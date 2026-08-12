import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { useAuth } from "@/src/context";
import { subirImagen } from "@/src/lib/imageUpload";
import { HORAS_DISPONIBLES, esDiaNoDisponible, MENSAJE_DIA, MENSAJE_BLOQUEADA, fetchFechasBloqueadas } from "@/src/lib/disponibilidad";
import { Sofia as SofiaFont } from "next/font/google";

const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const EVENTOS = [
  { value: "corporativo", label: "Corporativo", emoji: "🏢" },
  { value: "boda",        label: "Boda",        emoji: "💍" },
  { value: "xv",          label: "XV años",     emoji: "👑" },
  { value: "cumple",      label: "Cumpleaños",  emoji: "🎂" },
  { value: "baby",        label: "Baby shower", emoji: "👶" },
  { value: "graduacion",  label: "Graduación",  emoji: "🎓" },
  { value: "bautizo",     label: "Bautizo",     emoji: "🕊️" },
  { value: "otro",        label: "Otro",        emoji: "✨" },
];

const ENTREGAS = [
  { value: "recoger-local", label: "Recoger en local",  emoji: "🏠" },
  { value: "domicilio",     label: "A domicilio (GDL)", emoji: "🚚" },
  { value: "evento",        label: "Al salón / oficina", emoji: "🎉" },
];
const ENTREGAS_CON_DIRECCION = ["domicilio", "evento"];

const VALIDEZ_DIAS = 30;
const MAX_IMAGENES = 2;
// Las galletas decoradas se piden por pieza, con un mínimo por pedido.
const MINIMO_PIEZAS = 6;

// Anticipación mínima por volumen (días hábiles).
function diasHabilesRequeridos(piezas) {
  const p = Number(piezas) || 0;
  if (p > 120) return 12;
  if (p > 60) return 8;
  return 5;
}
function fechaMinimaHabil(diasHabiles) {
  const d = new Date();
  let restantes = diasHabiles;
  while (restantes > 0) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) restantes--;
  }
  return d.toISOString().slice(0, 10);
}

const DEFAULT_FORM = {
  evento:  { tipo: "", fecha: "", invitados: MINIMO_PIEZAS },
  piezas: MINIMO_PIEZAS,
  saborSlug: "",
  estilo:  { value: "", comentarios: "", imagenesInspiracion: [] },
  entrega: { tipo: "", hora: "", direccion: "" },
  cliente: { nombre: "", telefono: "", email: "" },
};

/**
 * Cotización de Galletas decoradas (personajes, diseño, logo). Se piden
 * por pieza con un mínimo, y el precio depende de la dificultad del
 * diseño. El cliente elige fecha, sabor, cantidad y sube dos imágenes de
 * referencia del diseño. El precio lo fija el admin (igual que pastel y
 * mesa de postres): aquí no se muestra monto.
 */
