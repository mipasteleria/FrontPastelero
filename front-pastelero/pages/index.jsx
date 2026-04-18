import Image from "next/image";
import WebFooter from "@/src/components/WebFooter";
import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Poppins as PoppinsFont, Sofia as SofiaFont, Playfair_Display as PlayfairFont } from "next/font/google";
import { useEffect, useState } from "react";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const poppins  = PoppinsFont({ subsets: ["latin"], weight: ["400", "600", "700"] });
const sofia    = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const playfair = PlayfairFont({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"] });

/* ── Datos estáticos de respaldo ── */
const STATIC_PRODUCTS = [
  { _id: "pasteles",  nombre: "Pasteles",           foto: "/img/home.jpg",       alt: "Pastel personalizado",     descripcion: "Diseños únicos para bodas, XV años, cumpleaños y más." },
  { _id: "postres",   nombre: "Mesa de Postres",    foto: "/img/pay.jpeg",       alt: "Mesa de postres variados", descripcion: "Pay de queso, brownies, macarons, donas y paletas magnum." },
  { _id: "3d",        nombre: "Pasteles 3D",        foto: "/img/yoda.jpg",       alt: "Pastel 3D personalizado",  descripcion: "Figuras completamente personalizadas para celebrar lo que más te importa." },
  { _id: "galletas",  nombre: "Galletas Americanas",foto: "/img/coockies.jpg",   alt: "Galletas americanas",      descripcion: "Chocolate chip, red velvet, matcha macadamia, limón y más." },
];

const WHY_US = [
  { icon: "🎨", title: "100% Personalizados",   desc: "Cada diseño es tuyo. Te asesoramos desde el concepto hasta la entrega." },
  { icon: "✨", title: "Ingredientes Selectos", desc: "Usamos ingredientes de calidad premium para que cada bocado sea memorable." },
  { icon: "📦", title: "Entrega Puntual",        desc: "Coordinamos la entrega para que tu evento salga perfecto." },
  { icon: "💬", title: "Atención Personalizada",desc: "Te acompañamos en todo el proceso con comunicación directa." },
];

async function fetchSignedUrl(filename) {
  try {
    const res = await fetch(`${API_BASE}/image-url/${encodeURIComponent(filename)}`);
    if (!res.ok) return null;
    return (await res.json()).url;
  } catch { return null; }
}

/* ── Tarjeta de producto estilo namelaka (imagen grande + texto elegante) ── */
function ProductCard({ nombre, descripcion, imgSrc, imgAlt, index }) {
  const isWide   = index === 0; // col-span-2 + row-span-2
  const isBottom = index === 3; // fila inferior full-width
  return (
    <Link
      href="/enduser/conocenuestrosproductos"
      className={`group relative overflow-hidden rounded-2xl bg-stone-100 ${isWide ? "col-span-2 md:col-span-2 row-span-2" : ""} ${isBottom ? "col-span-2 md:col-span-3" : ""}`}
      style={{ minHeight: isWide ? 440 : 220 }}
    >
      {/* Imagen */}
      <Image
        src={imgSrc}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        alt={imgAlt}
      />
      {/* Gradiente inferior */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      {/* Texto */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <p className="text-xs uppercase tracking-widest text-rose-200 mb-1 font-semibold">Descubrir</p>
        <h3 className={`text-2xl leading-tight mb-1 ${playfair.className}`}>{nombre}</h3>
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
    <main className={`min-h-screen ${poppins.className}`}
          style={{ background: "linear-gradient(to bottom, #ffe4e8 0%, #fdf2f8 40%, #fdf4ff 70%, #fff1f2 100%)" }}>
      <NavbarAdmin />

      {/* ════════════════════════════════════════
          HERO — Video banner edge-to-edge, altura 16:9
      ════════════════════════════════════════ */}
      <section className="relative overflow-hidden w-full"
               style={{ marginTop: "clamp(56px, 5.5vw, 70px)", height: "min(46vw, 72vh)" }}>

        {/* Video — full-width, sin gradientes internos */}
        <video
          src="/video/banner.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Tinte rosa muy sutil — solo para dar identidad de marca, no oscurecer */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(to right, rgba(200,50,90,0.12) 0%, transparent 50%)"
        }} />

        {/* Botones CTA clicables (el texto ya está en el video) */}
        <div className="absolute bottom-8 left-8 md:left-14 flex flex-wrap gap-3 z-10">
          <Link href="/cotizacion">
            <button className="bg-white text-rose-900 font-bold rounded-full shadow-lg hover:bg-rose-50 transition-colors"
                    style={{ padding: "14px 32px", fontSize: "0.95rem" }}>
              Cotiza tu pastel personalizado →
            </button>
          </Link>
          <Link href="/enduser/conocenuestrosproductos">
            <button className="border-2 border-white/80 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
                    style={{ padding: "14px 28px", fontSize: "0.95rem" }}>
              Ver productos
            </button>
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════
          EYEBROW — Divider editorial
      ════════════════════════════════════════ */}
      <div className="max-w-screen-lg mx-auto px-6 py-12 flex items-center gap-6">
        <div className="flex-1 h-px bg-stone-200" />
        <p className={`text-stone-400 uppercase tracking-[0.22em] text-xs ${poppins.className}`}>
          Hecho con amor · Desde 2018 · Guadalajara
        </p>
        <div className="flex-1 h-px bg-stone-200" />
      </div>

      {/* ════════════════════════════════════════
          PRODUCTOS — Grid estilo namelaka.ae
      ════════════════════════════════════════ */}
      <section className="max-w-screen-lg mx-auto px-4 pb-16">
        <div className="text-center mb-10">
          <p className="text-rose-400 uppercase tracking-widest text-xs font-semibold mb-3">Nuestras especialidades</p>
          <h2 className={`text-stone-800 leading-tight ${playfair.className}`}
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Creaciones para cada ocasión
          </h2>
        </div>

        {/* Grid asimétrico: card grande + 2 medianas + 1 banner inferior */}
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
            <button className={`border border-stone-300 text-stone-600 rounded-full hover:border-rose-300 hover:text-rose-600 transition-colors ${poppins.className}`}
                    style={{ padding: "12px 36px", fontSize: "0.875rem", letterSpacing: "0.05em" }}>
              Ver catálogo completo
            </button>
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════
          POR QUÉ ELEGIRNOS — Feature highlights
          (inspirado en vanillecouture.com)
      ════════════════════════════════════════ */}
      <section className="bg-rose-50/60 py-16">
        <div className="max-w-screen-lg mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-rose-400 uppercase tracking-widest text-xs font-semibold mb-3">¿Por qué nosotras?</p>
            <h2 className={`text-stone-800 ${playfair.className}`}
                style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}>
              La diferencia está en los detalles
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_US.map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center gap-3">
                <div className="text-4xl mb-1">{item.icon}</div>
                <h3 className={`text-stone-800 font-semibold text-base ${poppins.className}`}>{item.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CONÓCENOS — Banner oscuro
      ════════════════════════════════════════ */}
      <section className="max-w-screen-lg mx-auto px-4 py-16">
        <div className="rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[380px]"
             style={{ background: "linear-gradient(135deg, #3d0c14 0%, #7f1d1d 100%)" }}>
          {/* Texto */}
          <div className="flex flex-col justify-center p-10 md:p-14 md:w-1/2 gap-5">
            <p className="text-rose-300 uppercase tracking-[0.18em] text-xs font-semibold">
              Nuestra historia
            </p>
            <h2 className={`text-white leading-tight ${playfair.className}`}
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}>
              Hecho con amor,<br />
              <em className="text-rose-300">desde Guadalajara</em>
            </h2>
            <p className="text-rose-100/80 leading-relaxed text-sm md:text-base max-w-sm">
              Cada pastel cuenta una historia. En Pastelería El Ruiseñor creamos diseños únicos y sabores excepcionales con los mejores ingredientes y mucho cariño.
            </p>
            <Link href="/enduser/conocenos#preguntasfrecuentes">
              <button className={`border border-white/60 text-white font-semibold rounded-full w-fit hover:bg-white hover:text-rose-900 transition-colors ${poppins.className}`}
                      style={{ padding: "12px 28px", fontSize: "0.875rem", marginTop: 8 }}>
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
            {/* Overlay suave para mezclar con el gradiente */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#3d0c14]/30" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA FINAL
      ════════════════════════════════════════ */}
      <section className="text-center py-20 px-4">
        <p className="text-rose-400 uppercase tracking-widest text-xs font-semibold mb-4">¿Lista para pedir?</p>
        <h2 className={`text-stone-800 mb-6 ${playfair.className}`}
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}>
          Empieza tu cotización hoy
        </h2>
        <p className="text-stone-500 max-w-md mx-auto mb-8 text-sm leading-relaxed">
          Cuéntanos tu idea y te ayudamos a hacerla realidad. Sin compromisos, sin costos ocultos.
        </p>
        <Link href="/cotizacion">
          <button className={`bg-rose-800 text-white font-bold rounded-full shadow-lg hover:bg-rose-900 transition-colors ${poppins.className}`}
                  style={{ padding: "16px 44px", fontSize: "1rem" }}>
            ¡Cotiza ahora! →
          </button>
        </Link>
      </section>

      {/* ── VIDEO (comentado hasta que tengas tu ID de YouTube) ──
      <section className="max-w-screen-lg mx-auto px-4 pb-16">
        <div className="rounded-3xl overflow-hidden aspect-video">
          <iframe className="w-full h-full"
            src="https://www.youtube.com/embed/VIDEO_ID_AQUI"
            title="Video Pastelería El Ruiseñor"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen />
        </div>
      </section>
      ── */}

      <WebFooter />
    </main>
  );
}
