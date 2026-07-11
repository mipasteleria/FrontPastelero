import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const CARDS = [
  { href: "/dashboard/vintage-catalogos/porciones", label: "Porciones", desc: "Tamaños, pisos (máx y costo extra), anticipación, base/domo/branding" },
  { href: "/dashboard/vintage-catalogos/formas", label: "Formas", desc: "Corazón, círculo, cuadrado, hexágono" },
  { href: "/dashboard/vintage-catalogos/colores", label: "Colores base", desc: "Color + PNG sin fondo para el visualizador" },
  { href: "/dashboard/vintage-catalogos/decoraciones", label: "Decoraciones", desc: "Costo + variantes de color con PNG por capa" },
];

export default function VintageCatalogosHub() {
  return (
    <div className={poppins.className} style={{ background: "var(--bg-sunken)", minHeight: "100vh" }}>
      <NavbarAdmin />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className="flex-grow min-w-0 px-5 py-7 pb-20 md:pb-8 max-w-screen-xl">
          <h1 className={sofia.className} style={{ fontSize: "2.25rem", color: "var(--burdeos)", lineHeight: 1.1 }}>
            Catálogos del Pastel Vintage
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: 4 }}>
            Opciones que el cliente ve en <code className="px-1 bg-gray-100 rounded">/enduser/pastel-vintage</code>.
            Sabores, rellenos y coberturas se gestionan en sus catálogos con la casilla "aplica a vintage".
          </p>
          <div className="mt-6" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {CARDS.map((card) => (
              <Link key={card.href} href={card.href} style={{ textDecoration: "none" }}>
                <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "1.5rem", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-color)" }}>
                  <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--color-text)", marginBottom: 4 }}>{card.label}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{card.desc}</div>
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