export default function GalletaPersonalizada({ adminMode = false } = {}) {
  const router = useRouter();
  const { userToken, userEmail, isLoggedIn } = useAuth();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [sabores, setSabores] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [subiendoImg, setSubiendoImg] = useState(false);
  const [bloqueadas, setBloqueadas] = useState(new Set());

  useEffect(() => { fetchFechasBloqueadas(API_BASE).then(setBloqueadas); }, []);

  useEffect(() => {
    if (userEmail && !adminMode) setForm((f) => ({ ...f, cliente: { ...f.cliente, email: userEmail } }));
  }, [userEmail, adminMode]);

  useEffect(() => {
    fetch(`${API_BASE}/cotizacion-catalogos/sabores`)
      .then((r) => r.json())
      .then((j) => setSabores((j.data || []).filter((s) => s.paraGalleta)))
      .catch((e) => console.error("Error cargando sabores:", e));
  }, []);

  const piezasTotales = Number(form.piezas) || 0;
  const fechaMinEvento = useMemo(
    () => fechaMinimaHabil(diasHabilesRequeridos(piezasTotales)),
    [piezasTotales]
  );
  const saborSel = sabores.find((s) => s.slug === form.saborSlug);

  const setEvento  = (patch) => setForm((f) => ({ ...f, evento:  { ...f.evento,  ...patch } }));
  const setEstilo  = (patch) => setForm((f) => ({ ...f, estilo:  { ...f.estilo,  ...patch } }));
  const setEntrega = (patch) => setForm((f) => ({ ...f, entrega: { ...f.entrega, ...patch } }));
  const setCliente = (patch) => setForm((f) => ({ ...f, cliente: { ...f.cliente, ...patch } }));

  const alertarFalta = (msg) =>
    Swal.fire({ icon: "warning", title: "Falta info", text: msg, timer: 1800, showConfirmButton: false });

  const handleImgUpload = async (e) => {
    if (!isLoggedIn || !userToken) {
      Swal.fire({ icon: "info", title: "Inicia sesión para subir fotos", timer: 2500, showConfirmButton: false });
      e.target.value = "";
      return;
    }
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const espacio = MAX_IMAGENES - form.estilo.imagenesInspiracion.length;
    if (espacio <= 0) {
      alertarFalta(`Puedes adjuntar máximo ${MAX_IMAGENES} imágenes de referencia.`);
      e.target.value = "";
      return;
    }
    setSubiendoImg(true);
    try {
      const urls = [];
      for (const file of files.slice(0, espacio)) {
        const { fileUrl } = await subirImagen(file, API_BASE, userToken);
        urls.push(fileUrl);
      }
      setEstilo({ imagenesInspiracion: [...form.estilo.imagenesInspiracion, ...urls] });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error subiendo imagen", text: err.message, timer: 2500, showConfirmButton: false });
    } finally {
      setSubiendoImg(false);
      e.target.value = "";
    }
  };

  const quitarImagen = (url) =>
    setEstilo({ imagenesInspiracion: form.estilo.imagenesInspiracion.filter((u) => u !== url) });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.evento.tipo)  return alertarFalta("Selecciona el tipo de evento");
    if (!form.evento.fecha) return alertarFalta("Selecciona la fecha de entrega");
    if (esDiaNoDisponible(form.evento.fecha)) return alertarFalta(MENSAJE_DIA);
    if (bloqueadas.has(form.evento.fecha))    return alertarFalta(MENSAJE_BLOQUEADA);
    if (!form.saborSlug)    return alertarFalta("Elige el sabor de la galleta");
    if (piezasTotales < MINIMO_PIEZAS) return alertarFalta(`El pedido mínimo es de ${MINIMO_PIEZAS} galletas`);
    if (!form.cliente.nombre)   return alertarFalta("Necesitamos tu nombre");
    if (!form.cliente.telefono) return alertarFalta("Necesitamos un teléfono de contacto");

    setEnviando(true);
    try {
      const payload = {
        tipoProducto: "galleta",
        evento: { ...form.evento, invitados: piezasTotales },
        piezas: piezasTotales,
        saborSlug: form.saborSlug,
        estilo: form.estilo,
        entrega: {
          ...form.entrega,
          fecha: form.evento.fecha,
          direccion: ENTREGAS_CON_DIRECCION.includes(form.entrega.tipo) ? form.entrega.direccion : "",
        },
        cliente: form.cliente,
      };
      const r = await fetch(`${API_BASE}/cotizacion-personalizada`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(userToken ? { Authorization: `Bearer ${userToken}` } : {}) },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Error al enviar la cotización");

      if (adminMode && j.data?._id) {
        await Swal.fire({
          icon: "success", title: "Cotización capturada",
          text: "Ahora puedes costearla y fijar el precio.",
          timer: 1600, showConfirmButton: false, background: "#fff1f2", color: "#540027",
        });
        router.push(`/dashboard/cotizaciones-personalizadas/${j.data._id}`);
        return;
      }

      const validUntil = j.data?.validUntil
        ? new Date(j.data.validUntil).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })
        : null;

      Swal.fire({
        icon: "success",
        title: "¡Cotización enviada!",
        html: `Te contactaremos en menos de 24 horas hábiles.${
          validUntil ? `<br/><br/><strong>Tu cotización es válida hasta el ${validUntil}</strong> (${VALIDEZ_DIAS} días).` : ""
        }`,
        confirmButtonColor: "#FF6F7D", background: "#fff1f2", color: "#540027",
      });
      setForm({ ...DEFAULT_FORM, cliente: { ...DEFAULT_FORM.cliente, email: userEmail || "" } });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message, confirmButtonColor: "#FF6F7D" });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="galletas-pers">
      <style jsx>{`
        .galletas-pers { padding: 1.5rem; }
        .layout { display: grid; grid-template-columns: 1fr 280px; gap: 1.5rem; align-items: start; }
        @media (max-width: 900px) {
          .layout { grid-template-columns: 1fr; }
          .summary-side { position: static !important; }
        }
        fieldset {
          border: 1px solid var(--border-color);
          border-radius: var(--r-lg);
          padding: 1.25rem; margin-bottom: 1rem; background: #fff;
        }
        legend { font-family: var(--font-sofia); color: var(--burdeos); font-size: 1.15rem; padding: 0 0.5rem; }
        .opt-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 0.5rem; margin-top: 0.5rem;
        }
        .opt {
          border: 1.5px solid var(--border-color); background: #fff; border-radius: var(--r-md);
          padding: 0.6rem 0.5rem; font-size: 0.85rem; font-weight: 600; color: var(--burdeos);
          cursor: pointer; transition: all 150ms; display: flex; align-items: center; gap: 0.4rem; text-align: left;
        }
        .opt:hover { background: var(--rosa-4, #FFF3F5); }
        .opt.sel { background: var(--burdeos); color: #fff; border-color: var(--burdeos); box-shadow: var(--shadow-sm); }
        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 0.75rem; }
        @media (max-width: 500px) { .row { grid-template-columns: 1fr; } }
        input[type="text"], input[type="email"], input[type="tel"],
        input[type="number"], input[type="date"], textarea, select {
          width: 100%; padding: 0.55rem 0.75rem; border: 1.5px solid var(--border-color);
          border-radius: var(--r-md); font-size: 0.88rem; font-family: var(--font-nunito); background: #fff;
        }
        input:focus, textarea:focus, select:focus {
          outline: none; border-color: var(--rosa); box-shadow: 0 0 0 3px rgba(255,111,125,0.15);
        }
        label.fld {
          display: block; font-size: 0.72rem; font-weight: 700; color: var(--text-soft);
          text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.25rem;
        }
        .summary-side {
          position: sticky; top: 90px;
          background: linear-gradient(180deg, var(--rosa-4, #FFF3F5) 0%, #fff 100%);
          border: 1.5px solid var(--rosa); border-radius: var(--r-xl); padding: 1.25rem;
        }
        .sum-row {
          display: flex; justify-content: space-between; font-size: 0.82rem;
          padding: 0.4rem 0; border-bottom: 1px dashed var(--border-color);
        }
        .submit-btn {
          width: 100%; background: var(--burdeos); color: #fff; border: none; border-radius: var(--r-pill);
          padding: 0.85rem 1.5rem; font-weight: 800; font-size: 0.95rem; cursor: pointer;
          font-family: var(--font-nunito); margin-top: 1rem; box-shadow: var(--shadow-md); transition: all 150ms;
        }
        .submit-btn:hover:not(:disabled) { background: var(--rosa); transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .ref-grid { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem; }
        .ref-card {
          width: 110px; height: 110px; border-radius: var(--r-md); overflow: hidden;
          border: 1.5px solid var(--border-color); position: relative; background: #fff;
        }
        .ref-card img { width: 100%; height: 100%; object-fit: cover; }
        .ref-card button {
          position: absolute; top: 4px; right: 4px; border: none; cursor: pointer;
          background: rgba(84,0,39,.85); color: #fff; border-radius: 50%;
          width: 22px; height: 22px; font-weight: 800; line-height: 1;
        }
        .ref-empty {
          width: 110px; height: 110px; border-radius: var(--r-md);
          border: 1.5px dashed var(--border-strong); display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 4px; cursor: pointer;
          color: var(--text-soft); font-size: 0.72rem; text-align: center; padding: 6px;
        }
        .ref-empty:hover { background: var(--rosa-4, #FFF3F5); }
      `}</style>

      <form onSubmit={submit}>
        <div className="layout">
          <div>
            {/* ── 1. Evento ──────────────────────────────────── */}
            <fieldset>
              <legend>1. ¿Para qué evento?</legend>
              <div className="opt-grid">
                {EVENTOS.map((e) => (
                  <button type="button" key={e.value}
                    className={`opt ${form.evento.tipo === e.value ? "sel" : ""}`}
                    onClick={() => setEvento({ tipo: e.value })}>
                    <span>{e.emoji}</span>{e.label}
                  </button>
                ))}
              </div>
              <div className="row">
                <div>
                  <label className="fld">Fecha de entrega</label>
                  <input type="date" value={form.evento.fecha} min={fechaMinEvento}
                    onChange={(e) => {
                      if (esDiaNoDisponible(e.target.value)) { alertarFalta(MENSAJE_DIA); return; }
                      if (bloqueadas.has(e.target.value)) { alertarFalta(MENSAJE_BLOQUEADA); return; }
                      setEvento({ fecha: e.target.value });
                    }} />
                  <p style={{ fontSize: ".7rem", color: "var(--text-soft)", marginTop: ".25rem" }}>
                    Anticipación mínima: {diasHabilesRequeridos(piezasTotales)} días hábiles
                  </p>
                </div>
              </div>
            </fieldset>

            {/* ── 2. Sabor y cantidad ────────────────────────── */}
            <fieldset>
              <legend>2. Sabor y cantidad</legend>
              {sabores.length === 0 ? (
                <p style={{ fontSize: ".82rem", color: "var(--text-soft)" }}>
                  Estamos actualizando los sabores disponibles. Escríbenos por WhatsApp y con gusto te ayudamos.
                </p>
              ) : (
                <div className="opt-grid">
                  {sabores.map((s) => (
                    <button type="button" key={s.slug}
                      className={`opt ${form.saborSlug === s.slug ? "sel" : ""}`}
                      onClick={() => setForm((f) => ({ ...f, saborSlug: s.slug }))}
                      title={s.descripcion || s.nombre}>
                      🍪 {s.nombre}
                    </button>
                  ))}
                </div>
              )}
              <div className="row">
                <div>
                  <label className="fld">¿Cuántas galletas?</label>
                  <input type="number" min={MINIMO_PIEZAS} step="1" value={form.piezas}
                    onChange={(e) => setForm((f) => ({ ...f, piezas: Math.max(1, Number(e.target.value) || 1) }))}
                    onBlur={(e) => {
                      const n = Number(e.target.value) || 0;
                      if (n < MINIMO_PIEZAS) setForm((f) => ({ ...f, piezas: MINIMO_PIEZAS }));
                    }} />
                  <p style={{ fontSize: ".7rem", color: "var(--text-soft)", marginTop: ".25rem" }}>
                    Pedido mínimo: <strong>{MINIMO_PIEZAS} galletas</strong>. Se cotizan por pieza según la
                    dificultad del diseño.
                  </p>
                </div>
              </div>
            </fieldset>

            {/* ── 3. Diseño y referencias ────────────────────── */}
            <fieldset>
              <legend>3. Diseño y referencias</legend>
              <div>
                <label className="fld">Cuéntanos el diseño que imaginas</label>
                <textarea rows={3} value={form.estilo.comentarios}
                  onChange={(e) => setEstilo({ comentarios: e.target.value })}
                  placeholder="Tema, colores, logo de la empresa, texto en las galletas, alergias…" />
              </div>
              <div style={{ marginTop: "1rem" }}>
                <label className="fld">Imágenes de referencia (hasta {MAX_IMAGENES})</label>
                {!isLoggedIn ? (
                  <p style={{ fontSize: ".78rem", color: "var(--text-soft)" }}>Inicia sesión para adjuntar fotos.</p>
                ) : (
                  <div className="ref-grid">
                    {form.estilo.imagenesInspiracion.map((url) => (
                      <div key={url} className="ref-card">
                        <img src={url} alt="Referencia" />
                        <button type="button" onClick={() => quitarImagen(url)} aria-label="Quitar imagen">×</button>
                      </div>
                    ))}
                    {form.estilo.imagenesInspiracion.length < MAX_IMAGENES && (
                      <label className="ref-empty">
                        <span style={{ fontSize: "1.4rem" }}>{subiendoImg ? "…" : "📷"}</span>
                        {subiendoImg ? "Subiendo…" : "Agregar referencia"}
                        <input type="file" accept="image/*" multiple className="hidden" style={{ display: "none" }}
                          onChange={handleImgUpload} disabled={subiendoImg} />
                      </label>
                    )}
                  </div>
                )}
                <p style={{ fontSize: ".7rem", color: "var(--text-soft)", marginTop: ".5rem" }}>
                  Una foto de referencia nos ayuda muchísimo a cotizar con precisión.
                </p>
              </div>
            </fieldset>

            {/* ── 4. Entrega ─────────────────────────────────── */}
            <fieldset>
              <legend>4. Entrega</legend>
              <div className="opt-grid">
                {ENTREGAS.map((e) => (
                  <button type="button" key={e.value}
                    className={`opt ${form.entrega.tipo === e.value ? "sel" : ""}`}
                    onClick={() => setEntrega({ tipo: e.value })}>
                    <span>{e.emoji}</span>{e.label}
                  </button>
                ))}
              </div>
              <div className="row">
                <div>
                  <label className="fld">Hora aproximada</label>
                  <select value={form.entrega.hora} onChange={(e) => setEntrega({ hora: e.target.value })}>
                    <option value="">Selecciona una hora</option>
                    {HORAS_DISPONIBLES.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                {ENTREGAS_CON_DIRECCION.includes(form.entrega.tipo) && (
                  <div>
                    <label className="fld">Dirección / zona</label>
                    <input type="text" value={form.entrega.direccion}
                      onChange={(e) => setEntrega({ direccion: e.target.value })}
                      placeholder="Colonia, oficina o salón" />
                  </div>
                )}
              </div>
            </fieldset>

            {/* ── 5. Cliente ─────────────────────────────────── */}
            <fieldset>
              <legend>5. Tus datos</legend>
              <div className="row">
                <div>
                  <label className="fld">Nombre completo</label>
                  <input type="text" value={form.cliente.nombre} onChange={(e) => setCliente({ nombre: e.target.value })} required />
                </div>
                <div>
                  <label className="fld">Teléfono</label>
                  <input type="tel" inputMode="numeric" maxLength={10} value={form.cliente.telefono}
                    onChange={(e) => setCliente({ telefono: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    placeholder="3312345678" required />
                </div>
                <div>
                  <label className="fld">Email</label>
                  <input type="email" value={form.cliente.email} onChange={(e) => setCliente({ email: e.target.value })} />
                </div>
              </div>
            </fieldset>
          </div>

          {/* ── Resumen ──────────────────────────────────────── */}
          <aside className="summary-side">
            <h3 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.4rem", marginBottom: ".5rem" }}>
              Tus galletas
            </h3>
            <p style={{ fontSize: ".75rem", color: "var(--text-soft)", marginBottom: ".75rem" }}>
              Resumen de tu solicitud · Confirmamos en 24h
            </p>

            <div className="sum-row"><span style={{ color: "var(--text-soft)" }}>Evento</span><strong style={{ color: "var(--burdeos)" }}>{EVENTOS.find((x) => x.value === form.evento.tipo)?.label || "—"}</strong></div>
            <div className="sum-row"><span style={{ color: "var(--text-soft)" }}>Sabor</span><strong style={{ color: "var(--burdeos)" }}>{saborSel?.nombre || "—"}</strong></div>
            <div className="sum-row"><span style={{ color: "var(--text-soft)" }}>Galletas</span><strong style={{ color: "var(--burdeos)" }}>{piezasTotales}</strong></div>
            <div className="sum-row"><span style={{ color: "var(--text-soft)" }}>Referencias</span><strong style={{ color: "var(--burdeos)" }}>{form.estilo.imagenesInspiracion.length}/{MAX_IMAGENES}</strong></div>

            <p style={{ fontSize: ".72rem", color: "var(--text-soft)", marginTop: ".75rem", fontStyle: "italic" }}>
              El monto se calcula y autoriza manualmente. Te enviamos el precio
              final por WhatsApp o correo tras revisar tu solicitud.
            </p>
            <p style={{ fontSize: ".72rem", color: "var(--burdeos)", marginTop: ".5rem", fontWeight: 700 }}>
              Validez de la cotización: {VALIDEZ_DIAS} días desde el envío.
            </p>

            <button type="submit" disabled={enviando} className="submit-btn">
              {enviando ? (adminMode ? "Capturando…" : "Solicitando…") : (adminMode ? "Capturar cotización" : "Solicitar cotización")}
            </button>
          </aside>
        </div>
      </form>
    </div>
  );
}
