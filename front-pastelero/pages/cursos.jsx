import { useState } from "react";
import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

/* ─── Courses data ───────────────────────────────────────────── */
const COURSES = [
  { id: 1,  level: "Principiante", price: "$1,200", color: "linear-gradient(135deg,#FFC3C9,#FF6F7D)", title: "Pastel vintage 101",          by: "Silvia Ruiz · 4h",    date: "Sáb 12 Mar", seats: 8, avail: 3, desc: "Aprende la técnica de pastel vintage clásico: rosetones, drips y bordes. Te llevas un pastel de 6 porciones.", tag: "pasteles"   },
  { id: 2,  level: "Intermedio",   price: "$1,500", color: "linear-gradient(135deg,#B8E6D3,#6FC9A8)", title: "Buttercream avanzado",         by: "Silvia Ruiz · 5h",    date: "Dom 13 Mar", seats: 6, avail: 2, desc: "Texturas, flores en manga, pintura comestible y mezcla de tonos. Para quienes ya dominan lo básico.",   tag: "pasteles"   },
  { id: 3,  level: "Principiante", price: "$890",   color: "linear-gradient(135deg,#FFE99B,#FFC9A5)", title: "Galletas NY style",            by: "Diego López · 3h",   date: "Sáb 19 Mar", seats: 8, avail: 5, desc: "El secreto de la galleta gigante con centro suave. Te llevas una caja de 6 galletas.",                 tag: "galletas"   },
  { id: 4,  level: "Avanzado",     price: "$2,400", color: "linear-gradient(135deg,#D9C4E8,#FFC3C9)", title: "Pastel de bodas",              by: "Silvia Ruiz · 8h",    date: "Sáb 26 Mar", seats: 4, avail: 1, desc: "Estructura de tres pisos, dummies, transporte y decoración con flores naturales. Curso completo.",       tag: "pasteles"   },
  { id: 5,  level: "Principiante", price: "$650",   color: "linear-gradient(135deg,#FFA1AA,#D9C4E8)", title: "Cupcakes para principiantes",  by: "Diego López · 2.5h", date: "Dom 27 Mar", seats: 10, avail: 7, desc: "12 cupcakes con tres decoraciones distintas. Ideal para regalo o para emprender.",                    tag: "galletas"   },
  { id: 6,  level: "Intermedio",   price: "$1,800", color: "linear-gradient(135deg,#D4E3A8,#FFE99B)", title: "Tarta francesa",              by: "Mariana Cruz · 5h",  date: "Sáb 02 Abr", seats: 6, avail: 4, desc: "Masa sucrée, crema pâtissière y montaje de frutas. Receta clásica parisina.",                          tag: "pan"        },
  { id: 7,  level: "Intermedio",   price: "$1,100", color: "linear-gradient(135deg,#FFC3C9,#D9C4E8)", title: "Decoración con fondant",       by: "Silvia Ruiz · 4h",   date: "Dom 03 Abr", seats: 8, avail: 3, desc: "Forrado, texturizados, figuras y lettering con fondant. Ideal para diseños elaborados.",              tag: "decoracion" },
  { id: 8,  level: "Principiante", price: "$750",   color: "linear-gradient(135deg,#B8E6D3,#D4E3A8)", title: "Macarons parisinos",          by: "Mariana Cruz · 3h",  date: "Sáb 09 Abr", seats: 8, avail: 6, desc: "La técnica clásica del macaron francés con 3 rellenos. Te llevas una caja de 18 macarons.",           tag: "galletas"   },
  { id: 9,  level: "Avanzado",     price: "$2,200", color: "linear-gradient(135deg,#FFE99B,#FFC9A5)", title: "Pasteles 3D",                  by: "Silvia Ruiz · 7h",   date: "Dom 10 Abr", seats: 4, avail: 2, desc: "Construcción de pasteles temáticos 3D con estructura interna. Para reposteros con experiencia.",       tag: "pasteles"   },
];

const CATEGORIES = ["Todos", "Pasteles", "Galletas", "Decoración", "Pan"];
const LEVELS     = ["Todos los niveles", "Principiante", "Intermedio", "Avanzado"];

