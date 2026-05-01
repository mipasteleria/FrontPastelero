import Image from "next/image";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import Link from "next/link";
import { useState } from "react";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

/* ── FAQ data — preserving real answers from the project ─────── */
const FAQS = [
  {
    q: "¿Cómo puedo hacer un pedido?",
    a: "Puedes hacer un pedido a través de nuestro sitio web, por correo electrónico o llamándonos directamente. También puedes cotizar en línea y te respondemos con propuesta en menos de 24h.",
  },
  {
    q: "¿Con cuánta anticipación debo hacer mi pedido?",
    a: "Para pasteles personalizados pedimos mínimo 72 horas. Galletas y cupcakes con 48h. Para eventos grandes (más de 50 personas), recomendamos 14 días de anticipación.",
  },
  {
    q: "¿Ofrecen entregas a domicilio?",
    a: "Sí, ofrecemos servicio de entrega a domicilio en Guadalajara, Jalisco y sus alrededores. Los cargos adicionales según la distancia son considerados en la cotización.",
  },
  {
    q: "¿Puedo personalizar el diseño y sabor del pastel?",
    a: "Sí, puedes personalizar tanto el diseño como el sabor del pastel llenando el formulario, donde nos podrás compartir tus ideas y haremos lo posible por realizarlas. Nuestro modelo es 100% personalizado.",
  },
  {
    q: "¿Cuáles son las opciones de pago disponibles?",
    a: "Aceptamos pagos con tarjeta de crédito, transferencia bancaria y pagos en efectivo al momento de la entrega.",
  },
  {
    q: "¿Hacen pasteles para personas con alergias o dietas especiales?",
    a: "Sí, hacemos pasteles especiales para personas con alergias alimentarias o dietas específicas. Coméntenos sus necesidades y haremos un pastel a su medida.",
  },
  {
    q: "¿Puedo cancelar mi pedido después de realizar el pago?",
    a: "Sí, puedes cancelar tu pedido hasta 48 horas antes de la fecha de entrega programada y te reembolsaremos el pago según nuestra política de cancelaciones. Escríbenos para más detalles.",
  },
];

