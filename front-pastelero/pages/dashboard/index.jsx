import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";

const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

/* ── Nav cards data ─────────────────────────────────────────── */
const NAV_CARDS = [
  {
    href: "/dashboard/cotizaciones",
    label: "Solicitudes de cotización",
    description: "Revisa y gestiona los pedidos especiales recibidos",
    accent: "var(--rosa)",
    blob: "rgba(255,111,125,0.15)",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3" />
      </svg>
    ),
  },
  {
    href: "/dashboard/insumosytrabajomanual",
    label: "Insumos y Trabajo Manual",
    description: "Administra materias primas y tarifas de trabajo",
    accent: "var(--menta-deep)",
    blob: "rgba(111,201,168,0.15)",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.5 21h13M12 21V7m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm2-1.8c3.073.661 2.467 2.8 5 2.8M5 8c3.359 0 2.192-2.115 5.012-2.793M7 9.556V7.75m0 1.806-1.95 4.393a.773.773 0 0 0 .37.962.785.785 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.776.776 0 0 0 .09-.716L7 9.556Zm10 0V7.313m0 2.243-1.95 4.393a.773.773 0 0 0 .37.962.786.786 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.775.775 0 0 0 .09-.716L17 9.556Z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/costeorecetas",
    label: "Recetas",
    description: "Costea y organiza tus recetas con detalle",
    accent: "var(--mantequilla)",
    blob: "rgba(255,233,155,0.25)",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2" />
      </svg>
    ),
  },
  {
    href: "/dashboard/gastosfijosymanodeobra",
    label: "Gastos Fijos y Mano de Obra",
    description: "Controla costos fijos y tarifas de personal",
    accent: "var(--lavanda)",
    blob: "rgba(217,196,232,0.3)",
    icon: (
      <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797 1.415 1.415-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796-1.415 1.415-.796-.797A3.979 3.979 0 0 1 16 18.874V20h-2v-1.126a3.977 3.977 0 0 1-1.032-.428l-.796.797-1.415-1.415.797-.796A3.975 3.975 0 0 1 11.126 16H10v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796 1.415-1.415.796.797A3.977 3.977 0 0 1 14 11.126V10h2Zm.406 3.578.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703 7.029 7.029 0 0 0-3.235 3.235A4 4 0 0 1 5 8Zm4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.979 6.979 0 0 1 9 15c0-.695.101-1.366.29-2Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "/dashboard/tecnicas",
    label: "Técnicas Creativas",
    description: "Documenta y comparte tus técnicas de pastelería",
    accent: "var(--pistache-deep)",
    blob: "rgba(159,184,100,0.15)",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 11.5 11 13l4-3.5M12 20a16.405 16.405 0 0 1-5.092-5.804A16.694 16.694 0 0 1 5 6.666L12 4l7 2.667a16.695 16.695 0 0 1-1.908 7.529A16.406 16.406 0 0 1 12 20Z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/productos",
    label: "Productos del Home",
    description: "Gestiona los productos visibles en tu tienda",
    accent: "var(--durazno)",
    blob: "rgba(255,201,165,0.25)",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M3 12h18M3 18h18" />
      </svg>
    ),
  },
  {
    href: "/dashboard/usuarios",
    label: "Usuarios",
    description: "Administra cuentas y permisos del sistema",
    accent: "var(--rosa-2)",
    blob: "rgba(255,161,170,0.18)",
    icon: (
      <svg width="28" height="28" fill="currentColor" viewBox="0 0 20 18">
        <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
      </svg>
    ),
  },
];

export default function DashboardHome() {
  /* Greeting by time of day */
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "¡Buenos días!" : hour < 19 ? "¡Buenas tardes!" : "¡Buenas noches!";

  return (
    <div className={nunito.className} style={{ background: "var(--bg-sunken)", minHeight: "100vh" }}>
      {/* Sprinkle overlay */}
      <div
        aria-hidden="true"
        className="ru-pattern-sprinkle fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.07 }}
      />

      <NavbarAdmin />

      <div className="flex flex-row mt-16 relative z-10">
        <Asideadmin />

        <main className="flex-grow min-w-0 px-5 py-7 pb-20 md:pb-8 max-w-screen-xl">

          {/* ── Page header ────────────────────────────────────── */}
          <div className="mb-8">
            <h1
              className={sofia.className}
              style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", color: "var(--burdeos)", lineHeight: 1.1 }}
            >
              {greeting}
            </h1>
            <p style={{ color: "var(--text-muted)", fontWeight: 600, marginTop: 4, fontSize: "0.9rem" }}>
              Panel de administración · El Ruiseñor
            </p>
          </div>

          {/* ── Section cards grid ──────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {NAV_CARDS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="group"
                  style={{
                    background: "var(--bg-raised)",
                    borderRadius: "var(--r-xl)",
                    padding: "1.5rem",
                    boxShadow: "var(--shadow-sm)",
                    border: "1px solid var(--border-color)",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 200ms",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Blob decoration */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: -30,
                      right: -30,
                      width: 110,
                      height: 110,
                      borderRadius: "50%",
                      background: card.blob,
                    }}
                  />

                  {/* Icon */}
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "var(--r-md)",
                      background: card.blob,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: card.accent,
                      marginBottom: "1rem",
                      position: "relative",
                    }}
                  >
                    {card.icon}
                  </div>

                  {/* Text */}
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: "1rem",
                        color: "var(--color-text)",
                        lineHeight: 1.3,
                        marginBottom: 4,
                      }}
                    >
                      {card.label}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                      {card.description}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "1.25rem",
                      right: "1.25rem",
                      color: card.accent,
                      opacity: 0.7,
                    }}
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>

      <FooterDashboard />
    </div>
  );
}