const LEVEL_COLOR = {
  "Principiante": { bg: "rgba(255,255,255,.92)", text: "var(--burdeos)" },
  "Intermedio":   { bg: "rgba(255,255,255,.92)", text: "var(--burdeos)" },
  "Avanzado":     { bg: "rgba(255,255,255,.92)", text: "var(--burdeos)" },
};

export default function Cursos() {
  const [cat,   setCat]   = useState("Todos");
  const [level, setLevel] = useState("Todos los niveles");

  const filtered = COURSES.filter(c => {
    const catOk   = cat   === "Todos"               || c.tag     === cat.toLowerCase();
    const levelOk = level === "Todos los niveles"   || c.level   === level;
    return catOk && levelOk;
  });

  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)", display: "flex", flexDirection: "column" }}>
      <style>{`
        .course-card:hover{transform:translateY(-6px);box-shadow:0 16px 36px rgba(84,0,39,.16)!important}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @media(max-width:900px){.courses-hero{grid-template-columns:1fr!important}.courses-grid{grid-template-columns:1fr!important}.cta-courses{grid-template-columns:1fr!important}}
        @media(max-width:600px){.courses-grid{grid-template-columns:1fr!important}}
      `}</style>

      <div aria-hidden="true" className="ru-pattern-sprinkle fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.06 }} />
      <NavbarAdmin />

      <main className="flex-grow relative z-10" style={{ marginTop: "4rem" }}>

        {/* ── Hero ── */}
        <section style={{ padding: "3.5rem 1.5rem", maxWidth: 1200, margin: "0 auto" }}>
          <div className="courses-hero" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3.5rem", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--rosa)", marginBottom: 8 }}>Aprende con nosotros</p>
              <h1 className={sofia.className} style={{ fontSize: "clamp(3rem,6vw,5.5rem)", color: "var(--burdeos)", lineHeight: 0.95, marginBottom: "1.25rem" }}>
                Cursos para soñadores <span style={{ color: "var(--rosa)" }}>y reposteros.</span>
              </h1>
              <p style={{ fontSize: "1.05rem", color: "var(--text-soft)", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: "50ch" }}>
                Clases en grupos pequeños, en nuestro estudio en Guadalajara. Te llevas tu pieza a casa, recetas paso a paso y un mandil bordado.
              </p>
              {/* Stats */}
              <div style={{ display: "flex", gap: "2.5rem" }}>
                {[["12","cursos al mes"],["8","por grupo"],["4.9★","promedio"]].map(([n,l])=>(
                  <div key={l}>
                    <div className={sofia.className} style={{ fontSize: "2.5rem", color: "var(--rosa)", lineHeight: 1 }}>{n}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-soft)", fontWeight: 600 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Art blob */}
            <div style={{ position: "relative", aspectRatio: "1/1" }}>
              <div style={{ position: "absolute", inset: "8%", background: "linear-gradient(135deg,#FFE99B,#FFC9A5)", borderRadius: "60% 40% 55% 45%/50% 60% 40% 50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-xl)", overflow: "hidden", animation: "float 5s ease-in-out infinite" }}>
                <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0" style={{ opacity: 0.5 }} />
                <div className={sofia.className} style={{ fontSize: "clamp(3rem,6vw,5rem)", color: "var(--burdeos)", position: "relative", textAlign: "center", lineHeight: 1.1 }}>
                  Hornea<br />conmigo
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Filters ── */}
        <section style={{ padding: "0 1.5rem 2rem", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCat(c)} style={{ padding: "7px 16px", borderRadius: "var(--r-pill)", border: "1.5px solid", borderColor: cat === c ? "var(--burdeos)" : "var(--border-color)", background: cat === c ? "var(--burdeos)" : "var(--bg-raised)", color: cat === c ? "#fff" : "var(--text-soft)", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", fontFamily: "var(--font-nunito)", transition: "all 150ms" }}>
                  {c}
                </button>
              ))}
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {LEVELS.map(l => (
                <button key={l} onClick={() => setLevel(l)} style={{ padding: "7px 16px", borderRadius: "var(--r-pill)", border: "1.5px solid", borderColor: level === l ? "var(--rosa)" : "var(--border-color)", background: level === l ? "var(--rosa)" : "var(--bg-raised)", color: level === l ? "#fff" : "var(--text-soft)", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", fontFamily: "var(--font-nunito)", transition: "all 150ms" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Course grid ── */}
        <section style={{ padding: "0 1.5rem 3rem", maxWidth: 1200, margin: "0 auto" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", background: "var(--bg-raised)", borderRadius: "var(--r-xl)", border: "1.5px dashed var(--border-color)" }}>
              <span style={{ fontSize: "3rem" }}>🔍</span>
              <p style={{ color: "var(--text-muted)", fontWeight: 700, marginTop: 12 }}>No hay cursos con esos filtros. Prueba otra combinación.</p>
            </div>
          ) : (
            <div className="courses-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }}>
              {filtered.map(c => (
                <div key={c.id} className="course-card" style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", overflow: "hidden", boxShadow: "var(--shadow-sm)", transition: "all 280ms cubic-bezier(.2,.8,.2,1)" }}>
                  {/* Cover */}
                  <div style={{ aspectRatio: "16/10", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", padding: "1rem", background: c.color }}>
                    <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0" style={{ opacity: 0.4 }} />
                    <span style={{ position: "relative", background: "rgba(255,255,255,.92)", padding: "4px 12px", borderRadius: "var(--r-pill)", fontSize: "0.65rem", fontWeight: 700, color: "var(--burdeos)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{c.level}</span>
                    <span className={sofia.className} style={{ position: "absolute", top: "1rem", right: "1rem", background: "var(--burdeos)", color: "#fff", fontSize: "1.5rem", padding: "4px 14px", borderRadius: "var(--r-pill)", lineHeight: 1 }}>{c.price}</span>
                  </div>
                  {/* Body */}
                  <div style={{ padding: "1.25rem 1.25rem 1.5rem" }}>
                    <h3 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: 4, color: "var(--burdeos)" }}>{c.title}</h3>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>con {c.by}</p>
                    <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "var(--text-soft)", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                      <span>📅 {c.date}</span>
                      <span>👥 {c.seats} cupos</span>
                    </div>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-soft)", lineHeight: 1.6, marginBottom: "1rem" }}>{c.desc}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: "1px dashed var(--border-color)" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        <strong style={{ color: "var(--menta-deep)" }}>{c.avail}</strong> {c.avail === 1 ? "lugar" : "lugares"}
                      </span>
                      <Link href="/cotizacion">
                        <button style={{ padding: "8px 18px", borderRadius: "var(--r-pill)", background: "var(--burdeos)", color: "#fff", border: "none", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", fontFamily: "var(--font-nunito)", transition: "all 150ms" }}
                          onMouseEnter={e=>{e.currentTarget.style.background="var(--rosa)"}}
                          onMouseLeave={e=>{e.currentTarget.style.background="var(--burdeos)"}}>
                          Reservar
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── CTA bar ── */}
        <section style={{ padding: "0 1.5rem 4rem", maxWidth: 1200, margin: "0 auto" }}>
          <div
            className="cta-courses"
            style={{ background: "linear-gradient(135deg,#FFE99B 0%,#FFC9A5 100%)", borderRadius: "var(--r-2xl)", padding: "3.5rem 3rem", position: "relative", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", alignItems: "center" }}
          >
            <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />
            <div style={{ position: "relative" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--burdeos)", marginBottom: 8 }}>¿Grupo privado?</p>
              <h2 className={sofia.className} style={{ fontSize: "3rem", color: "var(--burdeos)", lineHeight: 1, marginBottom: 8 }}>Reserva el estudio</h2>
              <p style={{ color: "var(--burdeos)", opacity: 0.75, fontSize: "1rem", lineHeight: 1.6 }}>
                Clases para 4–10 personas. Ideal para despedidas, cumpleaños o team building.
              </p>
            </div>
            <Link href="/cotizacion" style={{ position: "relative", flexShrink: 0 }}>
              <button style={{ padding: "14px 32px", borderRadius: "var(--r-pill)", background: "var(--burdeos)", color: "#fff", border: "none", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer", fontFamily: "var(--font-nunito)", boxShadow: "var(--shadow-md)", transition: "all 150ms", whiteSpace: "nowrap" }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)"}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none"}}>
                Cotizar privado →
              </button>
            </Link>
          </div>
        </section>

      </main>

      <WebFooter />
    </div>
  );
}
