import Link from "next/link";
import Image from "next/image";
import NavbarAdmin from "@/src/components/navbar";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";
import { useState } from "react";
import WebFooter from "@/src/components/WebFooter";

const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

/* ── Accordion item data ──────────────────────────────────────── */
const SECTIONS = [
  {
    id: 1,
    label: "Nuestros sabores",
    img: "/img/sabores.jpeg",
    accent: "var(--rosa)",
    blob: "rgba(255,111,125,0.12)",
    content: [
      { name: "Vainilla", desc: "El clásico sabor favorito de las fiestas infantiles, con un infalible gusto suave y esponjoso que evoca recuerdos de infancia y felicidad en cada bocado." },
      { name: "Chocolate", desc: "Húmedo y con un rico sabor a chocolate, tan delicioso que todos tus invitados querrán una porción extra." },
      { name: "Birthday Cake (con confetti 🎉)", desc: "Una opción colorida y divertida, especialmente diseñada para los festejos de cumpleaños." },
      { name: "Red Velvet", desc: "Tan suave y terso como el terciopelo, con su textura sedosa y su distintivo sabor a cacao, con un toque de vainilla y un sutil tono ácido." },
      { name: "Blueberry con Limón y Semilla de Amapola", desc: "El más fresco de los sabores, único y especial. La combinación de arándanos con limón y semillas de amapola crea una experiencia vibrante." },
      { name: "Zanahoria", desc: "Especiado, húmedo y con un rico sabor a zanahoria. Una mezcla perfecta de sabores y texturas que te hará sentir como en casa." },
      { name: "Naranja", desc: "Un sabor natural e intenso que amarás en cada bocado. La frescura cítrica brilla en este pastel." },
      { name: "Manzana Canela", desc: "Inspirado en la tarta de manzana, combina la dulzura de las manzanas con el cálido abrazo de la canela." },
      { name: "Dulce de Leche", desc: "Uno de los más dulces. Rico y caramelizado, se derrite en la boca dejando una satisfacción absoluta." },
    ],
  },
  {
    id: 2,
    label: "Postres",
    img: "/img/pay.jpeg",
    accent: "var(--menta-deep)",
    blob: "rgba(111,201,168,0.12)",
    content: [
      { name: "Pay de Queso", desc: "Relleno suave y cremoso con un toque de vainilla, sobre una base de galleta rica y crujiente." },
      { name: "Brownie", desc: "Crujientes por fuera y húmedos por dentro, con un sabor intenso a chocolate." },
      { name: "Galletas Decoradas", desc: "Galletas de mantequilla decoradas que se adaptan a la temática de tu fiesta, tan bonitas como deliciosas." },
      { name: "Alfajores", desc: "Capas de galleta con un relleno dulce que te transportará a un mundo de sabores." },
      { name: "Macarons", desc: "Delicada textura y una variedad de sabores exquisitos que harán las delicias de tu paladar." },
      { name: "Donas", desc: "Frescas, esponjosas y cubiertas con glaseados irresistibles. Perfectas para cualquier momento del día." },
      { name: "Paletas Magnum", desc: "Helado cremoso cubierto con una gruesa capa de chocolate. Un placer congelado." },
      { name: "Cupcakes", desc: "Esponjosa masa y cobertura de crema — una explosión de sabor en cada bocado." },
      { name: "Pan de Naranja con Mermelada de Maracuyá", desc: "Húmedo y aromático, con una exquisita mermelada de maracuyá que añade un toque tropical." },
      { name: "Tarta de Frutas", desc: "Base crujiente con una colorida selección de frutas frescas, tan hermosa como deliciosa." },
      { name: "Galletas Americanas", desc: "Las clásicas galletas con chispas de chocolate y una textura perfecta." },
      { name: "Tarta de Manzana", desc: "Manzana jugosa con canela, en una base dorada y crujiente. El postre perfecto para cualquier temporada." },
    ],
  },
  {
    id: 4,
    label: "Pasteles",
    img: "/img/yoda.jpg",
    accent: "var(--mantequilla)",
    blob: "rgba(255,233,155,0.2)",
    content: [
      { name: "Pasteles Personalizados", desc: "Llevamos tus eventos al siguiente nivel con diseños únicos. Cada pastel es una obra de arte comestible, creada meticulosamente para impresionar desde todos los ángulos." },
      { name: "Pasteles 3D", desc: "Figuras completamente personalizadas que cobran vida con detalles realistas y creativos. La experiencia comienza con la admiración de su diseño artístico." },
      { name: "Para toda ocasión", desc: "Bodas, cumpleaños, XV años, aniversarios — cada celebración especial merece un pastel único que se convierta en el centro de atención." },
    ],
  },
  {
    id: 3,
    label: "Galletas Americanas",
    img: "/img/galletas.jpg",
    accent: "var(--durazno)",
    blob: "rgba(255,201,165,0.2)",
    content: [
      { name: "Chips de Chocolate con Nuez", desc: "Combina la dulzura de los chips de chocolate con el toque crujiente de las nueces — un clásico irresistible." },
      { name: "Red Velvet con Chocolate Blanco", desc: "Rellena con queso crema y trozos de chocolate blanco — una auténtica indulgencia." },
      { name: "Matcha con Macadamias", desc: "Rellena con queso crema y mermelada de frambuesa. Una combinación única que sorprenderá tu paladar." },
      { name: "Limón con Amapola y Arándanos", desc: "Rellena de lemon curd y mermelada de frambuesa, con semillas de amapola y arándanos para una fiesta de sabor." },
      { name: "Galleta de Pastel de Cumpleaños", desc: "Masa suave con chispas de colores. Perfecta para traer alegría a cualquier evento." },
    ],
  },
];

