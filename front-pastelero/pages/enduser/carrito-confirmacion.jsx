import { useEffect } from "react";
import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";
import { clearAll } from "@/src/lib/unifiedCart";

const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "700", "800"] });

/** Confirmación del checkout unificado — limpia los carritos locales. */
export default function CarritoConfirmacion() {
  useEffect(() => { clearAll(); }, []);

  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)" }}>
      <NavbarAdmin />
      <main style={{ maxWidth: 560, margin: "0 auto", padding: "7rem 1.25rem", textAlign: "center" }}>
        <p style={{ fontSize: "3.5rem" }}>🎉</p>
        <h1 className={sofia.className} style={{ fontSize: "2.4rem", color: "var(--burdeos)", marginBottom: 10 }}>¡Gracias por tu compra!</h1>
        <p style={{ color: "var(--text-soft)", lineHeight: 1.6, marginBottom: 8 }}>
          Recibimos tu pago y tus pedidos están confirmados. Te enviamos los detalles a tu correo.
        </p>
        <p style={{ color: "var(--text-soft)", fontSize: ".85rem", marginBottom: 24 }}>
          Puedes seguir tus pedidos en <Link href="/enduser/mispedidos" style={{ color: "var(--rosa)", fontWeight: 700 }}>Mis pedidos</Link>.
        </p>
        <Link href="/">
          <button style={{ padding: "12px 28px", borderRadius: 999, border: "none", background: "var(--burdeos)", color: "#fff", fontWeight: 800, cursor: "pointer" }}>
            Volver al inicio
          </button>
        </Link>
      </main>
    </div>
  );
}
