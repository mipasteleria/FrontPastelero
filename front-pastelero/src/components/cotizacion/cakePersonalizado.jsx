import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { useAuth } from "@/src/context";
import { subirImagen } from "@/src/lib/imageUpload";
import { HORAS_DISPONIBLES, esDiaNoDisponible, MENSAJE_DIA } from "@/src/lib/disponibilidad";
import { Sofia as SofiaFont } from "next/font/google";

const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// ── Opciones hardcodeadas (universales — no necesitan catálogo admin) ──
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

const NIVELES = [
  { value: 1, label: "1 piso" },
  { value: 2, label: "2 pisos" },
  { value: 3, label: "3 pisos" },
  { value: 4, label: "4+ pisos" },
];

const COLORES = [
  "#FFC9D4", "#FF8FA3", "#F4A6CD", "#D6A7BC", "#FFE9A6",
  "#A0E0B8", "#A0C8E0", "#C9B6E0", "#F2EAD3", "#FFFFFF",
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

// Tipos de entrega que requieren dirección/zona.
const ENTREGAS_CON_DIRECCION = ["domicilio", "evento"];

// ── Anticipación mínima por número de porciones (días hábiles) ──────
// < 30 porciones → 3 días hábiles
// 30 a 59        → 10 días hábiles
// 60 o más       → 14 días hábiles
const VALIDEZ_DIAS = 30; // la cotización es válida 30 días desde el envío.

function diasHabilesRequeridos(porciones) {
  const p = Number(porciones) || 0;
  if (p >= 60) return 14;
  if (p >= 30) return 10;
  return 3;
}

// Cupcakes — anticipación por docenas:
//   < 6 docenas   → 5 días hábiles
//   6 a 10        → 8 días hábiles
//   > 10          → 12 días hábiles
function diasHabilesCupcake(cupcakes) {
  const docenas = Math.max(1, Math.round((Number(cupcakes) || 0) / 12));
  if (docenas > 10) return 12;
  if (docenas >= 6) return 8;
  return 5;
}

// Suma `n` días hábiles (lunes–viernes) a partir de hoy y devuelve la
// fecha resultante en formato YYYY-MM-DD para usar como `min` del <input>.
function fechaMinimaHabil(diasHabiles) {
  const d = new Date();
  let restantes = diasHabiles;
  while (restantes > 0) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay(); // 0 = domingo, 6 = sábado
    if (dow !== 0 && dow !== 6) restantes--;
  }
  return d.toISOString().slice(0, 10);
}

const DEFAULT_FORM = {
  evento:    { tipo: "", fecha: "", invitados: 20 },
  niveles:   1,
  saborSlug: "",
  saboresCupcake: [{ saborSlug: "", docenas: 1 }], // solo cupcakes
  rellenoSlug: "",
  coberturaSlug: "",
  colorPrincipal: "",
  decoracionesSlugs: [],
  estilo:    { value: "", comentarios: "", imagenesInspiracion: [] },
  entrega:   { tipo: "", fecha: "", hora: "", direccion: "" },
  cliente:   { nombre: "", telefono: "", email: "" },
};

/**
 * CakePersonalizado — flow rediseñado de cotización de pastel.
 *
 * Reemplaza al viejo `<Cakeprice />` cuando el cliente elige "Pastel" en
 * `/cotizacion`. Los catálogos (sabor/relleno/cobertura/decoración) se
 * leen del back (admin los gestiona en `/dashboard/cotizacion-catalogos/*`).
 *
 * UX: visual selectors en vez de dropdowns. Multi-select para decoración.
 * Sticky summary card con desglose y estimado preliminar.
 */
