import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { addItem } from "@/src/lib/postresCart";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const UNIDAD_LABEL = { pieza: "pieza", docena: "docena", kg: "kilo" };
const money = (n) => `$${Number(n || 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Reglas de venta del producto (espejo de utils/cantidadVenta del back).
const reglas = (g) => ({
  unidad: g.unidad || "pieza",
  minimo: Number(g.minimo) > 0 ? Number(g.minimo) : 1,
  paso:   Number(g.paso) > 0 ? Number(g.paso) : 1,
});

const fmtCant = (n, unidad) => (unidad === "kg" ? `${n} kg` : `${n} ${n === 1 ? "pza" : "pzas"}`);

/**
 * Galletas artesanales — surtido a precio fijo, horneado bajo pedido
 * (alfajores, besos de nuez, pastisetas…). Pensada para el pedido de
 * variedad: el cliente ajusta cantidades y ve el total en vivo, sin
 * cotización de por medio. Cada producto define su unidad de venta,
 * mínimo e incremento; el servidor revalida lo mismo al pagar.
 */
export default function GalletasArtesanales() {
  const router = useRouter();
  const [galletas, setGalletas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cant, setCant] = useState({});   // id → cantidad seleccionada
  const [agregando, setAgregando] = useState(false);

  useEffect(() => {
    let cancelado = false;
    fetch(`${API_BASE}/postres?categoria=galleta`)
      .then((r) => r.json())
      .then((j) => { if (!cancelado) setGalletas(j?.data || []); })
      .catch(() => {})
      .finally(() => { if (!cancelado) setCargando(false); });
    return () => { cancelado = true; };
  }, []);

  const ajustar = (g, delta) => {
    const { minimo, paso } = reglas(g);
    setCant((c) => {
      const actual = c[g._id] || 0;
      let siguiente;
      if (actual === 0) siguiente = delta > 0 ? minimo : 0;
      else siguiente = actual + delta * paso;
      if (siguiente < minimo) siguiente = 0;            // bajar del mínimo = quitar
      // Redondeo para evitar 0.30000000000000004 con pasos de 0.5
      siguiente = Math.round(siguiente * 100) / 100;
      return { ...c, [g._id]: siguiente };
    });
  };

  const seleccion = useMemo(
    () => galletas.filter((g) => (cant[g._id] || 0) > 0),
    [galletas, cant]
  );
  const total = useMemo(
    () => seleccion.reduce((s, g) => s + Number(g.precio || 0) * (cant[g._id] || 0), 0),
    [seleccion, cant]
  );

  const agregarAlCarrito = () => {
    if (seleccion.length === 0) return;
    setAgregando(true);
    // Se suman al carrito de postres: comparten checkout, envío y fechas.
    for (const g of seleccion) addItem(g, cant[g._id]);
    router.push("/enduser/postres-carrito");
  };

  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)", display: "flex", flexDirection: "column" }}>
      <style>{`
        @media (max-width: 900px) { .ga-grid { grid-template-columns: 1fr !important; } .ga-side { position: static !important; } }
        @media (max-width: 640px) { .ga-list { grid-template-columns: 1fr !important; } }
      `}</style>

      <NavbarAdmin />

      <main style={{ flexGrow: 1, maxWidth: 1100, width: "100%", margin: "0 auto", padding: "5.5rem 1.25rem 3rem" }}>
        <p style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--rosa)" }}>
          Precio fijo · Sin cotización
        </p>
        <h1 className={sofia.className} style={{ fontSize: "clamp(2.4rem,6vw,4rem)", color: "var(--burdeos)", lineHeight: 1, marginBottom: 10 }}>
          Galletas artesanales
        </h1>
        <p style={{ color: "var(--text-soft)", maxWidth: "60ch", lineHeight: 1.6, marginBottom: 8 }}>
          Alfajores, besos de nuez, pastisetas y más — horneadas bajo pedido. Arma tu
          surtido, mira el total al instante y paga en línea.
        </p>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, background: "var(--mantequilla, #FFE99B)",
          color: "#6B4F1A", padding: "8px 16px", borderRadius: 999, fontSize: ".82rem", fontWeight: 700, marginBottom: "1.75rem",
        }}>
          🏢 Ideal para eventos corporativos y oficinas
        </div>

        {cargando ? (
          <p style={{ color: "var(--text-soft)" }}>Cargando galletas…</p>
        ) : galletas.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "var(--r-xl)", padding: "2.5rem", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
            <p style={{ fontSize: "2.4rem" }}>🍪</p>
            <p style={{ color: "var(--text-soft)" }}>Muy pronto publicaremos nuestro surtido de galletas artesanales.</p>
          </div>
        ) : (
          <div className="ga-grid" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem", alignItems: "start" }}>
            {/* Listado con selector de cantidad */}
            <div className="ga-list" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: "1rem" }}>
              {galletas.map((g) => {
                const { unidad, minimo, paso } = reglas(g);
                const n = cant[g._id] || 0;
                const activo = n > 0;
                return (
                  <article key={g._id} style={{
                    background: "#fff", borderRadius: "var(--r-xl)", overflow: "hidden",
                    border: activo ? "2px solid var(--rosa)" : "1px solid var(--border-color)",
                    boxShadow: activo ? "var(--shadow-md)" : "var(--shadow-sm)", transition: "all 180ms",
                    display: "flex", flexDirection: "column",
                  }}>
                    <div style={{ aspectRatio: "16/10", background: "var(--rosa-4)", position: "relative" }}>
                      {g.imagenUrl
                        ? <img src={g.imagenUrl} alt={g.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.4rem" }}>🍪</span>}
                    </div>
                    <div style={{ padding: "0.9rem 1rem 1rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                      <h2 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.3rem", lineHeight: 1.1 }}>{g.nombre}</h2>
                      {g.descripcion && (
                        <p style={{ color: "var(--text-soft)", fontSize: ".82rem", lineHeight: 1.45, margin: "4px 0 8px" }}>{g.descripcion}</p>
                      )}
                      <p style={{ fontWeight: 800, color: "var(--burdeos)", fontSize: "1.05rem" }}>
                        {money(g.precio)} <span style={{ fontSize: ".75rem", fontWeight: 400, color: "var(--text-soft)" }}>/ {UNIDAD_LABEL[unidad]}</span>
                      </p>
                      <p style={{ fontSize: ".72rem", color: "var(--text-soft)", marginBottom: 10 }}>
                        Mínimo {fmtCant(minimo, unidad)}
                        {paso !== minimo ? ` · de ${fmtCant(paso, unidad)} en ${fmtCant(paso, unidad)}` : ""}
                      </p>

                      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                        <button onClick={() => ajustar(g, -1)} disabled={n === 0} aria-label={`Quitar ${g.nombre}`}
                          style={{
                            width: 34, height: 34, borderRadius: "50%", border: "1.5px solid var(--border-strong)",
                            background: "#fff", color: "var(--burdeos)", fontWeight: 800, cursor: n === 0 ? "not-allowed" : "pointer",
                            opacity: n === 0 ? 0.4 : 1,
                          }}>−</button>
                        <span style={{ minWidth: 74, textAlign: "center", fontWeight: 800, color: activo ? "var(--burdeos)" : "var(--text-soft)" }}>
                          {n > 0 ? fmtCant(n, unidad) : "—"}
                        </span>
                        <button onClick={() => ajustar(g, 1)} aria-label={`Agregar ${g.nombre}`}
                          style={{
                            width: 34, height: 34, borderRadius: "50%", border: "none",
                            background: "var(--rosa)", color: "#fff", fontWeight: 800, cursor: "pointer",
                          }}>+</button>
                        {activo && (
                          <span style={{ marginLeft: "auto", fontWeight: 800, color: "var(--burdeos)", fontSize: ".9rem" }}>
                            {money(Number(g.precio) * n)}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Resumen del surtido */}
            <aside className="ga-side" style={{
              position: "sticky", top: 90, background: "#fff", borderRadius: "var(--r-xl)",
              border: "1.5px solid var(--rosa)", padding: "1.25rem", boxShadow: "var(--shadow-md)",
            }}>
              <h3 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.4rem", marginBottom: 4 }}>Tu surtido</h3>
              <p style={{ fontSize: ".75rem", color: "var(--text-soft)", marginBottom: ".75rem" }}>
                Precio fijo · Se hornea bajo pedido
              </p>

              {seleccion.length === 0 ? (
                <p style={{ fontSize: ".85rem", color: "var(--text-soft)" }}>
                  Elige cuántas quieres de cada galleta y aquí verás tu total.
                </p>
              ) : (
                <>
                  {seleccion.map((g) => (
                    <div key={g._id} style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "6px 0", borderBottom: "1px dashed var(--border-color)", fontSize: ".82rem" }}>
                      <span style={{ color: "var(--text-soft)" }}>
                        {g.nombre} <strong style={{ color: "var(--burdeos)" }}>×{fmtCant(cant[g._id], reglas(g).unidad)}</strong>
                      </span>
                      <strong style={{ color: "var(--burdeos)" }}>{money(Number(g.precio) * cant[g._id])}</strong>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: "1rem" }}>
                    <strong style={{ color: "var(--burdeos)" }}>Total</strong>
                    <strong style={{ color: "var(--burdeos)", fontSize: "1.25rem" }}>{money(total)}</strong>
                  </div>
                  <p style={{ fontSize: ".72rem", color: "var(--text-soft)", marginTop: 6 }}>
                    El envío se calcula en el siguiente paso.
                  </p>
                </>
              )}

              <button onClick={agregarAlCarrito} disabled={seleccion.length === 0 || agregando}
                style={{
                  width: "100%", marginTop: 14, padding: "0.85rem 1.5rem", borderRadius: 999, border: "none",
                  background: "var(--burdeos)", color: "#fff", fontWeight: 800, fontSize: ".95rem",
                  cursor: seleccion.length === 0 ? "not-allowed" : "pointer", opacity: seleccion.length === 0 ? 0.5 : 1,
                }}>
                {agregando ? "Agregando…" : "Continuar al carrito"}
              </button>

              <p style={{ fontSize: ".72rem", color: "var(--text-soft)", marginTop: 10, lineHeight: 1.5 }}>
                Preparamos con <strong>2 días hábiles</strong> de anticipación. No hay entregas en domingo.
              </p>
            </aside>
          </div>
        )}
      </main>

      <WebFooter />
    </div>
  );
}
