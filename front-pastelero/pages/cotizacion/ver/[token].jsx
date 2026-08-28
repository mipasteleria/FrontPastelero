import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Swal from "sweetalert2";
import { Nunito as NunitoFont, Fraunces as FrauncesFont, Sofia as SofiaFont } from "next/font/google";
import { useAuth } from "@/src/context";

const nunito = NunitoFont({ subsets: ["latin"], weight: ["400", "700", "800"], variable: "--font-sans-q" });
const fraunces = FrauncesFont({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display-q" });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"], variable: "--font-script-q" });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const PRODUCTO_NOUN = { pastel: "Pastel", cupcake: "Cupcakes", "mesa-postres": "Mesa de postres", galleta: "Galletas decoradas" };

// Pasos del timeline y a qué índice corresponde cada status.
const STEPS = ["Enviada", "En revisión", "Anticipo", "Horneando", "Entrega"];
function stepIndex(status) {
  if (status === "Entregado") return 4;
  if (status === "Agendado · producción") return 3;
  if (status === "Cotizada") return 2;            // listo para apartar
  if (status === "Agendado · revisión") return 3;
  if (status === "Cancelado") return 1;
  return 1; // Pendiente → en revisión
}

export default function VerCotizacion() {
  const router = useRouter();
  const { token } = router.query;
  const { isLoggedIn } = useAuth();

  const [cot, setCot] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [pagando, setPagando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [opcionPago, setOpcionPago] = useState("anticipo"); // anticipo | total
  const [verDesglose, setVerDesglose] = useState(false);
  const [ajusteOpen, setAjusteOpen] = useState(false);
  const [ajusteTexto, setAjusteTexto] = useState("");
  const [enviandoAjuste, setEnviandoAjuste] = useState(false);

  useEffect(() => {
    if (router.query.pago === "ok") Swal.fire({ icon: "success", title: "¡Pago recibido!", text: "Tu anticipo fue procesado. ¡Gracias!", confirmButtonColor: "#FF6F7D", background: "#fff1f2", color: "#540027" });
    else if (router.query.pago === "cancelado") Swal.fire({ icon: "info", title: "Pago cancelado", text: "Puedes intentarlo de nuevo cuando quieras.", confirmButtonColor: "#FF6F7D" });
  }, [router.query.pago]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/cotizacion-personalizada/public/${token}`)
      .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
      .then(({ ok, j }) => { if (!ok) throw new Error(j.message || "No encontrada"); setCot(j.data); })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [token]);

  const pagarEnLinea = async (paymentOption) => {
    setPagando(true);
    try {
      const r = await fetch(`${API_BASE}/checkout/create-checkout-session-public`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, paymentOption }),
      });
      const j = await r.json();
      if (!r.ok || !j.url) throw new Error(j.message || "No se pudo iniciar el pago");
      window.location.href = j.url;
    } catch (e) { Swal.fire({ icon: "error", title: e.message, confirmButtonColor: "#FF6F7D" }); setPagando(false); }
  };

  const confirmarPago = async (metodo) => {
    setConfirmando(true);
    try {
      const r = await fetch(`${API_BASE}/cotizacion-personalizada/public/${token}/confirmar`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ metodo }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Error");
      setCot((c) => ({ ...c, confirmacionCliente: { confirmado: true, metodo } }));
      Swal.fire({ icon: "success", title: "¡Pedido confirmado!", html: metodo === "transferencia" ? "Te enviamos por correo los datos bancarios para tu anticipo del 50%." : "Coordinaremos contigo el anticipo del 50% en efectivo.", confirmButtonColor: "#FF6F7D", background: "#fff1f2", color: "#540027" });
    } catch (e) { Swal.fire({ icon: "error", title: e.message, confirmButtonColor: "#FF6F7D" }); }
    finally { setConfirmando(false); }
  };

  const enviarAjuste = async () => {
    const mensaje = ajusteTexto.trim();
    if (!mensaje) return;
    setEnviandoAjuste(true);
    try {
      const r = await fetch(`${API_BASE}/cotizacion-personalizada/public/${token}/solicitar-ajuste`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mensaje }),
      });
      if (!r.ok) throw new Error((await r.json()).message || "Error");
      setAjusteTexto(""); setAjusteOpen(false);
      Swal.fire({ icon: "success", title: "Solicitud enviada", text: "Revisaremos tus ajustes y te contactamos.", confirmButtonColor: "#FF6F7D", background: "#fff1f2", color: "#540027" });
    } catch (e) { Swal.fire({ icon: "error", title: e.message, confirmButtonColor: "#FF6F7D" }); }
    finally { setEnviandoAjuste(false); }
  };

  const copiarEnlace = () => {
    navigator.clipboard?.writeText(window.location.href);
    Swal.fire({ icon: "success", title: "Enlace copiado", timer: 1200, showConfirmButton: false, background: "#fff1f2", color: "#540027" });
  };

  const fontVars = `${nunito.variable} ${fraunces.variable} ${sofia.variable}`;

  if (cargando) return <Shell fontVars={fontVars}><p style={{ color: "var(--text-soft)" }}>Cargando tu cotización…</p></Shell>;
  if (error || !cot) {
    return (
      <Shell fontVars={fontVars}>
        <h1 style={{ fontFamily: "var(--font-display-q)", color: "#540027", fontSize: "2rem" }}>Cotización no disponible</h1>
        <p style={{ color: "#5A3548", marginTop: 8 }}>El enlace no es válido o expiró. Contáctanos para reenviarte tu cotización.</p>
        <Link href="/" style={{ color: "#FF6F7D", fontWeight: 700, marginTop: 16, display: "inline-block" }}>← Inicio</Link>
      </Shell>
    );
  }

  // Las fechas de evento/validez son "date-only" guardadas a medianoche UTC;
  // se formatean en UTC para no recorrerse un día en zonas detrás de UTC.
  const fmt = (d, o) => d ? new Date(d).toLocaleDateString("es-MX", { ...(o || { day: "2-digit", month: "long", year: "numeric" }), timeZone: "UTC" }) : "—";
  const precio = Number(cot.precio) || 0;
  const anticipo = cot.anticipo != null ? Number(cot.anticipo) : Math.round(precio * 0.5);
  const saldo = Math.max(precio - anticipo, 0);
  const montoSel = opcionPago === "total" ? precio : anticipo;
  const vence = cot.validUntil ? new Date(cot.validUntil) : null;
  const vencida = vence ? Date.now() > vence.getTime() : false;
  const yaConfirmado = cot.confirmacionCliente?.confirmado;
  const pagado = (cot.status || "").startsWith("Agendado") || cot.status === "Entregado";
  const publicada = pagado || cot.status === "Cotizada";
  const esMesa = cot.tipoProducto === "mesa-postres";
  const esGalleta = cot.tipoProducto === "galleta";
  const sidx = stepIndex(cot.status);
  const disenoImg = cot.estilo?.imagenesInspiracion?.[0];
  const referencias = (cot.estilo?.imagenesInspiracion || []).slice(1);

  const tituloPastel = esMesa
    ? "Mesa de postres"
    : esGalleta
    ? "Galletas decoradas"
    : `${PRODUCTO_NOUN[cot.tipoProducto] || "Pastel"}${cot.estilo?.value ? ` ${cot.estilo.value}` : ""}`;

  // Rótulo de la sección según el producto (antes decía siempre "Tu Pastel").
  const eyebrowProducto = esMesa ? "Tu mesa de postres" : esGalleta ? "Tus galletas" : "Tu Pastel";

  const piezasGalleta = cot.piezasGalleta || cot.evento?.invitados || 0;

  const tags = esMesa
    ? [`${cot.evento?.invitados} personas`, `${cot.postresPorPersona}/persona`, cot.estilo?.value]
    : esGalleta
    ? [`${piezasGalleta} pieza${piezasGalleta === 1 ? "" : "s"}`, cot.sabor?.nombre]
    : [cot.niveles ? `${cot.niveles} nivel${cot.niveles > 1 ? "es" : ""}` : null, `${cot.evento?.invitados} porciones`, cot.estilo?.value];

  return (
    <Shell fontVars={fontVars}>
      <style jsx global>{`
        :root{
          --burd:#540027; --burd2:#7A1F44; --rosa:#FF6F7D; --rosa2:#FFA1AA; --rosa3:#FFC3C9; --rosa4:#FFE2E7;
          --crema:#FFF3F5; --bg-raised:#fff; --bg-sunken:#FFEEF1;
          --text:#2A0A1A; --soft:#5A3548; --muted:#8B6B7A; --border:#F5D4DA; --border-strong:#E8B5BE;
          --mantequilla:#FFE99B; --menta-deep:#6FC9A8; --durazno:#FFC9A5; --lavanda:#D9C4E8; --pistache:#9FB864;
          --r-md:12px; --r-lg:20px; --r-xl:28px; --r-2xl:36px; --r-pill:999px;
          --sh-xs:0 1px 2px rgba(84,0,39,.06); --sh-sm:0 2px 6px rgba(84,0,39,.08); --sh-md:0 8px 20px rgba(84,0,39,.12);
        }
        @keyframes floatq { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes pulseq { 0%,100%{opacity:1} 50%{opacity:.35} }
      `}</style>
      <style jsx>{`
        .wrap { max-width:1120px; margin:0 auto; padding:24px 20px 64px; font-family:var(--font-display-q); }
        .topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; }
        .logo { display:flex; align-items:center; gap:12px; }
        .badge { width:42px; height:42px; border-radius:50%; background:#fff; box-shadow:var(--sh-xs); overflow:hidden; display:flex; align-items:center; justify-content:center; }
        .badge img { width:100%; height:100%; object-fit:cover; }
        .eb { font-size:9px; text-transform:uppercase; letter-spacing:.06em; color:var(--rosa); font-weight:800; font-family:var(--font-sans-q); }
        .wm { font-family:var(--font-script-q); font-size:1.55rem; color:var(--burd); line-height:1; }
        .ghost { background:#fff; border:1px solid var(--border); color:var(--soft); border-radius:var(--r-pill); padding:8px 14px; font-size:.8rem; font-weight:700; cursor:pointer; font-family:var(--font-sans-q); margin-left:8px; }
        .ghost:hover { border-color:var(--border-strong); }

        .head { text-align:center; max-width:720px; margin:0 auto 40px; }
        .folio-row { display:flex; align-items:center; justify-content:center; gap:8px; flex-wrap:wrap; margin-bottom:16px; }
        .folio { display:inline-flex; align-items:center; gap:8px; font-family:ui-monospace,monospace; font-size:.8rem; color:var(--soft); background:#fff; padding:6px 14px; border-radius:var(--r-pill); border:1px solid var(--border); }
        .status-pill { display:inline-flex; align-items:center; gap:7px; padding:6px 15px; border-radius:var(--r-pill); font-size:.72rem; font-weight:800; text-transform:uppercase; letter-spacing:.06em; font-family:var(--font-sans-q); }
        .status-pill .dot { width:8px; height:8px; border-radius:50%; background:currentColor; animation:pulseq 1.8s ease infinite; }
        h1.title { font-family:var(--font-script-q); color:var(--burd); font-size:3rem; line-height:1.02; margin:6px 0 10px; }
        .sub { color:var(--soft); font-family:var(--font-sans-q); font-size:1rem; line-height:1.6; }

        .timeline { display:flex; gap:8px; max-width:760px; margin:0 auto 44px; }
        .tl { flex:1; display:flex; flex-direction:column; align-items:center; gap:8px; text-align:center; position:relative; }
        .tl::before { content:""; position:absolute; top:19px; left:-50%; width:100%; height:2px; background:var(--border); z-index:0; }
        .tl:first-child::before { display:none; }
        .tl.done::before, .tl.active::before { background:var(--rosa2); }
        .ring { width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:.85rem; background:#fff; color:var(--muted); border:2px solid var(--border); z-index:1; font-family:var(--font-sans-q); }
        .tl.done .ring { background:var(--menta-deep); color:#fff; border-color:var(--menta-deep); }
        .tl.active .ring { background:var(--rosa); color:#fff; border-color:var(--rosa); box-shadow:0 0 0 4px rgba(255,111,125,.18); }
        .tl .lbl { font-size:.78rem; font-weight:800; color:var(--soft); font-family:var(--font-sans-q); }
        .tl .when { font-size:.68rem; color:var(--muted); font-family:var(--font-sans-q); }
        @media (max-width:560px){ .tl .when{display:none} }

        .layout { display:grid; grid-template-columns:1fr 372px; gap:28px; align-items:start; }
        @media (max-width:880px){ .layout{ grid-template-columns:1fr; } }
        .card { background:#fff; border-radius:var(--r-2xl); box-shadow:var(--sh-sm); border:1px solid var(--border); }

        .preview { padding:28px; margin-bottom:24px; display:grid; grid-template-columns:200px 1fr; gap:28px; align-items:center; position:relative; overflow:hidden; }
        @media (max-width:520px){ .preview{ grid-template-columns:1fr; } }
        .blob { position:absolute; width:320px; height:320px; right:-60px; top:-60px; background:var(--rosa4); border-radius:42% 58% 65% 35% / 50% 40% 60% 50%; z-index:0; }
        .cake-art { position:relative; z-index:1; border-radius:18px; overflow:hidden; box-shadow:0 14px 26px rgba(84,0,39,.18); background:var(--bg-sunken); aspect-ratio:1; display:flex; align-items:center; justify-content:center; }
        .cake-art img { width:100%; height:100%; object-fit:cover; display:block; }
        .pinfo { position:relative; z-index:1; }
        .eyebrow { color:var(--rosa); font-size:.72rem; font-weight:800; text-transform:uppercase; letter-spacing:.06em; font-family:var(--font-sans-q); }
        h2.pname { font-family:var(--font-script-q); font-size:2.6rem; color:var(--burd); line-height:.96; margin:6px 0 14px; text-transform:capitalize; }
        .tags { display:flex; gap:8px; flex-wrap:wrap; }
        .tag { background:var(--bg-sunken); padding:6px 14px; border-radius:var(--r-pill); font-size:.82rem; font-weight:700; color:var(--burd2); font-family:var(--font-sans-q); }

        .specs { padding:28px; }
        .specs h3 { font-family:var(--font-display-q); font-weight:600; font-size:1.75rem; color:var(--burd); margin-bottom:8px; }
        .lead { color:var(--muted); font-size:.875rem; margin-bottom:24px; font-family:var(--font-sans-q); }
        .spec-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        @media (max-width:520px){ .spec-grid{ grid-template-columns:1fr; } }
        .spec { background:var(--crema); border:1px solid var(--border); border-radius:var(--r-lg); padding:16px; }
        .spec.wide { grid-column:1 / -1; }
        .spec .k { font-size:.72rem; font-weight:800; color:var(--muted); text-transform:uppercase; letter-spacing:.05em; margin-bottom:8px; font-family:var(--font-sans-q); }
        .spec .v { font-size:1rem; color:var(--text); line-height:1.45; font-family:var(--font-sans-q); font-weight:700; }
        .refs { display:flex; gap:8px; flex-wrap:wrap; margin-top:4px; }
        .refs img { width:64px; height:64px; object-fit:cover; border-radius:10px; border:1px solid var(--border); }

        aside { display:flex; flex-direction:column; gap:16px; position:sticky; top:16px; }
        .price { padding:28px; }
        .ptop { display:flex; align-items:baseline; justify-content:space-between; }
        .price h3 { font-family:var(--font-display-q); font-weight:600; font-size:1.375rem; color:var(--burd); }
        .est { font-size:11px; color:var(--muted); font-weight:700; text-transform:uppercase; letter-spacing:.05em; font-family:var(--font-sans-q); }
        .total-line { display:flex; align-items:flex-end; gap:6px; margin:6px 0 4px; }
        .num { font-family:var(--font-display-q); font-weight:700; font-size:2.5rem; color:var(--burd); line-height:1; }
        .cur { font-size:.8rem; color:var(--muted); font-weight:700; font-family:var(--font-sans-q); }
        .dl { display:flex; justify-content:space-between; font-size:.85rem; padding:5px 0; color:var(--soft); font-family:var(--font-sans-q); border-bottom:1px dashed var(--border); }
        .dl:last-child { border-bottom:none; }
        .dl strong { color:var(--burd); }
        .pay-label { font-size:.8rem; font-weight:800; color:var(--soft); margin:16px 0 8px; font-family:var(--font-sans-q); }
        .seg { display:flex; gap:6px; background:var(--bg-sunken); padding:5px; border-radius:var(--r-pill); }
        .seg button { flex:1; border:0; background:transparent; padding:9px; border-radius:var(--r-pill); font-weight:800; font-size:.82rem; color:var(--soft); cursor:pointer; font-family:var(--font-sans-q); }
        .seg button.on { background:#fff; color:var(--burd); box-shadow:var(--sh-xs); }
        .pay-box { background:var(--crema); border:1px solid var(--border); border-radius:var(--r-lg); padding:14px; margin-top:12px; }
        .reco { position:relative; border:2px solid var(--rosa); border-radius:var(--r-lg); padding:14px; background:var(--rosa4); margin-top:14px; }
        .reco .rb { position:absolute; top:-10px; right:14px; background:var(--rosa); color:#fff; font-size:.65rem; font-weight:800; padding:3px 12px; border-radius:var(--r-pill); text-transform:uppercase; letter-spacing:.04em; font-family:var(--font-sans-q); animation:floatq 2.4s ease infinite; }
        .cta { background:var(--rosa); color:#fff; border:0; width:100%; padding:15px; border-radius:var(--r-pill); font-weight:800; font-family:var(--font-sans-q); font-size:1rem; cursor:pointer; margin-top:14px; box-shadow:var(--sh-sm); }
        .cta:hover:not(:disabled){ background:var(--burd); }
        .cta:disabled{ opacity:.6; cursor:not-allowed; }
        .cta-2 { background:transparent; color:var(--burd); border:1.5px solid var(--border-strong); width:100%; padding:12px; border-radius:var(--r-pill); font-weight:800; font-family:var(--font-sans-q); font-size:.9rem; cursor:pointer; margin-top:10px; }
        .cta-2:hover{ background:var(--bg-sunken); }
        .valid { font-size:.75rem; color:var(--muted); text-align:center; margin-top:12px; font-family:var(--font-sans-q); }
        .cond h3 { font-family:var(--font-display-q); font-weight:600; font-size:1.2rem; color:var(--burd); margin-bottom:10px; }
        .cond li { list-style:none; font-size:.82rem; color:var(--soft); line-height:1.5; margin-bottom:8px; padding-left:18px; position:relative; font-family:var(--font-sans-q); }
        .cond li::before { content:"❤"; position:absolute; left:0; color:var(--rosa2); font-size:.75rem; }
        .bankbox { margin-top:12px; padding:12px 14px; background:var(--rosa4); border:1px solid var(--rosa); border-radius:var(--r-lg); font-family:var(--font-sans-q); }
        .wa { display:inline-block; margin-top:6px; color:var(--burd); font-weight:800; font-family:var(--font-sans-q); text-decoration:none; }
      `}</style>

      <div className="wrap">
        {/* Topbar */}
        <div className="topbar">
          <Link href="/" className="logo" style={{ textDecoration: "none" }}>
            <div className="badge"><img src="/img/logo.JPG" alt="Pastelería el Ruiseñor" /></div>
            <div>
              <div className="eb">Pastelería</div>
              <div className="wm">El Ruiseñor</div>
            </div>
          </Link>
          <div>
            <button className="ghost" onClick={copiarEnlace}>Compartir</button>
            <button className="ghost" onClick={() => window.print()}>Imprimir</button>
          </div>
        </div>

        {/* Head */}
        <div className="head">
          <div className="folio-row">
            <span className="folio">Número de orden · {cot.numeroOrden || "—"}</span>
            <span className="status-pill" style={{ background: pagado ? "var(--menta-deep)" : "var(--mantequilla)", color: pagado ? "#fff" : "#6B4F1A" }}>
              <span className="dot" />{cot.status || "Pendiente"}
            </span>
          </div>
          <h1 className="title">{pagado ? "¡Tu pedido está apartado!" : publicada ? "Tu cotización está lista" : "Tu cotización está casi lista"}</h1>
          <p className="sub">Hola 👋 {cot.cliente?.nombre ? <strong>{cot.cliente.nombre}</strong> : ""}, esto es justo lo que armaste. Revísalo y, si algo no coincide, pídenos ajustes — sin compromiso.</p>
        </div>

        {/* Timeline */}
        <div className="timeline">
          {STEPS.map((s, i) => (
            <div key={s} className={`tl ${i < sidx ? "done" : i === sidx ? "active" : ""}`}>
              <div className="ring">{i < sidx ? "✓" : i + 1}</div>
              <div className="lbl">{s}</div>
              <div className="when">
                {i === 0 ? fmt(cot.createdAt, { day: "2-digit", month: "short" })
                  : s === "Anticipo" ? "50% para apartar"
                  : s === "En revisión" ? "Resp. < 24h"
                  : s === "Entrega" ? fmt(cot.evento?.fecha, { day: "2-digit", month: "short" })
                  : "—"}
              </div>
            </div>
          ))}
        </div>

        <div className="layout">
          {/* Izquierda */}
          <div>
            <section className="card preview">
              <div className="blob" aria-hidden="true" />
              <div className="cake-art">
                {disenoImg ? <img src={disenoImg} alt="Diseño propuesto" /> : <span style={{ color: "#b89", fontSize: ".8rem", padding: 12, textAlign: "center" }}>La propuesta de diseño se agregará pronto</span>}
              </div>
              <div className="pinfo">
                <span className="eyebrow">{eyebrowProducto}</span>
                <h2 className="pname">{tituloPastel}</h2>
                <div className="tags">
                  {tags.filter(Boolean).map((t, i) => <span key={i} className="tag" style={{ textTransform: "capitalize" }}>{t}</span>)}
                </div>
              </div>
            </section>

            <section className="card specs">
              <h3>Lo que armaste</h3>
              <p className="lead">Revisa cada detalle. Si algo no coincide, pídenos ajustes — sin compromiso.</p>
              <div className="spec-grid">
                <Spec k="Ocasión" v={cot.evento?.tipo} cap dot="var(--rosa)" />
                {esMesa ? (
                  <>
                    <Spec k="Personas" v={`${cot.evento?.invitados}`} dot="var(--menta-deep)" />
                    <Spec k="Postres por persona" v={cot.postresPorPersona} dot="var(--mantequilla)" />
                    <Spec k="Postres" v={(cot.postres || []).map((p) => p.nombre).join(", ")} wide dot="var(--lavanda)" />
                  </>
                ) : esGalleta ? (
                  <>
                    <Spec k="Galletas" v={`${piezasGalleta} pieza${piezasGalleta === 1 ? "" : "s"}`} dot="var(--menta-deep)" />
                    <Spec k="Sabor" v={cot.sabor?.nombre || "—"} dot="var(--mantequilla)" />
                    {(cot.decoraciones || []).length > 0 && (
                      <Spec k="Decoración" dot="var(--lavanda)" wide v={
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {cot.decoraciones.map((d) => (
                            <span key={d.slug} style={{ background: "var(--bg-sunken)", padding: "4px 10px", borderRadius: 999, fontSize: ".8rem", fontWeight: 700, color: "var(--burd2)" }}>{d.nombre}</span>
                          ))}
                        </div>
                      } />
                    )}
                  </>
                ) : cot.tipoProducto === "cupcake" ? (
                  <>
                    <Spec k="Cupcakes" v={`${cot.evento?.invitados} (${(cot.evento?.invitados || 0) / 12} doc)`} dot="var(--menta-deep)" />
                    <Spec k="Sabores" dot="var(--mantequilla)" wide v={
                      (cot.saboresCupcake || []).length
                        ? <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {cot.saboresCupcake.map((r, i) => (
                              <span key={i} style={{ background: "var(--bg-sunken)", padding: "4px 10px", borderRadius: 999, fontSize: ".8rem", fontWeight: 700, color: "var(--burd2)" }}>{r.docenas} doc · {r.nombre}</span>
                            ))}
                          </div>
                        : (cot.sabor?.nombre || "—")
                    } />
                    <Spec k="Relleno" v={cot.relleno?.nombre} dot="var(--durazno)" />
                    <Spec k="Cobertura" v={cot.cobertura?.nombre} dot="var(--rosa2)" />
                    <Spec k="Decoración" dot="var(--lavanda)" v={
                      (cot.decoraciones || []).length
                        ? <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{cot.decoraciones.map((d) => <span key={d.slug} style={{ background: "var(--bg-sunken)", padding: "4px 10px", borderRadius: 999, fontSize: ".8rem", fontWeight: 700, color: "var(--burd2)" }}>{d.nombre}</span>)}</div>
                        : "—"
                    } />
                    {cot.colorPrincipal && <Spec k="Color principal" dot="var(--rosa)" v={<span style={{ display: "inline-block", width: 18, height: 18, borderRadius: "50%", background: cot.colorPrincipal, border: "1.5px solid rgba(0,0,0,.15)" }} />} />}
                    <Spec k="Estilo" v={cot.estilo?.value || "—"} cap dot="var(--menta-deep)" />
                  </>
                ) : (
                  <>
                    <Spec k="Porciones" v={`${cot.evento?.invitados}`} dot="var(--menta-deep)" />
                    <Spec k="Bizcocho" v={cot.sabor?.nombre} dot="var(--mantequilla)" />
                    <Spec k="Relleno" v={cot.relleno?.nombre} dot="var(--durazno)" />
                    <Spec k="Cobertura" v={cot.cobertura?.nombre} dot="var(--rosa2)" />
                    <Spec k="Forrado" v={cot.cobertura?.esFondant ? "Sí (fondant)" : "No aplica"} dot="var(--pistache)" />
                    <Spec k="Decoración" dot="var(--lavanda)" v={
                      (cot.decoraciones || []).length
                        ? <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {cot.decoraciones.map((d) => (
                              <span key={d.slug} style={{ background: "var(--bg-sunken)", padding: "4px 10px", borderRadius: 999, fontSize: ".8rem", fontWeight: 700, color: "var(--burd2)" }}>{d.nombre}</span>
                            ))}
                          </div>
                        : "—"
                    } />
                    <Spec k="Color principal" dot="var(--rosa)" v={cot.colorPrincipal
                      ? <span style={{ display: "inline-block", width: 18, height: 18, borderRadius: "50%", background: cot.colorPrincipal, border: "1.5px solid rgba(0,0,0,.15)" }} />
                      : "—"} />
                    <Spec k="Estilo" v={cot.estilo?.value || "—"} cap dot="var(--menta-deep)" />
                  </>
                )}
                {cot.estilo?.comentarios && <Spec k="Mensaje / notas" v={cot.estilo.comentarios} wide dot="var(--pistache)" />}
                <Spec k="Entrega" wide dot="var(--burd)" v={[cot.entrega?.tipo === "recoger-local" ? "Recoger en local" : (cot.entrega?.direccion || cot.entrega?.tipo), cot.entrega?.hora].filter(Boolean).join(" · ") || "Por confirmar"} />
                {referencias.length > 0 && (
                  <Spec k="Referencias que enviaste" wide dot="var(--menta-deep)" v={
                    <div className="refs">
                      {referencias.map((u) => <a key={u} href={u} target="_blank" rel="noopener noreferrer"><img src={u} alt="ref" /></a>)}
                    </div>
                  } />
                )}
              </div>
            </section>
          </div>

          {/* Derecha */}
          <aside>
            <section className="card price">
              <div className="ptop">
                <h3>Resumen</h3>
                {!publicada && <span className="est">En revisión</span>}
              </div>

              {publicada && precio > 0 ? (
                <>
                  <div className="total-line">
                    <span className="num">${precio.toLocaleString("es-MX")}</span><span className="cur">MXN</span>
                  </div>
                  <div className="dl"><span>Anticipo (50%)</span><strong>${anticipo.toLocaleString("es-MX")}</strong></div>
                  <div className="dl"><span>Saldo al entregar</span><strong>${saldo.toLocaleString("es-MX")}</strong></div>

                  {!pagado && !yaConfirmado && !vencida && (
                    <>
                      <div className="pay-label">¿Cómo quieres pagar?</div>
                      <div className="seg">
                        <button className={opcionPago === "anticipo" ? "on" : ""} onClick={() => setOpcionPago("anticipo")}>Anticipo 50%</button>
                        <button className={opcionPago === "total" ? "on" : ""} onClick={() => setOpcionPago("total")}>Pago total</button>
                      </div>
                      <div className="pay-box">
                        <div className="dl" style={{ borderBottom: "none", padding: 0 }}>
                          <span>{opcionPago === "total" ? "Pago total" : "Anticipo para apartar"}</span>
                          <strong>${montoSel.toLocaleString("es-MX")}</strong>
                        </div>
                      </div>

                      <div className="reco">
                        <span className="rb">Recomendado</span>
                        <div style={{ fontWeight: 800, color: "var(--burd)", fontFamily: "var(--font-sans-q)", marginBottom: 4 }}>💳 Pagar en línea</div>
                        <div style={{ fontSize: ".82rem", color: "var(--soft)", fontFamily: "var(--font-sans-q)", lineHeight: 1.45 }}>
                          {isLoggedIn ? "Aparta tu fecha al instante y da seguimiento a tu pedido." : "Crea tu cuenta para apartar al instante y dar seguimiento; el resto contra entrega."}
                        </div>
                        {isLoggedIn ? (
                          <button className="cta" disabled={pagando} onClick={() => pagarEnLinea(opcionPago)}>{pagando ? "Redirigiendo…" : `Confirmar y pagar $${montoSel.toLocaleString("es-MX")}`}</button>
                        ) : (
                          <>
                            <Link href={`/registrarse?next=${encodeURIComponent(`/cotizacion/ver/${token}`)}`}><button className="cta">Crear cuenta y pagar</button></Link>
                            <button className="cta-2" disabled={pagando} onClick={() => pagarEnLinea(opcionPago)}>{pagando ? "Redirigiendo…" : "o pagar como invitado"}</button>
                          </>
                        )}
                      </div>

                      <div className="pay-label" style={{ marginTop: 18 }}>🏦 O aparta con transferencia / efectivo</div>
                      <button className="cta-2" disabled={confirmando} onClick={() => confirmarPago("transferencia")} style={{ marginTop: 4 }}>Confirmar (pagaré vía transferencia)</button>
                      <button className="cta-2" disabled={confirmando} onClick={() => confirmarPago("efectivo")}>Confirmar (pagaré con efectivo)</button>
                    </>
                  )}

                  {pagado && (
                    <div className="bankbox" style={{ background: "var(--bg-sunken)", borderColor: "var(--menta-deep)" }}>
                      <strong style={{ color: "var(--burd)" }}>¡Pedido apartado! 🎉</strong>
                      <div style={{ fontSize: ".85rem", color: "var(--soft)", marginTop: 4 }}>{saldo > 0 ? `Saldo pendiente: $${saldo.toLocaleString("es-MX")}.` : "Pagado en su totalidad."}</div>
                    </div>
                  )}

                  {yaConfirmado && !pagado && (
                    <div className="bankbox">
                      <strong style={{ color: "var(--burd)" }}>¡Pedido confirmado! 🎉</strong>
                      <div style={{ fontSize: ".85rem", color: "var(--soft)", marginTop: 4 }}>
                        Pagarás el anticipo por {cot.confirmacionCliente?.metodo}. {cot.confirmacionCliente?.metodo === "transferencia" ? "También te lo enviamos por correo." : ""}
                      </div>
                      {cot.confirmacionCliente?.metodo === "transferencia" && (
                        <div style={{ marginTop: 8, fontSize: ".85rem", color: "var(--burd)" }}>
                          <div style={{ fontWeight: 800 }}>Datos Citibanamex</div>
                          <div>CLABE: 002320902695222820</div>
                          <div>Tarjeta: 5256 7839 9715 6998</div>
                          <div style={{ color: "var(--soft)", marginTop: 4 }}>Anticipo: <strong>${anticipo.toLocaleString("es-MX")}</strong></div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Solicitar ajustes */}
                  {!pagado && (
                    <>
                      <button className="cta-2" onClick={() => setAjusteOpen((v) => !v)} style={{ marginTop: 10 }}>Solicitar ajustes</button>
                      {ajusteOpen && (
                        <div style={{ marginTop: 8 }}>
                          <textarea value={ajusteTexto} onChange={(e) => setAjusteTexto(e.target.value)} rows={3} placeholder="¿Qué te gustaría cambiar?" style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 12, padding: 10, fontFamily: "var(--font-sans-q)", fontSize: ".88rem" }} />
                          <button className="cta-2" disabled={enviandoAjuste || !ajusteTexto.trim()} onClick={enviarAjuste}>{enviandoAjuste ? "Enviando…" : "Enviar solicitud de ajuste"}</button>
                        </div>
                      )}
                    </>
                  )}

                  {vence && <p className="valid">Cotización válida hasta el {fmt(cot.validUntil)}.</p>}
                </>
              ) : (
                <>
                  <p style={{ color: "var(--soft)", fontSize: ".9rem", fontFamily: "var(--font-sans-q)", marginTop: 8 }}>
                    Tu precio está en revisión. Te lo compartiremos muy pronto por este mismo enlace.
                  </p>
                  <button className="cta-2" onClick={() => setAjusteOpen((v) => !v)} style={{ marginTop: 12 }}>Solicitar ajustes</button>
                  {ajusteOpen && (
                    <div style={{ marginTop: 8 }}>
                      <textarea value={ajusteTexto} onChange={(e) => setAjusteTexto(e.target.value)} rows={3} placeholder="¿Qué te gustaría cambiar?" style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 12, padding: 10, fontFamily: "var(--font-sans-q)", fontSize: ".88rem" }} />
                      <button className="cta-2" disabled={enviandoAjuste || !ajusteTexto.trim()} onClick={enviarAjuste}>{enviandoAjuste ? "Enviando…" : "Enviar solicitud de ajuste"}</button>
                    </div>
                  )}
                </>
              )}
            </section>

            {/* Condiciones */}
            <section className="card cond" style={{ padding: 24 }}>
              <h3>Condiciones e Información Importante ⚠️</h3>
              <ul style={{ margin: 0, padding: 0 }}>
                <li>Para iniciar tu pedido se solicita un anticipo del 50% del total; confirma disponibilidad antes de hacer tu pedido.</li>
                <li><strong>Vigencia:</strong> el presupuesto es válido por 30 días{vence ? ` (vence el ${fmt(cot.validUntil)})` : ""}.</li>
                <li><strong>Cancelaciones:</strong> hasta 5 días antes de la entrega (Lun–Vie 9am–5pm) con cargo del 30%; de lo contrario el cargo será del 50%.</li>
                <li><strong>Cambios de diseño:</strong> hasta 5 días antes de la entrega; pueden generar cambios en la cotización.</li>
                <li><strong>Liquidar y recoger:</strong> liquida un día antes de la entrega; para recoger indica tu número de orden.</li>
              </ul>
            </section>

            {/* Contacto */}
            <section className="card cond" style={{ padding: 24 }}>
              <p style={{ color: "var(--soft)", fontSize: ".88rem", fontFamily: "var(--font-sans-q)" }}>¿Dudas con tu cotización? Escríbenos y te ayudamos.</p>
              <a className="wa" href="https://wa.me/523329295129" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <svg width="20" height="20" viewBox="0 0 32 32" fill="#25D366" aria-hidden="true">
                  <path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.6 6L4 29l8.2-1.6c1.7.9 3.7 1.4 5.8 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3z" opacity=".15"/>
                  <path d="M16.1 5.5c-5.3 0-9.6 4.3-9.6 9.6 0 1.9.6 3.7 1.5 5.2l-1 3.6 3.7-1c1.4.8 3 1.2 4.4 1.2 5.3 0 9.6-4.3 9.6-9.6s-4.3-9.6-9.6-9.6zm5.6 13.6c-.2.7-1.4 1.3-1.9 1.3-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.5-1.2-2.9s.7-2.1 1-2.4c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.5.8 1.9.8 2 .1.1.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.4-.5.5-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.2.7-.1.3.1 1.7.8 2 1 .3.1.5.2.5.3.1.2.1.7-.1 1.4z"/>
                </svg>
                332 929 5129
              </a>
            </section>
          </aside>
        </div>
      </div>
    </Shell>
  );
}

function Spec({ k, v, wide, cap, dot }) {
  return (
    <div style={{
      gridColumn: wide ? "1 / -1" : undefined,
      background: "var(--crema)", border: "1px solid var(--border)",
      borderRadius: "var(--r-lg)", padding: 16,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, fontSize: ".72rem", fontWeight: 800,
        color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".05em",
        marginBottom: 8, fontFamily: "var(--font-sans-q)",
      }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot || "var(--rosa)", display: "inline-block", flexShrink: 0 }} />
        {k}
      </div>
      <div style={{ fontSize: "1rem", color: "var(--text)", lineHeight: 1.45, fontFamily: "var(--font-sans-q)", fontWeight: 700, textTransform: cap ? "capitalize" : undefined }}>
        {v ?? "—"}
      </div>
    </div>
  );
}

function Shell({ children, fontVars }) {
  return (
    <div className={fontVars} style={{ minHeight: "100vh", background: "radial-gradient(1100px 520px at 78% -8%, #FFE2E7 0%, transparent 60%), radial-gradient(900px 480px at 6% 4%, #FFF8F2 0%, transparent 55%), #FFF3F5" }}>
      <main style={{ position: "relative" }}>{children}</main>
    </div>
  );
}
