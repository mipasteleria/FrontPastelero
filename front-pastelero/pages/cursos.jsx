import { useEffect, useState } from "react";
import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/** Catálogo público de cursos (en línea y presenciales). */
export default function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/cursos`)
      .then((r) => r.json())
      .then((j) => setCursos(j.data || []))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)", display: "flex", flexDirection: "column" }}>
      <NavbarAdmin />
      <main style={{ flexGrow: 1, maxWidth: 1040, width: "100%", margin: "0 auto", padding: "6rem 1.25rem 3rem" }}>
        <p style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--rosa)" }}>Aprende con nosotras</p>
        <h1 className={sofia.className} style={{ fontSize: "clamp(2.4rem,6vw,4rem)", color: "var(--burdeos)", lineHeight: 1, marginBottom: 8 }}>Cursos de repostería</h1>
        <p style={{ color: "var(--text-soft)", maxWidth: "52ch", marginBottom: 28 }}>
          Cursos en línea con video en alta calidad y materiales descargables, y clases presenciales en nuestro taller de Guadalajara.
        </p>

        {cargando ? (
          <p style={{ color: "var(--text-soft)" }}>Cargando cursos…</p>
        ) : cursos.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "var(--r-xl)", padding: "2.5rem", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
            <p style={{ fontSize: "2.4rem" }}>🎂</p>
            <p style={{ color: "var(--text-soft)" }}>Muy pronto publicaremos nuestros primeros cursos. ¡Vuelve pronto!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {cursos.map((c) => (
              <Link key={c._id} href={`/cursos/${c.slug}`} style={{ textDecoration: "none" }}>
                <article style={{ background: "#fff", borderRadius: "var(--r-xl)", overflow: "hidden", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-color)", transition: "all 180ms", height: "100%" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}>
                  <div style={{ aspectRatio: "16/9", background: "var(--rosa-4)", position: "relative" }}>
                    {c.thumbnailUrl
                      ? <img src={c.thumbnailUrl} alt={c.titulo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>🧁</span>}
                    <span style={{ position: "absolute", top: 10, left: 10, background: c.modalidad === "presencial" ? "var(--mantequilla)" : "var(--menta)", color: c.modalidad === "presencial" ? "#6B4F1A" : "#1D5A45", fontSize: ".68rem", fontWeight: 800, padding: "4px 12px", borderRadius: 999, textTransform: "uppercase", letterSpacing: ".04em" }}>
                      {c.modalidad === "presencial" ? "Presencial" : "En línea"}
                    </span>
                  </div>
                  <div style={{ padding: "1rem 1.15rem 1.2rem" }}>
                    <h2 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.45rem", lineHeight: 1.1, marginBottom: 6 }}>{c.titulo}</h2>
                    <p style={{ color: "var(--text-soft)", fontSize: ".85rem", lineHeight: 1.5, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.descripcion}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 800, color: "var(--burdeos)", fontSize: "1.1rem" }}>${Number(c.precio || 0).toLocaleString("es-MX")}</span>
                      <span style={{ fontSize: ".75rem", color: "var(--text-soft)" }}>{(c.lecciones || []).length} lección{(c.lecciones || []).length === 1 ? "" : "es"}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
      <WebFooter />
    </div>
  );
}
