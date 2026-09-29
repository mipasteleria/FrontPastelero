import { useEffect, useState } from "react";
import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";
import { useAuth } from "@/src/context";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const PRODUCTO = {
  pastel: "Pastel personalizado",
  cupcake: "Cupcakes",
  "mesa-postres": "Mesa de postres",
  galleta: "Galletas decoradas",
};
const ICONO = { pastel: "🎂", cupcake: "🧁", "mesa-postres": "🍰", galleta: "🍪" };

const money = (n) => `$${Number(n || 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fecha = (d) =>
  d ? new Date(d).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }) : "Por confirmar";

// Color del chip según el estado del pedido.
function tonoEstado(status = "") {
  if (/^Agendado|^Entregado|paid|confirmado/i.test(status)) return { bg: "#DCF5E9", fg: "#1D5A45" };
  if (/^Cancelado/i.test(status)) return { bg: "#FDE2E4", fg: "#B23A48" };
  return { bg: "#FFF3D6", fg: "#6B4F1A" };
}

/**
 * Historial del cliente. Lee /mis-pedidos, que devuelve en una sola llamada
 * sus cotizaciones personalizadas (con enlace a la vista real) y sus compras
 * de precio fijo. Antes esta pantalla leía los modelos legacy, así que las
 * cotizaciones nuevas no aparecían y "Ver detalles" abría una vista vieja.
 */
export default function MisPedidos() {
  const { userToken, isLoggedIn } = useAuth();
  const [datos, setDatos] = useState(null);
  const [retencion, setRetencion] = useState(18);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userToken) return;
    fetch(`${API_BASE}/mis-pedidos`, { headers: { Authorization: `Bearer ${userToken}` } })
      .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
      .then(({ ok, j }) => {
        if (!ok) throw new Error(j.message || "No se pudo cargar tu historial");
        setDatos(j.data);
        if (j.retencionComprasMeses) setRetencion(j.retencionComprasMeses);
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [userToken]);

  const cotizaciones = datos?.cotizaciones || [];
  const compras = datos?.compras || [];
  const vacio = !cargando && cotizaciones.length === 0 && compras.length === 0;

  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)", display: "flex", flexDirection: "column" }}>
      <NavbarAdmin />

      <main style={{ flexGrow: 1, maxWidth: 900, width: "100%", margin: "0 auto", padding: "5.5rem 1.25rem 3rem" }}>
        <p style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--rosa)" }}>Tu cuenta</p>
        <h1 className={sofia.className} style={{ fontSize: "clamp(2.2rem,5vw,3.4rem)", color: "var(--burdeos)", lineHeight: 1, marginBottom: "1.5rem" }}>
          Mis pedidos
        </h1>

        {!isLoggedIn && !userToken ? (
          <Tarjeta>
            <p style={{ color: "var(--text-soft)", marginBottom: 14 }}>Inicia sesión para ver tus pedidos y cotizaciones.</p>
            <Link href="/login" style={btnPrimario}>Iniciar sesión</Link>
          </Tarjeta>
        ) : cargando ? (
          <p style={{ color: "var(--text-soft)" }}>Cargando tu historial…</p>
        ) : error ? (
          <Tarjeta><p style={{ color: "#B23A48" }}>{error}</p></Tarjeta>
        ) : vacio ? (
          <Tarjeta>
            <p style={{ fontSize: "2.4rem", marginBottom: 6 }}>🎂</p>
            <p style={{ color: "var(--text-soft)", marginBottom: 16 }}>Aún no tienes pedidos ni cotizaciones.</p>
            <Link href="/cotizacion" style={btnPrimario}>Solicitar una cotización</Link>
          </Tarjeta>
        ) : (
          <>
            {/* ── Cotizaciones personalizadas ── */}
            {cotizaciones.length > 0 && (
              <section style={{ marginBottom: "2.5rem" }}>
                <h2 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.6rem", marginBottom: 10 }}>
                  Cotizaciones personalizadas
                </h2>
                <div style={{ display: "grid", gap: "0.85rem" }}>
                  {cotizaciones.map((c) => {
                    const tono = tonoEstado(c.status);
                    return (
                      <article key={c._id} style={tarjetaFila}>
                        <span style={{ fontSize: "1.8rem", lineHeight: 1 }}>{ICONO[c.tipoProducto] || "🎂"}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <strong style={{ color: "var(--burdeos)" }}>{PRODUCTO[c.tipoProducto] || "Cotización"}</strong>
                            <span style={{ ...chip, background: tono.bg, color: tono.fg }}>{c.status}</span>
                          </div>
                          <p style={{ fontSize: ".82rem", color: "var(--text-soft)", marginTop: 2 }}>
                            {c.numeroOrden ? `${c.numeroOrden} · ` : ""}Evento: {fecha(c.evento?.fecha)}
                          </p>
                          {c.precio > 0 && (
                            <p style={{ fontSize: ".82rem", color: "var(--burdeos)", fontWeight: 700, marginTop: 2 }}>
                              {money(c.precio)}
                              {c.saldoPendiente > 0 && (
                                <span style={{ color: "#B23A48", fontWeight: 600 }}> · Saldo: {money(c.saldoPendiente)}</span>
                              )}
                            </p>
                          )}
                        </div>
                        {/* Enlace a la vista real de la cotización. */}
                        {c.publicToken ? (
                          <Link href={`/cotizacion/ver/${c.publicToken}`} style={btnSecundario}>Ver detalles</Link>
                        ) : (
                          <span style={{ fontSize: ".78rem", color: "var(--text-muted)" }}>Sin detalle</span>
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── Compras ── */}
            {compras.length > 0 && (
              <section>
                <h2 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.6rem", marginBottom: 10 }}>
                  Mis compras
                </h2>
                <div style={{ display: "grid", gap: "0.85rem" }}>
                  {compras.map((p) => {
                    const tono = tonoEstado(p.estado);
                    return (
                      <article key={`${p.tipo}-${p.numeroOrden}`} style={tarjetaFila}>
                        <span style={{ fontSize: "1.8rem", lineHeight: 1 }}>{p.icono}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <strong style={{ color: "var(--burdeos)" }}>{p.titulo}</strong>
                            {p.estado && <span style={{ ...chip, background: tono.bg, color: tono.fg }}>{p.estado}</span>}
                          </div>
                          {p.detalle && (
                            <p style={{ fontSize: ".82rem", color: "var(--text-soft)", marginTop: 2 }}>{p.detalle}</p>
                          )}
                          <p style={{ fontSize: ".78rem", color: "var(--text-muted)", marginTop: 2 }}>
                            {p.numeroOrden ? `${p.numeroOrden} · ` : ""}Entrega: {fecha(p.fecha)}
                          </p>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontWeight: 800, color: "var(--burdeos)" }}>{money(p.total)}</div>
                          <div style={{ fontSize: ".7rem", color: "var(--text-muted)" }}>pagado</div>
                          {p.saldoPendiente > 0 && p.publicToken && (
                            <Link href={`/vintage/ver/${p.publicToken}`} style={{ ...btnSecundario, marginTop: 6, display: "inline-block", fontSize: ".72rem" }}>
                              Pagar saldo
                            </Link>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
                <p style={{ fontSize: ".75rem", color: "var(--text-muted)", marginTop: 12, lineHeight: 1.6 }}>
                  Tu historial de compras se conserva {retencion} meses. Si necesitas un
                  comprobante anterior, escríbenos y con gusto te lo compartimos.
                </p>
              </section>
            )}
          </>
        )}
      </main>

      <WebFooter />
    </div>
  );
}

const tarjetaFila = {
  display: "flex", alignItems: "center", gap: "0.9rem",
  background: "#fff", borderRadius: "var(--r-xl)", padding: "1rem 1.15rem",
  border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)",
};
const chip = {
  fontSize: ".68rem", fontWeight: 800, padding: "3px 10px", borderRadius: 999,
  textTransform: "uppercase", letterSpacing: ".03em",
};
const btnPrimario = {
  display: "inline-block", padding: "11px 26px", borderRadius: 999,
  background: "var(--burdeos)", color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: ".9rem",
};
const btnSecundario = {
  padding: "8px 18px", borderRadius: 999, border: "1.5px solid var(--burdeos)",
  color: "var(--burdeos)", textDecoration: "none", fontWeight: 700, fontSize: ".82rem", flexShrink: 0,
};

function Tarjeta({ children }) {
  return (
    <div style={{ background: "#fff", borderRadius: "var(--r-xl)", padding: "2.5rem", textAlign: "center", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-color)" }}>
      {children}
    </div>
  );
}
