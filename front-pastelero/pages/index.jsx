import Image from "next/image";
import WebFooter from "@/src/components/WebFooter";
import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

/* ─── Categories ─────────────────────────────────────────────────── */
const CATS = [
  { href: "/enduser/pastel-vintage", label: "Pasteles Vintage", sub: "Ármalo a tu gusto",      bg: "linear-gradient(180deg,rgba(255,226,231,.7) 0%,#FFC3C9 100%)", emoji: "🎂", textColor: "var(--burdeos)" },
  { href: "/enduser/galletas-ny",    label: "Galletas NY",      sub: "Mega, suaves, rellenas",  bg: "linear-gradient(180deg,rgba(184,230,211,.7) 0%,#B8E6D3 100%)", emoji: "🍪", textColor: "var(--burdeos)" },
  { href: "/enduser/conocenuestrosproductos", label: "Cupcakes", sub: "Perfectos para eventos", bg: "linear-gradient(180deg,rgba(255,233,155,.7) 0%,#FFE99B 100%)", emoji: "🧁", textColor: "var(--burdeos)" },
  { href: "/cursos",                 label: "Cursos",            sub: "Aprende con nosotros",   bg: "linear-gradient(180deg,rgba(217,196,232,.7) 0%,#D9C4E8 100%)", emoji: "✨", textColor: "var(--burdeos)" },
];

/* ─── Bestsellers ─────────────────────────────────────────────────── */
const BEST = [
  { tag: null,       label: "Vintage Rosa",    sub: "Vainilla · Mascarpone",    price: "$680", bg: "linear-gradient(135deg,#FFE2E7,#FFC3C9)", emoji: "🎂", href: "/enduser/pastel-vintage" },
  { tag: "Nuevo",    label: "Cookie Nutella",  sub: "NY style · Media docena",  price: "$180", bg: "linear-gradient(135deg,#FFE99B,#FFC9A5)", emoji: "🍪", href: "/enduser/galletas-ny" },
  { tag: null,       label: "Pay de Pistache", sub: "Masa de mantequilla",      price: "$450", bg: "linear-gradient(135deg,#B8E6D3,#D4E3A8)", emoji: "🥧", href: "/enduser/conocenuestrosproductos" },
  { tag: "Favorito", label: "Vintage Lavanda", sub: "Limón · Merengue",         price: "$720", bg: "linear-gradient(135deg,#D9C4E8,#FFC3C9)", emoji: "🎂", href: "/enduser/pastel-vintage" },
];

/* ─── Testimonials ───────────────────────────────────────────────── */
const TESTS = [
  { stars: "★★★★★", text: "El pastel de XV años fue absolutamente perfecto. Todos quedaron impresionados con el diseño y el sabor.", name: "Daniela M.", meta: "XV Años · Burdeos", av: "D", avBg: "linear-gradient(135deg,#FFC3C9,#FF6F7D)" },
  { stars: "★★★★★", text: "Las galletas NY llegaron calientitas el mismo día. El pistache crunch es el mejor que he probado en mi vida.", name: "Rodrigo P.", meta: "Entrega a domicilio", av: "R", avBg: "linear-gradient(135deg,#B8E6D3,#6FC9A8)" },
  { stars: "★★★★★", text: "Tomé el curso de pastel vintage y fue increíble. Me llevé mi pieza a casa y recibí muchos elogios.", name: "Camila L.", meta: "Curso · Nivel básico", av: "C", avBg: "linear-gradient(135deg,#D9C4E8,#A87BC8)" },
];

