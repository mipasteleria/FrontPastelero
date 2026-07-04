import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";
import { clearCart } from "@/src/lib/postresCart";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

const API_BASE      = process.env.NEXT_PUBLIC_API_BASE_URL;
const WA_NUMBER     = "523741025036";
const STORE_ADDRESS = "Calle Bogotá 2866a, Col. Providencia, Guadalajara, Jal.";

function formatearFechaLarga(d) {
  if (!d) return "";
  const dias  = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const f = new Date(d);
  return `${dias[f.getDay()]} ${f.getDate()} de ${meses[f.getMonth()]}, ${f.getFullYear()}`;
}

export default function PostresConfirmacion() {
  const router = useRouter();
  const { session_id, orden } = router.query;

  const [pedido, setPedido]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!router.isReady) return;
    let cancelled = false;

    async function fetchPedido(numeroOrden) {
      try {
        let email = "";
        try { email = localStorage.getItem("lastPostreEmail") || ""; } catch {}
        const res = await axios.get(`${API_BASE}/postrePedidos/orden/${numeroOrden}`, { params: { email } });
        if (!cancelled) {
          setPedido(res.data.data);
          setError("");
        }
      } catch (err) {
        if (!cancelled) setError("No pudimos cargar el detalle del pedido.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function init() {
      if (orden) {
        await fetchPedido(orden);
        return;
      }
      if (!session_id) {
        setError("Falta información del pago.");
        setLoading(false);
        return;
      }
      // El carrito puede limpiarse cuando llegamos aquí — el pago ya se intentó.
      try { clearCart(); } catch {}

      let stored = "";
      try { stored = localStorage.getItem("lastPostreOrden") || ""; } catch {}
      if (stored) {
        await fetchPedido(stored);
      } else {
        setError("No encontramos referencia al pedido. Te llegará un correo con tu número de orden.");
        setLoading(false);
      }
    }

    init();
    return () => { cancelled = true; };
  }, [router.isReady, session_id, orden]);

  const waLink = pedido
    ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hola, quiero confirmar mi pedido ${pedido.numeroOrden}.`)}`
    : `https://wa.me/${WA_NUMBER}`;

  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)", display: "flex", flexDirection: "column" }}>
      <NavbarAdmin />

      <main className="flex-grow" style={{ marginTop: "4rem", padding: "2rem 1.25rem 4rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {loading ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "3rem" }}>Cargando tu pedido…</p>
          ) : error ? (
            <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-2xl)", padding: "2rem", textAlign: "center" }}>
              <h1 className={sofia.className} style={{ fontSize: "2rem", color: "var(--burdeos)", marginBottom: 8 }}>¡Pago recibido!</h1>
              <p style={{ color: "var(--text-soft)", marginBottom: "1.25rem" }}>{error}</p>
              <Link href="/enduser/postres">
                <button style={{ padding: "12px 26px", borderRadius: "var(--r-pill)", background: "var(--burdeos)", color: "#fff", border: "none", fontWeight: 800, cursor: "pointer" }}>
                  Ver más postres
                </button>
              </Link>
            </div>
          ) : pedido ? (
            <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-2xl)", padding: "2rem", boxShadow: "var(--shadow-md)" }}>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>🎂</div>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--rosa)" }}>Top postres</p>
                <h1 className={sofia.className} style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--burdeos)", lineHeight: 1, marginTop: 6 }}>
                  ¡Pago confirmado!
                </h1>
                <p style={{ color: "var(--text-soft)", marginTop: 8 }}>
                  Gracias <strong>{pedido.cliente?.nombre}</strong>, te enviamos el detalle a tu correo.
                </p>
              </div>

              <div style={{ background: "#fff1f2", borderLeft: "4px solid var(--rosa)", borderRadius: 8, padding: "12px 16px", marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Número de orden</p>
                <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--burdeos)", fontFamily: "monospace", letterSpacing: "0.04em", marginTop: 4 }}>
                  {pedido.numeroOrden}
                </p>
              </div>

              <h3 className={sofia.className} style={{ fontSize: "1.4rem", color: "var(--burdeos)", marginBottom: 8 }}>Tu pedido</h3>
              <div style={{ marginBottom: "1.25rem" }}>
                {pedido.items?.map((it, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#fff1f2", borderRadius: 8, marginBottom: 6 }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, color: "var(--burdeos)" }}>{it.cantidad}× {it.nombre}</p>
                      <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-muted)" }}>${it.precioUnitario} c/u</p>
                    </div>
                    <span style={{ fontWeight: 700, color: "var(--burdeos)" }}>${it.subtotal}</span>
                  </div>
                ))}
              </div>

              <div style={{ paddingTop: "1rem", borderTop: "2px solid var(--border-color)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-soft)", fontSize: "0.88rem" }}>
                  <span>Subtotal</span><span>${pedido.subtotalProductos}</span>
                </div>
                {pedido.costoEnvio > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-soft)", fontSize: "0.88rem", marginTop: 4 }}>
                    <span>Envío</span><span>${pedido.costoEnvio}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px", marginTop: "10px", borderTop: "1px solid var(--border-color)" }}>
                  <span style={{ fontWeight: 800, color: "var(--burdeos)" }}>Total pagado</span>
                  <span className={sofia.className} style={{ fontSize: "1.8rem", color: "var(--burdeos)" }}>${pedido.total}</span>
                </div>
              </div>

              <h3 className={sofia.className} style={{ fontSize: "1.2rem", color: "var(--burdeos)", marginTop: "1.5rem", marginBottom: 8 }}>
                {pedido.tipoEntrega === "envio" ? "Tu envío" : "Tu recogida"}
              </h3>
              <div style={{ background: "#fff", border: "1px solid var(--border-color)", borderRadius: 10, padding: "12px 14px" }}>
                {pedido.tipoEntrega === "envio" ? (
                  <>
                    <p style={{ margin: 0, color: "var(--color-text)" }}>{pedido.direccionEnvio?.calleNumero}</p>
                    <p style={{ margin: 0, color: "var(--color-text)" }}>Col. {pedido.direccionEnvio?.colonia}, {pedido.direccionEnvio?.municipio}</p>
                    {pedido.direccionEnvio?.referencias && <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-muted)" }}>Ref: {pedido.direccionEnvio.referencias}</p>}
                  </>
                ) : (
                  <p style={{ margin: 0, color: "var(--color-text)" }}>{STORE_ADDRESS}</p>
                )}
                <p style={{ marginTop: 6, fontWeight: 700, color: "var(--burdeos)" }}>{formatearFechaLarga(pedido.fechaEntrega)} · {pedido.horaEntrega} hrs</p>
              </div>

              <div style={{ textAlign: "center", marginTop: "1.75rem" }}>
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  <button style={{ padding: "12px 28px", borderRadius: "var(--r-pill)", background: "#25D366", color: "#fff", border: "none", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
                    💬 Contactar por WhatsApp
                  </button>
                </a>
              </div>

              <p style={{ textAlign: "center", marginTop: "1.25rem", color: "var(--text-muted)", fontSize: "0.78rem" }}>
                Pastelería El Ruiseñor · {STORE_ADDRESS}
              </p>
            </div>
          ) : null}
        </div>
      </main>

      <WebFooter />
    </div>
  );
}
