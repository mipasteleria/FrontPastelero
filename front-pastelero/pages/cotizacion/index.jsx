import { useState, useContext } from "react";
import { useAuth } from "@/src/context";
import Cakeprice from "../../src/components/cotizacion/cakeprice";
import Snackprice from "@/src/components/cotizacion/snackprice";
import Cupcakeprice from "@/src/components/cotizacion/cupcakeprice";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import Link from "next/link";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700"] });

const PRODUCTS = [
  { value: "cake", label: "Pastel", emoji: "🎂" },
  { value: "snack", label: "Mesa de postres", emoji: "🍮" },
  { value: "cupcake", label: "Cupcakes", emoji: "🧁" },
];

export default function Price() {
  const [selectedProduct, setSelectedProduct] = useState("cake");
  const { isLoggedIn } = useAuth();

  return (
    <div
      className={`flex flex-col min-h-screen ${nunito.className}`}
      style={{ background: "var(--bg-sunken)", position: "relative" }}
    >
      {/* Sprinkle pattern overlay */}
      <div
        className="ru-pattern-sprinkle"
        style={{
          position: "fixed",
          inset: 0,
          opacity: 0.07,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <NavbarAdmin />

      <main
        style={{
          position: "relative",
          zIndex: 1,
          flexGrow: 1,
          maxWidth: "1024px",
          width: "100%",
          margin: "0 auto",
          marginTop: "4rem",
          padding: "2rem 1.25rem",
        }}
      >
        {/* Page header */}
        <div style={{ marginBottom: "2rem" }}>
          <p
            style={{
              color: "var(--rosa)",
              fontFamily: "var(--font-nunito, inherit)",
              fontWeight: 700,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: "0.5rem",
            }}
          >
            Pedido especial
          </p>
          <h1
            className={sofia.className}
            style={{
              color: "var(--burdeos)",
              fontSize: "3rem",
              lineHeight: 1.1,
              marginBottom: "0.75rem",
            }}
          >
            Cotiza tu pastel
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              maxWidth: "560px",
            }}
          >
            Cuéntanos sobre tu ocasión especial y te preparamos una propuesta a
            la medida.
          </p>
        </div>

        {!isLoggedIn ? (
          /* Not-logged-in card */
          <div
            style={{
              background: "#ffffff",
              borderRadius: "var(--r-xl)",
              boxShadow: "var(--shadow-md)",
              border: "1px solid var(--border-color)",
              padding: "2rem 2.5rem",
              marginBottom: "7rem",
            }}
          >
            <h2
              className={sofia.className}
              style={{
                color: "var(--burdeos)",
                fontSize: "1.6rem",
                marginBottom: "0.75rem",
              }}
            >
              Para solicitar una cotización necesitas iniciar sesión
            </h2>
            <p
              style={{
                color: "var(--text-soft)",
                fontSize: "0.95rem",
                marginBottom: "1.75rem",
              }}
            >
              Por favor, inicia sesión o regístrate para continuar con el
              proceso de cotización. También puedes volver al inicio.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                alignItems: "center",
              }}
            >
              <Link href="/registrarse">
                <button
                  style={{
                    background: "transparent",
                    color: "var(--burdeos)",
                    border: "1.5px solid var(--burdeos)",
                    borderRadius: "var(--r-pill)",
                    padding: "10px 24px",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "all 150ms",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--burdeos)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--burdeos)";
                  }}
                >
                  Registrarse
                </button>
              </Link>
              <Link href="/login">
                <button
                  className="btn-ru btn-ru-primary"
                  style={{
                    padding: "10px 24px",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  Iniciar sesión
                </button>
              </Link>
              <Link href="/">
                <button
                  style={{
                    background: "transparent",
                    color: "var(--burdeos)",
                    border: "1.5px solid var(--burdeos)",
                    borderRadius: "var(--r-pill)",
                    padding: "10px 24px",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "all 150ms",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--burdeos)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--burdeos)";
                  }}
                >
                  Volver al inicio
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Info box */}
            <div
              style={{
                background: "var(--rosa-4)",
                borderRadius: "var(--r-md)",
                padding: "1rem 1.25rem",
                fontSize: "0.85rem",
                color: "var(--text-soft)",
                borderLeft: "3px solid var(--rosa)",
                marginBottom: "1.75rem",
              }}
            >
              Le pedimos que complete cada campo con la mayor cantidad de
              detalles posible para acelerar el proceso de cotización. Recuerda
              que somos una empresa pequeña que realiza pocos pasteles a la
              semana. Por favor, solicita tu cotización con suficiente
              anticipación. Hacemos todo lo posible para responder rápidamente,
              pero a veces puede haber retrasos. Agradecemos tu comprensión.
            </div>

            {/* Product selector label */}
            <p
              className={sofia.className}
              style={{
                color: "var(--burdeos)",
                fontSize: "1.3rem",
                marginBottom: "0.5rem",
              }}
            >
              Selecciona el producto que deseas cotizar:
            </p>

            {/* Chip selector */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                margin: "1.5rem 0",
                flexWrap: "wrap",
              }}
            >
              {PRODUCTS.map(({ value, label, emoji }) => {
                const isSelected = selectedProduct === value;
                return (
                  <button
                    key={value}
                    onClick={() => setSelectedProduct(value)}
                    style={{
                      background: isSelected
                        ? "var(--burdeos)"
                        : "var(--bg-raised)",
                      color: isSelected ? "#ffffff" : "var(--burdeos)",
                      border: isSelected
                        ? "1.5px solid var(--burdeos)"
                        : "1.5px solid var(--border-strong)",
                      borderRadius: "var(--r-pill)",
                      padding: "10px 24px",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      transition: "all 150ms",
                    }}
                  >
                    {emoji} {label}
                  </button>
                );
              })}
            </div>

            {/* Sub-component area */}
            <div style={{ marginTop: "1.5rem" }}>
              {selectedProduct === "cake" && <Cakeprice />}
              {selectedProduct === "snack" && <Snackprice />}
              {selectedProduct === "cupcake" && <Cupcakeprice />}
            </div>
          </>
        )}
      </main>

      <WebFooter />
    </div>
  );
}