export default function Home() {
  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)" }}>
      {/* ── keyframe animations ──────────────────────────── */}
      <style>{`
        @keyframes float  { 0%,100%{transform:translateY(0) rotate(-8deg)} 50%{transform:translateY(-14px) rotate(-4deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(6deg)}  50%{transform:translateY(-10px) rotate(3deg)} }
        @keyframes bob    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes tumble { 0%,100%{transform:rotate(0deg) translateY(0)} 50%{transform:rotate(180deg) translateY(-9px)} }
        @keyframes spin   { to { transform:rotate(360deg) } }
        .cat-card:hover { transform: translateY(-8px); box-shadow: 0 16px 36px rgba(84,0,39,.16); }
        .prod-card:hover { transform: translateY(-6px); box-shadow: 0 16px 36px rgba(84,0,39,.16); }
        .add-btn:hover { background: var(--rosa); transform: scale(1.1); }
        .link-btn:hover { background: var(--rosa-4); }
        @media (max-width:900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .cats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .best-grid { grid-template-columns: repeat(2,1fr) !important; }
          .test-grid { grid-template-columns: 1fr !important; }
          .vintage-cta-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width:560px) {
          .cats-grid { grid-template-columns: 1fr 1fr !important; }
          .best-grid { grid-template-columns: 1fr 1fr !important; }
          .hero-visual { display:none; }
        }
      `}</style>

      {/* Sprinkle overlay */}
      <div aria-hidden="true" className="ru-pattern-sprinkle fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.06 }} />

      <NavbarAdmin />

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section style={{ position: "relative", padding: "5rem 1.5rem 4.5rem", overflow: "hidden" }}>
        <div className="hero-grid" style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>

          {/* ── Left copy ── */}
          <div>
            {/* Eyebrow pill */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", background: "var(--bg-raised)", borderRadius: "var(--r-pill)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--burdeos)", boxShadow: "var(--shadow-xs)", marginBottom: "1.25rem" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--rosa)", flexShrink: 0 }} />
              Recién horneado · Edición primavera
            </div>

            <h1 className={sofia.className} style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)", lineHeight: 0.97, color: "var(--burdeos)", marginBottom: "1.25rem" }}>
              Hornea<br />
              recuerdos
              <span style={{ color: "var(--rosa)", display: "block", transform: "translateX(clamp(1.5rem,3vw,3rem))" }}>dulces.</span>
            </h1>

            <p style={{ fontSize: "1.05rem", color: "var(--text-soft)", maxWidth: "46ch", lineHeight: 1.7, marginBottom: "2rem" }}>
              Pastelería artesanal en la Ciudad de México. Horneamos cada pieza a pedido, con ingredientes de temporada y un toque del ruiseñor.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
              <Link href="/enduser/pastel-vintage">
                <button style={{ padding: "14px 30px", borderRadius: "var(--r-pill)", background: "var(--burdeos)", color: "#fff", border: "none", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer", boxShadow: "var(--shadow-sm)", fontFamily: "var(--font-nunito)", transition: "all 150ms" }}
                  onMouseEnter={e=>{e.currentTarget.style.background="#7A1F44";e.currentTarget.style.transform="translateY(-2px)"}}
                  onMouseLeave={e=>{e.currentTarget.style.background="var(--burdeos)";e.currentTarget.style.transform="none"}}>
                  Arma tu pastel →
                </button>
              </Link>
              <Link href="/cursos">
                <button className="link-btn" style={{ padding: "14px 28px", borderRadius: "var(--r-pill)", background: "transparent", color: "var(--burdeos)", border: "2px solid var(--border-strong)", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", fontFamily: "var(--font-nunito)", transition: "all 150ms" }}>
                  Ver cursos
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "2.5rem" }}>
              {[["12+","sabores"],["4.9★","458 reseñas"],["72h","entrega CDMX"]].map(([n,l])=>(
                <div key={l}>
                  <div className={sofia.className} style={{ fontSize: "2.5rem", color: "var(--rosa)", lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-soft)", fontWeight: 600 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right visual ── */}
          <div className="hero-visual" style={{ position: "relative", aspectRatio: "1/1" }}>
            {/* Blob 1 — rosa */}
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%,#FFA1AA,#FF6F7D)", borderRadius: "60% 40% 55% 45%/50% 60% 40% 50%", animation: "float 6s ease-in-out infinite" }} />
            {/* Blob 2 — menta */}
            <div style={{ position: "absolute", inset: "10% -5% -5% 12%", background: "radial-gradient(circle at 70% 40%,#B8E6D3,#6FC9A8)", borderRadius: "45% 55% 40% 60%/60% 40% 55% 45%", animation: "float2 6s ease-in-out infinite", opacity: 0.85, zIndex: -1 }} />
            {/* Cake blob */}
            <div style={{ position: "absolute", inset: "10%", background: "var(--crema)", borderRadius: "50% 50% 50% 50%/50% 50% 50% 50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-xl)", overflow: "hidden" }}>
              <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0" style={{ opacity: 0.2 }} />
              <span style={{ fontSize: "6rem", position: "relative" }}>🎂</span>
            </div>

            {/* Floating sprinkle particles */}
            {[
              { top:"5%",  left:"8%",  bg:"#FF6F7D", delay:0    },
              { top:"25%", right:"-2%",bg:"#6FC9A8", delay:"-1s" },
              { bottom:"20%",left:"-2%",bg:"#FFE99B",delay:"-2s" },
              { bottom:"8%",right:"18%",bg:"#D9C4E8",delay:"-1.5s"},
            ].map((sp,i)=>(
              <span key={i} style={{ position:"absolute", width:14, height:5, borderRadius:3, background:sp.bg, animation:`tumble 4s ease-in-out infinite`, animationDelay:sp.delay, ...sp }} />
            ))}

            {/* Floating chips */}
            <div style={{ position:"absolute", top:"8%", right:"-4%", background:"var(--bg-raised)", padding:"10px 14px", borderRadius:"var(--r-pill)", boxShadow:"var(--shadow-md)", display:"flex", alignItems:"center", gap:10, fontWeight:700, fontSize:"0.8rem", animation:"bob 4s ease-in-out infinite", whiteSpace:"nowrap" }}>
              <span style={{ width:32, height:32, borderRadius:"50%", background:"#FFE2E7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>❤︎</span>
              <div><div style={{ fontSize:"0.65rem", color:"var(--text-muted)", fontWeight:500 }}>Favorito de</div><div>la semana</div></div>
            </div>
            <div style={{ position:"absolute", bottom:"12%", left:"-6%", background:"var(--bg-raised)", padding:"10px 14px", borderRadius:"var(--r-pill)", boxShadow:"var(--shadow-md)", display:"flex", alignItems:"center", gap:10, fontWeight:700, fontSize:"0.8rem", animation:"bob 4s ease-in-out infinite", animationDelay:"-2s", whiteSpace:"nowrap" }}>
              <span style={{ width:32, height:32, borderRadius:"50%", background:"#B8E6D3", color:"#1D5A45", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>✓</span>
              <div><div style={{ fontSize:"0.65rem", color:"var(--text-muted)", fontWeight:500 }}>Hecho con</div><div>mantequilla real</div></div>
            </div>
            <div style={{ position:"absolute", bottom:"40%", right:"-10%", background:"var(--bg-raised)", padding:"10px 14px", borderRadius:"var(--r-pill)", boxShadow:"var(--shadow-md)", display:"flex", alignItems:"center", gap:10, fontWeight:700, fontSize:"0.8rem", animation:"bob 4s ease-in-out infinite", animationDelay:"-1s", whiteSpace:"nowrap" }}>
              <span style={{ width:32, height:32, borderRadius:"50%", background:"#FFE99B", color:"#6B4F1A", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>✦</span>
              <div>Nuevo sabor</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CATEGORÍAS
      ══════════════════════════════════════════ */}
      <section style={{ background: "rgba(255,243,245,0.6)", padding: "4.5rem 1.5rem", position: "relative" }}>
        {/* section header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--rosa)", marginBottom: 8 }}>Nuestro mundo dulce</p>
          <h2 className={sofia.className} style={{ fontSize: "clamp(2.5rem,5vw,4rem)", color: "var(--burdeos)", lineHeight: 1 }}>¿Qué se te antoja hoy?</h2>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
            {["#FF6F7D","#6FC9A8","#FFE99B","#D9C4E8","#9FB864"].map(c=>(
              <span key={c} style={{ width:14, height:4, borderRadius:2, background:c }} />
            ))}
          </div>
        </div>

        <div className="cats-grid" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
          {CATS.map((cat) => (
            <Link key={cat.href} href={cat.href} style={{ textDecoration: "none" }}>
              <div
                className="cat-card"
                style={{ position: "relative", aspectRatio: "3/4", borderRadius: "var(--r-xl)", overflow: "hidden", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "flex-end", background: cat.bg, cursor: "pointer", transition: "transform 280ms cubic-bezier(.2,.8,.2,1), box-shadow 280ms" }}
              >
                {/* Sprinkle overlay */}
                <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0 pointer-events-none" style={{ opacity: 0.3 }} />
                {/* Illustration */}
                <div style={{ position: "absolute", top: "12%", left: "50%", transform: "translateX(-50%)", fontSize: "4.5rem", lineHeight: 1, zIndex: 1 }}>{cat.emoji}</div>
                {/* Text */}
                <h3 className={sofia.className} style={{ fontSize: "2rem", lineHeight: 1, marginBottom: 6, position: "relative", zIndex: 2, color: cat.textColor }}>{cat.label}</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-soft)", marginBottom: "0.75rem", position: "relative", zIndex: 2 }}>{cat.sub}</p>
                <span style={{ fontWeight: 700, fontSize: "0.8rem", color: cat.textColor, position: "relative", zIndex: 2 }}>Explorar →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BESTSELLERS
      ══════════════════════════════════════════ */}
      <section style={{ background: "rgba(250,237,227,.85)", padding: "4.5rem 1.5rem", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--rosa)", marginBottom: 8 }}>Top de la pastelería</p>
          <h2 className={sofia.className} style={{ fontSize: "clamp(2.5rem,5vw,4rem)", color: "var(--burdeos)", lineHeight: 1 }}>Los más horneados</h2>
        </div>

        <div className="best-grid" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
          {BEST.map((p) => (
            <Link key={p.label} href={p.href} style={{ textDecoration: "none" }}>
              <div className="prod-card" style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", overflow: "hidden", boxShadow: "var(--shadow-sm)", transition: "all 280ms cubic-bezier(.2,.8,.2,1)", position: "relative", cursor: "pointer" }}>
                {/* Badge */}
                {p.tag && (
                  <span style={{ position: "absolute", top: 12, left: 12, zIndex: 2, background: p.tag === "Nuevo" ? "var(--menta-deep)" : "var(--mantequilla)", color: p.tag === "Nuevo" ? "#1D5A45" : "#6B4F1A", fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: "var(--r-pill)" }}>
                    {p.tag}
                  </span>
                )}
                {/* Heart */}
                <button aria-label="favorito" style={{ position: "absolute", top: 10, right: 10, zIndex: 2, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.9)", backdropFilter: "blur(6px)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--rosa)", fontSize: 18, cursor: "pointer" }}>♥</button>
                {/* Product image area */}
                <div style={{ aspectRatio: "1/1", background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                  <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0" style={{ opacity: 0.3 }} />
                  <span style={{ fontSize: "5rem", position: "relative", zIndex: 1 }}>{p.emoji}</span>
                </div>
                {/* Body */}
                <div style={{ padding: "1rem 1.25rem 1.25rem" }}>
                  <h4 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: 4, color: "var(--color-text)" }}>{p.label}</h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>{p.sub}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className={sofia.className} style={{ fontSize: "1.75rem", color: "var(--rosa)", lineHeight: 1 }}>{p.price}</span>
                    <button className="add-btn" style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--burdeos)", color: "#fff", border: "none", fontSize: 20, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 150ms" }}>+</button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <Link href="/enduser/conocenuestrosproductos">
            <button className="link-btn" style={{ padding: "12px 36px", borderRadius: "var(--r-pill)", border: "1.5px solid var(--border-strong)", background: "transparent", color: "var(--burdeos)", cursor: "pointer", fontWeight: 700, fontFamily: "var(--font-nunito)", fontSize: "0.9rem", transition: "all 150ms" }}>
              Ver todo el catálogo
            </button>
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          VINTAGE CTA (burdeos)
      ══════════════════════════════════════════ */}
      <section style={{ padding: "4.5rem 1.5rem", position: "relative" }}>
        <div
          className="vintage-cta-grid"
          style={{ maxWidth: 1200, margin: "0 auto", background: "var(--burdeos)", borderRadius: "var(--r-2xl)", padding: "4rem 3rem", color: "#fff", position: "relative", overflow: "hidden", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "3rem", alignItems: "center" }}
        >
          {/* Patterns */}
          <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0 pointer-events-none" style={{ opacity: 0.2 }} />
          <div aria-hidden="true" className="ru-pattern-branches absolute inset-0 pointer-events-none" style={{ opacity: 0.1 }} />

          {/* Copy */}
          <div style={{ position: "relative" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--rosa-2)", marginBottom: "1rem" }}>Firma de la casa</p>
            <h2 className={sofia.className} style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)", lineHeight: 1, marginBottom: "1rem" }}>Arma tu pastel vintage</h2>
            <p style={{ color: "#FFD8DF", fontSize: "1rem", maxWidth: "44ch", marginBottom: "1.75rem", lineHeight: 1.7 }}>
              Elige porciones, sabor, relleno, cobertura y colores. Cada paso tiene preview en vivo para que veas tu pastel antes de ordenarlo.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link href="/enduser/pastel-vintage">
                <button style={{ padding: "14px 28px", borderRadius: "var(--r-pill)", background: "var(--rosa)", color: "#fff", border: "none", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer", fontFamily: "var(--font-nunito)", boxShadow: "0 4px 16px rgba(255,111,125,.4)", transition: "all 150ms" }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)"}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="none"}}>
                  Empezar configuración
                </button>
              </Link>
              <Link href="/enduser/galeria">
                <button style={{ padding: "14px 28px", borderRadius: "var(--r-pill)", background: "transparent", color: "#FFD8DF", border: "1.5px solid rgba(255,161,170,.5)", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", fontFamily: "var(--font-nunito)", transition: "all 150ms" }}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.08)"}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent"}}>
                  Ver galería
                </button>
              </Link>
            </div>
          </div>

          {/* Spinning ring visual */}
          <div style={{ position: "relative", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", inset: 0, border: "2px dashed rgba(255,193,200,.35)", borderRadius: "50%", animation: "spin 40s linear infinite" }}>
              <div style={{ position: "absolute", top: -6, left: "50%", width: 12, height: 12, background: "var(--rosa)", borderRadius: "50%", transform: "translateX(-50%)" }} />
            </div>
            <span style={{ fontSize: "7rem", filter: "drop-shadow(0 20px 40px rgba(0,0,0,.3))", animation: "bob 4s ease-in-out infinite" }}>🎂</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section style={{ padding: "4.5rem 1.5rem", background: "rgba(255,243,245,.6)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--rosa)", marginBottom: 8 }}>Lo que dicen</p>
            <h2 className={sofia.className} style={{ fontSize: "clamp(2.5rem,5vw,4rem)", color: "var(--burdeos)", lineHeight: 1 }}>Reseñas reales</h2>
          </div>

          <div className="test-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }}>
            {TESTS.map((t) => (
              <div key={t.name} style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "1.75rem", boxShadow: "var(--shadow-sm)", position: "relative" }}>
                <span className={sofia.className} style={{ fontSize: "4rem", color: "var(--rosa-3)", lineHeight: 0.5, position: "absolute", top: 16, right: 20 }}>"</span>
                <div style={{ color: "#E8B43A", fontSize: "1rem", letterSpacing: 2, marginBottom: "0.75rem" }}>{t.stars}</div>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--text-soft)", fontStyle: "italic", marginBottom: "1rem" }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: t.avBg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className={sofia.className} style={{ fontSize: "1.5rem" }}>{t.av}</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{t.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{t.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          NEWSLETTER / CTA FINAL
      ══════════════════════════════════════════ */}
      <section style={{ padding: "4.5rem 1.5rem" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", background: "linear-gradient(135deg,#FFC3C9 0%,#FFE99B 100%)", borderRadius: "var(--r-2xl)", padding: "3.5rem 2.5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0 pointer-events-none" style={{ opacity: 0.45 }} />
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--burdeos)", marginBottom: 8, position: "relative" }}>¿Lista para pedir?</p>
          <h2 className={sofia.className} style={{ fontSize: "3.5rem", lineHeight: 1, color: "var(--burdeos)", marginBottom: 12, position: "relative" }}>Cotiza hoy</h2>
          <p style={{ color: "var(--burdeos)", fontSize: "1rem", marginBottom: "1.75rem", position: "relative", lineHeight: 1.6, opacity: 0.8 }}>
            Cuéntanos tu idea y te respondemos en menos de 24 horas. Sin compromisos, sin costos ocultos.
          </p>
          <Link href="/cotizacion" style={{ position: "relative" }}>
            <button style={{ padding: "14px 40px", borderRadius: "var(--r-pill)", background: "var(--burdeos)", color: "#fff", border: "none", fontWeight: 800, fontSize: "1rem", cursor: "pointer", fontFamily: "var(--font-nunito)", boxShadow: "var(--shadow-md)", transition: "all 150ms" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="var(--shadow-lg)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="var(--shadow-md)"}}>
              ¡Cotizar ahora! →
            </button>
          </Link>
        </div>
      </section>

      <WebFooter />
    </div>
  );
}
