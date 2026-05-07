import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

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

export default function GalletasConfirmacion() {
  const router = useRouter();
  const { session_id, orden } = router.query;

  const [pedido, setPedido]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [pollingDone, setPollingDone] = useState(false);

  /* ── Find numeroOrden either from `orden` query param or by polling /checkout/session-status ── */
  useEffect(() => {
    if (!router.isReady) return;

    let timeoutId;
    let cancelled = false;

    async function fetchPedido(numeroOrden) {
      try {
        const res = await axios.get(`${API_BASE}/galletaPedidos/orden/${numeroOrden}`);
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
      // If they came in with ?orden=GNY-... directly we just use that
      if (orden) {
        await fetchPedido(orden);
        return;
      }

      // Otherwise we have a Stripe session_id — find our pedido by querying with retries
      // because the webhook might be a few seconds behind the redirect.
      if (!session_id) {
        setError("Falta información del pago.");
        setLoading(false);
        return;
      }

      // Try to clear the cart now that we have a session_id (payment was attempted)
      try { localStorage.removeItem("galletasCart"); } catch {}

      // Poll our backend trying to find the pedido by session_id is not possible publicly,
      // but the user gets a numeroOrden from the embedded checkout step. We can store it
      // there as fallback. Until then we show a generic success while polling.
      // For MVP: read the lastOrderNumber from localStorage (set by checkout page).
      let stored = "";
      try { stored = localStorage.getItem("lastGalletaOrden") || ""; } catch {}
      if (stored) {
        await fetchPedido(stored);
      } else {
        setError("No encontramos referencia al pedido. Te llegará un correo con tu número de orden.");
        setLoading(false);
      }
    }

    init();

    return () => { cancelled = true; clearTimeout(timeoutId); };
  }, [router.isReady, session_id, orden]);

  /* ── Build WhatsApp link with order number ── */
  const waLink = pedido
    ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hola, quiero confirmar mi pedido ${pedido.numeroOrden}.`)}`
    : `https://wa.me/${WA_NUMBER}`;

  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)", display: "flex", flexDirection: "column" }}>
      <div aria-hidden="true" className="ru-pattern-sprinkle fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.06 }} />
      <NavbarAdmin />

      <main className="flex-grow relative z-10" style={{ marginTop: "5rem", padding: "1.5rem 1.25rem 3rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          {/* Hero card */}
          <div style={{ background: "linear-gradient(135deg,#FFC3C9,#FFA1AA)", borderRadius: "var(--r-2xl)", padding: "2.5rem 1.5rem", textAlign: "center", color: "#fff", boxShadow: "var(--shadow-md)", marginBottom: "1rem", position: "relative", overflow: "hidden" }}>
            <div aria-hidden="true" className="ru-pattern-sprinkle absolute inset-0" style={{ opacity: 0.2 }} />
            <div style={{ fontSize: "3.5rem", marginBottom: 6, position: "relative" }}>🎉</div>
            <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, opacity: 0.95, position: "relative" }}>Pago confirmado</p>
            <h1 className={sofia.className} style={{ fontSize: "clamp(2rem,5vw,3rem)", marginTop: 4, lineHeight: 1.1, position: "relative" }}>¡Gracias por tu pedido!</h1>
          </div>

          {loading ? (
            <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
              Cargando detalle de tu pedido…
            </div>
          ) : error ? (
            <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "1.5rem", textAlign: "center" }}>
              <p style={{ color: "var(--burdeos)", fontWeight: 700, marginBottom: 6 }}>Tu pago se procesó correctamente</p>
              <p style={{ color: "var(--text-soft)", fontSize: "0.88rem", marginBottom: "1rem" }}>{error}</p>
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <button style={{ padding: "12px 24px", borderRadius: "var(--r-pill)", background: "#25D366", color: "#fff", border: "none", fontWeight: 800, cursor: "pointer" }}>💬 Contactar por WhatsApp</button>
              </a>
            </div>
          ) : pedido ? (
            <>
              {/* Order number */}
              <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "1.25rem 1.5rem", marginBottom: "1rem", borderLeft: "5px solid var(--rosa)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Tu número de orden</p>
                  <p className={sofia.className} style={{ fontSize: "1.5rem", color: "var(--burdeos)", letterSpacing: "0.04em", fontFamily: "monospace", marginTop: 4 }}>
                    {pedido.numeroOrden}
                  </p>
                </div>
                <button
                  onClick={() => navigator.clipboard?.writeText(pedido.numeroOrden)}
                  style={{ padding: "8px 14px", background: "var(--bg-sunken)", border: "1px solid var(--border-color)", borderRadius: "var(--r-pill)", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", color: "var(--burdeos)" }}
                >
                  📋 Copiar
                </button>
              </div>

              {/* Delivery info */}
              <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "1.25rem 1.5rem", marginBottom: "1rem" }}>
                {pedido.tipoEntrega === "envio" ? (
                  <>
                    <p style={{ fontSize: "0.72rem", color: "var(--rosa)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 6 }}>🚗 Envío a domicilio</p>
                    <p style={{ color: "var(--burdeos)", fontWeight: 700 }}>{pedido.direccionEnvio?.calleNumero}</p>
                    <p style={{ color: "var(--text-soft)", fontSize: "0.88rem" }}>Col. {pedido.direccionEnvio?.colonia}, {pedido.direccionEnvio?.municipio}</p>
                    {pedido.direccionEnvio?.referencias && (
                      <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 4 }}>Ref: {pedido.direccionEnvio.referencias}</p>
                    )}
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: "0.72rem", color: "var(--rosa)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 6 }}>🏪 Recoger en sucursal</p>
                    <p style={{ color: "var(--burdeos)", fontWeight: 700 }}>{STORE_ADDRESS}</p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: 4 }}>Te confirmaremos por WhatsApp el punto exacto.</p>
                  </>
                )}
                <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px dashed var(--border-color)" }}>
                  <p style={{ color: "var(--burdeos)", fontWeight: 700, fontSize: "1rem" }}>{formatearFechaLarga(pedido.fechaEntrega)}</p>
                  <p style={{ color: "var(--text-soft)", fontSize: "0.88rem" }}>Hora: <strong>{pedido.horaEntrega}</strong></p>
                </div>
              </div>

              {/* Detail */}
              <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "1.25rem 1.5rem", marginBottom: "1rem" }}>
                <h3 className={sofia.className} style={{ fontSize: "1.2rem", color: "var(--burdeos)", marginBottom: "0.75rem" }}>Detalle del pedido</h3>
                {pedido.cajas?.map((caja, i) => (
                  <div key={i} style={{ marginBottom: "0.75rem", paddingBottom: "0.75rem", borderBottom: i < pedido.cajas.length - 1 ? "1px dashed var(--border-color)" : "none" }}>
                    <div style={{ fontWeight: 800, fontSize: "0.72rem", color: "var(--rosa)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                      Caja {i + 1} — {caja.tamano === "12" ? "Docena" : "Media docena"}
                    </div>
                    {caja.items.map((it, j) => (
                      <div key={j} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-soft)", padding: "1px 0" }}>
                        <span>{it.cantidad}× {it.saborNombre}</span>
                        <span>${(it.cantidad * it.precioUnitario).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                ))}
                <table style={{ width: "100%", marginTop: 6 }}>
                  <tbody>
                    <tr><td style={{ padding: "2px 0", color: "var(--text-soft)", fontSize: "0.85rem" }}>Productos</td><td style={{ padding: "2px 0", textAlign: "right", color: "var(--burdeos)", fontWeight: 600 }}>${pedido.subtotalProductos}</td></tr>
                    {pedido.costoEnvio > 0 && (
                      <tr><td style={{ padding: "2px 0", color: "var(--text-soft)", fontSize: "0.85rem" }}>Envío</td><td style={{ padding: "2px 0", textAlign: "right", color: "var(--burdeos)", fontWeight: 600 }}>${pedido.costoEnvio}</td></tr>
                    )}
                    <tr><td style={{ padding: "8px 0 0", borderTop: "2px solid var(--border-color)", color: "var(--burdeos)", fontWeight: 800 }}>Total pagado</td><td style={{ padding: "8px 0 0", borderTop: "2px solid var(--border-color)", textAlign: "right", color: "var(--burdeos)", fontWeight: 800, fontSize: "1.15rem" }}>${pedido.total}</td></tr>
                  </tbody>
                </table>
              </div>

              {/* Policy */}
              <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "1.25rem 1.5rem", marginBottom: "1rem", fontSize: "0.85rem", color: "var(--text-soft)", lineHeight: 1.65 }}>
                <h3 className={sofia.className} style={{ fontSize: "1.1rem", color: "var(--burdeos)", marginBottom: 6 }}>Información importante</h3>
                <ul style={{ paddingLeft: 18, margin: 0 }}>
                  <li>Las galletas se hornean el mismo día de tu entrega para que lleguen frescas.</li>
                  <li>Cancelaciones <strong>sin cargo hasta 24 h antes</strong>. Después no son reembolsables.</li>
                  <li>Para reclamos de calidad, contáctanos por WhatsApp en las <strong>2 horas siguientes</strong> con foto del producto. Es indispensable que el producto sea devuelto físicamente para procesar reembolso o reposición.</li>
                </ul>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ flex: 1 }}>
                  <button style={{ width: "100%", padding: "14px 20px", borderRadius: "var(--r-pill)", background: "#25D366", color: "#fff", border: "none", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer", boxShadow: "var(--shadow-sm)" }}>
                    💬 Confirmar por WhatsApp
                  </button>
                </a>
                <Link href="/enduser/galletas-ny" style={{ flex: 1 }}>
                  <button style={{ width: "100%", padding: "14px 20px", borderRadius: "var(--r-pill)", background: "transparent", color: "var(--burdeos)", border: "2px solid var(--burdeos)", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer" }}>
                    Ordenar otra caja
                  </button>
                </Link>
              </div>

              <p style={{ marginTop: "1rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                Recibirás un correo de confirmación con todos estos detalles a <strong>{pedido.cliente?.nombre}</strong>.
              </p>
            </>
          ) : null}
        </div>
      </main>

      <WebFooter />
    </div>
  );
}