/* ── Accordion item ──────────────────────────────────────────── */
function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div
      style={{
        background: "var(--bg-raised)",
        borderRadius: isOpen ? "var(--r-xl)" : "var(--r-pill)",
        padding: isOpen ? "1rem 1.5rem" : "0.75rem 1.5rem",
        marginBottom: "0.5rem",
        cursor: "pointer",
        boxShadow: isOpen ? "var(--shadow-sm)" : "none",
        border: `1px solid ${isOpen ? "var(--rosa-2, #FFC3C9)" : "transparent"}`,
        transition: "all 200ms",
      }}
      onClick={onToggle}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-text)", flex: 1, paddingRight: 12 }}>
          {item.q}
        </span>
        <span
          style={{
            color: "var(--rosa)",
            fontSize: "1.5rem",
            lineHeight: 1,
            flexShrink: 0,
            fontWeight: 300,
            transition: "transform 200ms",
            transform: isOpen ? "rotate(45deg)" : "none",
          }}
        >
          +
        </span>
      </div>
      {isOpen && (
        <div
          style={{
            color: "var(--text-soft)",
            fontSize: "0.9rem",
            lineHeight: 1.7,
            marginTop: "0.75rem",
            paddingTop: "0.75rem",
            borderTop: "1px dashed var(--border-color)",
          }}
        >
          {item.a}
        </div>
      )}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function Conocenos() {
  const [openFaq, setOpenFaq] = useState(null);
  const toggle = (i) => setOpenFaq(openFaq === i ? null : i);

  return (
    <div
      className={nunito.className}
      style={{ minHeight: "100vh", background: "var(--bg-sunken)", display: "flex", flexDirection: "column" }}
    >
      <style>{`
        @media (max-width: 860px) {
          .about-grid { grid-template-columns: 1fr !important; }
          .faq-grid   { grid-template-columns: 1fr !important; }
          .faq-side   { display: none !important; }
        }
        @media (max-width: 560px) {
          .about-photo-wrap { max-width: 260px !important; margin: 0 auto !important; }
        }
        .side-cta-btn:hover { opacity: 0.88; transform: translateY(-1px); }
      `}</style>

      {/* Sprinkle overlay */}
      <div
        aria-hidden="true"
        className="ru-pattern-sprinkle fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.07 }}
      />

      <NavbarAdmin />

      <main
        className="flex-grow relative z-10"
        style={{ marginTop: "4rem", padding: "2.5rem 1.25rem 3rem" }}
      >

        {/* ── ABOUT SECTION ───────────────────────────────────────── */}
        <div
          className="about-grid"
          style={{
            maxWidth: 1040,
            margin: "0 auto 3rem",
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* Photo column */}
          <div
            className="about-photo-wrap"
            style={{
              aspectRatio: "3/4",
              borderRadius: "var(--r-xl)",
              overflow: "hidden",
              position: "relative",
              background: "linear-gradient(135deg,#FFC3C9,#D9C4E8)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <Image
              src="/img/conocenosPastelera.png"
              fill
              style={{ objectFit: "cover" }}
              alt="Nuestra fundadora con un pastel"
              priority
            />
            {/* Sprinkle overlay */}
            <div
              aria-hidden="true"
              className="ru-pattern-sprinkle absolute inset-0 pointer-events-none"
              style={{ opacity: 0.28 }}
            />
            {/* Label */}
            <div
              className={sofia.className}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                color: "#fff",
                fontSize: "1.3rem",
                lineHeight: 1.15,
                textShadow: "0 2px 8px rgba(84,0,39,0.4)",
              }}
            >
              Nuestra<br />fundadora
            </div>
          </div>

          {/* Text card */}
          <div
            style={{
              background: "var(--rosa-4, #FFF3F5)",
              borderRadius: "var(--r-xl)",
              padding: "2.5rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Sprinkle overlay */}
            <div
              aria-hidden="true"
              className="ru-pattern-sprinkle absolute inset-0 pointer-events-none"
              style={{ opacity: 0.15 }}
            />

            <h1
              className={sofia.className}
              style={{ fontSize: "3rem", color: "var(--burdeos)", lineHeight: 1, marginBottom: "1.5rem", position: "relative" }}
            >
              Conócenos
            </h1>

            <p style={{ color: "var(--color-text)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: "1rem", position: "relative" }}>
              Pastelería El Ruiseñor nació en 2015, cuando nuestra fundadora, Ana González, estaba cursando la carrera de Ingeniería Mecatrónica. Su pasión por los pasteles y la necesidad de encontrar un apoyo económico extra hicieron que un sueño se convirtiera en realidad.
            </p>
            <p style={{ color: "var(--color-text)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: "1rem", position: "relative" }}>
              Nos sentimos afortunados de estar en constante capacitación, siempre aprendiendo y aplicando las técnicas más actuales y de tendencia en el mundo pastelero.
            </p>
            <p style={{ color: "var(--color-text)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: "1rem", position: "relative" }}>
              En lugar de copiar pasteles de una imagen, preferimos personalizarlos especialmente para ti. Permítenos la oportunidad de maravillar tu fiesta y a tus invitados con un diseño único y hecho a tu medida.
            </p>
            <p
              className={sofia.className}
              style={{ fontSize: "1.4rem", color: "var(--rosa)", marginTop: "1.25rem", position: "relative" }}
            >
              ¡Será un placer ser parte de tus momentos más dulces!
            </p>
          </div>
        </div>

        {/* ── FAQ SECTION ─────────────────────────────────────────── */}
        <div
          className="faq-grid"
          id="preguntasfrecuentes"
          style={{
            maxWidth: 1040,
            margin: "0 auto 3rem",
            display: "grid",
            gridTemplateColumns: "1fr 220px",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* FAQ main */}
          <div>
            <h2
              className={sofia.className}
              style={{ fontSize: "3rem", color: "var(--burdeos)", lineHeight: 1, marginBottom: "1.75rem" }}
            >
              Preguntas frecuentes
            </h2>

            {FAQS.map((item, i) => (
              <FaqItem
                key={i}
                item={item}
                isOpen={openFaq === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>

          {/* Sidebar */}
          <aside
            className="faq-side"
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <Link href="/cotizacion">
              <div
                className="side-cta-btn"
                style={{
                  background: "var(--rosa-3, #FFC3C9)",
                  borderRadius: "var(--r-md)",
                  padding: "0.75rem 1rem",
                  textAlign: "center",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--burdeos)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                  transition: "all 150ms",
                  display: "block",
                }}
              >
                ¡Solicita tu cotización aquí!
              </div>
            </Link>

            {/* Image 1 */}
            <div
              style={{
                aspectRatio: "1/1",
                borderRadius: "var(--r-lg)",
                overflow: "hidden",
                position: "relative",
                boxShadow: "var(--shadow-sm)",
                background: "linear-gradient(135deg,#FFE99B,#FFC9A5)",
              }}
            >
              <Image src="/img/yoda.jpg" fill style={{ objectFit: "cover" }} alt="Pastel Yoda 3D" />
              <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0 pointer-events-none" style={{ opacity: 0.3 }} />
            </div>

            <Link href="/enduser/galeria">
              <div
                className="side-cta-btn"
                style={{
                  background: "var(--rosa)",
                  borderRadius: "var(--r-md)",
                  padding: "0.75rem 1rem",
                  textAlign: "center",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  cursor: "pointer",
                  transition: "all 150ms",
                  display: "block",
                }}
              >
                Ver galería
              </div>
            </Link>

            {/* Image 2 */}
            <div
              style={{
                aspectRatio: "1/1",
                borderRadius: "var(--r-lg)",
                overflow: "hidden",
                position: "relative",
                boxShadow: "var(--shadow-sm)",
                background: "linear-gradient(135deg,#2A1010,#540027)",
              }}
            >
              <Image src="/img/pastelnegro.jpg" fill style={{ objectFit: "cover" }} alt="Pastel decorado" />
              <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0 pointer-events-none" style={{ opacity: 0.3 }} />
            </div>
          </aside>
        </div>

        {/* ── CTA BANNER ──────────────────────────────────────────── */}
        <div
          style={{
            maxWidth: 1040,
            margin: "0 auto",
            background: "linear-gradient(135deg, var(--burdeos) 0%, #3D001D 100%)",
            borderRadius: "var(--r-2xl)",
            padding: "2.5rem 2rem",
            textAlign: "center",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0 pointer-events-none" style={{ opacity: 0.22 }} />
          <p
            className={sofia.className}
            style={{ fontSize: "2rem", lineHeight: 1, marginBottom: 10, position: "relative" }}
          >
            ¿No encontraste tu respuesta?
          </p>
          <p style={{ color: "#FFD8DF", fontSize: "0.9rem", marginBottom: "1.5rem", position: "relative", fontWeight: 600 }}>
            Escríbenos por WhatsApp y te respondemos en menos de 30 minutos en horario de tienda.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
            <a href="https://wa.me/521XXXXXXXXXX" target="_blank" rel="noreferrer">
              <button
                style={{
                  padding: "12px 28px",
                  borderRadius: "var(--r-pill)",
                  background: "var(--rosa)",
                  color: "#fff",
                  border: "none",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(255,111,125,0.4)",
                  fontFamily: "var(--font-nunito)",
                  transition: "all 150ms",
                }}
              >
                WhatsApp →
              </button>
            </a>
            <Link href="/cotizacion">
              <button
                style={{
                  padding: "12px 28px",
                  borderRadius: "var(--r-pill)",
                  background: "transparent",
                  color: "#FFD8DF",
                  border: "1.5px solid rgba(255,161,170,0.5)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  fontFamily: "var(--font-nunito)",
                  transition: "all 150ms",
                }}
              >
                Cotizar ahora
              </button>
            </Link>
          </div>
        </div>

      </main>

      <WebFooter />
    </div>
  );
}
