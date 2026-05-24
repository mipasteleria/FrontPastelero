import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";
import { getCart, updateQty, removeItem, clearCart } from "@/src/lib/postresCart";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

export default function PostresCarrito() {
  const router = useRouter();
  const [cart, setCart] = useState({ items: [] });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCart(getCart());
    setLoaded(true);
  }, []);

  const cambiarCantidad = (postreId, cantidad) => {
    const n = Math.max(1, Number(cantidad) || 1);
    setCart(updateQty(postreId, n));
  };

  const quitar = (postreId) => {
    setCart(removeItem(postreId));
  };

  const vaciar = () => {
    clearCart();
    setCart({ items: [] });
  };

  const subtotal = cart.items.reduce((s, i) => s + (Number(i.precio) || 0) * (Number(i.cantidad) || 0), 0);

  /* ── Carrito vacío ── */
  if (loaded && cart.items.length === 0) {
    return (
      <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)", display: "flex", flexDirection: "column" }}>
        <NavbarAdmin />
        <main className="flex-grow" style={{ marginTop: "5rem", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.25rem" }}>
          <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-2xl)", padding: "3rem 2rem", textAlign: "center", maxWidth: 480 }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "0.75rem" }}>🛒</div>
            <h1 className={sofia.className} style={{ fontSize: "2rem", color: "var(--burdeos)", marginBottom: 6 }}>Tu carrito está vacío</h1>
            <p style={{ color: "var(--text-soft)", marginBottom: "1.5rem" }}>Explora el catálogo de postres y agrega tu favorito antes de continuar al pago.</p>
            <Link href="/enduser/postres">
              <button style={{ padding: "12px 26px", borderRadius: "var(--r-pill)", background: "var(--burdeos)", color: "#fff", border: "none", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer" }}>
                Ver postres
              </button>
            </Link>
          </div>
        </main>
        <WebFooter />
      </div>
    );
  }

  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)" }}>
      <NavbarAdmin />

      <section style={{ padding: "5rem 1.5rem 2rem", maxWidth: 960, margin: "0 auto" }}>
        <Link href="/enduser/postres" style={{ fontSize: "0.85rem", color: "var(--burdeos)", textDecoration: "none", fontWeight: 700 }}>
          ← Seguir comprando
        </Link>
        <h1 className={sofia.className} style={{ fontSize: "clamp(2.5rem,5vw,4rem)", color: "var(--burdeos)", lineHeight: 1, marginTop: "1rem", marginBottom: "2rem" }}>
          Tu carrito
        </h1>

        <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
          {cart.items.map((it, i) => (
            <div
              key={it.postreId}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr auto auto",
                gap: "1rem",
                alignItems: "center",
                padding: "1rem 1.25rem",
                borderBottom: i < cart.items.length - 1 ? "1px solid var(--border-color)" : "none",
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  background: it.imagenUrl ? "var(--crema)" : "linear-gradient(135deg,#FFE2E7,#FFC3C9)",
                  backgroundImage: it.imagenUrl ? `url(${it.imagenUrl})` : "none",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: !it.imagenUrl ? "2.5rem" : 0,
                }}
              >
                {!it.imagenUrl && "🎂"}
              </div>

              <div>
                <Link href={`/enduser/postres/${it.slug}`} style={{ textDecoration: "none" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-text)", margin: 0 }}>{it.nombre}</h3>
                </Link>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>
                  ${Number(it.precio).toFixed(2)} c/u
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button
                  onClick={() => cambiarCantidad(it.postreId, it.cantidad - 1)}
                  disabled={it.cantidad <= 1}
                  style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border-strong)", background: "transparent", color: "var(--burdeos)", fontSize: 16, cursor: it.cantidad <= 1 ? "not-allowed" : "pointer", opacity: it.cantidad <= 1 ? 0.4 : 1 }}
                >
                  −
                </button>
                <span style={{ minWidth: 32, textAlign: "center", fontWeight: 700, color: "var(--color-text)" }}>{it.cantidad}</span>
                <button
                  onClick={() => cambiarCantidad(it.postreId, it.cantidad + 1)}
                  style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border-strong)", background: "transparent", color: "var(--burdeos)", fontSize: 16, cursor: "pointer" }}
                >
                  +
                </button>
              </div>

              <div style={{ textAlign: "right", minWidth: 80 }}>
                <p className={sofia.className} style={{ fontSize: "1.3rem", color: "var(--rosa)", margin: 0 }}>
                  ${(Number(it.precio) * Number(it.cantidad)).toFixed(2)}
                </p>
                <button
                  onClick={() => quitar(it.postreId)}
                  style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "0.75rem", cursor: "pointer", marginTop: 4, textDecoration: "underline" }}
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "1.5rem", marginTop: "1.25rem", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <span style={{ fontSize: "1rem", color: "var(--text-soft)" }}>Subtotal</span>
            <span className={sofia.className} style={{ fontSize: "2rem", color: "var(--burdeos)" }}>${subtotal.toFixed(2)}</span>
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
            El costo de envío (si aplica) se calcula en el siguiente paso según tu zona.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              onClick={() => router.push("/enduser/postres-checkout")}
              style={{ padding: "14px 30px", borderRadius: "var(--r-pill)", background: "var(--burdeos)", color: "#fff", border: "none", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer", boxShadow: "var(--shadow-sm)" }}
            >
              Ir a pagar →
            </button>
            <button
              onClick={vaciar}
              style={{ padding: "14px 24px", borderRadius: "var(--r-pill)", background: "transparent", color: "var(--burdeos)", border: "1.5px solid var(--border-strong)", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}
            >
              Vaciar carrito
            </button>
          </div>
        </div>
      </section>

      <WebFooter />
    </div>
  );
}
