import { useState } from "react";
import { useAuth } from "@/src/context";
import Cakeprice from "../../src/components/cotizacion/cakeprice";
import Snackprice from "@/src/components/cotizacion/snackprice";
import Cupcakeprice from "@/src/components/cotizacion/cupcakeprice";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import Link from "next/link";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700"] });

const PRODUCTS = [
  { value: "cake",    label: "Pastel",           emoji: "🎂" },
  { value: "snack",   label: "Mesa de postres",   emoji: "🍮" },
  { value: "cupcake", label: "Cupcakes",           emoji: "🧁" },
];

/* ── Tips shown in the sidebar ─────────────────────────────── */
const TIPS = [
  { icon: "⏰", title: "Anticipa tu pedido", body: "Pasteles personalizados: 72h mínimo. Eventos grandes: 14 días." },
  { icon: "📸", title: "Comparte referencias", body: "Una imagen vale más que mil palabras. Adjunta fotos de inspiración." },
  { icon: "✅", title: "Reserva con 30%", body: "Al confirmar, apartas fecha con 30% de anticipo. El resto al entregar." },
  { icon: "💬", title: "Respuesta en 24h", body: "Te contactamos por WhatsApp o correo en menos de 24 horas hábiles." },
];

export default function Price() {
  const [selectedProduct, setSelectedProduct] = useState("cake");
  const { isLoggedIn } = useAuth();

  return (
    <div
      className={nunito.className}
      style={{ minHeight: "100vh", background: "var(--bg-sunken)", display: "flex", flexDirection: "column", position: "relative" }}
    >
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 860px) {
          .quote-layout { grid-template-columns: 1fr !important; }
          .quote-sidebar { display: none !important; }
        }
        @media (max-width: 540px) {
          .product-chips { flex-direction: column !important; }
          .product-chips button { width: 100% !important; }
        }
      `}</style>

      {/* Sprinkle overlay */}
      <div aria-hidden="true" className="ru-pattern-sprinkle fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />

      <NavbarAdmin />

      <main
        style={{
          position: "relative",
          zIndex: 1,
          flexGrow: 1,
          maxWidth: 1040,
          width: "100%",
          margin: "4rem auto 0",
          padding: "2.5rem 1.25rem 3rem",
        }}
      >
        {/* ── Page header ─────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p style={{
            fontSize: "0.72rem", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.14em",
            color: "var(--rosa)", marginBottom: 8,
          }}>
            Pedido especial
          </p>
          <h1
            className={sofia.className}
            style={{ color: "var(--burdeos)", fontSize: "clamp(2.5rem,6vw,4.5rem)", lineHeight: 1, marginBottom: 12 }}
          >
            Cotiza tu evento
          </h1>
          <p style={{ color: "var(--text-soft)", fontSize: "0.95rem", maxWidth: "52ch", margin: "0 auto", lineHeight: 1.65 }}>
            Cuéntanos qué imaginas y te respondemos con propuesta y muestras en menos de 24h.
          </p>
          {/* Step indicators */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: "1.25rem" }}>
            {[1,2,3].map((s,i) => (
              <span key={s} style={{
                width: i === 0 ? 28 : 8, height: 8,
                borderRadius: "var(--r-pill)",
                background: i === 0 ? "var(--rosa)" : "var(--border-strong)",
                display: "inline-block",
                transition: "all 200ms",
              }} />
            ))}
          </div>
        </div>

        {/* ── Two-column layout ───────────────────────────── */}
        <div
          className="quote-layout"
          style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.75rem", alignItems: "start" }}
        >

          {/* ── Main form area ───────────────────────────── */}
          <div>
            {!isLoggedIn ? (
              /* Not-logged-in card */
              <div
                style={{
                  background: "var(--bg-raised)",
                  borderRadius: "var(--r-2xl)",
                  boxShadow: "var(--shadow-md)",
                  border: "1px solid var(--border-color)",
                  padding: "2.5rem",
                }}
              >
                <h2
                  className={sofia.className}
                  style={{ color: "var(--burdeos)", fontSize: "1.75rem", marginBottom: "0.75rem" }}
                >
                  Para solicitar una cotización necesitas iniciar sesión
                </h2>
                <p style={{ color: "var(--text-soft)", fontSize: "0.95rem", marginBottom: "1.75rem", lineHeight: 1.65 }}>
                  Por favor, inicia sesión o regístrate para continuar con el proceso de cotización. También puedes volver al inicio.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                  <Link href="/registrarse">
                    <button
                      style={{
                        background: "transparent", color: "var(--burdeos)",
                        border: "1.5px solid var(--burdeos)", borderRadius: "var(--r-pill)",
                        padding: "10px 24px", fontWeight: 700, fontSize: "0.9rem",
                        cursor: "pointer", transition: "all 150ms", fontFamily: "var(--font-nunito)",
                      }}
                      onMouseEnter={e=>{e.currentTarget.style.background="var(--burdeos)";e.currentTarget.style.color="#fff"}}
                      onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--burdeos)"}}
                    >
                      Registrarse
                    </button>
                  </Link>
                  <Link href="/login">
                    <button
                      style={{
                        background: "var(--burdeos)", color: "#fff",
                        border: "none", borderRadius: "var(--r-pill)",
                        padding: "10px 24px", fontWeight: 700, fontSize: "0.9rem",
                        cursor: "pointer", transition: "all 150ms", fontFamily: "var(--font-nunito)",
                        boxShadow: "var(--shadow-sm)",
                      }}
                    >
                      Iniciar sesión
                    </button>
                  </Link>
                  <Link href="/">
                    <button
                      style={{
                        background: "transparent", color: "var(--text-soft)",
                        border: "1.5px solid var(--border-strong)", borderRadius: "var(--r-pill)",
                        padding: "10px 24px", fontWeight: 700, fontSize: "0.9rem",
                        cursor: "pointer", transition: "all 150ms", fontFamily: "var(--font-nunito)",
                      }}
                    >
                      Volver al inicio
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Info box */}
                <div
                  style={{
                    background: "var(--rosa-4, #FFF3F5)",
                    borderRadius: "var(--r-md)",
                    padding: "1rem 1.25rem",
                    fontSize: "0.85rem",
                    color: "var(--text-soft)",
                    borderLeft: "3px solid var(--rosa)",
                    marginBottom: "1.75rem",
                    lineHeight: 1.6,
                  }}
                >
                  Complete cada campo con la mayor cantidad de detalles posible para acelerar la cotización. Somos una empresa pequeña que realiza pocos pasteles a la semana — solicita con suficiente anticipación. Agradecemos tu comprensión.
                </div>

                {/* Product fieldset header */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                  <span
                    style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "var(--rosa)", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: "0.85rem", flexShrink: 0,
                    }}
                  >
                    1
                  </span>
                  <span
                    className={sofia.className}
                    style={{ color: "var(--burdeos)", fontSize: "1.5rem", lineHeight: 1 }}
                  >
                    Selecciona el producto
                  </span>
                </div>

                {/* Chip selector */}
                <div
                  className="product-chips"
                  style={{ display: "flex", gap: "0.75rem", marginBottom: "1.75rem", flexWrap: "wrap" }}
                >
                  {PRODUCTS.map(({ value, label, emoji }) => {
                    const sel = selectedProduct === value;
                    return (
                      <button
                        key={value}
                        onClick={() => setSelectedProduct(value)}
                        style={{
                          background: sel ? "var(--burdeos)" : "var(--bg-raised)",
                          color: sel ? "#fff" : "var(--burdeos)",
                          border: sel ? "1.5px solid var(--burdeos)" : "1.5px solid var(--border-strong)",
                          borderRadius: "var(--r-pill)",
                          padding: "10px 24px",
                          fontWeight: 700, fontSize: "0.9rem",
                          cursor: "pointer", transition: "all 150ms",
                          fontFamily: "var(--font-nunito)",
                          boxShadow: sel ? "var(--shadow-sm)" : "none",
                        }}
                      >
                        {emoji} {label}
                      </button>
                    );
                  })}
                </div>

                {/* Sub-component area */}
                <div
                  style={{
                    background: "var(--bg-raised)",
                    borderRadius: "var(--r-2xl)",
                    boxShadow: "var(--shadow-md)",
                    overflow: "hidden",
                  }}
                >
                  {selectedProduct === "cake"    && <Cakeprice />}
                  {selectedProduct === "snack"   && <Snackprice />}
                  {selectedProduct === "cupcake" && <Cupcakeprice />}
                </div>
              </>
            )}
          </div>

          {/* ── Sidebar ─────────────────────────────────── */}
          <aside
            className="quote-sidebar"
            style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* Promise card — burdeos */}
            <div
              style={{
                background: "linear-gradient(180deg, var(--burdeos) 0%, #3D001D 100%)",
                borderRadius: "var(--r-xl)",
                padding: "1.5rem",
                color: "#fff",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0 pointer-events-none" style={{ opacity: 0.2 }} />
              <h3
                className={sofia.className}
                style={{ fontSize: "1.75rem", lineHeight: 1, marginBottom: 6, position: "relative" }}
              >
                Resumen rápido
              </h3>
              <p style={{ color: "var(--rosa-2, #FFD8DF)", fontSize: "0.8rem", marginBottom: "1.25rem", position: "relative" }}>
                Estimado preliminar · Ajustado al confirmar
              </p>
              {[["Anticipo","30%"],["Respuesta","< 24h"],["Entregas","GDL y zona metro"]].map(([k,v])=>(
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px dashed rgba(255,255,255,.15)", fontSize: "0.82rem", color: "#FFD8DF", position: "relative" }}>
                  <span>{k}</span>
                  <strong style={{ color: "#fff" }}>{v}</strong>
                </div>
              ))}
              {/* Spinning ring deco */}
              <div style={{ position: "relative", textAlign: "center", marginTop: "1.25rem" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", border: "2px dashed rgba(255,193,200,.35)", animation: "spin 40s linear infinite", position: "relative", margin: "0 auto" }}>
                  <div style={{ position: "absolute", top: -4, left: "50%", width: 8, height: 8, background: "var(--rosa)", borderRadius: "50%", transform: "translateX(-50%)" }} />
                </div>
              </div>
            </div>

            {/* Tips */}
            {TIPS.map((tip) => (
              <div
                key={tip.title}
                style={{
                  background: "var(--bg-raised)",
                  borderRadius: "var(--r-md)",
                  padding: "1rem",
                  boxShadow: "var(--shadow-xs)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.25rem", flexShrink: 0, lineHeight: 1 }}>{tip.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.82rem", color: "var(--burdeos)", marginBottom: 3 }}>{tip.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-soft)", lineHeight: 1.55 }}>{tip.body}</div>
                  </div>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </main>

      <WebFooter />
    </div>
  );
}
