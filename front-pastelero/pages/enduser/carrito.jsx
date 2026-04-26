import { useContext, useState, useEffect } from "react";
import { CartContext } from "@/src/components/enuser/carritocontext";
import { useAuth } from "@/src/context";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/* ─── Source → gradient / emoji ─────────────────────── */
const SOURCE_STYLE = {
  pastel:  { bg: "linear-gradient(135deg,#FFE2E7,#FFC3C9)", emoji: "🎂" },
  galleta: { bg: "linear-gradient(135deg,#FFE99B,#FFC9A5)", emoji: "🍪" },
  postre:  { bg: "linear-gradient(135deg,#B8E6D3,#D4E3A8)", emoji: "🥧" },
  default: { bg: "linear-gradient(135deg,#D9C4E8,#FFC3C9)", emoji: "✨" },
};

function getStyle(src) {
  const key = (src || "").toLowerCase();
  return SOURCE_STYLE[key] || SOURCE_STYLE.default;
}

/* ─── Steps indicator ─────────────────────────────── */
function Steps({ current = 0 }) {
  const steps = ["Carrito", "Entrega", "Pago"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: "2rem" }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", border: "2px solid",
              borderColor: i < current ? "var(--menta-deep)" : i === current ? "var(--rosa)" : "var(--border-color)",
              background: i < current ? "var(--menta-deep)" : i === current ? "var(--rosa)" : "var(--bg-sunken)",
              color: i <= current ? "#fff" : "var(--text-muted)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: "0.875rem",
              boxShadow: i === current ? "var(--shadow-glow)" : "none",
              transition: "all 200ms",
            }}>
              {i < current ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: i <= current ? "var(--color-text)" : "var(--text-muted)" }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 2, background: i < current ? "var(--menta-deep)" : "var(--border-color)", margin: "0 6px", marginBottom: 20 }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Cart item row ───────────────────────────────── */
function CartItem({ item, onDelete }) {
  const style = getStyle(item.source);
  return (
    <div style={{ display: "flex", gap: "1rem", padding: "1rem", background: "var(--bg-raised)", borderRadius: "var(--r-xl)", boxShadow: "var(--shadow-xs)", border: "1px solid var(--border-color)", transition: "box-shadow 200ms", alignItems: "flex-start" }}>
      {/* Thumbnail */}
      <div style={{ width: 80, height: 80, flexShrink: 0, borderRadius: "var(--r-md)", background: style.bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0" style={{ opacity: 0.3 }} />
        <span style={{ fontSize: "2.5rem", position: "relative", zIndex: 1 }}>{style.emoji}</span>
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontWeight: 800, fontSize: "0.95rem", marginBottom: 4, color: "var(--color-text)" }}>
          {item.name || "Producto sin nombre"}
        </h3>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 8, textTransform: "capitalize" }}>
          {item.source} · {item.status || "Pendiente"}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          {/* Qty pill */}
          <div style={{ display: "flex", alignItems: "center", border: "1.5px solid var(--border-color)", borderRadius: "var(--r-pill)", overflow: "hidden", height: 32 }}>
            <span style={{ padding: "0 12px", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-soft)" }}>×{item.quantity}</span>
          </div>
          {/* Price per unit */}
          {item.amount && (
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              ${item.amount.toFixed(2)} c/u
            </span>
          )}
        </div>
      </div>

      {/* Right: total + remove */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
        {item.amount && (
          <span className={sofia.className} style={{ fontSize: "1.5rem", color: "var(--rosa)", lineHeight: 1 }}>
            ${(item.quantity * item.amount).toFixed(2)}
          </span>
        )}
        <button
          onClick={() => onDelete(item.id, item.source, item.paymentOption)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: 700, fontFamily: "var(--font-nunito)", transition: "color 150ms", padding: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--rosa)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
        >
          Eliminar ×
        </button>
      </div>
    </div>
  );
}

