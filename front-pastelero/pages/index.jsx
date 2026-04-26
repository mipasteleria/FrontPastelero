import Image from "next/image";
import WebFooter from "@/src/components/WebFooter";
import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont, Fraunces as FrauncesFont } from "next/font/google";
import { useEffect, useState } from "react";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const poppins   = PoppinsFont({ subsets: ["latin"], weight: ["400", "600", "700"] });
const sofia     = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const fraunces  = FrauncesFont({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"] });

/* ── Static fallback products ── */
const STATIC_PRODUCTS = [
  { _id: "pasteles",  nombre: "Pasteles",            foto: "/img/home.jpg",         alt: "Pastel personalizado",     descripcion: "Diseños únicos para bodas, XV años, cumpleaños y más." },
  { _id: "postres",   nombre: "Mesa de Postres",     foto: "/img/pay.jpeg",         alt: "Mesa de postres variados", descripcion: "Pay de queso, brownies, macarons, donas y paletas magnum." },
  { _id: "3d",        nombre: "Pasteles 3D",         foto: "/img/yoda.jpg",         alt: "Pastel 3D personalizado",  descripcion: "Figuras completamente personalizadas para celebrar lo que más te importa." },
  { _id: "galletas",  nombre: "Galletas Americanas", foto: "/img/coockies.jpg",     alt: "Galletas americanas",      descripcion: "Chocolate chip, red velvet, matcha macadamia, limón y más." },
];

const WHY_US = [
  { icon: "🎨", title: "100% Personalizados",    desc: "Cada diseño es tuyo. Te asesoramos desde el concepto hasta la entrega." },
  { icon: "✨", title: "Ingredientes Selectos",  desc: "Usamos ingredientes de calidad premium para que cada bocado sea memorable." },
  { icon: "📦", title: "Entrega Puntual",         desc: "Coordinamos la entrega para que tu evento salga perfecto." },
  { icon: "💬", title: "Atención Personalizada", desc: "Te acompañamos en todo el proceso con comunicación directa." },
];

async function fetchSignedUrl(filename) {
  try {
    const res = await fetch(`${API_BASE}/image-url/${encodeURIComponent(filename)}`);
    if (!res.ok) return null;
    return (await res.json()).url;
  } catch { return null; }
}

/* ── Product card — editorial style ── */
function ProductCard({ nombre, descripcion, imgSrc, imgAlt, index }) {
  const isWide   = index === 0;
  const isBottom = index === 3;
  return (
    <Link
      href="/enduser/conocenuestrosproductos"
      className={`group relative overflow-hidden bg-stone-100 ${isWide ? "col-span-2 md:col-span-2 row-span-2" : ""} ${isBottom ? "col-span-2 md:col-span-3" : ""}`}
      style={{ borderRadius: "var(--r-xl)", minHeight: isWide ? 440 : 220, display: "block" }}
    >
      <Image
        src={imgSrc}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        alt={imgAlt}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--rosa-2)", marginBottom: 4, fontWeight: 700 }}>
          Descubrir
        </p>
        <h3 className={`${fraunces.className} text-2xl leading-tight mb-1`}>{nombre}</h3>
        {descripcion && (
          <p className="text-sm text-white/80 leading-relaxed max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {descripcion}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch(`${API_BASE}/productos`);
        const json = await res.json();
        if (!json.data?.length) return;
        const enriched = await Promise.all(
          json.data.map(async (p) => ({
            ...p,
            signedUrl: p.fotos?.length ? await fetchSignedUrl(p.fotos[0]) : null,
          }))
        );
        setProductos(enriched);
      } catch { /* usar fallback */ }
    };
    load();
  }, []);

  const displayProducts = productos.length > 0 ? productos : null;

  return (
    <main
      className={`min-h-screen ${poppins.className}`}
      style={{ background: "var(--crema)" }}
    >
      <NavbarAdmin />

      {/* ══════════════════════════════════════
          HERO — video edge-to-edge
      ══════════════════════════════════════ */}
      <section
        className="relative overflow-hidden w-full"
        style={{ marginTop: "clamp(56px, 5.5vw, 70px)", height: "min(46vw, 72vh)" }}
      >
        <video
          src="/video/banner.mp4"
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Marca sutil izquierda */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to right, rgba(84,0,39,0.18) 0%, transparent 50%)" }}
        />
        {/* CTAs */}
        <div className="absolute bottom-8 left-8 md:left-14 flex flex-wrap gap-3 z-10">
          <Link href="/cotizacion">
            <button
              className={poppins.className}
              style={{
                padding: "14px 32px",
                fontSize: "0.95rem",
                background: "#fff",
                color: "var(--burdeos)",
                fontWeight: 700,
                borderRadius: "var(--r-pill)",
                border: "none",
                cursor: "pointer",
                boxShadow: "var(--shadow-md)",
                transition: "all 150ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--crema)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
            >
              Cotiza tu pastel personalizado →
            </button>
          </Link>
          <Link href="/enduser/conocenuestrosproductos">
            <button
              className={poppins.className}
              style={{
                padding: "14px 28px",
                fontSize: "0.95rem",
                background: "transparent",
                color: "#fff",
                fontWeight: 600,
                borderRadius: "var(--r-pill)",
                border: "2px solid rgba(255,255,255,0.7)",
                cursor: "pointer",
                transition: "all 150ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              Ver productos
            </button>
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DIVIDER editorial
      ══════════════════════════════════════ */}
      <div className="max-w-screen-lg mx-auto px-6 py-12 flex items-center gap-6">
        <div style={{ flex: 1, height: 1, background: "var(--border-color)" }} />
        <p
          className={poppins.className}
          style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.22em", fontSize: "0.7rem", whiteSpace: "nowrap" }}
        >
          Hecho con amor · Desde 2018 · Guadalajara
        </p>
        <div style={{ flex: 1, height: 1, background: "var(--border-color)" }} />
      </div>

      {/* ══════════════════════════════════════
          PRODUCTOS — grid asimétrico
      ══════════════════════════════════════ */}
      <section className="max-w-screen-lg mx-auto px-4 pb-16">
        <div className="text-center mb-10">
          <p style={{ color: "var(--rosa)", textTransform: "uppercase", letterSpacing: "0.16em", fontSize: "0.7rem", fontWeight: 700, marginBottom: 12 }}>
            Nuestras especialidades
          </p>
          <h2
            className={fraunces.className}
            style={{ color: "var(--burdeos)", lineHeight: 1.15, fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Creaciones para cada ocasión
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[220px]">
          {(displayProducts ?? STATIC_PRODUCTS).slice(0, 4).map((p, i) => (
            <ProductCard
              key={p._id}
              index={i}
              nombre={p.nombre}
              descripcion={p.descripcion}
              imgSrc={p.signedUrl ?? p.foto ?? "/img/home.jpg"}
              imgAlt={p.alt ?? p.nombre}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/enduser/conocenuestrosproductos">
            <button
              className={poppins.className}
              style={{
                padding: "12px 36px",
                fontSize: "0.875rem",
                letterSpacing: "0.05em",
                borderRadius: "var(--r-pill)",
                border: "1.5px solid var(--border-strong)",
                background: "transparent",
                color: "var(--burdeos)",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 150ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--rosa-4)"; e.currentTarget.style.borderColor = "var(--rosa)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
            >
              Ver catálogo completo
            </button>
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════
          POR QUÉ ELEGIRNOS
      ══════════════════════════════════════ */}
      <section style={{ background: "var(--rosa-4)", padding: "4rem 1rem" }}>
        <div className="max-w-screen-lg mx-auto">
          <div className="text-center mb-12">
            <p style={{ color: "var(--rosa)", textTransform: "uppercase", letterSpacing: "0.16em", fontSize: "0.7rem", fontWeight: 700, marginBottom: 12 }}>
              ¿Por qué nosotras?
            </p>
            <h2
              className={fraunces.className}
              style={{ color: "var(--burdeos)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
            >
              La diferencia está en los detalles
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_US.map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center gap-3">
                <div
                  style={{
                    width: 64, height: 64, borderRadius: "var(--r-lg)",
                    background: "var(--bg-raised)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.75rem",
                    boxShadow: "var(--shadow-sm)",
                    border: "1px solid var(--border-color)",
                    marginBottom: 4,
                  }}
                >
                  {item.icon}
                </div>
                <h3 className={poppins.className} style={{ color: "var(--burdeos)", fontWeight: 700, fontSize: "0.95rem" }}>
                  {item.title}
                </h3>
                <p style={{ color: "var(--text-soft)", fontSize: "0.85rem", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CONÓCENOS — banner burdeos
      ══════════════════════════════════════ */}
      <section className="max-w-screen-lg mx-auto px-4 py-16">
        <div
          className="rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[380px] relative"
          style={{ background: "linear-gradient(135deg, var(--burdeos) 0%, #7A1F44 100%)" }}
        >
          {/* Sprinkle pattern */}
          <div
            aria-hidden="true"
            className="ru-pattern-sprinkle absolute inset-0 pointer-events-none"
            style={{ opacity: 0.15 }}
          />

          {/* Texto */}
          <div className="flex flex-col justify-center p-10 md:p-14 md:w-1/2 gap-5 relative">
            <p style={{ color: "var(--rosa-2)", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: "0.7rem", fontWeight: 700 }}>
              Nuestra historia
            </p>
            <h2
              className={fraunces.className}
              style={{ color: "#fff", lineHeight: 1.2, fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}
            >
              Hecho con amor,<br />
              <em style={{ color: "var(--rosa-2)" }}>desde Guadalajara</em>
            </h2>
            <p style={{ color: "rgba(255,210,220,0.85)", lineHeight: 1.7, fontSize: "0.9rem", maxWidth: "32ch" }}>
              Cada pastel cuenta una historia. En Pastelería El Ruiseñor creamos diseños únicos y sabores excepcionales con los mejores ingredientes y mucho cariño.
            </p>
            <Link href="/enduser/conocenos#preguntasfrecuentes">
              <button
                className={poppins.className}
                style={{
                  padding: "12px 28px",
                  fontSize: "0.875rem",
                  marginTop: 8,
                  width: "fit-content",
                  borderRadius: "var(--r-pill)",
                  border: "1.5px solid rgba(255,255,255,0.55)",
                  background: "transparent",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 150ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                Conoce nuestra historia →
              </button>
            </Link>
          </div>

          {/* Imagen */}
          <div className="relative h-72 md:h-auto md:w-1/2 flex-shrink-0">
            <Image
              src="/img/conocenosPastelera.png"
              fill
              className="object-cover object-top"
              alt="Pastelera de El Ruiseñor"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to left, transparent, rgba(84,0,39,0.25))" }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════ */}
      <section className="text-center py-20 px-4">
        <p style={{ color: "var(--rosa)", textTransform: "uppercase", letterSpacing: "0.16em", fontSize: "0.7rem", fontWeight: 700, marginBottom: 16 }}>
          ¿Lista para pedir?
        </p>
        <h2
          className={fraunces.className}
          style={{ color: "var(--burdeos)", marginBottom: 20, fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}
        >
          Empieza tu cotización hoy
        </h2>
        <p className={poppins.className} style={{ color: "var(--text-soft)", maxWidth: 400, margin: "0 auto 32px", fontSize: "0.9rem", lineHeight: 1.7 }}>
          Cuéntanos tu idea y te ayudamos a hacerla realidad. Sin compromisos, sin costos ocultos.
        </p>
        <Link href="/cotizacion">
          <button
            style={{
              padding: "16px 44px",
              fontSize: "1rem",
              borderRadius: "var(--r-pill)",
              background: "var(--burdeos)",
              color: "#fff",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "var(--shadow-md)",
              fontFamily: "var(--font-nunito)",
              transition: "all 150ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#7A1F44"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--burdeos)"; e.currentTarget.style.transform = "none"; }}
          >
            ¡Cotiza ahora! →
          </button>
        </Link>
      </section>

      <WebFooter />
    </main>
  );
}
