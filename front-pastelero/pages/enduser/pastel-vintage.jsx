import { useState } from "react";
import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

/* ─── Step data ──────────────────────────────────────────────── */
const STEPS = [
  { label: "Porciones" },
  { label: "Sabor"     },
  { label: "Relleno"   },
  { label: "Cobertura" },
  { label: "Color"     },
  { label: "Decoración"},
];

const PORTIONS = [
  { id: "10", label: "10 porciones",  sub: "Para fiestas pequeñas.",                              extra: null,    price: 450 },
  { id: "12", label: "12 porciones",  sub: "El tamaño más popular para cumpleaños.",              extra: "+ Más popular", price: 560 },
  { id: "16", label: "16 porciones",  sub: "Para reuniones medianas o bufet dulce.",              extra: null,    price: 720 },
  { id: "20", label: "20 porciones",  sub: "Ideal para bodas, XV años y eventos grandes.",        extra: "+ 2 pisos", price: 980 },
];

const SABORES = [
  { id: "vainilla",    label: "Vainilla",          sub: "El clásico favorito, suave y esponjoso.",           extra: "Incluido" },
  { id: "chocolate",   label: "Chocolate",          sub: "Húmedo, rico y con sabor intenso a cacao.",         extra: "Incluido" },
  { id: "birthday",   label: "Birthday Cake 🎉",    sub: "Con confetti de colores. Extra festivo.",           extra: "Incluido" },
  { id: "redvelvet",  label: "Red Velvet",          sub: "Textura sedosa con toque de cacao y vainilla.",     extra: "+ $40"    },
  { id: "limón",      label: "Blueberry & Limón",   sub: "Fresco y único, con semillas de amapola.",          extra: "+ $50"    },
  { id: "zanahoria",  label: "Zanahoria",           sub: "Especiado, húmedo y reconfortante.",                extra: "Incluido" },
];

const RELLENOS = [
  { id: "fresa",      label: "Fresa natural",       sub: "Mermelada casera con trozos de fresa.",             extra: "+ $40 · Más popular" },
  { id: "nutella",    label: "Nutella",             sub: "Cremosa, para los amantes del chocolate.",          extra: "+ $60" },
  { id: "cajeta",     label: "Dulce de leche",      sub: "Espeso, caramelizado y tibio.",                     extra: "+ $50" },
  { id: "cajeta-mex", label: "Cajeta quemada",      sub: "Tradicional mexicana con toque de sal.",            extra: "+ $50" },
  { id: "pistache",   label: "Crema de pistache",   sub: "Artesanal, con pistaches naturales molidos.",       extra: "+ $90 · Ed. limitada" },
  { id: "none",       label: "Sin relleno",         sub: "Esponja clásica con cobertura. Más ligera.",        extra: "Incluido" },
];

const COBERTURAS = [
  { id: "buttercream",  label: "Buttercream clásico",    sub: "Suave, cremoso y versátil.",              extra: "Incluido" },
  { id: "mascarpone",   label: "Crema Mascarpone",       sub: "Más ligero y elegante.",                  extra: "+ $80"    },
  { id: "ganache",      label: "Ganache de chocolate",   sub: "Brillante y rico para los chocolateros.", extra: "+ $70"    },
  { id: "fondant",      label: "Fondant liso",           sub: "Acabado perfecto para diseños complejos.", extra: "+ $120"   },
];

const COLORS = [
  { id: "rosa-pastel", label: "Rosa pastel",  hex: "#FFE2E7" },
  { id: "rosa",        label: "Rosa",         hex: "#FF6F7D" },
  { id: "menta",       label: "Menta",        hex: "#B8E6D3" },
  { id: "mantequilla", label: "Mantequilla",  hex: "#FFE99B" },
  { id: "lavanda",     label: "Lavanda",      hex: "#D9C4E8" },
  { id: "durazno",     label: "Durazno",      hex: "#FFC9A5" },
  { id: "burdeos",     label: "Burdeos",      hex: "#540027" },
  { id: "blanco",      label: "Blanco",       hex: "#FFFFFF" },
];

const DECORACIONES = [
  { id: "rosetones",   label: "Rosetones clásicos",    sub: "Flores de buttercream en la parte superior.",    extra: "Incluido" },
  { id: "drips",       label: "Drips de ganache",       sub: "Chorritos de chocolate por los bordes.",         extra: "+ $60"    },
  { id: "flores-nat",  label: "Flores naturales",       sub: "Flores frescas de temporada.",                  extra: "+ $120"   },
  { id: "láminas-oro", label: "Láminas de oro",         sub: "Detalles dorados comestibles.",                 extra: "+ $90"    },
];

