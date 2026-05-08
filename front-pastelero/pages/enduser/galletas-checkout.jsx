import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import axios from "axios";
import Swal from "sweetalert2";
import NavbarAdmin from "@/src/components/navbar";
import WebFooter from "@/src/components/WebFooter";
import { Sofia as SofiaFont, Nunito as NunitoFont } from "next/font/google";

const sofia  = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });

const API_BASE      = process.env.NEXT_PUBLIC_API_BASE_URL;
const STRIPE_PUB    = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
const stripePromise = STRIPE_PUB ? loadStripe(STRIPE_PUB) : null;

const ZMG_MUNICIPIOS = [
  "Guadalajara", "Zapopan", "San Pedro Tlaquepaque", "Tonalá",
  "Tlajomulco de Zúñiga", "El Salto", "Juanacatlán",
  "Ixtlahuacán de los Membrillos", "Acatlán de Juárez",
];

const SLOTS_RECOGIDA = [
  "10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30",
  "14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30",
  "18:00","18:30",
];
const SLOTS_ENVIO = [
  "11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30",
];

/* ─── Helpers ────────────────────────────────────────────────── */
function getMinDateString() {
  // 72h from now → date string YYYY-MM-DD (in local TZ)
  const d = new Date(Date.now() + 72 * 60 * 60 * 1000);
  // bump to Monday if it lands on Sunday
  if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function isSunday(dateString) {
  if (!dateString) return false;
  // Parse as local-date (avoid TZ shift)
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(y, m - 1, d).getDay() === 0;
}

/* ─── Component ──────────────────────────────────────────────── */
export default function GalletasCheckout() {
  const router = useRouter();

  /* ── Cart from localStorage ── */
  const [boxes, setBoxes] = useState([]);
  const [sabores, setSabores] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  /* ── Form state ── */
  const [cliente, setCliente] = useState({ nombre: "", email: "", telefono: "" });
  const [tipoEntrega, setTipoEntrega] = useState("recogida"); // default: pickup (no login required)
  const [fecha, setFecha] = useState("");
  const [hora, setHora]   = useState("");
  const [direccion, setDireccion] = useState({
    calleNumero: "", colonia: "", municipio: "", referencias: "",
  });
  const [notas, setNotas] = useState("");

  /* ── Shipping cost (from API) ── */
  const [zonaInfo, setZonaInfo]   = useState(null);
  const [zonaLoading, setZonaLoading] = useState(false);

  /* ── Stripe embedded session ── */
  const [clientSecret, setClientSecret] = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [orderInfo, setOrderInfo]       = useState(null); // { numeroOrden, total }

  /* ── Load cart from localStorage on mount ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("galletasCart");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.boxes) && parsed.boxes.length) {
          setBoxes(parsed.boxes);
        }
      }
    } catch {}
    setCartLoaded(true);
  }, []);

  /* ── Load sabores (for displaying names + prices) ── */
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/galletaSabores`);
        setSabores(res.data.data || []);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const saboresMap = useMemo(
    () => Object.fromEntries(sabores.map(s => [s.slug, s])),
    [sabores]
  );

  /* ── Compute box totals ── */
  const cajasResumen = useMemo(() => {
    return boxes.map((box) => {
      const items = Object.entries(box.quantities || {})
        .filter(([_, q]) => q > 0)
        .map(([slug, qty]) => ({ slug, qty, sabor: saboresMap[slug] }));
      const filled = items.reduce((s, it) => s + it.qty, 0);
      const subtotal = items.reduce((s, it) => s + (it.sabor?.precio || 0) * it.qty, 0);
      // Sin descuento automático — pendiente código promocional vía admin.
      const desc = 0;
      return { ...box, items, filled, subtotal, descuento: desc, total: subtotal - desc };
    });
  }, [boxes, saboresMap]);

  const subtotalProductos = cajasResumen.reduce((s, c) => s + c.total, 0);
  const costoEnvio        = tipoEntrega === "envio" ? (zonaInfo?.costo || 0) : 0;
  const grandTotal        = subtotalProductos + costoEnvio;

  /* ── Re-cotize shipping when address changes (debounced) ── */
  useEffect(() => {
    if (tipoEntrega !== "envio") {
      setZonaInfo(null);
      return;
    }
    if (!direccion.colonia && !direccion.municipio) return;
    setZonaLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await axios.post(`${API_BASE}/galletaPedidos/cotizar-envio`, {
          colonia:   direccion.colonia,
          municipio: direccion.municipio,
        });
        setZonaInfo(res.data.data);
      } catch (e) {
        setZonaInfo(null);
      } finally {
        setZonaLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [direccion.colonia, direccion.municipio, tipoEntrega]);

  /* ── Available time slots ── */
  const slotsDisponibles = tipoEntrega === "envio" ? SLOTS_ENVIO : SLOTS_RECOGIDA;
  const minDate = getMinDateString();

  /* ── Form validation ── */
  const formValido = useMemo(() => {
    if (!cliente.nombre.trim() || !cliente.email.trim() || !cliente.telefono.trim()) return false;
    if (!fecha || !hora) return false;
    if (isSunday(fecha)) return false;
    if (tipoEntrega === "envio") {
      if (!direccion.calleNumero.trim() || !direccion.colonia.trim() || !direccion.municipio.trim()) return false;
      if (!zonaInfo) return false;
    }
    if (!boxes.length || !boxes.every(b => {
      const f = Object.values(b.quantities).reduce((x,v) => x+v, 0);
      return f === (b.size === "6" ? 6 : 12);
    })) return false;
    return true;
  }, [cliente, fecha, hora, tipoEntrega, direccion, zonaInfo, boxes]);

  /* ── Submit → create checkout session ── */
  const handleProceedToPayment = async (e) => {
    e?.preventDefault();
    if (!formValido) return;
    setSubmitting(true);

    // Build cart payload — server validates again
    const cajasPayload = boxes.map((b) => ({
      tamano: b.size,
      items: Object.entries(b.quantities)
        .filter(([_, q]) => q > 0)
        .map(([saborSlug, cantidad]) => ({ saborSlug, cantidad })),
    }));

    try {
      const res = await axios.post(`${API_BASE}/galletaPedidos/checkout`, {
        cliente,
        cajas: cajasPayload,
        tipoEntrega,
        fechaEntrega: fecha,
        horaEntrega: hora,
        direccionEnvio: tipoEntrega === "envio" ? direccion : undefined,
        notas,
      });
      setClientSecret(res.data.clientSecret);
      setOrderInfo({ numeroOrden: res.data.numeroOrden, total: res.data.total });
      // Persist for the confirmation page (it doesn't have direct access to session_id)
      try { localStorage.setItem("lastGalletaOrden", res.data.numeroOrden); } catch {}
      // Scroll to embedded checkout
      setTimeout(() => {
        document.getElementById("stripe-embedded")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "No se pudo continuar",
        text: err.response?.data?.message || err.message,
        background: "#fff1f2", color: "#540027",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Empty cart state ── */
  if (cartLoaded && (!boxes.length || cajasResumen.every(c => c.filled === 0))) {
    return (
      <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)", display: "flex", flexDirection: "column" }}>
        <NavbarAdmin />
        <main className="flex-grow" style={{ marginTop: "5rem", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.25rem" }}>
          <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-2xl)", padding: "3rem 2rem", textAlign: "center", maxWidth: 480 }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "0.75rem" }}>🛒</div>
            <h1 className={sofia.className} style={{ fontSize: "2rem", color: "var(--burdeos)", marginBottom: 6 }}>Tu carrito está vacío</h1>
            <p style={{ color: "var(--text-soft)", marginBottom: "1.5rem" }}>Vuelve a la página de Galletas NY y arma tu caja antes de continuar al pago.</p>
            <Link href="/enduser/galletas-ny">
              <button style={{ padding: "12px 26px", borderRadius: "var(--r-pill)", background: "var(--burdeos)", color: "#fff", border: "none", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer" }}>
                ← Volver a Galletas NY
              </button>
            </Link>
          </div>
        </main>
        <WebFooter />
      </div>
    );
  }

  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)", display: "flex", flexDirection: "column" }}>
      <style>{`
        @media (max-width: 900px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
          .checkout-summary { position: relative !important; top: auto !important; }
        }
      `}</style>
      <div aria-hidden="true" className="ru-pattern-sprinkle fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.06 }} />
      <NavbarAdmin />

      <main className="flex-grow relative z-10" style={{ marginTop: "4rem" }}>
        {/* Header */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.25rem 0" }}>
          <Link href="/enduser/galletas-ny" style={{ color: "var(--text-soft)", fontSize: "0.85rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            ← Editar caja
          </Link>
          <h1 className={sofia.className} style={{ fontSize: "clamp(2rem,5vw,3.25rem)", color: "var(--burdeos)", marginTop: "0.5rem", lineHeight: 1 }}>Finaliza tu pedido</h1>
          <p style={{ color: "var(--text-soft)", fontSize: "0.9rem", maxWidth: "55ch", marginTop: 6 }}>
            Completa tus datos, elige fecha y forma de entrega. Pagas el total al momento.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="checkout-grid" style={{ maxWidth: 1100, margin: "1.5rem auto 0", padding: "0 1.25rem 3rem", display: "grid", gridTemplateColumns: "1fr 360px", gap: "1.5rem", alignItems: "start" }}>

          {/* ─── LEFT: form ─── */}
          <form onSubmit={handleProceedToPayment} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Step 1 — Cliente */}
            <Section number="1" title="Tus datos">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <Field label="Nombre completo *" full>
                  <input type="text" required value={cliente.nombre}
                    onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
                    style={inputStyle} />
                </Field>
                <Field label="Email *">
                  <input type="email" required value={cliente.email}
                    onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
                    style={inputStyle} />
                </Field>
                <Field label="Teléfono *">
                  <input type="tel" required value={cliente.telefono}
                    onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
                    placeholder="33 1234 5678"
                    style={inputStyle} />
                </Field>
              </div>
            </Section>

            {/* Step 2 — Tipo de entrega */}
            <Section number="2" title="¿Cómo quieres recibirlo?">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <DeliveryOption
                  active={tipoEntrega === "recogida"}
                  onClick={() => setTipoEntrega("recogida")}
                  emoji="🏪"
                  title="Recoger en sucursal"
                  desc="Sin costo · 10:00 a 18:30"
                  badge="Default"
                />
                <DeliveryOption
                  active={tipoEntrega === "envio"}
                  onClick={() => setTipoEntrega("envio")}
                  emoji="🚗"
                  title="Envío a domicilio"
                  desc="Cotización en vivo · 11:00 a 17:30"
                  badge="Solo Zona Metro GDL"
                />
              </div>

              {/* Address (only if delivery) */}
              {tipoEntrega === "envio" && (
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px dashed var(--border-color)" }}>
                  <p style={{ fontSize: "0.78rem", color: "var(--burdeos)", fontWeight: 700, marginBottom: 8, display: "inline-flex", alignItems: "center", gap: 6, background: "#fff1f2", padding: "5px 10px", borderRadius: 6 }}>
                    📍 Solo entregas dentro de Zona Metropolitana de Guadalajara
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <Field label="Calle y número *" full>
                      <input type="text" value={direccion.calleNumero}
                        onChange={(e) => setDireccion({ ...direccion, calleNumero: e.target.value })}
                        placeholder="Ej. Av. Patria 1234" style={inputStyle} />
                    </Field>
                    <Field label="Colonia *">
                      <input type="text" value={direccion.colonia}
                        onChange={(e) => setDireccion({ ...direccion, colonia: e.target.value })}
                        placeholder="Ej. Providencia" style={inputStyle} />
                    </Field>
                    <Field label="Municipio *">
                      <select value={direccion.municipio}
                        onChange={(e) => setDireccion({ ...direccion, municipio: e.target.value })}
                        style={inputStyle}>
                        <option value="">Selecciona…</option>
                        {ZMG_MUNICIPIOS.map((m) => <option key={m}>{m}</option>)}
                      </select>
                    </Field>
                    <Field label="Referencias (opcional)" full>
                      <input type="text" value={direccion.referencias}
                        onChange={(e) => setDireccion({ ...direccion, referencias: e.target.value })}
                        placeholder="Edificio gris, frente al parque…" style={inputStyle} />
                    </Field>
                  </div>

                  {/* Quote display */}
                  {zonaLoading ? (
                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>Calculando envío…</p>
                  ) : zonaInfo ? (
                    <div style={{ marginTop: "0.75rem", background: "var(--bg-sunken)", padding: "10px 14px", borderRadius: "var(--r-md)", border: "1px dashed var(--rosa)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, color: "var(--text-muted)" }}>Envío estimado</p>
                        <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--burdeos)", marginTop: 2 }}>{zonaInfo.nombre}</p>
                        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Tiempo estimado: {zonaInfo.tiempo}</p>
                      </div>
                      <span className={sofia.className} style={{ fontSize: "1.5rem", color: "var(--burdeos)" }}>${zonaInfo.costo}</span>
                    </div>
                  ) : null}
                </div>
              )}
            </Section>

            {/* Step 3 — Fecha + hora */}
            <Section number="3" title="¿Cuándo lo necesitas?">
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 8 }}>
                Mínimo 72 horas de anticipación. Lunes a Sábado.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <Field label="Fecha de entrega *">
                  <input type="date" required min={minDate} value={fecha}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v && isSunday(v)) {
                        Swal.fire({ icon: "info", title: "Día no disponible", text: "No realizamos entregas los domingos.", timer: 2200, showConfirmButton: false });
                        setFecha("");
                      } else {
                        setFecha(v);
                      }
                    }}
                    style={inputStyle} />
                </Field>
                <Field label="Hora de entrega *">
                  <select required value={hora} onChange={(e) => setHora(e.target.value)} style={inputStyle}>
                    <option value="">Selecciona…</option>
                    {slotsDisponibles.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
            </Section>

            {/* Step 4 — Notas */}
            <Section number="4" title="Notas (opcional)">
              <textarea
                placeholder="¿Es para regalo? ¿Alguna alergia? Instrucciones especiales…"
                rows={3}
                maxLength={500}
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
              />
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 4, textAlign: "right" }}>{notas.length}/500</p>
            </Section>

            {!clientSecret && (
              <button
                type="submit"
                disabled={!formValido || submitting}
                style={{ padding: "14px 28px", borderRadius: "var(--r-pill)", background: (!formValido || submitting) ? "var(--border-strong)" : "var(--burdeos)", color: "#fff", border: "none", fontWeight: 800, fontSize: "0.95rem", cursor: (!formValido || submitting) ? "not-allowed" : "pointer", boxShadow: "var(--shadow-md)", marginTop: "0.5rem" }}
              >
                {submitting ? "Procesando…" : `Continuar al pago — $${grandTotal}`}
              </button>
            )}
          </form>

          {/* ─── RIGHT: order summary ─── */}
          <aside className="checkout-summary" style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "1.25rem", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-color)" }}>
              <h3 className={sofia.className} style={{ fontSize: "1.4rem", color: "var(--burdeos)", marginBottom: "0.75rem", lineHeight: 1 }}>Tu pedido</h3>

              {cajasResumen.map((caja, i) => (
                <div key={i} style={{ marginBottom: "0.75rem", paddingBottom: "0.75rem", borderBottom: i < cajasResumen.length - 1 ? "1px dashed var(--border-color)" : "none" }}>
                  <div style={{ fontWeight: 800, fontSize: "0.72rem", color: "var(--rosa)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                    Caja {i + 1} — {caja.size === "6" ? "Media docena" : "Docena"} ({caja.filled})
                  </div>
                  {caja.items.map((it) => (
                    <div key={it.slug} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--text-soft)", padding: "1px 0" }}>
                      <span>{it.qty}× {it.sabor?.nombre || it.slug}</span>
                      <span>${(it.qty * (it.sabor?.precio || 0)).toFixed(0)}</span>
                    </div>
                  ))}
                  {caja.descuento > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--menta-deep)", padding: "1px 0" }}>
                      <span>Descuento</span><span>−${caja.descuento}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: 700, color: "var(--burdeos)", marginTop: 2 }}>
                    <span>Subtotal</span><span>${caja.total}</span>
                  </div>
                </div>
              ))}

              <table style={{ width: "100%", marginTop: "0.5rem" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "3px 0", color: "var(--text-soft)", fontSize: "0.85rem" }}>Productos</td>
                    <td style={{ padding: "3px 0", textAlign: "right", color: "var(--burdeos)", fontWeight: 700 }}>${subtotalProductos}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "3px 0", color: "var(--text-soft)", fontSize: "0.85rem" }}>Envío</td>
                    <td style={{ padding: "3px 0", textAlign: "right", color: "var(--burdeos)", fontWeight: 700 }}>
                      {tipoEntrega === "recogida" ? "Sin costo" : (zonaInfo ? `$${zonaInfo.costo}` : "—")}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 0 0", borderTop: "2px solid var(--border-color)", color: "var(--burdeos)", fontWeight: 800 }}>Total</td>
                    <td style={{ padding: "8px 0 0", borderTop: "2px solid var(--border-color)", textAlign: "right", color: "var(--burdeos)", fontWeight: 800, fontSize: "1.25rem" }}>${grandTotal}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Policy info */}
            <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-md)", padding: "0.85rem 1rem", fontSize: "0.78rem", color: "var(--text-soft)", border: "1px solid var(--border-color)", lineHeight: 1.55 }}>
              <strong style={{ color: "var(--burdeos)" }}>📅 Política:</strong> Cancelaciones sin cargo hasta 24 h antes. Después no son reembolsables — las galletas se hornean el día de tu entrega.
            </div>
          </aside>
        </div>

        {/* ── Stripe Embedded Checkout ── */}
        {clientSecret && (
          <div id="stripe-embedded" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.25rem 4rem" }}>
            <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "1.5rem", boxShadow: "var(--shadow-md)" }}>
              <h2 className={sofia.className} style={{ fontSize: "1.6rem", color: "var(--burdeos)", marginBottom: 6 }}>Pago seguro</h2>
              {orderInfo && (
                <p style={{ color: "var(--text-soft)", fontSize: "0.85rem", marginBottom: "1rem" }}>
                  Orden <code style={{ background: "#fff1f2", padding: "2px 8px", borderRadius: 4, color: "var(--burdeos)" }}>{orderInfo.numeroOrden}</code> · Total ${orderInfo.total}
                </p>
              )}
              {stripePromise ? (
                <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              ) : (
                <p style={{ color: "var(--rosa)" }}>Stripe no está configurado. Falta NEXT_PUBLIC_STRIPE_PUBLIC_KEY.</p>
              )}
            </div>
          </div>
        )}
      </main>

      <WebFooter />
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */
function Section({ number, title, children }) {
  return (
    <div style={{ background: "var(--bg-raised)", borderRadius: "var(--r-xl)", padding: "1.25rem 1.5rem", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-color)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem" }}>
        <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--rosa)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.78rem", flexShrink: 0 }}>{number}</span>
        <h2 className={sofia.className} style={{ fontSize: "1.3rem", color: "var(--burdeos)", lineHeight: 1 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children, full }) {
  return (
    <label style={{ gridColumn: full ? "1 / -1" : "auto" }}>
      <span style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "var(--text-soft)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
      {children}
    </label>
  );
}

function DeliveryOption({ active, onClick, emoji, title, desc, badge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "14px 16px",
        borderRadius: "var(--r-md)",
        border: `2px solid ${active ? "var(--burdeos)" : "var(--border-color)"}`,
        background: active ? "#fff1f2" : "var(--bg-sunken)",
        color: "var(--burdeos)",
        textAlign: "left",
        cursor: "pointer",
        fontFamily: "var(--font-nunito)",
        transition: "all 150ms",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <span style={{ fontSize: "1.4rem" }}>{emoji}</span>
        {badge && <span style={{ fontSize: "0.6rem", padding: "2px 6px", borderRadius: "var(--r-pill)", background: active ? "var(--burdeos)" : "var(--rosa-4)", color: active ? "#fff" : "var(--burdeos)", fontWeight: 700 }}>{badge}</span>}
      </div>
      <p style={{ fontSize: "0.92rem", fontWeight: 800, marginTop: 6 }}>{title}</p>
      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{desc}</p>
    </button>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1.5px solid var(--border-color)",
  borderRadius: "var(--r-md)",
  fontSize: "0.9rem",
  fontFamily: "var(--font-nunito)",
  background: "#fff",
  color: "var(--burdeos)",
  outline: "none",
  boxSizing: "border-box",
};
