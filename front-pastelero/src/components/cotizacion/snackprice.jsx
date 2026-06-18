import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { useAuth } from "@/src/context";
import { subirImagen } from "@/src/lib/imageUpload";
import { HORAS_DISPONIBLES, esDiaNoDisponible, MENSAJE_DIA } from "@/src/lib/disponibilidad";
import { Sofia as SofiaFont } from "next/font/google";

const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// ── Opciones hardcodeadas (universales) ──
const EVENTOS = [
  { value: "boda",       label: "Boda",         emoji: "💍" },
  { value: "xv",         label: "XV años",      emoji: "👑" },
  { value: "cumple",     label: "Cumpleaños",   emoji: "🎂" },
  { value: "corporativo",label: "Corporativo",  emoji: "🏢" },
  { value: "baby",       label: "Baby shower",  emoji: "👶" },
  { value: "graduacion", label: "Graduación",   emoji: "🎓" },
  { value: "bautizo",    label: "Bautizo",      emoji: "🕊️" },
  { value: "otro",       label: "Otro",         emoji: "✨" },
];

const ESTILOS = [
  { value: "minimalista", label: "Minimalista", emoji: "○" },
  { value: "elegante",    label: "Elegante",    emoji: "✦" },
  { value: "tropical",    label: "Tropical",    emoji: "🌴" },
  { value: "rustico",     label: "Rústico",     emoji: "🌾" },
  { value: "acuarela",    label: "Acuarela",    emoji: "🎨" },
  { value: "lujoso",      label: "Lujoso",      emoji: "✨" },
];

const ENTREGAS = [
  { value: "recoger-local",  label: "Recoger en local",      emoji: "🏠" },
  { value: "domicilio",      label: "A domicilio (GDL)",     emoji: "🚚" },
  { value: "evento",         label: "Al salón / evento",     emoji: "🎉" },
];
const ENTREGAS_CON_DIRECCION = ["domicilio", "evento"];

const VALIDEZ_DIAS = 30;

// Anticipación mínima por número de personas (días hábiles).
function diasHabilesRequeridos(personas) {
  const p = Number(personas) || 0;
  if (p >= 60) return 14;
  if (p >= 30) return 10;
  return 3;
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
  evento:   { tipo: "", fecha: "", invitados: 30 },
  postresPorPersona: 1,
  postresSlugs: [],
  estilo:   { value: "", comentarios: "", imagenesInspiracion: [] },
  entrega:  { tipo: "", fecha: "", hora: "", direccion: "" },
  cliente:  { nombre: "", telefono: "", email: "" },
};

/**
 * Snackprice — cotización de Mesa de postres con el flujo "game-like"
 * del pastel. Los postres se leen del catálogo que el admin gestiona en
 * /dashboard/cotizacion-catalogos/postres. El monto NO se muestra: lo
 * autoriza y calcula el admin manualmente.
 */
