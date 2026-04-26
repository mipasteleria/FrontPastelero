import { useState } from "react";
import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

/* ─── Cookie flavors ─────────────────────────────────────────── */
const FLAVORS = [
  { id: "chispas",   name: "Chispas clásica",    tag: "Bestseller", tagColor: "var(--rosa)",        tagText: "#fff",       bg: "linear-gradient(135deg,#FFE2E7,#FFC3C9)", price: 30, emoji: "🍪" },
  { id: "nutella",   name: "Nutella molten",      tag: null,         tagColor: null,                tagText: null,         bg: "linear-gradient(135deg,#FFE99B,#FFC9A5)", price: 38, emoji: "🍫" },
  { id: "pistache",  name: "Pistache crunch",     tag: "Nuevo",      tagColor: "var(--menta-deep)", tagText: "#1D5A45",    bg: "linear-gradient(135deg,#B8E6D3,#D4E3A8)", price: 42, emoji: "🌿" },
  { id: "redvelvet", name: "Red velvet",          tag: null,         tagColor: null,                tagText: null,         bg: "linear-gradient(135deg,#FFC9A5,#FFA1AA)", price: 35, emoji: "❤️" },
  { id: "oreo",      name: "Oreo & cream",        tag: "Favorito",   tagColor: "var(--mantequilla)","tagText":"#6B4F1A",   bg: "linear-gradient(135deg,#D9C4E8,#FFC3C9)", price: 38, emoji: "🍦" },
  { id: "matcha",    name: "Matcha white",         tag: null,         tagColor: null,                tagText: null,         bg: "linear-gradient(135deg,#B8E6D3,#D9C4E8)", price: 42, emoji: "🍵" },
  { id: "triple",    name: "Triple chocolate",    tag: null,         tagColor: null,                tagText: null,         bg: "linear-gradient(135deg,#6B3F2A,#D9A87B)", price: 38, emoji: "🍫" },
  { id: "fresa",     name: "Fresa & leche",       tag: null,         tagColor: null,                tagText: null,         bg: "linear-gradient(135deg,#FFA1AA,#FF6F7D)", price: 35, emoji: "🍓" },
];

const SIZES = [
  { label: "Media docena", count: 6,  key: "6" },
  { label: "Docena",       count: 12, key: "12" },
];