/* ── Accordion item component ─────────────────────────────────── */
function AccordionItem({ section, isOpen, onToggle }) {
  return (
    <div
      style={{
        background: "var(--bg-raised)",
        borderRadius: "var(--r-xl)",
        boxShadow: isOpen ? "var(--shadow-md)" : "var(--shadow-xs)",
        border: `1.5px solid ${isOpen ? section.accent : "var(--border-color)"}`,
        overflow: "hidden",
        transition: "box-shadow 200ms, border-color 200ms",
      }}
    >
      {/* Header button */}
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "1.25rem 1.5rem",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Thumbnail */}
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              border: `2.5px solid ${isOpen ? section.accent : "var(--border-color)"}`,
              background: section.blob,
              transition: "border-color 200ms",
            }}
          >
            <Image
              src={section.img}
              width={60}
              height={60}
              alt={section.label}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>

          {/* Label */}
          <span
            className={sofia.className}
            style={{
              fontSize: "1.4rem",
              color: isOpen ? section.accent : "var(--burdeos)",
              lineHeight: 1.2,
              transition: "color 200ms",
            }}
          >
            {section.label}
          </span>
        </div>

        {/* Chevron */}
        <span
          style={{
            flexShrink: 0,
            color: isOpen ? section.accent : "var(--text-muted)",
            transition: "transform 250ms, color 200ms",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            display: "flex",
          }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
          </svg>
        </span>
      </button>

      {/* Body */}
      {isOpen && (
        <div
          style={{
            padding: "0 1.5rem 1.5rem",
            borderTop: `1px solid var(--border-color)`,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "0.75rem",
              paddingTop: "1.25rem",
            }}
          >
            {section.content.map((item) => (
              <div
                key={item.name}
                style={{
                  background: section.blob,
                  borderRadius: "var(--r-md)",
                  padding: "1rem",
                  border: `1px solid ${section.accent}22`,
                }}
              >
                <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--color-text)", marginBottom: 4 }}>
                  {item.name}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-soft)", lineHeight: 1.55 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function ConocenuestrosProductos() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (id) => setOpenSection(openSection === id ? null : id);

  return (
    <div
      className={nunito.className}
      style={{ minHeight: "100vh", background: "var(--bg-sunken)", display: "flex", flexDirection: "column" }}
    >
      {/* Sprinkle overlay */}
      <div
        aria-hidden="true"
        className="ru-pattern-sprinkle fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.07 }}
      />

      <NavbarAdmin />

      <main
        className="flex-grow relative z-10"
        style={{ marginTop: "4rem", padding: "2.5rem 1.25rem 3rem", maxWidth: 900, marginLeft: "auto", marginRight: "auto", width: "100%" }}
      >
        {/* ── Page header ─────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p
            style={{
              fontSize: "0.72rem", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.14em",
              color: "var(--rosa)", marginBottom: 8,
            }}
          >
            Menú y especialidades
          </p>
          <h1
            className={sofia.className}
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--burdeos)", lineHeight: 1.1, marginBottom: 12 }}
          >
            Conoce nuestros productos
          </h1>
          <p style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: "0.9rem", maxWidth: 480, margin: "0 auto" }}>
            Pasteles personalizados, postres, galletas y más — todos hechos con ingredientes selectos y mucho amor.
          </p>
        </div>

        {/* ── Accordion ───────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {SECTIONS.map((section) => (
            <AccordionItem
              key={section.id}
              section={section}
              isOpen={openSection === section.id}
              onToggle={() => toggleSection(section.id)}
            />
          ))}
        </div>

        {/* ── CTA banner ──────────────────────────────────── */}
        <div
          style={{
            marginTop: "2.5rem",
            background: "linear-gradient(135deg, var(--burdeos) 0%, #7A1F44 100%)",
            borderRadius: "var(--r-xl)",
            padding: "2rem 2rem",
            textAlign: "center",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            className="ru-pattern-sprinkle absolute inset-0 pointer-events-none"
            style={{ opacity: 0.18 }}
          />
          <p className={sofia.className} style={{ fontSize: "1.75rem", marginBottom: 8, position: "relative" }}>
            ¿Te antojaste?
          </p>
          <p style={{ color: "rgba(255,210,220,0.9)", fontSize: "0.9rem", marginBottom: "1.25rem", position: "relative", fontWeight: 600 }}>
            Cotiza tu pedido y te respondemos en menos de 24 horas.
          </p>
          <Link href="/cotizacion" style={{ position: "relative", display: "inline-block" }}>
            <button
              style={{
                padding: "12px 32px", borderRadius: "var(--r-pill)",
                background: "var(--rosa)", color: "#fff",
                fontWeight: 800, fontSize: "0.95rem",
                border: "none", cursor: "pointer",
                boxShadow: "0 4px 16px rgba(255,111,125,0.4)",
                fontFamily: "var(--font-nunito)",
                transition: "all 150ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,111,125,0.5)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,111,125,0.4)"; }}
            >
              ¡Cotizar ahora! →
            </button>
          </Link>
        </div>
      </main>

      <WebFooter />
    </div>
  );
}
