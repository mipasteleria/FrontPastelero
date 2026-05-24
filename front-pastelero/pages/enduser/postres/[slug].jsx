import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Swal from "sweetalert2";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";
import { addItem } from "@/src/lib/postresCart";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function PostreDetalle() {
  const router = useRouter();
  const { slug } = router.query;
  const [postre, setPostre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/postres/${slug}`);
        if (r.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }
        const j = await r.json();
        if (!cancelled) setPostre(j?.data || null);
      } catch {
        /* silencioso */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  /* ── Agregar al carrito ── */
  const agregarAlCarrito = async () => {
    if (!postre) return;
    addItem(postre, 1);
    const result = await Swal.fire({
      icon: "success",
      title: "Agregado al carrito",
      html: `<strong>${postre.nombre}</strong> está en tu carrito.`,
      showCancelButton: true,
      confirmButtonText: "Ir al carrito",
      cancelButtonText: "Seguir comprando",
      confirmButtonColor: "#540027",
      cancelButtonColor: "#a78891",
      background: "#fff1f2",
      color: "#540027",
    });
    if (result.isConfirmed) {
      router.push("/enduser/postres-carrito");
    }
  };

  if (loading) {
    return (
      <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)" }}>
        <NavbarAdmin />
        <p style={{ padding: "8rem 1.5rem", textAlign: "center", color: "var(--text-muted)" }}>Cargando…</p>
      </div>
    );
  }

  if (notFound || !postre) {
    return (
      <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)" }}>
        <NavbarAdmin />
        <section style={{ padding: "8rem 1.5rem 4rem", textAlign: "center" }}>
          <h1 className={sofia.className} style={{ fontSize: "3rem", color: "var(--burdeos)", marginBottom: "1rem" }}>
            Postre no encontrado
          </h1>
          <p style={{ color: "var(--text-soft)", marginBottom: "2rem" }}>
            El postre que buscas no existe o fue retirado del catálogo.
          </p>
          <Link href="/enduser/postres">
            <button style={{ padding: "12px 28px", borderRadius: "var(--r-pill)", background: "var(--burdeos)", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-nunito)" }}>
              Ver todos los postres
            </button>
          </Link>
        </section>
        <WebFooter />
      </div>
    );
  }

  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)" }}>
      <style>{`
        @media (max-width: 800px) {
          .detalle-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <NavbarAdmin />

      {/* Breadcrumb */}
      <div style={{ padding: "5rem 1.5rem 0", maxWidth: 1200, margin: "0 auto" }}>
        <Link href="/enduser/postres" style={{ fontSize: "0.85rem", color: "var(--burdeos)", textDecoration: "none", fontWeight: 700 }}>
          ← Volver al catálogo
        </Link>
      </div>

      <section style={{ padding: "2rem 1.5rem 4rem", maxWidth: 1200, margin: "0 auto" }}>
        <div className="detalle-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          {/* Imagen */}
          <div style={{
            aspectRatio: "1/1",
            background: "var(--crema)",
            borderRadius: "var(--r-2xl)",
            boxShadow: "var(--shadow-lg)",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {postre.imagenUrl ? (
              <div
                role="img"
                aria-label={postre.nombre}
                style={{
                  width: "85%",
                  height: "85%",
                  backgroundImage: `url(${postre.imagenUrl})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              />
            ) : (
              <span style={{ fontSize: "10rem" }}>🎂</span>
            )}
          </div>

          {/* Info */}
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--rosa)", marginBottom: 8 }}>
              Pastelería El Ruiseñor
            </p>
            <h1 className={sofia.className} style={{ fontSize: "clamp(2.5rem,5vw,4rem)", color: "var(--burdeos)", lineHeight: 1, marginBottom: "1rem" }}>
              {postre.nombre}
            </h1>

            <p className={sofia.className} style={{ fontSize: "3rem", color: "var(--rosa)", lineHeight: 1, marginBottom: "1.5rem" }}>
              ${Number(postre.precio).toFixed(0)}
              <span style={{ fontSize: "1rem", color: "var(--text-muted)", marginLeft: 8 }}>MXN</span>
            </p>

            {postre.descripcion && (
              <p style={{ fontSize: "1rem", color: "var(--text-soft)", lineHeight: 1.7, marginBottom: "2rem", whiteSpace: "pre-line" }}>
                {postre.descripcion}
              </p>
            )}

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                onClick={agregarAlCarrito}
                style={{
                  padding: "14px 30px",
                  borderRadius: "var(--r-pill)",
                  background: "var(--burdeos)",
                  color: "#fff",
                  border: "none",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  boxShadow: "var(--shadow-sm)",
                  fontFamily: "var(--font-nunito)",
                }}
              >
                Agregar al carrito
              </button>
              <Link href="/enduser/postres">
                <button style={{
                  padding: "14px 28px",
                  borderRadius: "var(--r-pill)",
                  background: "transparent",
                  color: "var(--burdeos)",
                  border: "2px solid var(--border-strong)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  fontFamily: "var(--font-nunito)",
                }}>
                  Ver más postres
                </button>
              </Link>
            </div>

            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "1.5rem" }}>
              Horneado bajo pedido en Guadalajara · Mínimo 2 días hábiles de anticipación.
            </p>
          </div>
        </div>
      </section>

      <WebFooter />
    </div>
  );
}