/* ─── Helpers ────────────────────────────────────────────────── */
function OptionGrid({ options, selected, onSelect, columns = 2 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns},1fr)`, gap: "0.75rem", marginBottom: "1.25rem" }}>
      {options.map(opt => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onSelect(opt.id)}
          style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "1rem", borderRadius: "var(--r-md)", border: "2px solid", borderColor: selected === opt.id ? "var(--rosa)" : "var(--border-color)", background: selected === opt.id ? "var(--rosa-4)" : "var(--bg-raised)", cursor: "pointer", textAlign: "left", position: "relative", transition: "all 150ms", fontFamily: "var(--font-nunito)" }}
        >
          {/* Radio dot */}
          <span style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid", borderColor: selected === opt.id ? "var(--rosa)" : "var(--text-muted)", background: selected === opt.id ? "var(--rosa)" : "transparent", boxShadow: selected === opt.id ? "inset 0 0 0 3px #fff" : "none", flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong style={{ display: "block", fontSize: "0.9rem", marginBottom: 2 }}>{opt.label}</strong>
            {opt.sub && <span style={{ fontSize: "0.8rem", color: "var(--text-soft)", lineHeight: 1.4, display: "block" }}>{opt.sub}</span>}
            {opt.extra && <span style={{ fontSize: "0.7rem", color: "var(--rosa)", fontWeight: 700, marginTop: 4, display: "block" }}>{opt.extra}</span>}
          </div>
          {/* Checkmark */}
          {selected === opt.id && (
            <span style={{ position: "absolute", top: 8, right: 12, width: 20, height: 20, background: "var(--rosa)", color: "#fff", borderRadius: "50%", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>✓</span>
          )}
        </button>
      ))}
    </div>
  );
}

function ColorPicker({ colors, selected, onSelect }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
      {colors.map(c => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(c.id)}
          title={c.label}
          style={{ width: 46, height: 46, borderRadius: "50%", background: c.hex, border: selected === c.id ? "3px solid var(--burdeos)" : "3px solid transparent", cursor: "pointer", transition: "all 150ms", transform: selected === c.id ? "scale(1.12)" : "scale(1)", boxShadow: selected === c.id ? "var(--shadow-sm)" : "none", outline: c.hex === "#FFFFFF" ? "1px solid var(--border-color)" : "none" }}
        />
      ))}
    </div>
  );
}

/* ─── Step bar ───────────────────────────────────────────────── */
function StepBar({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
      {STEPS.map((s, i) => (
        <div key={s.label} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", border: "2px solid", borderColor: i < current ? "var(--menta-deep)" : i === current ? "var(--rosa)" : "var(--border-color)", background: i < current ? "var(--menta-deep)" : i === current ? "var(--rosa)" : "var(--bg-sunken)", color: i <= current ? "#fff" : "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", boxShadow: i === current ? "var(--shadow-glow)" : "none", transition: "all 200ms" }}>
              {i < current ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", color: i <= current ? "var(--color-text)" : "var(--text-muted)", whiteSpace: "nowrap" }}>{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ flex: 1, height: 2, background: i < current ? "var(--menta-deep)" : "var(--border-color)", margin: "0 4px", marginBottom: 20 }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function PastelVintage() {
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState({
    porciones: "12", sabor: "vainilla", relleno: "fresa",
    cobertura: "buttercream", color: "rosa", decoracion: "rosetones",
  });

  const update = (key, val) => setSel(prev => ({ ...prev, [key]: val }));

  const basePrice = PORTIONS.find(p => p.id === sel.porciones)?.price || 560;
  const rellenoExtra = { nutella: 60, cajeta: 50, "cajeta-mex": 50, pistache: 90, fresa: 40, none: 0 }[sel.relleno] || 0;
  const coberturaExtra = { buttercream: 0, mascarpone: 80, ganache: 70, fondant: 120 }[sel.cobertura] || 0;
  const decorExtra = { rosetones: 0, drips: 60, "flores-nat": 120, "láminas-oro": 90 }[sel.decoracion] || 0;
  const total = basePrice + rellenoExtra + coberturaExtra + decorExtra;

  const colorHex = COLORS.find(c => c.id === sel.color)?.hex || "#FF6F7D";
  const colorName = COLORS.find(c => c.id === sel.color)?.label || "Rosa";

  const stepContent = [
    { title: "Elige las porciones", desc: "Selecciona el tamaño de tu pastel según el número de invitados.", content: <OptionGrid options={PORTIONS} selected={sel.porciones} onSelect={v=>update("porciones",v)} /> },
    { title: "Elige tu sabor",      desc: "Todos nuestros sabores se hornean el mismo día para garantizar la frescura.", content: <OptionGrid options={SABORES} selected={sel.sabor} onSelect={v=>update("sabor",v)} /> },
    { title: "Elige tu relleno",    desc: "Puedes combinar hasta 2 rellenos. Los rellenos frescos se preparan el mismo día.", content: <OptionGrid options={RELLENOS} selected={sel.relleno} onSelect={v=>update("relleno",v)} /> },
    { title: "Elige la cobertura",  desc: "La cobertura afecta la textura final y las posibilidades de decoración.", content: <OptionGrid options={COBERTURAS} selected={sel.cobertura} onSelect={v=>update("cobertura",v)} /> },
    { title: "Elige el color",      desc: "El color de la cobertura exterior de tu pastel.", content: <div><p style={{ fontSize:"0.85rem", color:"var(--text-soft)", marginBottom:"0.75rem" }}>Color seleccionado: <strong style={{color:"var(--burdeos)"}}>{colorName}</strong></p><ColorPicker colors={COLORS} selected={sel.color} onSelect={v=>update("color",v)} /></div> },
    { title: "Elige la decoración", desc: "El toque final que hace a tu pastel único.", content: <OptionGrid options={DECORACIONES} selected={sel.decoracion} onSelect={v=>update("decoracion",v)} /> },
  ];

  const current = stepContent[step];

  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @media(max-width:900px){.vintage-pdp{grid-template-columns:1fr!important}.preview-sticky{position:relative!important;top:auto!important;aspect-ratio:4/5}}
      `}</style>

      <div aria-hidden="true" className="ru-pattern-sprinkle fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.06 }} />
      <NavbarAdmin />

      <main className="flex-grow relative z-10" style={{ marginTop: "4rem", padding: "2.5rem 1.25rem 3rem", maxWidth: 1200, marginLeft: "auto", marginRight: "auto", width: "100%" }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
          <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Inicio</Link>
          {" › "}
          <strong style={{ color: "var(--burdeos)" }}>Pastel Vintage Personalizado</strong>
        </div>

        {/* Page header */}
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--rosa)", marginBottom: 6 }}>Edición Vintage · Personalizable</p>
            <h1 className={sofia.className} style={{ fontSize: "clamp(2.5rem,6vw,5rem)", color: "var(--burdeos)", lineHeight: 1 }}>Arma tu pastel vintage</h1>
            <p style={{ color: "var(--text-soft)", fontSize: "0.95rem", marginTop: 8, maxWidth: "54ch" }}>
              Cinco pasos. Cada elección actualiza tu pastel en vivo.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <span style={{ background: "var(--menta)", color: "#1D5A45", fontSize: "0.75rem", fontWeight: 700, padding: "4px 12px", borderRadius: "var(--r-pill)" }}>Stock: listo</span>
            <span style={{ background: "var(--mantequilla)", color: "#6B4F1A", fontSize: "0.75rem", fontWeight: 700, padding: "4px 12px", borderRadius: "var(--r-pill)" }}>⭐ 4.9</span>
          </div>
        </div>

        <div className="vintage-pdp" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "2.5rem", alignItems: "start" }}>

          {/* ── Left: live preview ── */}
          <div className="preview-sticky" style={{ position: "sticky", top: 84, background: `linear-gradient(180deg,${colorHex}55 0%,${colorHex}AA 60%,${colorHex}CC 100%)`, borderRadius: "var(--r-2xl)", overflow: "hidden", padding: "2.5rem", aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", boxShadow: "var(--shadow-md)", position: "relative" }}>
            <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0" style={{ opacity: 0.4 }} />
            {/* Cake illustration */}
            <div style={{ position: "relative", width: "70%", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", animation: "float 4s ease-in-out infinite", zIndex: 1 }}>
              <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                {/* Top tier */}
                <div style={{ width: "55%", height: 64, background: colorHex, borderRadius: "8px 8px 0 0", boxShadow: `0 -4px 0 ${colorHex}88 inset`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>🕯️</div>
                {/* Middle tier */}
                <div style={{ width: "78%", height: 72, background: colorHex, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>🌹</div>
                {/* Bottom tier */}
                <div style={{ width: "100%", height: 80, background: colorHex, borderRadius: "0 0 12px 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", boxShadow: "0 8px 20px rgba(84,0,39,.25)" }}>
                  {sel.decoracion === "drips" ? "🍫" : sel.decoracion === "flores-nat" ? "🌸" : sel.decoracion === "láminas-oro" ? "✨" : ""}
                </div>
              </div>
            </div>
            {/* Live badge */}
            <div style={{ position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, background: "rgba(255,255,255,.9)", backdropFilter: "blur(6px)", padding: "6px 14px", borderRadius: "var(--r-pill)", boxShadow: "var(--shadow-sm)", fontSize: "0.7rem", fontWeight: 700, color: "var(--burdeos)", letterSpacing: "0.12em", textTransform: "uppercase", alignItems: "center", whiteSpace: "nowrap" }}>
              <span style={{ width: 8, height: 8, background: "var(--menta-deep)", borderRadius: "50%", boxShadow: "0 0 0 3px rgba(111,201,168,.3)" }} />
              Preview en vivo
            </div>
            {/* Summary chips */}
            <div style={{ position: "absolute", top: "1.25rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", maxWidth: "90%" }}>
              {[sel.porciones + " porc.", SABORES.find(s=>s.id===sel.sabor)?.label, colorName].map(chip=>(
                <span key={chip} style={{ fontSize: "0.65rem", fontWeight: 700, background: "rgba(255,255,255,.85)", color: "var(--burdeos)", padding: "3px 8px", borderRadius: "var(--r-pill)" }}>{chip}</span>
              ))}
            </div>
          </div>

          {/* ── Right: configurator panel ── */}
          <div>
            <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "2rem", boxShadow: "var(--shadow-sm)" }}>
              <StepBar current={step} />

              {/* Step content */}
              <div>
                <p className={sofia.className} style={{ fontSize: "1.1rem", color: "var(--rosa)", marginBottom: 4 }}>Paso {step + 1} de {STEPS.length}</p>
                <h2 style={{ fontWeight: 800, fontSize: "1.6rem", color: "var(--burdeos)", marginBottom: 6 }}>{current.title}</h2>
                <p style={{ fontSize: "0.85rem", color: "var(--text-soft)", marginBottom: "1.25rem", lineHeight: 1.5 }}>{current.desc}</p>
                {current.content}
              </div>

              {/* Navigation */}
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", paddingTop: "1.25rem", borderTop: "1px dashed var(--border-color)" }}>
                <button disabled={step === 0} onClick={() => setStep(s => s - 1)} style={{ padding: "10px 22px", borderRadius: "var(--r-pill)", border: "2px solid var(--border-color)", background: "transparent", color: "var(--burdeos)", fontWeight: 700, fontSize: "0.85rem", cursor: step === 0 ? "not-allowed" : "pointer", fontFamily: "var(--font-nunito)", opacity: step === 0 ? 0.4 : 1 }}>
                  ← Anterior
                </button>
                {step < STEPS.length - 1 ? (
                  <button onClick={() => setStep(s => s + 1)} style={{ padding: "10px 22px", borderRadius: "var(--r-pill)", background: "var(--rosa)", color: "#fff", border: "none", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", fontFamily: "var(--font-nunito)", boxShadow: "0 4px 12px rgba(255,111,125,.3)", transition: "all 150ms" }}
                    onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="none"}>
                    Siguiente: {STEPS[step + 1].label} →
                  </button>
                ) : (
                  <Link href="/cotizacion">
                    <button style={{ padding: "10px 22px", borderRadius: "var(--r-pill)", background: "var(--burdeos)", color: "#fff", border: "none", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", fontFamily: "var(--font-nunito)", boxShadow: "var(--shadow-md)" }}>
                      Agregar al carrito →
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* Pricing sticky bar */}
            <div style={{ background: "var(--burdeos)", color: "#fff", padding: "1.25rem 1.5rem", borderRadius: "var(--r-xl)", marginTop: "1rem", boxShadow: "var(--shadow-lg)", display: "flex", justifyContent: "space-between", alignItems: "center", overflow: "hidden", position: "relative" }}>
              <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0" style={{ opacity: 0.14 }} />
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: "0.65rem", color: "var(--rosa-2)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 4 }}>Total estimado</div>
                <div className={sofia.className} style={{ fontSize: "2.2rem", lineHeight: 1 }}>${total} <span style={{ fontSize: "0.85rem", fontWeight: 500, fontFamily: "var(--font-nunito)", color: "#FFA1AA" }}>MXN</span></div>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: 6, flexWrap: "wrap" }}>
                  {[sel.porciones+" porc.", SABORES.find(s=>s.id===sel.sabor)?.label, colorName].map(c=>(
                    <span key={c} style={{ padding: "3px 8px", background: "rgba(255,255,255,.1)", borderRadius: "var(--r-pill)", fontSize: "0.7rem" }}>{c}</span>
                  ))}
                </div>
              </div>
              <Link href="/cotizacion" style={{ position: "relative" }}>
                <button style={{ padding: "12px 24px", borderRadius: "var(--r-pill)", background: "var(--rosa)", color: "#fff", border: "none", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer", fontFamily: "var(--font-nunito)", whiteSpace: "nowrap", boxShadow: "0 4px 16px rgba(255,111,125,.4)", transition: "all 150ms" }}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="none"}>
                  Cotizar pedido
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
