import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import VideoPlayer from "@/src/components/cursos/VideoPlayer";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";
import { useAuth } from "@/src/context";

const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Página del curso: si el usuario tiene acceso (compra o admin) muestra el
 * player propio y descargables; si no, la vista de venta con botón de
 * compra (Fase 3 conecta el pago).
 */
export default function CursoDetalle() {
  const router = useRouter();
  const { slug } = router.query;
  const { userToken, isLoggedIn } = useAuth();

  const [curso, setCurso] = useState(null);
  const [acceso, setAcceso] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [lecActiva, setLecActiva] = useState(0);
  const [play, setPlay] = useState(null); // { hls, dash, thumbnailUrl, captionsUrl, capitulos }
  const [comprando, setComprando] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API_BASE}/cursos/slug/${slug}`, { headers: userToken ? { Authorization: `Bearer ${userToken}` } : {} })
      .then((r) => r.json())
      .then((j) => { setCurso(j.data || null); setAcceso(!!j.acceso); })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [slug, userToken]);

  // Cargar URL de reproducción de la lección activa cuando hay acceso.
  useEffect(() => {
    if (!curso || !acceso) return;
    const lec = curso.lecciones?.[lecActiva];
    if (!lec || lec.video?.estado !== "listo") { setPlay(null); return; }
    fetch(`${API_BASE}/cursos/${curso._id}/lecciones/${lec._id}/play`, { headers: { Authorization: `Bearer ${userToken}` } })
      .then((r) => r.json())
      .then((j) => setPlay(j.data || null))
      .catch(() => setPlay(null));
  }, [curso, acceso, lecActiva, userToken]);

  const comprar = async () => {
    if (!isLoggedIn) { router.push(`/login?next=/cursos/${slug}`); return; }
    setComprando(true);
    try {
      const r = await fetch(`${API_BASE}/cursos/${curso._id}/comprar`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` },
      });
      const j = await r.json();
      if (!r.ok || !j.url) throw new Error(j.message || "La compra en línea estará disponible muy pronto.");
      window.location.href = j.url;
    } catch (e) {
      alert(e.message);
      setComprando(false);
    }
  };

  if (cargando) return <Shell><p style={{ color: "var(--text-soft)" }}>Cargando curso…</p></Shell>;
  if (!curso) return (
    <Shell>
      <h1 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "2rem" }}>Curso no encontrado</h1>
      <Link href="/cursos" style={{ color: "var(--rosa)", fontWeight: 700 }}>← Ver todos los cursos</Link>
    </Shell>
  );

  const lec = curso.lecciones?.[lecActiva];

  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)", display: "flex", flexDirection: "column" }}>
      <NavbarAdmin />
      <main style={{ flexGrow: 1, maxWidth: 1080, width: "100%", margin: "0 auto", padding: "5.5rem 1.25rem 3rem" }}>
        <Link href="/cursos" style={{ fontSize: ".8rem", color: "var(--text-soft)" }}>← Cursos</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", margin: "6px 0 4px" }}>
          <h1 className={sofia.className} style={{ fontSize: "clamp(2rem,5vw,3rem)", color: "var(--burdeos)", lineHeight: 1 }}>{curso.titulo}</h1>
          <span style={{ background: curso.modalidad === "presencial" ? "var(--mantequilla)" : "var(--menta)", color: curso.modalidad === "presencial" ? "#6B4F1A" : "#1D5A45", fontSize: ".68rem", fontWeight: 800, padding: "4px 12px", borderRadius: 999, textTransform: "uppercase" }}>
            {curso.modalidad === "presencial" ? "Presencial" : "En línea"}
          </span>
        </div>
        <p style={{ color: "var(--text-soft)", maxWidth: "60ch", marginBottom: 20 }}>{curso.descripcion}</p>

        <div className="curso-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", alignItems: "start" }}>
          {/* Player / venta */}
          <div>
            {acceso && lec ? (
              lec.video?.estado === "listo" && play ? (
                <VideoPlayer
                  src={{ hls: play.hls, dash: play.dash }}
                  poster={play.thumbnailUrl || curso.thumbnailUrl}
                  captionsUrl={play.captionsUrl}
                  capitulos={play.capitulos || []}
                />
              ) : (
                <div style={{ aspectRatio: "16/9", background: "var(--rosa-4)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-soft)", textAlign: "center", padding: 20 }}>
                  {lec.video?.estado === "procesando" ? "El video de esta lección se está procesando… vuelve en unos minutos." : "Esta lección aún no tiene video."}
                </div>
              )
            ) : (
              <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: 16, overflow: "hidden", background: "var(--rosa-4)" }}>
                {curso.thumbnailUrl && <img src={curso.thumbnailUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.7)" }} />}
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", textAlign: "center", padding: 20 }}>
                  <span style={{ fontSize: "2.2rem" }}>🔒</span>
                  <p style={{ fontWeight: 800, marginTop: 6 }}>Compra el curso para ver las lecciones</p>
                </div>
              </div>
            )}

            {/* Descripción de la lección + descargables (con acceso) */}
            {acceso && lec && (
              <div style={{ background: "#fff", borderRadius: "var(--r-xl)", padding: "1.25rem", marginTop: 14, boxShadow: "var(--shadow-sm)" }}>
                <h2 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.4rem" }}>{lec.titulo}</h2>
                {lec.descripcion && <p style={{ color: "var(--text-soft)", fontSize: ".9rem", marginTop: 4 }}>{lec.descripcion}</p>}
                {(lec.descargables || []).length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <p style={{ fontSize: ".72rem", fontWeight: 800, textTransform: "uppercase", color: "var(--text-soft)", marginBottom: 6 }}>Materiales descargables</p>
                    {lec.descargables.map((d, i) => (
                      <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--rosa-4)", color: "var(--burdeos)", fontWeight: 700, fontSize: ".82rem", padding: "6px 14px", borderRadius: 999, marginRight: 8, marginBottom: 6, textDecoration: "none" }}>
                        📄 {d.nombre || `Material ${i + 1}`}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lateral: compra + temario */}
          <aside style={{ display: "grid", gap: 14 }}>
            {!acceso && (
              <div style={{ background: "#fff", borderRadius: "var(--r-xl)", padding: "1.25rem", boxShadow: "var(--shadow-md)" }}>
                <p style={{ fontSize: "1.7rem", fontWeight: 800, color: "var(--burdeos)" }}>${Number(curso.precio || 0).toLocaleString("es-MX")} <span style={{ fontSize: ".8rem", color: "var(--text-soft)", fontWeight: 400 }}>MXN</span></p>
                {curso.modalidad === "presencial" && (
                  <p style={{ fontSize: ".82rem", color: "var(--text-soft)", margin: "6px 0" }}>
                    📍 {curso.lugar || "Taller Providencia"}{curso.fechaClase ? ` · ${new Date(curso.fechaClase).toLocaleDateString("es-MX", { day: "2-digit", month: "long", timeZone: "UTC" })}` : ""}{curso.cupo ? ` · Cupo: ${curso.cupo}` : ""}
                  </p>
                )}
                <ul style={{ fontSize: ".82rem", color: "var(--text-soft)", margin: "10px 0", paddingLeft: 18, lineHeight: 1.7 }}>
                  <li>Video en alta calidad (se adapta a tu conexión)</li>
                  <li>Materiales descargables</li>
                  <li>Acceso permanente</li>
                </ul>
                <button onClick={comprar} disabled={comprando}
                  style={{ width: "100%", padding: 13, borderRadius: 999, border: "none", background: "var(--rosa)", color: "#fff", fontWeight: 800, cursor: "pointer", opacity: comprando ? .6 : 1 }}>
                  {comprando ? "Redirigiendo…" : isLoggedIn ? "Comprar curso" : "Inicia sesión para comprar"}
                </button>
              </div>
            )}

            <div style={{ background: "#fff", borderRadius: "var(--r-xl)", padding: "1.25rem", boxShadow: "var(--shadow-sm)" }}>
              <h3 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.2rem", marginBottom: 8 }}>Temario</h3>
              {(curso.lecciones || []).map((l, i) => (
                <button key={l._id} onClick={() => acceso && setLecActiva(i)}
                  style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", background: acceso && i === lecActiva ? "var(--rosa-4)" : "transparent", border: "none", borderRadius: 10, padding: "8px 10px", cursor: acceso ? "pointer" : "default" }}>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: acceso && i === lecActiva ? "var(--rosa)" : "var(--bg-sunken)", color: acceso && i === lecActiva ? "#fff" : "var(--text-soft)", fontSize: ".7rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontSize: ".85rem", fontWeight: 700, color: "var(--burdeos)", flexGrow: 1 }}>{l.titulo}</span>
                  {!acceso && <span>🔒</span>}
                </button>
              ))}
              {(curso.lecciones || []).length === 0 && <p style={{ fontSize: ".82rem", color: "var(--text-soft)" }}>Temario en preparación.</p>}
            </div>
          </aside>
        </div>
      </main>
      <WebFooter />
      <style jsx>{`@media (max-width: 880px){ .curso-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

function Shell({ children }) {
  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)" }}>
      <NavbarAdmin />
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "7rem 1.25rem" }}>{children}</main>
    </div>
  );
}