export default function Snackprice({ adminMode = false } = {}) {
  const router = useRouter();
  const { userToken, userEmail, isLoggedIn } = useAuth();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [postres, setPostres] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [subiendoImg, setSubiendoImg] = useState(false);

  useEffect(() => {
    if (userEmail && !adminMode) setForm((f) => ({ ...f, cliente: { ...f.cliente, email: userEmail } }));
  }, [userEmail, adminMode]);

  useEffect(() => {
    fetch(`${API_BASE}/cotizacion-catalogos/postres`)
      .then((r) => r.json())
      .then((j) => setPostres(j.data || []))
      .catch((e) => console.error("Error cargando postres:", e));
  }, []);

  const postresSel = useMemo(
    () => postres.filter((p) => form.postresSlugs.includes(p.slug)),
    [postres, form.postresSlugs]
  );

  const fechaMinEvento = useMemo(
    () => fechaMinimaHabil(diasHabilesRequeridos(form.evento.invitados)),
    [form.evento.invitados]
  );

  const piezasTotales = (Number(form.evento.invitados) || 0) * (Number(form.postresPorPersona) || 0);

  const setEvento = (patch)  => setForm((f) => ({ ...f, evento: { ...f.evento, ...patch } }));
  const setEstilo = (patch)  => setForm((f) => ({ ...f, estilo: { ...f.estilo, ...patch } }));
  const setEntrega = (patch) => setForm((f) => ({ ...f, entrega: { ...f.entrega, ...patch } }));
  const setCliente = (patch) => setForm((f) => ({ ...f, cliente: { ...f.cliente, ...patch } }));

  const togglePostre = (slug) => {
    setForm((f) => {
      const has = f.postresSlugs.includes(slug);
      return {
        ...f,
        postresSlugs: has ? f.postresSlugs.filter((s) => s !== slug) : [...f.postresSlugs, slug],
      };
    });
  };

  const handleImgUpload = async (e) => {
    if (!isLoggedIn || !userToken) {
      Swal.fire({ icon: "info", title: "Inicia sesión para subir fotos", timer: 2500, showConfirmButton: false });
      e.target.value = "";
      return;
    }
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setSubiendoImg(true);
    try {
      const urls = [];
      for (const file of files) {
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

  const quitarImagen = (url) => {
    setEstilo({ imagenesInspiracion: form.estilo.imagenesInspiracion.filter((u) => u !== url) });
  };

  const alertarFalta = (msg) => {
    Swal.fire({ icon: "warning", title: "Falta info", text: msg, timer: 1800, showConfirmButton: false });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.evento.tipo)      return alertarFalta("Selecciona el tipo de evento");
    if (!form.evento.fecha)     return alertarFalta("Selecciona la fecha del evento");
    if (esDiaNoDisponible(form.evento.fecha)) return alertarFalta(MENSAJE_DIA);
    if (!form.evento.invitados) return alertarFalta("Indica cuántas personas");
    if (form.postresSlugs.length === 0) return alertarFalta("Elige al menos un postre");
    if (!form.cliente.nombre)   return alertarFalta("Necesitamos tu nombre");
    if (!form.cliente.telefono) return alertarFalta("Necesitamos un teléfono de contacto");

    setEnviando(true);
    try {
      const payload = {
        tipoProducto: "mesa-postres",
        evento: form.evento,
        postresPorPersona: Number(form.postresPorPersona) || 1,
        postresSlugs: form.postresSlugs,
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
          icon: "success",
          title: "Cotización capturada",
          text: "Ahora puedes costearla y fijar el precio.",
          timer: 1600,
          showConfirmButton: false,
          background: "#fff1f2",
          color: "#540027",
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
        confirmButtonColor: "#FF6F7D",
        background: "#fff1f2",
        color: "#540027",
      });
      setForm({ ...DEFAULT_FORM, cliente: { ...DEFAULT_FORM.cliente, email: userEmail || "" } });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message, confirmButtonColor: "#FF6F7D" });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="mesa-postres">
      <style jsx>{`
        .mesa-postres { padding: 1.5rem; }
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
        .opt-grid.tight { grid-template-columns: repeat(auto-fill, minmax(95px, 1fr)); }
        .opt {
          border: 1.5px solid var(--border-color); background: #fff; border-radius: var(--r-md);
          padding: 0.6rem 0.5rem; font-size: 0.85rem; font-weight: 600; color: var(--burdeos);
          cursor: pointer; transition: all 150ms; display: flex; align-items: center; gap: 0.4rem; text-align: left;
        }
        .opt:hover { background: var(--rosa-4, #FFF3F5); }
        .opt.sel { background: var(--burdeos); color: #fff; border-color: var(--burdeos); box-shadow: var(--shadow-sm); }
        .deco {
          border: 1.5px solid var(--border-color); background: #fff; border-radius: var(--r-md);
          padding: 0.75rem; cursor: pointer; transition: all 150ms; display: flex; flex-direction: column; gap: 0.25rem;
        }
        .deco:hover { background: var(--rosa-4, #FFF3F5); }
        .deco.sel { background: var(--rosa-4, #FFF3F5); border-color: var(--burdeos); }
        .deco-emoji { font-size: 1.5rem; }
        .deco-name { font-weight: 700; font-size: 0.82rem; color: var(--burdeos); }
        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 0.75rem; }
        @media (max-width: 500px) { .row { grid-template-columns: 1fr; } }
        input[type="text"], input[type="email"], input[type="tel"],
        input[type="number"], input[type="date"], input[type="time"], textarea, select {
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
        .img-pill {
          display: inline-flex; align-items: center; gap: 4px; background: var(--rosa-4, #FFF3F5);
          padding: 4px 10px; border-radius: var(--r-pill); font-size: 0.75rem; margin: 4px 4px 0 0;
        }
        .img-pill button { background: transparent; border: none; cursor: pointer; color: var(--burdeos); font-weight: 800; }
      `}</style>

      <form onSubmit={submit}>
        <div className="layout">
          <div>
            {/* ── 1. Evento ──────────────────────────────────── */}
            <fieldset>
              <legend>1. ¿Qué celebras?</legend>
              <div className="opt-grid">
                {EVENTOS.map((e) => (
                  <button
                    type="button"
                    key={e.value}
                    className={`opt ${form.evento.tipo === e.value ? "sel" : ""}`}
                    onClick={() => setEvento({ tipo: e.value })}
                  >
                    <span>{e.emoji}</span>{e.label}
                  </button>
                ))}
              </div>
              <div className="row">
                <div>
                  <label className="fld">Fecha del evento</label>
                  <input
                    type="date"
                    value={form.evento.fecha}
                    min={fechaMinEvento}
                    onChange={(e) => {
                      if (esDiaNoDisponible(e.target.value)) { alertarFalta(MENSAJE_DIA); return; }
                      setEvento({ fecha: e.target.value });
                    }}
                  />
                  <p style={{ fontSize: ".7rem", color: "var(--text-soft)", marginTop: ".25rem" }}>
                    Anticipación mínima: {diasHabilesRequeridos(form.evento.invitados)} días hábiles
                    {" "}para {form.evento.invitados || 0} personas.
                  </p>
                </div>
                <div>
                  <label className="fld">Personas</label>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={form.evento.invitados}
                    onChange={(e) => {
                      const n = Number(e.target.value) || 0;
                      setEvento({ invitados: Math.max(10, Math.round(n / 10) * 10) });
                    }}
                  />
                  <p style={{ fontSize: ".7rem", color: "var(--text-soft)", marginTop: ".25rem" }}>
                    En incrementos de 10 personas.
                  </p>
                </div>
              </div>
            </fieldset>

            {/* ── 2. Postres por persona ──────────────────────── */}
            <fieldset>
              <legend>2. ¿Cuántos postres por persona?</legend>
              <div className="row">
                <div>
                  <label className="fld">Postres por persona</label>
                  <input
                    type="number"
                    min="1"
                    value={form.postresPorPersona}
                    onChange={(e) => setForm({ ...form, postresPorPersona: Math.max(1, Number(e.target.value) || 1) })}
                  />
                </div>
                <div style={{ alignSelf: "end" }}>
                  <p style={{ fontSize: ".8rem", color: "var(--text-soft)" }}>
                    Total aproximado: <strong style={{ color: "var(--burdeos)" }}>{piezasTotales} piezas</strong>
                  </p>
                </div>
              </div>
            </fieldset>

            {/* ── 3. Postres (multi) ──────────────────────────── */}
            <fieldset>
              <legend>3. Elige tus postres</legend>
              {postres.length === 0 ? (
                <p style={{ fontSize: ".82rem", color: "var(--text-soft)" }}>Cargando opciones…</p>
              ) : (
                <div className="opt-grid tight">
                  {postres.map((p) => {
                    const sel = form.postresSlugs.includes(p.slug);
                    return (
                      <div
                        key={p.slug}
                        className={`deco ${sel ? "sel" : ""}`}
                        onClick={() => togglePostre(p.slug)}
                      >
                        <div className="deco-emoji">{p.emoji || "🍰"}</div>
                        <div className="deco-name">{p.nombre}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </fieldset>

            {/* ── 4. Estilo + inspiración ─────────────────────── */}
            <fieldset>
              <legend>4. Estilo y referencias</legend>
              <div className="opt-grid tight">
                {ESTILOS.map((s) => (
                  <button
                    type="button"
                    key={s.value}
                    className={`opt ${form.estilo.value === s.value ? "sel" : ""}`}
                    onClick={() => setEstilo({ value: s.value })}
                  >
                    <span>{s.emoji}</span>{s.label}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: "1rem" }}>
                <label className="fld">Comentarios / detalles especiales</label>
                <textarea
                  rows={3}
                  value={form.estilo.comentarios}
                  onChange={(e) => setEstilo({ comentarios: e.target.value })}
                  placeholder="Tema, colores, alergias, etc."
                />
              </div>
              <div style={{ marginTop: "1rem" }}>
                <label className="fld">Imágenes de inspiración (opcional)</label>
                {!isLoggedIn ? (
                  <p style={{ fontSize: ".78rem", color: "var(--text-soft)" }}>Inicia sesión para adjuntar fotos.</p>
                ) : (
                  <input type="file" multiple accept="image/*" onChange={handleImgUpload} disabled={subiendoImg} />
                )}
                {subiendoImg && <p style={{ fontSize: ".78rem", color: "var(--rosa)" }}>Subiendo…</p>}
                <div>
                  {form.estilo.imagenesInspiracion.map((url) => (
                    <span key={url} className="img-pill">
                      <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--burdeos)" }}>📷</a>
                      <button type="button" onClick={() => quitarImagen(url)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            </fieldset>

            {/* ── 5. Entrega ──────────────────────────────────── */}
            <fieldset>
              <legend>5. Entrega</legend>
              <div className="opt-grid">
                {ENTREGAS.map((e) => (
                  <button
                    type="button"
                    key={e.value}
                    className={`opt ${form.entrega.tipo === e.value ? "sel" : ""}`}
                    onClick={() => setEntrega({ tipo: e.value })}
                  >
                    <span>{e.emoji}</span>{e.label}
                  </button>
                ))}
              </div>
              <div className="row">
                <div>
                  <label className="fld">Hora aproximada</label>
                  <select
                    value={form.entrega.hora}
                    onChange={(e) => setEntrega({ hora: e.target.value })}
                  >
                    <option value="">Selecciona una hora</option>
                    {HORAS_DISPONIBLES.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                {ENTREGAS_CON_DIRECCION.includes(form.entrega.tipo) && (
                  <div>
                    <label className="fld">Dirección / zona</label>
                    <input
                      type="text"
                      value={form.entrega.direccion}
                      onChange={(e) => setEntrega({ direccion: e.target.value })}
                      placeholder="Colonia o salón"
                    />
                  </div>
                )}
              </div>
              <p style={{ fontSize: ".72rem", color: "var(--text-soft)", marginTop: ".5rem" }}>
                La entrega es el mismo día del evento
                {form.evento.fecha ? ` (${new Date(form.evento.fecha + "T00:00:00").toLocaleDateString("es-MX")})` : ""}.
              </p>
            </fieldset>

            {/* ── 6. Cliente ──────────────────────────────────── */}
            <fieldset>
              <legend>6. Tus datos</legend>
              <div className="row">
                <div>
                  <label className="fld">Nombre completo</label>
                  <input type="text" value={form.cliente.nombre} onChange={(e) => setCliente({ nombre: e.target.value })} required />
                </div>
                <div>
                  <label className="fld">Teléfono</label>
                  <input type="tel" value={form.cliente.telefono} onChange={(e) => setCliente({ telefono: e.target.value })} placeholder="33-1234-5678" required />
                </div>
                <div>
                  <label className="fld">Email</label>
                  <input type="email" value={form.cliente.email} onChange={(e) => setCliente({ email: e.target.value })} />
                </div>
              </div>
            </fieldset>
          </div>

          {/* ── Summary side ─────────────────────────────────── */}
          <aside className="summary-side">
            <h3 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.4rem", marginBottom: ".5rem" }}>
              Tu mesa de postres
            </h3>
            <p style={{ fontSize: ".75rem", color: "var(--text-soft)", marginBottom: ".75rem" }}>
              Resumen de tu solicitud · Confirmamos en 24h
            </p>

            <div className="sum-row"><span style={{ color: "var(--text-soft)" }}>Evento</span><strong style={{ color: "var(--burdeos)" }}>{EVENTOS.find((x) => x.value === form.evento.tipo)?.label || "—"}</strong></div>
            <div className="sum-row"><span style={{ color: "var(--text-soft)" }}>Personas</span><strong style={{ color: "var(--burdeos)" }}>{form.evento.invitados || "—"}</strong></div>
            <div className="sum-row"><span style={{ color: "var(--text-soft)" }}>Postres/persona</span><strong style={{ color: "var(--burdeos)" }}>{form.postresPorPersona}</strong></div>
            <div className="sum-row"><span style={{ color: "var(--text-soft)" }}>Total piezas</span><strong style={{ color: "var(--burdeos)" }}>{piezasTotales}</strong></div>
            <div className="sum-row">
              <span style={{ color: "var(--text-soft)" }}>Postres</span>
              <strong style={{ color: "var(--burdeos)", maxWidth: "60%", textAlign: "right", overflowWrap: "anywhere" }}>
                {postresSel.length ? postresSel.map((p) => p.nombre).join(", ") : "—"}
              </strong>
            </div>

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