export default function CakePersonalizado({ tipoProducto = "pastel", adminMode = false } = {}) {
  const esCupcake = tipoProducto === "cupcake";
  // Cupcakes se cotizan por docena (múltiplos de 12); pastel de 10 en 10.
  const pasoPorciones = esCupcake ? 12 : 10;
  const router = useRouter();
  const { userToken, userEmail, isLoggedIn } = useAuth();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [catalogos, setCatalogos] = useState({
    sabores: [], rellenos: [], coberturas: [], decoraciones: [],
  });
  const [enviando, setEnviando] = useState(false);
  const [subiendoImg, setSubiendoImg] = useState(false);

  // ── Pre-llenar email del usuario logeado ─────────────────────────
  useEffect(() => {
    // En modo captura (admin) NO prellenamos con el email del admin —
    // los datos son del cliente y se teclean a mano.
    if (userEmail && !adminMode) {
      setForm((f) => ({ ...f, cliente: { ...f.cliente, email: userEmail } }));
    }
  }, [userEmail, adminMode]);

  // ── Normalizar porciones (solo pastel: de 10 en 10) ──────────────
  useEffect(() => {
    if (esCupcake) return; // cupcakes: el total lo derivan las docenas
    setForm((f) => {
      const n = Number(f.evento.invitados) || 10;
      const norm = Math.max(10, Math.round(n / 10) * 10);
      if (norm === f.evento.invitados) return f;
      return { ...f, evento: { ...f.evento, invitados: norm } };
    });
  }, [esCupcake]);

  // ── Cupcakes: total de docenas/cupcakes desde los sabores ─────────
  const totalDocenas = esCupcake
    ? (form.saboresCupcake || []).reduce((acc, r) => acc + (Number(r.docenas) || 0), 0)
    : 0;
  const totalCupcakes = totalDocenas * 12;

  // Mantener evento.invitados sincronizado con el total de cupcakes.
  useEffect(() => {
    if (!esCupcake) return;
    setForm((f) => f.evento.invitados === totalCupcakes ? f : { ...f, evento: { ...f.evento, invitados: totalCupcakes } });
  }, [esCupcake, totalCupcakes]);

  // ── Cargar catálogos ─────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sR, rR, cR, dR] = await Promise.all([
          fetch(`${API_BASE}/cotizacion-catalogos/sabores`),
          fetch(`${API_BASE}/cotizacion-catalogos/rellenos`),
          fetch(`${API_BASE}/cotizacion-catalogos/coberturas`),
          fetch(`${API_BASE}/cotizacion-catalogos/decoraciones`),
        ]);
        const [sJ, rJ, cJ, dJ] = await Promise.all([sR.json(), rR.json(), cR.json(), dR.json()]);
        setCatalogos({
          sabores: sJ.data || [],
          rellenos: rJ.data || [],
          coberturas: cJ.data || [],
          decoraciones: dJ.data || [],
        });
      } catch (e) {
        console.error("Error cargando catálogos:", e);
      }
    };
    fetchAll();
  }, []);

  // ── Resumen de selección (sin precio) ───────────────────────────
  // El monto NO se muestra al cliente: lo autoriza y calcula el admin
  // manualmente. Aquí sólo resolvemos los nombres para el resumen.
  const desglose = useMemo(() => {
    const sabor = catalogos.sabores.find((s) => s.slug === form.saborSlug);
    const relleno = catalogos.rellenos.find((r) => r.slug === form.rellenoSlug);
    const cobertura = catalogos.coberturas.find((c) => c.slug === form.coberturaSlug);
    const decosSel = catalogos.decoraciones.filter((d) => form.decoracionesSlugs.includes(d.slug));
    return { sabor, relleno, cobertura, decosSel };
  }, [form, catalogos]);

  // Sabores disponibles según el producto (la receta de pastel y cupcake difiere).
  const saboresProducto = catalogos.sabores.filter((s) => esCupcake ? s.paraCupcake : s.paraPastel);

  // Anticipación mínima → fecha `min`. Cupcakes por docenas; resto por porciones.
  const diasAnticipacion = esCupcake
    ? diasHabilesCupcake(form.evento.invitados)
    : diasHabilesRequeridos(form.evento.invitados);
  const fechaMinEvento = useMemo(
    () => fechaMinimaHabil(diasAnticipacion),
    [diasAnticipacion]
  );

  // ── Cupcakes: manejar filas de sabor + docenas ───────────────────
  const setSaborCupcakeRow = (i, patch) => setForm((f) => ({
    ...f, saboresCupcake: f.saboresCupcake.map((r, idx) => idx === i ? { ...r, ...patch } : r),
  }));
  const addSaborCupcakeRow = () => setForm((f) => ({ ...f, saboresCupcake: [...f.saboresCupcake, { saborSlug: "", docenas: 1 }] }));
  const removeSaborCupcakeRow = (i) => setForm((f) => ({ ...f, saboresCupcake: f.saboresCupcake.length > 1 ? f.saboresCupcake.filter((_, idx) => idx !== i) : f.saboresCupcake }));

  // ── Helpers para setear sub-estado ──────────────────────────────
  const setEvento = (patch)  => setForm((f) => ({ ...f, evento: { ...f.evento, ...patch } }));
  const setEstilo = (patch)  => setForm((f) => ({ ...f, estilo: { ...f.estilo, ...patch } }));
  const setEntrega = (patch) => setForm((f) => ({ ...f, entrega: { ...f.entrega, ...patch } }));
  const setCliente = (patch) => setForm((f) => ({ ...f, cliente: { ...f.cliente, ...patch } }));

  const toggleDecoracion = (slug) => {
    setForm((f) => {
      const has = f.decoracionesSlugs.includes(slug);
      return {
        ...f,
        decoracionesSlugs: has
          ? f.decoracionesSlugs.filter((s) => s !== slug)
          : [...f.decoracionesSlugs, slug],
      };
    });
  };

  // ── Upload de imágenes de inspiración ────────────────────────────
  const handleImgUpload = async (e) => {
    if (!isLoggedIn || !userToken) {
      Swal.fire({
        icon: "info",
        title: "Inicia sesión para subir fotos",
        text: "Las imágenes de inspiración requieren cuenta para evitar abuso.",
        timer: 2500,
        showConfirmButton: false,
      });
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

  // ── Submit ──────────────────────────────────────────────────────
  const submit = async (e) => {
    e.preventDefault();
    // Validación mínima del lado cliente.
    if (!form.evento.tipo)     return alertarFalta("Selecciona el tipo de evento");
    if (!form.evento.fecha)    return alertarFalta("Selecciona la fecha del evento");
    if (esDiaNoDisponible(form.evento.fecha)) return alertarFalta(MENSAJE_DIA);
    if (esCupcake) {
      const rowsValidas = (form.saboresCupcake || []).filter((r) => r.saborSlug && Number(r.docenas) > 0);
      if (rowsValidas.length === 0) return alertarFalta("Elige al menos un sabor con sus docenas");
    } else {
      if (!form.evento.invitados) return alertarFalta("Indica cuántas porciones");
      if (!form.saborSlug)        return alertarFalta("Elige un sabor de bizcocho");
    }
    if (!form.cliente.nombre)  return alertarFalta("Necesitamos tu nombre");
    if (!form.cliente.telefono)return alertarFalta("Necesitamos un teléfono de contacto");

    setEnviando(true);
    try {
      // La entrega es el mismo día del evento; la dirección sólo aplica
      // a domicilio / salón.
      const payload = {
        ...form,
        tipoProducto,
        niveles: esCupcake ? 1 : form.niveles,
        // Cupcakes: enviar sabores por docena y el total como invitados.
        saboresCupcakeData: esCupcake
          ? form.saboresCupcake.filter((r) => r.saborSlug && Number(r.docenas) > 0)
          : undefined,
        evento: { ...form.evento, invitados: esCupcake ? totalCupcakes : form.evento.invitados },
        entrega: {
          ...form.entrega,
          fecha: form.evento.fecha,
          direccion: ENTREGAS_CON_DIRECCION.includes(form.entrega.tipo) ? form.entrega.direccion : "",
        },
      };
      const r = await fetch(`${API_BASE}/cotizacion-personalizada`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(userToken ? { Authorization: `Bearer ${userToken}` } : {}) },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Error al enviar la cotización");

      // Captura admin: ir directo al detalle para costear.
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

  const alertarFalta = (msg) => {
    Swal.fire({ icon: "warning", title: "Falta info", text: msg, timer: 1800, showConfirmButton: false });
  };

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div className="cake-personalizado">
      {/* Estilos locales — se inyectan dentro del card padre del page index. */}
      <style jsx>{`
        .cake-personalizado {
          padding: 1.5rem;
        }
        .layout {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 1.5rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .layout { grid-template-columns: 1fr; }
          .summary-side { position: static !important; }
        }
        fieldset {
          border: 1px solid var(--border-color);
          border-radius: var(--r-lg);
          padding: 1.25rem;
          margin-bottom: 1rem;
          background: #fff;
        }
        legend {
          font-family: var(--font-sofia);
          color: var(--burdeos);
          font-size: 1.15rem;
          padding: 0 0.5rem;
        }
        .opt-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .opt-grid.tight {
          grid-template-columns: repeat(auto-fill, minmax(95px, 1fr));
        }
        .opt {
          border: 1.5px solid var(--border-color);
          background: #fff;
          border-radius: var(--r-md);
          padding: 0.6rem 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--burdeos);
          cursor: pointer;
          transition: all 150ms;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          text-align: left;
        }
        .opt:hover { background: var(--rosa-4, #FFF3F5); }
        .opt.sel {
          background: var(--burdeos);
          color: #fff;
          border-color: var(--burdeos);
          box-shadow: var(--shadow-sm);
        }
        .opt .csw {
          width: 22px; height: 22px;
          border-radius: 50%;
          background: var(--rosa-3);
          flex-shrink: 0;
          border: 1px solid rgba(0,0,0,0.08);
        }
        .tier-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
        }
        .tier-pick {
          border: 1.5px solid var(--border-color);
          background: #fff;
          border-radius: var(--r-md);
          padding: 1rem 0.5rem;
          cursor: pointer;
          transition: all 150ms;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          color: var(--burdeos);
          font-size: 0.85rem;
        }
        .tier-pick:hover { background: var(--rosa-4, #FFF3F5); }
        .tier-pick.sel {
          background: var(--burdeos);
          color: #fff;
          border-color: var(--burdeos);
        }
        .tier-pick svg { transition: all 150ms; }
        .colors {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }
        .csw-pick {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 150ms;
        }
        .csw-pick.sel {
          border-color: var(--burdeos);
          transform: scale(1.15);
          box-shadow: var(--shadow-sm);
        }
        .deco {
          border: 1.5px solid var(--border-color);
          background: #fff;
          border-radius: var(--r-md);
          padding: 0.75rem;
          cursor: pointer;
          transition: all 150ms;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .deco:hover { background: var(--rosa-4, #FFF3F5); }
        .deco.sel {
          background: var(--rosa-4, #FFF3F5);
          border-color: var(--burdeos);
        }
        .deco-emoji { font-size: 1.5rem; }
        .deco-name {
          font-weight: 700;
          font-size: 0.82rem;
          color: var(--burdeos);
        }
        .deco-price {
          font-size: 0.7rem;
          color: var(--text-soft);
        }
        .row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-top: 0.75rem;
        }
        @media (max-width: 500px) {
          .row { grid-template-columns: 1fr; }
        }
        .row.three { grid-template-columns: 1fr 1fr 1fr; }
        @media (max-width: 700px) {
          .row.three { grid-template-columns: 1fr; }
        }
        input[type="text"], input[type="email"], input[type="tel"],
        input[type="number"], input[type="date"], input[type="time"], textarea, select {
          width: 100%;
          padding: 0.55rem 0.75rem;
          border: 1.5px solid var(--border-color);
          border-radius: var(--r-md);
          font-size: 0.88rem;
          font-family: var(--font-nunito);
          background: #fff;
        }
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: var(--rosa);
          box-shadow: 0 0 0 3px rgba(255,111,125,0.15);
        }
        label.fld {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-soft);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 0.25rem;
        }
        .summary-side {
          position: sticky;
          top: 90px;
          background: linear-gradient(180deg, var(--rosa-4, #FFF3F5) 0%, #fff 100%);
          border: 1.5px solid var(--rosa);
          border-radius: var(--r-xl);
          padding: 1.25rem;
        }
        .sum-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          padding: 0.4rem 0;
          border-bottom: 1px dashed var(--border-color);
        }
        .sum-row.total {
          font-weight: 800;
          font-size: 1rem;
          color: var(--burdeos);
          border-bottom: none;
          padding-top: 0.75rem;
        }
        .submit-btn {
          width: 100%;
          background: var(--burdeos);
          color: #fff;
          border: none;
          border-radius: var(--r-pill);
          padding: 0.85rem 1.5rem;
          font-weight: 800;
          font-size: 0.95rem;
          cursor: pointer;
          font-family: var(--font-nunito);
          margin-top: 1rem;
          box-shadow: var(--shadow-md);
          transition: all 150ms;
        }
        .submit-btn:hover:not(:disabled) {
          background: var(--rosa);
          transform: translateY(-1px);
        }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .img-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: var(--rosa-4, #FFF3F5);
          padding: 4px 10px;
          border-radius: var(--r-pill);
          font-size: 0.75rem;
          margin: 4px 4px 0 0;
        }
        .img-pill button {
          background: transparent; border: none; cursor: pointer; color: var(--burdeos); font-weight: 800;
        }
      `}</style>

      <form onSubmit={submit}>
        <div className="layout">
          <div>
            {/* ── 1. Tipo de evento + fecha + invitados ──────────── */}
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
                    {esCupcake
                      ? `Anticipación mínima: ${diasAnticipacion} días hábiles para ${totalDocenas} ${totalDocenas === 1 ? "docena" : "docenas"}.`
                      : `Anticipación mínima: ${diasAnticipacion} días hábiles para ${form.evento.invitados || 0} porciones.`}
                  </p>
                </div>
                <div>
                  <label className="fld">{esCupcake ? "Total" : "Porciones"}</label>
                  {esCupcake ? (
                    <div style={{ padding: ".55rem .75rem", border: "1.5px solid var(--border-color)", borderRadius: "var(--r-md)", background: "var(--rosa-4,#FFF3F5)", fontWeight: 700, color: "var(--burdeos)" }}>
                      {totalDocenas} docenas · {totalCupcakes} cupcakes
                    </div>
                  ) : (
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
                  )}
                  <p style={{ fontSize: ".7rem", color: "var(--text-soft)", marginTop: ".25rem" }}>
                    {esCupcake ? "Define los sabores y docenas abajo." : "En incrementos de 10 porciones."}
                  </p>
                </div>
              </div>
            </fieldset>

            {/* ── 2. Niveles (solo pastel) ─────────────────────── */}
            {!esCupcake && (
              <fieldset>
                <legend>2. Niveles del pastel</legend>
                <div className="tier-grid">
                  {NIVELES.map((n) => (
                    <button
                      type="button"
                      key={n.value}
                      className={`tier-pick ${form.niveles === n.value ? "sel" : ""}`}
                      onClick={() => setForm({ ...form, niveles: n.value })}
                    >
                      <TierIcon niveles={n.value} />
                      {n.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {/* ── 3. Sabor (pastel: único · cupcake: por docena) ── */}
            <fieldset>
              <legend>{esCupcake ? "2. Sabores y docenas" : "3. Sabor del bizcocho"}</legend>
              {catalogos.sabores.length === 0 ? (
                <p style={{ fontSize: ".82rem", color: "var(--text-soft)" }}>Cargando opciones…</p>
              ) : saboresProducto.length === 0 ? (
                <p style={{ fontSize: ".82rem", color: "var(--text-soft)" }}>
                  Aún no hay sabores disponibles para {esCupcake ? "cupcakes" : "pastel"}.
                </p>
              ) : esCupcake ? (
                <div>
                  {form.saboresCupcake.map((row, i) => (
                    <div key={i} className="row" style={{ gridTemplateColumns: "1fr 110px auto", alignItems: "end", marginTop: i === 0 ? 0 : ".5rem" }}>
                      <div>
                        <label className="fld">Sabor</label>
                        <select value={row.saborSlug} onChange={(e) => setSaborCupcakeRow(i, { saborSlug: e.target.value })}>
                          <option value="">Elige un sabor</option>
                          {saboresProducto.map((s) => <option key={s.slug} value={s.slug}>{s.emoji ? `${s.emoji} ` : ""}{s.nombre}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="fld">Docenas</label>
                        <input type="number" min="1" step="1" value={row.docenas}
                          onChange={(e) => setSaborCupcakeRow(i, { docenas: Math.max(1, Number(e.target.value) || 1) })} />
                      </div>
                      <button type="button" onClick={() => removeSaborCupcakeRow(i)} title="Quitar"
                        style={{ border: "1.5px solid var(--border-color)", background: "#fff", borderRadius: "var(--r-md)", padding: ".55rem .7rem", cursor: "pointer", color: "var(--burdeos)" }}>✕</button>
                    </div>
                  ))}
                  <button type="button" onClick={addSaborCupcakeRow}
                    style={{ marginTop: ".6rem", border: "1.5px dashed var(--border-strong)", background: "transparent", borderRadius: "var(--r-pill)", padding: ".5rem 1rem", cursor: "pointer", color: "var(--burdeos)", fontWeight: 700, fontSize: ".82rem" }}>
                    + Agregar otro sabor
                  </button>
                  <p style={{ fontSize: ".75rem", color: "var(--text-soft)", marginTop: ".6rem" }}>
                    Total: <strong>{totalDocenas} docenas</strong> ({totalCupcakes} cupcakes).
                  </p>
                </div>
              ) : (
                <div className="opt-grid">
                  {saboresProducto.map((s) => (
                    <button
                      type="button"
                      key={s.slug}
                      className={`opt ${form.saborSlug === s.slug ? "sel" : ""}`}
                      onClick={() => setForm({ ...form, saborSlug: s.slug })}
                    >
                      <span className="csw" style={{ background: s.swatch || "var(--rosa-3)" }} />
                      <span>{s.emoji ? `${s.emoji} ` : ""}{s.nombre}</span>
                    </button>
                  ))}
                </div>
              )}
            </fieldset>

            {/* ── 4. Sabor del relleno ──────────────────────────── */}
            <fieldset>
              <legend>4. Sabor del relleno (opcional)</legend>
              {catalogos.rellenos.length === 0 ? (
                <p style={{ fontSize: ".82rem", color: "var(--text-soft)" }}>Cargando opciones…</p>
              ) : (
                <div className="opt-grid">
                  <button
                    type="button"
                    className={`opt ${!form.rellenoSlug ? "sel" : ""}`}
                    onClick={() => setForm({ ...form, rellenoSlug: "" })}
                  >
                    Sin relleno
                  </button>
                  {catalogos.rellenos.map((r) => (
                    <button
                      type="button"
                      key={r.slug}
                      className={`opt ${form.rellenoSlug === r.slug ? "sel" : ""}`}
                      onClick={() => setForm({ ...form, rellenoSlug: r.slug })}
                    >
                      {r.nombre}
                    </button>
                  ))}
                </div>
              )}
            </fieldset>

            {/* ── 5. Cobertura + color ───────────────────────────── */}
            <fieldset>
              <legend>5. Cobertura</legend>
              {catalogos.coberturas.length === 0 ? (
                <p style={{ fontSize: ".82rem", color: "var(--text-soft)" }}>Cargando opciones…</p>
              ) : (
                <div className="opt-grid">
                  {catalogos.coberturas.map((c) => (
                    <button
                      type="button"
                      key={c.slug}
                      className={`opt ${form.coberturaSlug === c.slug ? "sel" : ""}`}
                      onClick={() => setForm({ ...form, coberturaSlug: c.slug })}
                    >
                      {c.esFondant ? "🎀 " : ""}{c.nombre}
                    </button>
                  ))}
                </div>
              )}
              <div style={{ marginTop: "1rem" }}>
                <label className="fld">Color principal</label>
                <div className="colors">
                  {COLORES.map((c) => (
                    <button
                      type="button"
                      key={c}
                      aria-label={`Color ${c}`}
                      className={`csw-pick ${form.colorPrincipal === c ? "sel" : ""}`}
                      style={{ background: c, border: c === "#FFFFFF" ? "2px solid var(--border-color)" : undefined }}
                      onClick={() => setForm({ ...form, colorPrincipal: c })}
                    />
                  ))}
                </div>
              </div>
            </fieldset>

            {/* ── 6. Decoraciones (multi) ────────────────────────── */}
            <fieldset>
              <legend>6. Decoraciones (puedes elegir varias)</legend>
              {catalogos.decoraciones.length === 0 ? (
                <p style={{ fontSize: ".82rem", color: "var(--text-soft)" }}>Cargando opciones…</p>
              ) : (
                <div className="opt-grid tight">
                  {catalogos.decoraciones.map((d) => {
                    const sel = form.decoracionesSlugs.includes(d.slug);
                    return (
                      <div
                        key={d.slug}
                        className={`deco ${sel ? "sel" : ""}`}
                        onClick={() => toggleDecoracion(d.slug)}
                      >
                        <div className="deco-emoji">{d.emoji || "🎀"}</div>
                        <div className="deco-name">{d.nombre}</div>
                        {d.costoManual > 0 && !d.tecnicaCreativaId && (
                          <div className="deco-price">+${d.costoManual}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </fieldset>

            {/* ── 7. Estilo + comentarios + inspiración ──────────── */}
            <fieldset>
              <legend>7. Estilo y referencias</legend>
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
                  placeholder="Tema, nombres, alergias, dedicatorias, etc."
                />
              </div>
              <div style={{ marginTop: "1rem" }}>
                <label className="fld">Imágenes de inspiración (opcional)</label>
                {!isLoggedIn ? (
                  <p style={{ fontSize: ".78rem", color: "var(--text-soft)" }}>
                    Inicia sesión para adjuntar fotos.
                  </p>
                ) : (
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImgUpload}
                    disabled={subiendoImg}
                  />
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

            {/* ── 8. Entrega ─────────────────────────────────────── */}
            <fieldset>
              <legend>8. Entrega</legend>
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

            {/* ── 9. Cliente ────────────────────────────────────── */}
            <fieldset>
              <legend>9. Tus datos</legend>
              <div className="row three">
                <div>
                  <label className="fld">Nombre completo</label>
                  <input
                    type="text"
                    value={form.cliente.nombre}
                    onChange={(e) => setCliente({ nombre: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="fld">Teléfono</label>
                  <input
                    type="tel"
                    value={form.cliente.telefono}
                    onChange={(e) => setCliente({ telefono: e.target.value })}
                    placeholder="33-1234-5678"
                    required
                  />
                </div>
                <div>
                  <label className="fld">Email</label>
                  <input
                    type="email"
                    value={form.cliente.email}
                    onChange={(e) => setCliente({ email: e.target.value })}
                  />
                </div>
              </div>
            </fieldset>
          </div>

          {/* ── Summary side ───────────────────────────────────── */}
          <aside className="summary-side">
            <h3 className={sofia.className} style={{ color: "var(--burdeos)", fontSize: "1.4rem", marginBottom: ".5rem" }}>
              {esCupcake ? "Tus cupcakes" : "Tu pastel"}
            </h3>
            <p style={{ fontSize: ".75rem", color: "var(--text-soft)", marginBottom: ".75rem" }}>
              Resumen de tu solicitud · Confirmamos en 24h
            </p>

            <SumRow label="Evento" val={EVENTOS.find((x) => x.value === form.evento.tipo)?.label || "—"} />
            {esCupcake ? (
              <SumRow label="Cupcakes" val={totalDocenas ? `${totalDocenas} doc · ${totalCupcakes} pz` : "—"} />
            ) : (
              <SumRow label="Porciones" val={form.evento.invitados || "—"} />
            )}
            {!esCupcake && (
              <SumRow label="Niveles" val={NIVELES.find((x) => x.value === form.niveles)?.label || "—"} />
            )}
            {esCupcake ? (
              <SumRow label="Sabores" val={
                form.saboresCupcake.filter((r) => r.saborSlug).length
                  ? form.saboresCupcake.filter((r) => r.saborSlug).map((r) => {
                      const s = catalogos.sabores.find((x) => x.slug === r.saborSlug);
                      return `${r.docenas} doc ${s?.nombre || r.saborSlug}`;
                    }).join(", ")
                  : "—"
              } />
            ) : (
              <SumRow label="Bizcocho" val={desglose.sabor?.nombre || "—"} />
            )}
            <SumRow label="Relleno" val={desglose.relleno?.nombre || "—"} />
            <SumRow label="Cobertura" val={desglose.cobertura?.nombre || "—"} />
            <SumRow label="Decoraciones" val={desglose.decosSel.length ? desglose.decosSel.map((d) => d.nombre).join(", ") : "—"} />
            <SumRow label="Estilo" val={ESTILOS.find((x) => x.value === form.estilo.value)?.label || "—"} />

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

// ── Pequeños sub-componentes ──────────────────────────────────────

function SumRow({ label, val }) {
  return (
    <div className="sum-row">
      <span style={{ color: "var(--text-soft)" }}>{label}</span>
      <strong style={{ color: "var(--burdeos)", maxWidth: "60%", textAlign: "right", overflowWrap: "anywhere" }}>
        {val}
      </strong>
    </div>
  );
}

// Iconos esquemáticos de pisos (rectángulos apilados).
function TierIcon({ niveles }) {
  const tiers = Math.min(niveles, 4);
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      {Array.from({ length: tiers }).map((_, i) => {
        const w = 30 - i * 5;
        const x = 20 - w / 2;
        const y = 30 - i * 7;
        return <rect key={i} x={x} y={y} width={w} height={6} rx={1.5} fill="currentColor" />;
      })}
    </svg>
  );
}