export default function GalletasNY() {
  const [activeSize, setActiveSize] = useState("12");
  const [quantities, setQuantities] = useState({});

  const boxSize  = activeSize === "6" ? 6 : 12;
  const filled   = Object.values(quantities).reduce((s, v) => s + v, 0);
  const remaining = boxSize - filled;

  const add = (id) => {
    if (filled >= boxSize) return;
    setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const remove = (id) => {
    setQuantities(prev => {
      const next = { ...prev };
      if (!next[id]) return prev;
      next[id] -= 1;
      if (next[id] <= 0) delete next[id];
      return next;
    });
  };

  const selectedItems = FLAVORS.filter(f => quantities[f.id]);
  const subtotal = selectedItems.reduce((s, f) => s + f.price * quantities[f.id], 0);
  const discount = activeSize === "12" && filled === 12 ? 30 : 0;
  const total    = subtotal - discount;

  /* Box slots */
  const slots = Array.from({ length: boxSize }, (_, i) => {
    let cum = 0;
    for (const f of FLAVORS) {
      const q = quantities[f.id] || 0;
      if (i < cum + q) return f;
      cum += q;
    }
    return null;
  });

  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)", display: "flex", flexDirection: "column" }}>
      <style>{`
        .flav-card:hover{transform:translateY(-6px);box-shadow:0 16px 36px rgba(84,0,39,.16)}
        .add-circle:hover{background:var(--rosa)!important}
        @media(max-width:900px){.ny-grid{grid-template-columns:1fr!important}.box-wrap-sticky{position:relative!important;top:auto!important}}
        @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
      `}</style>

      <div aria-hidden="true" className="ru-pattern-sprinkle fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.06 }} />

      <NavbarAdmin />

      <main className="flex-grow relative z-10" style={{ marginTop: "4rem" }}>
        {/* ── Page header ── */}
        <div style={{ textAlign: "center", padding: "2.5rem 1.25rem 0", maxWidth: 820, margin: "0 auto" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--rosa)", marginBottom: 8 }}>Galletas NY · Mega, suaves, rellenas</p>
          <h1 className={sofia.className} style={{ fontSize: "clamp(2.5rem,6vw,5rem)", color: "var(--burdeos)", lineHeight: 1, marginBottom: 12 }}>Arma tu caja</h1>
          <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: "0.95rem", maxWidth: 50 + "ch", margin: "0 auto 2rem" }}>
            Elige tamaño y llénala con los sabores que más se te antojen. Llegan calientitas el mismo día.
          </p>

          {/* Size tabs */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
            {SIZES.map(sz => (
              <button
                key={sz.key}
                onClick={() => { setActiveSize(sz.key); setQuantities({}); }}
                style={{ padding: "12px 28px", borderRadius: "var(--r-pill)", border: "2px solid", borderColor: activeSize === sz.key ? "var(--rosa)" : "var(--border-color)", background: activeSize === sz.key ? "var(--rosa)" : "var(--bg-raised)", color: activeSize === sz.key ? "#fff" : "var(--text-soft)", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-nunito)", transition: "all 150ms" }}
              >
                {sz.label}
                <span style={{ padding: "2px 8px", borderRadius: "var(--r-pill)", fontSize: "0.7rem", background: activeSize === sz.key ? "rgba(255,255,255,.2)" : "var(--rosa-4)", color: activeSize === sz.key ? "#fff" : "var(--burdeos)", fontWeight: 700 }}>{sz.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="ny-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem 3rem", display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.75rem", alignItems: "start" }}>

          {/* ── Flavors panel ── */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <h2 style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--burdeos)" }}>Elige tus sabores</h2>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Click en <strong style={{ color: "var(--rosa)" }}>+</strong> para agregar</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>Puedes repetir o mezclar. Cada galleta pesa ~120g.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: "1rem" }}>
              {FLAVORS.map(f => {
                const qty = quantities[f.id] || 0;
                return (
                  <div key={f.id} className="flav-card" style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "1rem", boxShadow: "var(--shadow-sm)", cursor: "pointer", transition: "all 280ms cubic-bezier(.2,.8,.2,1)", position: "relative", overflow: "hidden", border: qty > 0 ? "2px solid var(--rosa)" : "2px solid transparent" }}>
                    {/* Qty badge */}
                    {qty > 0 && (
                      <div style={{ position: "absolute", top: 10, left: 10, width: 26, height: 26, borderRadius: "50%", background: "var(--rosa)", color: "#fff", fontWeight: 800, fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-sm)" }}>{qty}</div>
                    )}
                    {/* Tag */}
                    {f.tag && (
                      <div style={{ position: "absolute", top: 10, right: 10, background: f.tagColor, color: f.tagText, fontSize: "0.65rem", fontWeight: 700, padding: "3px 8px", borderRadius: "var(--r-pill)" }}>{f.tag}</div>
                    )}
                    {/* Image circle */}
                    <div style={{ width: "80%", aspectRatio: "1/1", borderRadius: "50%", background: f.bg, margin: "0 auto 0.75rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", position: "relative", overflow: "hidden" }}>
                      <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0" style={{ opacity: 0.3 }} />
                      <span style={{ position: "relative", zIndex: 1 }}>{f.emoji}</span>
                    </div>
                    <h4 style={{ fontWeight: 700, fontSize: "0.9rem", textAlign: "center", marginBottom: 2 }}>{f.name}</h4>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center", marginBottom: "0.75rem" }}>Chocolate belga</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-soft)", fontWeight: 700 }}>${f.price} c/u</span>
                      <div style={{ display: "flex", gap: 6 }}>
                        {qty > 0 && (
                          <button onClick={() => remove(f.id)} style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--rosa-4)", color: "var(--burdeos)", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>−</button>
                        )}
                        <button className="add-circle" onClick={() => add(f.id)} disabled={remaining <= 0 && !qty} style={{ width: 28, height: 28, borderRadius: "50%", background: remaining <= 0 && !qty ? "var(--border-color)" : "var(--burdeos)", color: "#fff", border: "none", cursor: remaining <= 0 && !qty ? "not-allowed" : "pointer", fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 150ms", lineHeight: 1 }}>+</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Box sidebar ── */}
          <div className="box-wrap-sticky" style={{ position: "sticky", top: 84, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {/* Box visual */}
            <div style={{ background: "linear-gradient(180deg,#FFC3C9 0%,#FFA1AA 100%)", borderRadius: "var(--r-xl)", padding: "1.25rem", boxShadow: "var(--shadow-md)", position: "relative", overflow: "hidden" }}>
              <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0" style={{ opacity: 0.4 }} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <h3 className={sofia.className} style={{ fontSize: "1.5rem", color: "var(--burdeos)", lineHeight: 1 }}>Tu caja</h3>
                  <span style={{ fontSize: "0.7rem", color: "var(--burdeos)", fontWeight: 700, background: "rgba(255,255,255,.7)", padding: "3px 10px", borderRadius: "var(--r-pill)" }}>{filled} / {boxSize}</span>
                </div>
                {/* Slots grid */}
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${activeSize === "6" ? 3 : 4},1fr)`, gap: 6, background: "rgba(255,243,245,.7)", backdropFilter: "blur(6px)", borderRadius: "var(--r-md)", padding: "0.75rem", border: "2px dashed rgba(84,0,39,.15)" }}>
                  {slots.map((flavor, i) => (
                    <div key={i} style={{ aspectRatio: "1/1", borderRadius: "50%", background: flavor ? flavor.bg : "rgba(255,255,255,.4)", border: "2px dashed", borderColor: flavor ? "transparent" : "rgba(84,0,39,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: flavor ? "1.4rem" : "0.85rem", color: "rgba(84,0,39,.35)", fontWeight: 700, animation: flavor ? "bob 4s ease-in-out infinite" : "none", animationDelay: `${i * 0.15}s` }}>
                      {flavor ? flavor.emoji : "+"}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            {filled > 0 && (
              <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-md)", padding: "1rem 1.25rem", border: "1px solid var(--border-color)" }}>
                <h4 style={{ fontWeight: 800, fontSize: "0.75rem", color: "var(--burdeos)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Resumen</h4>
                {selectedItems.map(f => (
                  <div key={f.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--text-soft)", padding: "2px 0" }}>
                    <span>{quantities[f.id]}× {f.name}</span>
                    <span>${(quantities[f.id] * f.price).toFixed(0)}</span>
                  </div>
                ))}
                {discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--menta-deep)", padding: "2px 0" }}>
                    <span>Descuento docena</span><span>−${discount}</span>
                  </div>
                )}
                <div style={{ borderTop: "1px dashed var(--border-color)", marginTop: "0.5rem", paddingTop: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>Total</span>
                  <span className={sofia.className} style={{ fontSize: "1.5rem", color: "var(--burdeos)", lineHeight: 1 }}>${total}</span>
                </div>
              </div>
            )}

            {/* Checkout */}
            <div style={{ background: "var(--burdeos)", color: "#fff", padding: "1rem 1.25rem", borderRadius: "var(--r-md)", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "var(--shadow-md)", gap: "0.75rem", position: "relative", overflow: "hidden" }}>
              <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0" style={{ opacity: 0.12 }} />
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: "0.65rem", color: "var(--rosa-2)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 2 }}>{remaining > 0 ? `Faltan ${remaining}` : "¡Caja lista!"}</div>
                <div className={sofia.className} style={{ fontSize: "1.5rem", lineHeight: 1 }}>${total}</div>
              </div>
              <Link href="/cotizacion">
                <button style={{ padding: "10px 20px", borderRadius: "var(--r-pill)", background: "var(--rosa)", color: "#fff", border: "none", fontWeight: 800, fontSize: "0.85rem", cursor: filled > 0 ? "pointer" : "not-allowed", fontFamily: "var(--font-nunito)", whiteSpace: "nowrap", opacity: filled > 0 ? 1 : 0.5, transition: "all 150ms", position: "relative" }}>
                  Cotizar →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <WebFooter />
    </div>
  );
}
