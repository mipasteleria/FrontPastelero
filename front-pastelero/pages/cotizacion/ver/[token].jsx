import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Swal from "sweetalert2";
import { Nunito as NunitoFont, Sofia as SofiaFont } from "next/font/google";
import { useAuth } from "@/src/context";

const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "700", "800"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const PRODUCTO_NOUN = { pastel: "Pastel", cupcake: "Cupcakes", "mesa-postres": "Mesa de postres" };

/**
 * Vista pública de una cotización (enlace de invitado), con el formato del
 * template de Pastelería el Ruiseñor: encabezado, diseño, detalles del
 * pedido, condiciones, datos bancarios y acciones de pago.
 */
export default function VerCotizacion() {
  const router = useRouter();
  const { token } = router.query;
  const { isLoggedIn } = useAuth();

  const [cot, setCot] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [pagando, setPagando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    if (router.query.pago === "ok") {
      Swal.fire({ icon: "success", title: "¡Pago recibido!", text: "Tu anticipo fue procesado. ¡Gracias!", confirmButtonColor: "#FF6F7D", background: "#fff1f2", color: "#540027" });
    } else if (router.query.pago === "cancelado") {
      Swal.fire({ icon: "info", title: "Pago cancelado", text: "Puedes intentarlo de nuevo cuando quieras.", confirmButtonColor: "#FF6F7D" });
    }
  }, [router.query.pago]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/cotizacion-personalizada/public/${token}`)
      .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
      .then(({ ok, j }) => { if (!ok) throw new Error(j.message || "No encontrada"); setCot(j.data); })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [token]);

  const pagarEnLinea = async (paymentOption = "anticipo") => {
    setPagando(true);
    try {
      const r = await fetch(`${API_BASE}/checkout/create-checkout-session-public`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, paymentOption }),
      });
      const j = await r.json();
      if (!r.ok || !j.url) throw new Error(j.message || "No se pudo iniciar el pago");
      window.location.href = j.url;
    } catch (e) {
      Swal.fire({ icon: "error", title: e.message, confirmButtonColor: "#FF6F7D" });
      setPagando(false);
    }
  };

  const confirmarPago = async (metodo) => {
    setConfirmando(true);
    try {
      const r = await fetch(`${API_BASE}/cotizacion-personalizada/public/${token}/confirmar`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metodo }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Error");
      setCot((c) => ({ ...c, confirmacionCliente: { confirmado: true, metodo } }));
      Swal.fire({
        icon: "success",
        title: "¡Pedido confirmado!",
        html: metodo === "transferencia"
          ? "Te enviamos por correo los datos bancarios para tu anticipo del 50%."
          : "Coordinaremos contigo el anticipo del 50% en efectivo.",
        confirmButtonColor: "#FF6F7D", background: "#fff1f2", color: "#540027",
      });
    } catch (e) {
      Swal.fire({ icon: "error", title: e.message, confirmButtonColor: "#FF6F7D" });
    } finally {
      setConfirmando(false);
    }
  };

  if (cargando) return <Shell><p style={{ color: "var(--text-soft)" }}>Cargando tu cotización…</p></Shell>;
  if (error || !cot) {
    return (
      <Shell>
        <h1 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "2rem" }}>Cotización no disponible</h1>
        <p style={{ color: "var(--text-soft)", marginTop: 8 }}>El enlace no es válido o expiró. Contáctanos para reenviarte tu cotización.</p>
        <Link href="/" style={{ color: "var(--rosa)", fontWeight: 700, marginTop: 16, display: "inline-block" }}>← Inicio</Link>
      </Shell>
    );
  }

  const fmtFecha = (d, opts) => d ? new Date(d).toLocaleDateString("es-MX", opts || { day: "2-digit", month: "long", year: "numeric" }) : "—";
  const precio = Number(cot.precio) || 0;
  const anticipo = cot.anticipo != null ? Number(cot.anticipo) : Math.round(precio * 0.5);
  const vence = cot.validUntil ? new Date(cot.validUntil) : null;
  const vencida = vence ? Date.now() > vence.getTime() : false;
  const yaConfirmado = cot.confirmacionCliente?.confirmado;
  const pagado = (cot.status || "").startsWith("Agendado");
  const publicada = pagado || ["Cotizada", "Entregado"].includes(cot.status);
  const esMesa = cot.tipoProducto === "mesa-postres";

  const lugarHora = [
    cot.entrega?.tipo === "recoger-local" ? "Recoger en local" : (cot.entrega?.direccion || ""),
    cot.entrega?.hora || "",
  ].filter(Boolean).join(" · ") || "Por confirmar";

  const extras = [
    ...(cot.decoraciones || []).map((d) => d.nombre),
    cot.estilo?.value,
    cot.colorPrincipal ? `Color ${cot.colorPrincipal}` : "",
    cot.estilo?.comentarios,
  ].filter(Boolean).join(", ") || "—";

  const disenoImg = cot.estilo?.imagenesInspiracion?.[0];

  return (
    <Shell>
      <style jsx>{`
        @keyframes pulse-glow { 0%,100% { box-shadow:0 0 0 0 rgba(255,111,125,.45); transform:translateY(0);} 50% { box-shadow:0 0 0 10px rgba(255,111,125,0); transform:translateY(-2px);} }
        .reco-card { animation: pulse-glow 2.2s ease-in-out infinite; }
        .reco-badge { position:absolute; top:-10px; right:16px; background:var(--rosa); color:#fff; font-size:.7rem; font-weight:800; padding:3px 12px; border-radius:999px; letter-spacing:.04em; text-transform:uppercase; }
        .btn { border:none; border-radius:999px; padding:.8rem 1.2rem; font-weight:800; font-size:.9rem; cursor:pointer; transition:all 150ms; }
        .btn:hover:not(:disabled) { transform:translateY(-1px); }
        .btn:disabled { opacity:.6; cursor:not-allowed; }

        .tpl { background:#fff; border-radius:18px; overflow:hidden; box-shadow:0 10px 40px rgba(84,0,39,.10); border:1px solid #f3d7df; }
        .tpl-header { background:linear-gradient(180deg,#f9dfe6,#f6cdd8); padding:18px 22px; display:flex; justify-content:space-between; align-items:flex-start; gap:12px; }
        .tpl-title { font-size:2rem; line-height:1; color:#c98aa6; }
        .tpl-order { text-align:right; color:#7a6; }
        .tpl-order .lbl { color:#9a7; font-size:.7rem; }
        .det-grid { display:grid; grid-template-columns:1fr 1.1fr; gap:18px; padding:20px 22px; }
        @media (max-width:720px){ .det-grid { grid-template-columns:1fr; } }
        .det-row { margin-bottom:9px; }
        .det-lbl { color:#5b5b6b; font-size:.95rem; }
        .det-val { color:#d57aa0; font-size:1.05rem; }
        .section-title { color:#5b5b6b; font-weight:800; font-size:1.05rem; margin:6px 0 8px; border-bottom:1px solid #f0dbe2; padding-bottom:4px; }
        .cond { padding:16px 22px; background:#fffafc; border-top:1px solid #f3d7df; }
        .cond h3 { color:#5b5b6b; font-weight:800; font-size:1.1rem; margin-bottom:8px; }
        .cond li { font-size:.85rem; color:#5b5b6b; margin-bottom:7px; line-height:1.5; list-style:none; padding-left:18px; position:relative; }
        .cond li::before { content:"❤"; position:absolute; left:0; color:#f4a6c0; font-size:.8rem; }
        .pay-foot { padding:18px 22px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:14px; border-top:1px solid #f3d7df; }
        .bank { color:#7c9; font-size:.9rem; }
        .bank .b-title { color:#6aa; font-weight:800; }
        .totals { text-align:right; color:#d57aa0; }
        .disenoBox { border:1px dashed #e8b9c8; border-radius:12px; min-height:180px; display:flex; align-items:center; justify-content:center; overflow:hidden; background:#fff6f9; }
      `}</style>

      <div className="tpl">
        {/* Encabezado */}
        <div className="tpl-header">
          <div>
            <div className={sofia.className} style={{ fontSize: "0.7rem", color: "#b07", letterSpacing: ".1em", textTransform: "uppercase" }}>Cotización</div>
            <div className={`${sofia.className} tpl-title`}>Pastelería el Ruiseñor</div>
          </div>
          <div className="tpl-order">
            <div className="lbl">Número de orden</div>
            <div className={sofia.className} style={{ fontSize: "1.1rem", color: "#7a6" }}>{cot.numeroOrden || "—"}</div>
            <div className="lbl" style={{ marginTop: 4 }}>Fecha</div>
            <div className={sofia.className} style={{ color: "#7a6" }}>{fmtFecha(cot.createdAt, { day: "2-digit", month: "long", year: "numeric" })}</div>
          </div>
        </div>

        {/* Diseño + Detalles */}
        <div className="det-grid">
          <div>
            <div className="det-lbl" style={{ marginBottom: 8 }}>Diseño</div>
            <div className="disenoBox">
              {disenoImg
                ? <img src={disenoImg} alt="Diseño" style={{ width: "100%", height: "auto", display: "block" }} />
                : <span style={{ color: "#cba", fontSize: ".85rem" }}>Sin imagen de diseño</span>}
            </div>
          </div>

          <div>
            <Row lbl="En atención a" val={cot.cliente?.nombre} />
            <Row lbl="Fecha de entrega" val={fmtFecha(cot.evento?.fecha)} />
            <Row lbl="Lugar y hora de entrega" val={lugarHora} />
            <Row lbl="Recibirá" val={cot.cliente?.nombre} />
            <Row lbl="Teléfono" val={cot.cliente?.telefono ? "Registrado" : "—"} />

            <div className="section-title">Detalles del Pedido 🧾</div>
            {esMesa ? (
              <>
                <Row lbl="Mesa de postres para" val={`${cot.evento?.invitados} personas`} />
                <Row lbl="Postres por persona" val={cot.postresPorPersona} />
                <Row lbl="Postres" val={(cot.postres || []).map((p) => p.nombre).join(", ") || "—"} />
              </>
            ) : (
              <>
                <Row lbl={`${PRODUCTO_NOUN[cot.tipoProducto] || "Pastel"} para`} val={`${cot.evento?.invitados} porciones`} />
                <Row lbl="Sabor de pan" val={cot.sabor?.nombre} />
                <Row lbl="Relleno" val={cot.relleno?.nombre} />
                <Row lbl="Cobertura" val={cot.cobertura?.nombre} />
                <Row lbl="Forrado" val={cot.cobertura?.esFondant ? "Sí (fondant)" : "No aplica"} />
              </>
            )}
            <Row lbl="Extras" val={extras} />
          </div>
        </div>

        {/* Condiciones */}
        <div className="cond">
          <h3>Condiciones e Información Importante ⚠️</h3>
          <ul style={{ margin: 0, padding: 0 }}>
            <li>Para iniciar su pedido se solicita un anticipo del 50% del total del pedido, favor de confirmar disponibilidad antes de hacer su pedido.</li>
            <li><strong>Vigencia:</strong> El presupuesto es válido por 30 días a partir de la fecha estipulada en la orden{vence ? ` (vence el ${fmtFecha(cot.validUntil)})` : ""}.</li>
            <li><strong>Cancelaciones:</strong> Podrá cancelar su pedido hasta 5 días antes de la fecha de entrega por medio de llamada o mensaje en un horario de 9am a 5pm de Lunes a Viernes, con un cargo del 30% del total; de lo contrario el cargo por cancelación será del 50% del costo total.</li>
            <li><strong>Cambios de diseño:</strong> Podrá hacer cambios en el diseño hasta 5 días antes de la fecha de entrega, pudiendo generar cambios en la cotización compartida previamente.</li>
            <li><strong>Liquidar y Recoger:</strong> Se pide liquidar su pedido un día antes de la fecha de entrega; para recoger su pedido por favor indique su número de orden.</li>
          </ul>
        </div>

        {/* Datos bancarios + totales */}
        <div className="pay-foot">
          <div className="bank">
            <div className="b-title">Datos Bancarios Citibanamex:</div>
            <div>Clabe 002320902695222820</div>
            <div>No. Tarjeta 5256 7839 9715 6998</div>
          </div>
          <div className="totals">
            {publicada && precio > 0 ? (
              <>
                <div className={sofia.className} style={{ fontSize: "1.3rem" }}>Total $ {precio.toLocaleString("es-MX")}</div>
                <div style={{ borderTop: "1px solid #e8b9c8", margin: "6px 0" }} />
                <div className={sofia.className} style={{ fontSize: "1.1rem" }}>Anticipo $ {anticipo.toLocaleString("es-MX")}</div>
              </>
            ) : (
              <div style={{ color: "#b89", fontSize: ".9rem", maxWidth: 220 }}>Tu precio está en revisión. Te lo compartiremos muy pronto por este mismo enlace.</div>
            )}
          </div>
        </div>
      </div>

      {/* Acciones de pago */}
      {publicada && precio > 0 && !vencida && (
        pagado ? (
          <Card><h2 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.2rem" }}>¡Pedido apartado! 🎉</h2>
            <p style={{ color: "var(--text-soft)", marginTop: 6 }}>Recibimos tu anticipo. {cot.saldoPendiente > 0 ? `Saldo pendiente: $${Number(cot.saldoPendiente).toLocaleString("es-MX")}.` : "Pedido pagado en su totalidad."}</p></Card>
        ) : yaConfirmado ? (
          <Card><h2 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.2rem" }}>¡Pedido confirmado! 🎉</h2>
            <p style={{ color: "var(--text-soft)", marginTop: 6 }}>Coordinaremos contigo el anticipo por {cot.confirmacionCliente?.metodo}. {cot.confirmacionCliente?.metodo === "transferencia" ? "Revisa tu correo con los datos bancarios." : ""} ¡Gracias!</p></Card>
        ) : (
          <Card>
            <h2 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.4rem", marginBottom: 12 }}>Aparta tu fecha con el 50%</h2>

            <div className="reco-card" style={{ position: "relative", border: "2px solid var(--rosa)", borderRadius: 14, padding: "1.1rem", background: "var(--rosa-4,#FFF3F5)" }}>
              <span className="reco-badge">Recomendado</span>
              <h3 style={{ fontWeight: 800, color: "var(--burdeos)", fontSize: "1.02rem", marginBottom: 6 }}>💳 Paga en línea</h3>
              <p style={{ fontSize: ".85rem", color: "var(--text-soft)", lineHeight: 1.5, marginBottom: 12 }}>Crea tu cuenta para apartar tu fecha al instante, dar seguimiento y pagar el resto contra entrega. ¡Es rápido!</p>
              {isLoggedIn ? (
                <button className="btn" disabled={pagando} style={{ background: "var(--burdeos)", color: "#fff", width: "100%" }} onClick={() => pagarEnLinea("anticipo")}>
                  {pagando ? "Redirigiendo…" : `Pagar anticipo en línea ($${anticipo.toLocaleString("es-MX")})`}
                </button>
              ) : (
                <>
                  <Link href={`/registrarse?next=${encodeURIComponent(`/cotizacion/ver/${token}`)}`}>
                    <button className="btn" style={{ background: "var(--burdeos)", color: "#fff", width: "100%" }}>Crear cuenta y pagar</button>
                  </Link>
                  <button className="btn" disabled={pagando} style={{ background: "transparent", color: "var(--burdeos)", width: "100%", marginTop: 8, fontWeight: 700, fontSize: ".82rem" }} onClick={() => pagarEnLinea("anticipo")}>
                    {pagando ? "Redirigiendo…" : "o pagar como invitado"}
                  </button>
                </>
              )}
            </div>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px dashed var(--border-color)" }}>
              <h3 style={{ fontWeight: 800, color: "var(--burdeos)", fontSize: "1.02rem", marginBottom: 6 }}>🏦 Pagar el anticipo por transferencia o efectivo</h3>
              <p style={{ fontSize: ".85rem", color: "var(--text-soft)", marginBottom: 12 }}>Al confirmar te enviamos por correo los datos para depositar el 50%.</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="btn" disabled={confirmando} style={{ background: "var(--rosa)", color: "#fff", flex: 1, minWidth: 200 }} onClick={() => confirmarPago("transferencia")}>
                  Confirmar (pagaré vía transferencia)
                </button>
                <button className="btn" disabled={confirmando} style={{ background: "#fff", color: "var(--burdeos)", border: "1.5px solid var(--burdeos)", flex: 1, minWidth: 200 }} onClick={() => confirmarPago("efectivo")}>
                  Confirmar (pagaré con efectivo)
                </button>
              </div>
            </div>
          </Card>
        )
      )}

      <p style={{ textAlign: "center", fontSize: ".8rem", color: "var(--text-soft)", marginTop: 18, fontStyle: "italic" }}>
        Muchas gracias por tomarte el tiempo de leer toda la información. Quedamos al pendiente para cualquier duda o aclaración. Horario de atención: Lunes a Viernes de 9am a 6pm.
      </p>
      <Link href="/" style={{ color: "var(--text-soft)", fontSize: ".85rem", marginTop: 14, display: "inline-block" }}>← Volver al inicio</Link>
    </Shell>
  );
}

function Row({ lbl, val }) {
  return (
    <div className="det-row">
      <span className="det-lbl">{lbl} </span>
      <span className={`${sofia.className} det-val`}>{val ?? "—"}</span>
    </div>
  );
}

const cardStyle = { background: "#fff", borderRadius: 16, border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)", padding: "1.25rem 1.4rem", marginTop: 16 };
function Card({ children }) { return <div style={cardStyle}>{children}</div>; }

function Shell({ children }) {
  return (
    <div className={nunito.className} style={{ minHeight: "100vh", background: "var(--bg-sunken)" }}>
      <div aria-hidden="true" className="ru-pattern-sprinkle fixed inset-0 pointer-events-none" style={{ opacity: 0.06 }} />
      <main style={{ position: "relative", maxWidth: 720, margin: "0 auto", padding: "2.5rem 1.25rem 4rem" }}>
        {children}
      </main>
    </div>
  );
}