export default function Carrito() {
  const { userToken } = useAuth();
  const { items, deleteFromCart } = useContext(CartContext);
  const [checkoutError, setCheckoutError] = useState(null);
  const [loading, setLoading]   = useState(true);
  const router = useRouter();

  useEffect(() => { if (items) setLoading(false); }, [items]);

  const total = items?.reduce((sum, i) => sum + (i.quantity * (i.amount || 0)), 0) ?? 0;

  const handleClick = async () => {
    if (!items || items.length === 0) return;
    setCheckoutError(null);
    const item = items[0];
    const cotizacionType = item.source.charAt(0).toUpperCase() + item.source.slice(1);
    try {
      const response = await fetch(`${API_BASE}/checkout/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userToken}` },
        body: JSON.stringify({ cotizacionId: item.id, cotizacionType, paymentOption: item.paymentOption }),
      });
      const sessionData = await response.json();
      if (!response.ok) { setCheckoutError(sessionData.message || "Error al iniciar el pago"); return; }
      localStorage.setItem("clientSecret", sessionData.clientSecret);
      router.push("/enduser/pagar");
    } catch {
      setCheckoutError("No se pudo conectar con el servidor. Intenta de nuevo.");
    }
  };

  if (loading) {
    return (
      <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "3rem" }}>🎂</span>
          <p style={{ color: "var(--text-muted)", marginTop: 12, fontWeight: 600 }}>Cargando tu carrito…</p>
        </div>
      </div>
    );
  }

  const hasItems = items && items.length > 0;

  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)", display: "flex", flexDirection: "column" }}>
      <style>{`
        @media(max-width:860px){
          .cart-layout{grid-template-columns:1fr!important}
          .cart-sidebar{position:relative!important;top:auto!important}
        }
      `}</style>

      {/* Sprinkle overlay */}
      <div aria-hidden="true" className="ru-pattern-sprinkle fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.06 }} />

      <NavbarAdmin />

      <main className="flex-grow relative z-10" style={{ marginTop: "4rem", padding: "2.5rem 1.25rem 3rem", maxWidth: 960, marginLeft: "auto", marginRight: "auto", width: "100%" }}>

        {/* ── Page header ── */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--rosa)", marginBottom: 6 }}>Tu pedido</p>
          <h1 className={sofia.className} style={{ fontSize: "clamp(2rem,5vw,3rem)", color: "var(--burdeos)", lineHeight: 1.1 }}>Tu carrito</h1>
        </div>

        {/* ── Steps ── */}
        <Steps current={0} />

        {hasItems ? (
          <div className="cart-layout" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "1.5rem", alignItems: "start" }}>

            {/* ── Items list ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <h2 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 4 }}>
                {items.length} {items.length === 1 ? "producto" : "productos"}
              </h2>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onDelete={(id, source, paymentOption) => deleteFromCart(id, source, paymentOption)}
                />
              ))}

              {/* Error message */}
              {checkoutError && (
                <div style={{ background: "var(--rosa-4)", border: "1px solid var(--rosa-3)", borderRadius: "var(--r-md)", padding: "0.75rem 1rem", color: "var(--burdeos)", fontSize: "0.85rem", fontWeight: 600 }}>
                  ⚠ {checkoutError}
                </div>
              )}

              {/* Continue shopping */}
              <div style={{ marginTop: "0.5rem" }}>
                <Link href="/" style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, transition: "color 150ms" }}
                  onMouseEnter={e=>e.currentTarget.style.color="var(--burdeos)"}
                  onMouseLeave={e=>e.currentTarget.style.color="var(--text-muted)"}>
                  ← Seguir explorando
                </Link>
              </div>
            </div>

            {/* ── Sticky sidebar ── */}
            <div className="cart-sidebar" style={{ position: "sticky", top: 84 }}>
              <div style={{ background: "var(--burdeos)", borderRadius: "var(--r-xl)", padding: "1.75rem", position: "relative", overflow: "hidden", boxShadow: "var(--shadow-lg)", color: "#fff" }}>
                {/* Pattern overlay */}
                <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0 pointer-events-none" style={{ opacity: 0.18 }} />

                <div style={{ position: "relative" }}>
                  <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--rosa-2)", marginBottom: "1rem" }}>Resumen del pedido</p>

                  {/* Item lines */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                    {items.map((item) => (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#FFD8DF" }}>
                        <span style={{ maxWidth: "65%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.quantity}× {item.name || "Producto"}
                        </span>
                        <span>${((item.quantity || 1) * (item.amount || 0)).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: "1px dashed rgba(255,193,200,.3)", marginBottom: "1rem" }} />

                  {/* Total */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--rosa-2)" }}>Total</span>
                    <span className={sofia.className} style={{ fontSize: "2.25rem", lineHeight: 1, color: "#fff" }}>
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  {/* Payment info */}
                  <div style={{ background: "rgba(255,255,255,.1)", borderRadius: "var(--r-md)", padding: "0.75rem 1rem", marginBottom: "1.25rem", fontSize: "0.78rem", color: "#FFD8DF", lineHeight: 1.5 }}>
                    💳 Pago seguro con Stripe. Acepta tarjetas de crédito y débito.
                  </div>

                  {/* CTA */}
                  <button
                    onClick={handleClick}
                    style={{ width: "100%", padding: "14px", borderRadius: "var(--r-pill)", background: "var(--rosa)", color: "#fff", border: "none", fontWeight: 800, fontSize: "1rem", cursor: "pointer", fontFamily: "var(--font-nunito)", boxShadow: "0 4px 16px rgba(255,111,125,.4)", transition: "all 150ms" }}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(255,111,125,.5)"}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 16px rgba(255,111,125,.4)"}}>
                    Ir a pagar →
                  </button>
                </div>
              </div>

              {/* Trust badges */}
              <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                {["🔒 Pago seguro", "📦 Entrega CDMX", "⭐ 4.9/5"].map(b => (
                  <span key={b} style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", background: "var(--bg-raised)", padding: "4px 10px", borderRadius: "var(--r-pill)", border: "1px solid var(--border-color)" }}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── Empty state ── */
          <div style={{ textAlign: "center", padding: "5rem 1rem", background: "var(--bg-raised)", borderRadius: "var(--r-xl)", border: "1.5px dashed var(--border-color)" }}>
            <div style={{ fontSize: "5rem", marginBottom: "1.25rem" }}>🛒</div>
            <h2 className={sofia.className} style={{ fontSize: "2rem", color: "var(--burdeos)", marginBottom: 12 }}>Tu carrito está vacío</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.75rem", maxWidth: 320, margin: "0 auto 1.75rem" }}>
              Aún no has agregado productos. Explora nuestro catálogo y elige algo delicioso.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/">
                <button style={{ padding: "12px 28px", borderRadius: "var(--r-pill)", background: "var(--burdeos)", color: "#fff", border: "none", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer", fontFamily: "var(--font-nunito)" }}>
                  Explorar tienda
                </button>
              </Link>
              <Link href="/cotizacion">
                <button style={{ padding: "12px 28px", borderRadius: "var(--r-pill)", background: "transparent", color: "var(--burdeos)", border: "2px solid var(--border-strong)", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "var(--font-nunito)" }}>
                  Cotizar pedido
                </button>
              </Link>
            </div>
          </div>
        )}
      </main>

      <WebFooter />
    </div>
  );
}
