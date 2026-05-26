import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

// Hub mini de los 4 catálogos. El cliente final usa /cotizacion.
// El aside también tiene los 4 enlaces sueltos — esta página es un atajo
// visual desde el dashboard.
const CARDS = [
  {
    href: "/dashboard/cotizacion-catalogos/sabores",
    label: "Sabores del bizcocho",
    desc: "Catálogo con vínculo opcional a Recetas",
    accent: "var(--mantequilla)",
    blob: "rgba(255,233,155,0.25)",
  },
  {
    href: "/dashboard/cotizacion-catalogos/rellenos",
    label: "Rellenos",
    desc: "Costo manual por porción",
    accent: "var(--rosa)",
    blob: "rgba(255,111,125,0.15)",
  },
  {
    href: "/dashboard/cotizacion-catalogos/coberturas",
    label: "Coberturas",
    desc: "Buttercream / ganache / fondant",
    accent: "var(--lavanda)",
    blob: "rgba(217,196,232,0.3)",
  },
  {
    href: "/dashboard/cotizacion-catalogos/decoraciones",
    label: "Decoraciones",
    desc: "Vinculadas a Técnicas Creativas",
    accent: "var(--menta-deep)",
    blob: "rgba(111,201,168,0.15)",
  },
];

export default function CotizacionCatalogosHub() {
  return (
    <div className={poppins.className} style={{ background: "var(--bg-sunken)", minHeight: "100vh" }}>
      <NavbarAdmin />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className="flex-grow min-w-0 px-5 py-7 pb-20 md:pb-8 max-w-screen-xl">
          <h1
            className={sofia.className}
            style={{ fontSize: "2.25rem", color: "var(--burdeos)", lineHeight: 1.1 }}
          >
            Catálogos de cotización
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: 4 }}>
            Opciones que el cliente ve en <code className="px-1 bg-gray-100 rounded">/cotizacion</code>.
          </p>

          <div
            className="mt-6"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {CARDS.map((card) => (
              <Link key={card.href} href={card.href} style={{ textDecoration: "none" }}>
                <div
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
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: -30, right: -30,
                      width: 110, height: 110,
                      borderRadius: "50%",
                      background: card.blob,
                    }}
                  />
                  <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--color-text)", marginBottom: 4 }}>
                    {card.label}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                    {card.desc}
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
