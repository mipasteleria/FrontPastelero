import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "@/src/context";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const money = (n) => `$${Number(n || 0).toLocaleString("es-MX")}`;

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const DIAS = ["L", "M", "M", "J", "V", "S", "D"];

// Página de impresión por tipo de pedido.
const PRINT_PATH = {
  galletas: "/dashboard/pedidos-galletas/imprimir",
  postres: "/dashboard/postres/imprimir",
  vintage: "/dashboard/pedidos-vintage/imprimir",
  cotizacion: "/dashboard/cotizaciones-personalizadas/imprimir",
};
const DETALLE_PATH = {
  galletas: (id) => `/dashboard/pedidos-galletas/${id}`,
  postres: () => `/dashboard/postres`,
  vintage: (id) => `/dashboard/pedidos-vintage/${id}`,
  cotizacion: (id) => `/dashboard/cotizaciones-personalizadas/${id}`,
};

/**
 * Agenda mensual del dashboard: calendario con los pedidos agendados
 * (iconos por tipo), selección de día con lista + imprimir pedidos del
 * día, bloqueo/desbloqueo de fechas y analíticos del mes.
 */
export default function AgendaMes() {
  const { userToken } = useAuth();
  const hoy = new Date();
  const [mes, setMes] = useState(`${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`);
  const [data, setData] = useState(null);
  const [diaSel, setDiaSel] = useState(null); // "YYYY-MM-DD"
  const authHeader = userToken ? { Authorization: `Bearer ${userToken}` } : {};

  const cargar = () => {
    if (!userToken) return;
    fetch(`${API_BASE}/dashboard-agenda?mes=${mes}`, { headers: authHeader })
      .then((r) => r.json()).then((j) => setData(j.data || null)).catch(() => {});
  };
  useEffect(cargar, [mes, userToken]); // eslint-disable-line

  const eventosPorDia = useMemo(() => {
    const m = {};
    for (const e of data?.eventos || []) (m[e.dia] = m[e.dia] || []).push(e);
    return m;
  }, [data]);
  const bloqueadas = useMemo(() => new Set((data?.bloqueadas || []).map((b) => b.fecha)), [data]);

  // Celdas del mes (lunes primero).
  const celdas = useMemo(() => {
    const [y, m] = mes.split("-").map(Number);
    const primero = new Date(Date.UTC(y, m - 1, 1));
    const nDias = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const offset = (primero.getUTCDay() + 6) % 7; // lunes=0
    const arr = Array(offset).fill(null);
    for (let d = 1; d <= nDias; d++) arr.push(`${mes}-${String(d).padStart(2, "0")}`);
    return arr;
  }, [mes]);

  const cambiarMes = (delta) => {
    const [y, m] = mes.split("-").map(Number);
    const d = new Date(Date.UTC(y, m - 1 + delta, 1));
    setMes(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`);
    setDiaSel(null);
  };

  const toggleBloqueo = async (fecha) => {
    const bloqueada = bloqueadas.has(fecha);
    if (bloqueada) {
      await fetch(`${API_BASE}/fechas-bloqueadas/${fecha}`, { method: "DELETE", headers: authHeader });
    } else {
      const { value: motivo, isDismissed } = await Swal.fire({
        title: `Bloquear ${fecha}`, input: "text", inputPlaceholder: "Motivo (opcional)",
        showCancelButton: true, confirmButtonColor: "#540027", confirmButtonText: "Bloquear",
      });
      if (isDismissed) return;
      await fetch(`${API_BASE}/fechas-bloqueadas`, {
        method: "POST", headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ fecha, motivo: motivo || "" }),
      });
    }
    cargar();
  };

  const imprimirDia = (fecha) => {
    const evs = eventosPorDia[fecha] || [];
    const grupos = {};
    for (const e of evs) (grupos[e.tipo] = grupos[e.tipo] || []).push(e.id);
    let abiertos = 0;
    for (const [tipo, ids] of Object.entries(grupos)) {
      if (PRINT_PATH[tipo]) { window.open(`${PRINT_PATH[tipo]}?ids=${ids.join(",")}`, "_blank"); abiertos++; }
    }
    if (!abiertos) Swal.fire({ icon: "info", title: "Nada que imprimir para este día", timer: 1600, showConfirmButton: false });
  };

  const a = data?.analytics;
  const [yy, mm] = mes.split("-").map(Number);

  return (
    <div style={{ display: "grid", gap: "1.25rem", marginBottom: "2rem" }}>
      {/* ── Analíticos del mes ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.9rem" }}>
        <Kpi label="Pedidos del mes" val={a?.pedidos ?? "—"} emoji="📦" />
        <Kpi label="Ganancia bruta (ventas)" val={a ? money(a.ingresos) : "—"} emoji="💰" />
        <Kpi label="Costos registrados" val={a ? money(a.costos) : "—"} emoji="🧾" />
        <Kpi label="Ganancia neta*" val={a ? money(a.gananciaNeta) : "—"} emoji="📈" />
      </div>
      <p style={{ fontSize: ".7rem", color: "var(--text-muted)", marginTop: "-0.8rem" }}>
        * Neta calculada sobre pedidos con costo registrado (pasteles cotizados y vintage). Galletas/postres aún no registran costo.
      </p>

      {/* ── En qué se va el costo ──
          El KPI de arriba daba un solo número sin decir su composición.
          Aquí se abre en materia prima / mano de obra / taller, rastreando
          cada renglón hasta la receta o técnica de la que salió. */}
      {a?.desgloseCostos?.total > 0 && <DesgloseCostos d={a.desgloseCostos} />}

      <div className="agenda-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "1.25rem", alignItems: "start" }}>
        {/* ── Calendario ── */}
        <section style={{ background: "#fff", borderRadius: "var(--r-xl)", padding: "1.25rem", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <button onClick={() => cambiarMes(-1)} style={navBtn}>←</button>
            <h2 style={{ fontWeight: 800, color: "var(--burdeos)" }}>{MESES[mm - 1]} {yy}</h2>
            <button onClick={() => cambiarMes(1)} style={navBtn}>→</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, fontSize: ".68rem", fontWeight: 800, color: "var(--text-muted)", textAlign: "center", marginBottom: 4 }}>
            {DIAS.map((d, i) => <span key={i}>{d}</span>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
            {celdas.map((f, i) => {
              if (!f) return <span key={i} />;
              const evs = eventosPorDia[f] || [];
              const esBloq = bloqueadas.has(f);
              const esSel = diaSel === f;
              const esHoy = f === new Date().toISOString().slice(0, 10);
              return (
                <button key={f} onClick={() => setDiaSel(esSel ? null : f)}
                  style={{
                    minHeight: 56, borderRadius: 10, padding: "4px 3px", cursor: "pointer",
                    border: esSel ? "2px solid var(--burdeos)" : esHoy ? "2px solid var(--rosa)" : "1px solid var(--border-color)",
                    background: esBloq ? "#F3F4F6" : evs.length ? "var(--rosa-4)" : "#fff",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                  }}>
                  <span style={{ fontSize: ".72rem", fontWeight: 800, color: esBloq ? "#9CA3AF" : "var(--burdeos)" }}>{Number(f.slice(-2))}</span>
                  <span style={{ fontSize: ".8rem", lineHeight: 1, letterSpacing: "-1px" }}>
                    {esBloq ? "🚫" : evs.slice(0, 3).map((e) => e.icono).join("")}
                    {evs.length > 3 ? `+${evs.length - 3}` : ""}
                  </span>
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 10, fontSize: ".7rem", color: "var(--text-muted)" }}>
            <span>🍪 Galletas</span><span>🍮 Postres</span><span>🎂 Pastel</span><span>🧁 Cupcakes</span><span>🍰 Mesa</span><span>🎀 Vintage</span><span>🚫 Bloqueado</span>
          </div>
        </section>

        {/* ── Panel del día ── */}
        <section style={{ background: "#fff", borderRadius: "var(--r-xl)", padding: "1.25rem", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-color)" }}>
          {!diaSel ? (
            <>
              <h3 style={{ fontWeight: 800, color: "var(--burdeos)", marginBottom: 6 }}>Top productos del mes</h3>
              {(a?.topProductos || []).length === 0 ? (
                <p style={{ fontSize: ".85rem", color: "var(--text-muted)" }}>Sin ventas confirmadas este mes.</p>
              ) : (
                a.topProductos.map((p, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px dashed var(--border-color)", fontSize: ".85rem" }}>
                    <span style={{ color: "var(--burdeos)", fontWeight: 700 }}>{i + 1}. {p.nombre}</span>
                    <span style={{ color: "var(--text-soft)" }}>{p.cantidad}</span>
                  </div>
                ))
              )}
              <p style={{ fontSize: ".75rem", color: "var(--text-muted)", marginTop: 10 }}>Selecciona un día del calendario para ver sus pedidos, imprimirlos o bloquearlo.</p>
            </>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h3 style={{ fontWeight: 800, color: "var(--burdeos)" }}>{diaSel}</h3>
                <button onClick={() => setDiaSel(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>✕</button>
              </div>

              {(eventosPorDia[diaSel] || []).length === 0 ? (
                <p style={{ fontSize: ".85rem", color: "var(--text-muted)", marginBottom: 10 }}>Sin pedidos agendados este día.</p>
              ) : (
                <div style={{ marginBottom: 10 }}>
                  {(eventosPorDia[diaSel] || []).sort((x, y) => (x.hora || "").localeCompare(y.hora || "")).map((e) => (
                    <a key={e.id} href={DETALLE_PATH[e.tipo]?.(e.id) || "#"}
                      style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "7px 8px", borderRadius: 8, textDecoration: "none", border: "1px solid var(--border-color)", marginBottom: 5 }}>
                      <span style={{ fontSize: ".82rem", color: "var(--burdeos)", fontWeight: 700 }}>{e.icono} {e.hora || "—"} · {e.cliente}</span>
                      <span style={{ fontSize: ".75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>{e.numeroOrden}</span>
                    </a>
                  ))}
                </div>
              )}

              <div style={{ display: "grid", gap: 8 }}>
                <button onClick={() => imprimirDia(diaSel)} disabled={!(eventosPorDia[diaSel] || []).length}
                  style={{ padding: "10px", borderRadius: 999, border: "none", background: "var(--rosa)", color: "#fff", fontWeight: 800, cursor: "pointer", opacity: (eventosPorDia[diaSel] || []).length ? 1 : .5 }}>
                  🖨️ Imprimir pedidos del día
                </button>
                <button onClick={() => toggleBloqueo(diaSel)}
                  style={{ padding: "10px", borderRadius: 999, border: "1.5px solid var(--burdeos)", background: bloqueadas.has(diaSel) ? "var(--burdeos)" : "#fff", color: bloqueadas.has(diaSel) ? "#fff" : "var(--burdeos)", fontWeight: 800, cursor: "pointer" }}>
                  {bloqueadas.has(diaSel) ? "✓ Desbloquear fecha" : "🚫 Bloquear fecha"}
                </button>
                {bloqueadas.has(diaSel) && (
                  <p style={{ fontSize: ".75rem", color: "var(--text-muted)" }}>
                    Bloqueada{(data?.bloqueadas || []).find((b) => b.fecha === diaSel)?.motivo ? `: ${(data.bloqueadas).find((b) => b.fecha === diaSel).motivo}` : ""}. Los clientes no podrán elegir este día.
                  </p>
                )}
              </div>
            </>
          )}
        </section>
      </div>
      <style jsx>{`@media (max-width: 900px){ .agenda-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

const navBtn = { border: "1px solid var(--border-color)", background: "#fff", borderRadius: 8, padding: "4px 12px", cursor: "pointer", color: "var(--burdeos)", fontWeight: 800 };

function Kpi({ label, val, emoji }) {
  return (
    <div style={{ background: "#fff", borderRadius: "var(--r-xl)", padding: "1rem 1.1rem", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-color)" }}>
      <div style={{ fontSize: ".68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text-muted)" }}>{emoji} {label}</div>
      <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--burdeos)", marginTop: 2 }}>{val}</div>
    </div>
  );
}

/**
 * Reparto del costo del mes. Las barras son proporcionales al total para
 * que la composición se lea de un vistazo sin tener que dividir mentalmente.
 *
 * "Sin clasificar" se muestra siempre que exista: es costo real que no se
 * pudo atribuir (pedidos vintage, que no guardan el origen de cada
 * concepto, y renglones capturados a mano). Ocultarlo haría parecer que
 * los porcentajes de arriba son del total cuando son de una parte.
 */
function DesgloseCostos({ d }) {
  const filas = [
    { k: "materiaPrima",  label: "Materia prima", sub: "ingredientes e insumos", color: "#C86B7F" },
    { k: "manoObra",      label: "Mano de obra",  sub: "horas de trabajo",       color: "#7B9A6D" },
    { k: "gastosFijos",   label: "Gastos fijos",  sub: "uso del taller",         color: "#D4A24C" },
    { k: "otros",         label: "Otros",         sub: "IEPS y adicionales",     color: "#9A8AA8" },
    { k: "sinClasificar", label: "Sin clasificar", sub: "vintage y capturas manuales", color: "#BFB4B8" },
  ].filter((f) => Number(d[f.k]) > 0);

  const total = Number(d.total) || 1;

  return (
    <section style={{ background: "#fff", borderRadius: "var(--r-xl)", padding: "1.25rem", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-color)" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        <h3 style={{ fontWeight: 800, color: "var(--burdeos)" }}>¿En qué se va el costo?</h3>
        <span style={{ fontSize: ".72rem", color: "var(--text-muted)" }}>
          {d.coberturaPct}% del costo rastreado hasta su receta o técnica
        </span>
      </div>

      {filas.map((f) => {
        const v = Number(d[f.k]);
        const pct = (v / total) * 100;
        return (
          <div key={f.k} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", marginBottom: 3 }}>
              <span style={{ fontWeight: 700, color: "var(--color-text)" }}>
                {f.label}{" "}
                <span style={{ fontWeight: 400, fontSize: ".72rem", color: "var(--text-muted)" }}>· {f.sub}</span>
              </span>
              <span style={{ color: "var(--text-soft)" }}>
                <strong>{money(v)}</strong>{" "}
                <span style={{ fontSize: ".74rem", color: "var(--text-muted)" }}>{pct.toFixed(0)}%</span>
              </span>
            </div>
            <div style={{ height: 8, background: "var(--bg-sunken)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: f.color, borderRadius: 999 }} />
            </div>
          </div>
        );
      })}

      {d.sinClasificar > 0 && (
        <p style={{ fontSize: ".7rem", color: "var(--text-muted)", marginTop: 10 }}>
          Lo &quot;sin clasificar&quot; son pedidos vintage —que guardan el costo por concepto
          pero no de dónde sale cada uno— y renglones que capturaste a mano.
        </p>
      )}
    </section>
  );
}
