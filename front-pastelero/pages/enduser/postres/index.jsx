import { useEffect, useState } from "react";
import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function PostresIndex() {
  const [postres, setPostres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/postres?categoria=postre`);
        const j = await r.json();
        if (!cancelled) setPostres(j?.data || []);
      } catch {
        /* silencioso */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)" }}>
      <style>{`
        .postre-card:hover { transform: translateY(-6px); box-shadow: 0 16px 36px rgba(84,0,39,.16); }
        @media (max-width: 900px) { .postres-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 520px) { .postres-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <NavbarAdmin />

      <section style={{ padding: "5rem 1.5rem 2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--rosa)", marginBottom: 8 }}>
          Catálogo
        </p>
        <h1 className={sofia.className} style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)", color: "var(--burdeos)", lineHeight: 1 }}>
          Top postres
        </h1>
        <p style={{ fontSize: "1rem", color: "var(--text-soft)", maxWidth: "60ch", margin: "1rem auto 0", lineHeight: 1.6 }}>
          Nuestros postres horneados a pedido en Guadalajara. Precio fijo, ingredientes de temporada.
        </p>
      </section>

      <section style={{ padding: "1rem 1.5rem 4.5rem", maxWidth: 1200, margin: "0 auto" }}>
        {loading ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)" }}>Cargando…</p>
        ) : postres.length === 0 ? (
          <div style={{
            border: "1px dashed var(--border-strong)",
            borderRadius: "var(--r-xl)",
            padding: "3rem 1.5rem",
            textAlign: "center",
            color: "var(--text-muted)",
            background: "var(--bg-raised)",
          }}>
            <p style={{ fontSize: "1.1rem", marginBottom: 8 }}>Aún no hay postres en el catálogo.</p>
            <p style={{ fontSize: "0.85rem" }}>
              Vuelve pronto o explora{" "}
              <Link href="/enduser/galletas-ny" style={{ color: "var(--burdeos)", fontWeight: 700 }}>nuestras galletas NY</Link>.
            </p>
          </div>
        ) : (
          <div
            className="postres-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}
          >
            {postres.map((p) => (
              <Link key={p._id} href={`/enduser/postres/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div
                  className="postre-card"
                  style={{
                    background: "var(--bg-raised)",
                    borderRadius: "var(--r-xl)",
                    overflow: "hidden",
                    boxShadow: "var(--shadow-sm)",
                    transition: "all 280ms cubic-bezier(.2,.8,.2,1)",
                    cursor: "pointer",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      aspectRatio: "1/1",
                      background: p.imagenUrl
                        ? `var(--crema)`
                        : "linear-gradient(135deg,#FFE2E7,#FFC3C9)",
                      backgroundImage: p.imagenUrl ? `url(${p.imagenUrl})` : "none",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                  >
                    {!p.imagenUrl && (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>
                        🎂
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "1rem 1.25rem 1.25rem", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: 4, color: "var(--color-text)" }}>{p.nombre}</h3>
                      {p.descripcion && (
                        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.75rem", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {p.descripcion}
                        </p>
                      )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                      <span className={sofia.className} style={{ fontSize: "1.75rem", color: "var(--rosa)", lineHeight: 1 }}>${Number(p.precio).toFixed(0)}</span>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--burdeos)" }}>Ver →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <WebFooter />
    </div>
  );
}
