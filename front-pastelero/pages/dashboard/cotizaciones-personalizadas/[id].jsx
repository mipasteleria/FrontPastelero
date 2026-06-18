import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Swal from "sweetalert2";
import NavbarAdmin from "@/src/components/navbar";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { useAuth } from "@/src/context";
import { subirImagen } from "@/src/lib/imageUpload";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

const EVENTOS = ["boda", "xv", "cumple", "corporativo", "baby", "graduacion", "bautizo", "otro"];
const ESTILOS = ["minimalista", "elegante", "tropical", "rustico", "acuarela", "lujoso", "vintage"];
const ENTREGAS = [
  { value: "recoger-local", label: "Recoger en local" },
  { value: "domicilio", label: "A domicilio (GDL)" },
  { value: "evento", label: "Al salón / evento" },
];

const TIPO_EXTRA_LABEL = {
  receta: "Receta",
  tecnica: "Técnica creativa",
  insumo: "Insumo / trabajo manual",
  manual: "Costo manual / estructura",
};

const PRODUCTO_LABEL = {
  pastel: "Pastel",
  cupcake: "Cupcakes",
  "mesa-postres": "Mesa de postres",
};

const STATUSES = [
  "Pendiente",
  "Cotizada",            // precio listo y visible para el cliente (puede agendar)
  "Agendado · revisión",
  "Agendado · producción",
  "Entregado",
  "Cancelado",
];

/**
 * Detalle admin de una cotización personalizada — incluye:
 *  - Resumen de la solicitud (lectura)
 *  - Acciones admin: status, precio, anticipo
 *  - Pre-costeo automático (POST /:id/calcular-costeo)
 *  - Notas internas (POST/DELETE)
 */
export default function CotizacionPersonalizadaDetalle() {
  const router = useRouter();
  const { id } = router.query;
  const { userToken } = useAuth();

  const [cot, setCot] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [calculando, setCalculando] = useState(false);

  // Form editable de admin (status/precio/anticipo).
  const [editForm, setEditForm] = useState({ status: "", precio: "", anticipo: "" });

  // Nota interna nueva
  const [notaTexto, setNotaTexto] = useState("");

  // ── Costeo: renglones extra (base automática + extras encima) ──────
  const [fuentes, setFuentes] = useState({ recetas: [], tecnicas: [], insumos: [], laborHora: 0 });
  const [extras, setExtras] = useState([]);
  const [nuevoExtra, setNuevoExtra] = useState({ tipo: "manual", refId: "", concepto: "", costoUnitario: 0, cantidad: 1 });
  const [guardandoExtras, setGuardandoExtras] = useState(false);
  const [markupPct, setMarkupPct] = useState("");
  const [subiendoImg, setSubiendoImg] = useState(false);
  const [catalogos, setCatalogos] = useState({ sabores: [], rellenos: [], coberturas: [], decoraciones: [], postres: [] });
  const [editMode, setEditMode] = useState(false);
  const [edit, setEdit] = useState(null);
  const [guardandoEdit, setGuardandoEdit] = useState(false);

  const authHeader = userToken ? { Authorization: `Bearer ${userToken}` } : {};

  const recargar = async () => {
    if (!id) return;
    const r = await fetch(`${API_BASE}/cotizacion-personalizada/${id}`, { headers: authHeader });
    const j = await r.json();
    setCot(j.data);
    // Si aún no hay precio final pero ya se costeó, pre-llenamos con el
    // precio sugerido (el admin solo confirma y guarda).
    const sugerido = j.data?.costeoSnapshot?.precioSugerido;
    const precioPre = j.data?.precio ?? (sugerido != null ? Math.round(sugerido) : "");
    const anticipoPre = j.data?.anticipo ?? (precioPre !== "" ? Math.round(Number(precioPre) * 0.5) : "");
    setEditForm({
      status: j.data?.status || "Pendiente",
      precio: precioPre,
      anticipo: anticipoPre,
    });
    setExtras(j.data?.costeoExtras || []);
    setMarkupPct(j.data?.costeoSnapshot?.markupPct != null ? String(j.data.costeoSnapshot.markupPct) : "");
    setCargando(false);
  };

  useEffect(() => { recargar(); /* eslint-disable-line */ }, [id, userToken]);

  // Backfill de número de orden / enlace para cotizaciones viejas.
  useEffect(() => {
    if (!cot || !id || !userToken) return;
    if (cot.numeroOrden && cot.publicToken) return;
    fetch(`${API_BASE}/cotizacion-personalizada/${id}/generar-enlace`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
    }).then(() => recargar()).catch(() => {});
    /* eslint-disable-next-line */
  }, [cot?._id]);

  // ── Catálogos para edición ────────────────────────────────────────
  useEffect(() => {
    const tipos = ["sabores", "rellenos", "coberturas", "decoraciones", "postres"];
    Promise.all(tipos.map((t) => fetch(`${API_BASE}/cotizacion-catalogos/${t}`).then((r) => r.json()).catch(() => ({}))))
      .then((res) => {
        const o = {};
        tipos.forEach((t, i) => { o[t] = res[i]?.data || []; });
        setCatalogos(o);
      });
  }, []);

  const iniciarEdicion = () => {
    setEdit({
      tipoProducto: cot.tipoProducto || "pastel",
      eventoTipo: cot.evento?.tipo || "",
      eventoFecha: cot.evento?.fecha ? new Date(cot.evento.fecha).toISOString().slice(0, 10) : "",
      invitados: cot.evento?.invitados || 0,
      niveles: cot.niveles || 1,
      saborSlug: cot.sabor?.slug || "",
      rellenoSlug: cot.relleno?.slug || "",
      coberturaSlug: cot.cobertura?.slug || "",
      decoracionesSlugs: (cot.decoraciones || []).map((d) => d.slug),
      colorPrincipal: cot.colorPrincipal || "",
      estiloValue: cot.estilo?.value || "",
      comentarios: cot.estilo?.comentarios || "",
      postresPorPersona: cot.postresPorPersona || 1,
      postresSlugs: (cot.postres || []).map((p) => p.slug),
      entregaTipo: cot.entrega?.tipo || "",
      entregaHora: cot.entrega?.hora || "",
      entregaDireccion: cot.entrega?.direccion || "",
      clienteNombre: cot.cliente?.nombre || "",
      clienteTelefono: cot.cliente?.telefono || "",
      clienteEmail: cot.cliente?.email || "",
    });
    setEditMode(true);
  };

  const guardarEdicion = async () => {
    setGuardandoEdit(true);
    try {
      const esMesa = edit.tipoProducto === "mesa-postres";
      const payload = {
        tipoProducto: edit.tipoProducto,
        evento: { tipo: edit.eventoTipo, fecha: edit.eventoFecha, invitados: Number(edit.invitados) || 1 },
        niveles: esMesa ? 1 : (edit.tipoProducto === "cupcake" ? 1 : Number(edit.niveles) || 1),
        colorPrincipal: edit.colorPrincipal,
        estilo: { ...(cot.estilo || {}), value: edit.estiloValue, comentarios: edit.comentarios },
        entrega: { tipo: edit.entregaTipo, fecha: edit.eventoFecha, hora: edit.entregaHora, direccion: ["domicilio", "evento"].includes(edit.entregaTipo) ? edit.entregaDireccion : "" },
        cliente: { nombre: edit.clienteNombre, telefono: edit.clienteTelefono, email: edit.clienteEmail },
      };
      if (esMesa) {
        payload.postresPorPersona = Number(edit.postresPorPersona) || 1;
        payload.postresSlugs = edit.postresSlugs;
      } else {
        payload.saborSlug = edit.saborSlug;
        payload.rellenoSlug = edit.rellenoSlug;
        payload.coberturaSlug = edit.coberturaSlug;
        payload.decoracionesSlugs = edit.decoracionesSlugs;
      }
      const r = await fetch(`${API_BASE}/cotizacion-personalizada/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error((await r.json()).message || "Error");
      setEditMode(false);
      await recargar();
      Swal.fire({ icon: "success", title: "Cotización actualizada", timer: 1500, showConfirmButton: false, background: "#fff1f2", color: "#540027" });
    } catch (e) {
      Swal.fire({ icon: "error", title: e.message, timer: 2400, showConfirmButton: false });
    } finally {
      setGuardandoEdit(false);
    }
  };

  const toggleDecoEdit = (slug) => setEdit((e) => ({ ...e, decoracionesSlugs: e.decoracionesSlugs.includes(slug) ? e.decoracionesSlugs.filter((s) => s !== slug) : [...e.decoracionesSlugs, slug] }));
  const togglePostreEdit = (slug) => setEdit((e) => ({ ...e, postresSlugs: e.postresSlugs.includes(slug) ? e.postresSlugs.filter((s) => s !== slug) : [...e.postresSlugs, slug] }));

  // ── Imagen de diseño (subir / quitar) ─────────────────────────────
  const guardarImagenes = async (imagenes) => {
    const r = await fetch(`${API_BASE}/cotizacion-personalizada/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({ estilo: { ...(cot.estilo || {}), imagenesInspiracion: imagenes } }),
    });
    if (!r.ok) throw new Error((await r.json()).message || "Error");
    await recargar();
  };

  const subirImagenDiseno = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setSubiendoImg(true);
    try {
      const urls = [];
      for (const file of files) {
        const { fileUrl } = await subirImagen(file, API_BASE, userToken);
        urls.push(fileUrl);
      }
      await guardarImagenes([...(cot.estilo?.imagenesInspiracion || []), ...urls]);
      Swal.fire({ icon: "success", title: "Imagen agregada", timer: 1400, showConfirmButton: false, background: "#fff1f2", color: "#540027" });
    } catch (err) {
      Swal.fire({ icon: "error", title: err.message || "Error al subir", timer: 2200, showConfirmButton: false });
    } finally {
      setSubiendoImg(false);
      e.target.value = "";
    }
  };

  const quitarImagenDiseno = async (url) => {
    try {
      await guardarImagenes((cot.estilo?.imagenesInspiracion || []).filter((u) => u !== url));
    } catch (err) {
      Swal.fire({ icon: "error", title: err.message || "Error", timer: 2000, showConfirmButton: false });
    }
  };

  // ── Cargar fuentes de costo (recetas / técnicas / insumos / labor) ──
  useEffect(() => {
    if (!userToken) return;
    const h = { Authorization: `Bearer ${userToken}` };
    Promise.all([
      fetch(`${API_BASE}/recetas/recetas`, { headers: h }).then((r) => r.json()).catch(() => ({})),
      fetch(`${API_BASE}/tecnicas?todas=true`, { headers: h }).then((r) => r.json()).catch(() => ({})),
      fetch(`${API_BASE}/insumos`, { headers: h }).then((r) => r.json()).catch(() => ([])),
      fetch(`${API_BASE}/costs`, { headers: h }).then((r) => r.json()).catch(() => ({})),
    ]).then(([rec, tec, ins, cost]) => {
      setFuentes({
        recetas: rec.data || rec || [],
        tecnicas: tec.data || tec || [],
        insumos: Array.isArray(ins) ? ins : (ins.data || []),
        laborHora: cost?.laborCosts ?? 0,
      });
    });
  }, [userToken]);

  // ── Guardar campos admin ─────────────────────────────────────────
  const guardarAdmin = async () => {
    try {
      const r = await fetch(`${API_BASE}/cotizacion-personalizada/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({
          status: editForm.status,
          precio: editForm.precio === "" ? undefined : Number(editForm.precio),
          anticipo: editForm.anticipo === "" ? undefined : Number(editForm.anticipo),
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Error");
      Swal.fire({ icon: "success", title: "Actualizado", timer: 1500, showConfirmButton: false, background: "#fff1f2", color: "#540027" });
      recargar();
    } catch (e) {
      Swal.fire({ icon: "error", title: e.message, timer: 2200, showConfirmButton: false });
    }
  };

  // ── Costeo automático ────────────────────────────────────────────
  const calcularCosteo = async () => {
    setCalculando(true);
    try {
      const r = await fetch(`${API_BASE}/cotizacion-personalizada/${id}/calcular-costeo`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify(markupPct === "" ? {} : { markupPct: Number(markupPct) }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Error");
      Swal.fire({
        icon: "success",
        title: `Precio sugerido: $${j.data.precioSugerido.toLocaleString("es-MX")}`,
        timer: 2500,
        showConfirmButton: false,
        background: "#fff1f2",
        color: "#540027",
      });
      recargar();
    } catch (e) {
      Swal.fire({ icon: "error", title: e.message, timer: 2200, showConfirmButton: false });
    } finally {
      setCalculando(false);
    }
  };

  // ── Costeo: renglones extra ───────────────────────────────────────
  // Construye un renglón a partir del tipo/fuente seleccionados.
  // Costo unitario sugerido al elegir una fuente (editable después).
  const costoSugerido = (tipo, refId) => {
    if (tipo === "receta") {
      const r = fuentes.recetas.find((x) => String(x._id) === String(refId));
      return r && r.portions > 0 ? round2(r.total_cost / r.portions) : 0;
    }
    if (tipo === "tecnica") {
      const t = fuentes.tecnicas.find((x) => String(x._id) === String(refId));
      if (!t) return 0;
      // Pre-llenamos con el costo base de la técnica (el admin puede subirlo
      // si quiere incluir escala/horas). Evita inflar el costo por defecto.
      return round2(t.costoBase || 0);
    }
    if (tipo === "insumo") {
      const i = fuentes.insumos.find((x) => String(x._id) === String(refId));
      return i ? round2(i.cost || 0) : 0;
    }
    return 0;
  };

  const conceptoDeFuente = (tipo, refId) => {
    if (tipo === "receta") return fuentes.recetas.find((x) => String(x._id) === String(refId))?.nombre_receta || "";
    if (tipo === "tecnica") return fuentes.tecnicas.find((x) => String(x._id) === String(refId))?.nombre || "";
    if (tipo === "insumo") {
      const i = fuentes.insumos.find((x) => String(x._id) === String(refId));
      return i ? `${i.name}${i.unit ? ` (${i.unit})` : ""}` : "";
    }
    return "";
  };

  const construirExtra = () => {
    const cantidad = Math.max(1, Number(nuevoExtra.cantidad) || 1);
    const { tipo, refId } = nuevoExtra;
    // El costo unitario es el que está en el form (pre-llenado desde la
    // fuente pero editable por el admin).
    const unit = Number(nuevoExtra.costoUnitario) || 0;

    if (tipo === "manual") {
      if (!nuevoExtra.concepto.trim() || unit <= 0) return null;
      return { tipo: "manual", refId: null, concepto: nuevoExtra.concepto.trim(), costoUnitario: round2(unit), cantidad, subtotal: round2(unit * cantidad) };
    }
    // receta / tecnica / insumo
    if (!refId) return null;
    const concepto = conceptoDeFuente(tipo, refId);
    const refDoc = tipo === "tecnica"
      ? fuentes.tecnicas.find((x) => String(x._id) === String(refId))
      : tipo === "receta"
        ? fuentes.recetas.find((x) => String(x._id) === String(refId))
        : fuentes.insumos.find((x) => String(x._id) === String(refId));
    if (!refDoc) return null;
    return { tipo, refId: refDoc._id, concepto, costoUnitario: round2(unit), cantidad, subtotal: round2(unit * cantidad) };
  };

  const agregarExtra = () => {
    const item = construirExtra();
    if (!item) {
      Swal.fire({ icon: "warning", title: "Completa el renglón", timer: 1600, showConfirmButton: false });
      return;
    }
    setExtras((prev) => [...prev, item]);
    setNuevoExtra({ tipo: nuevoExtra.tipo, refId: "", concepto: "", costoUnitario: 0, cantidad: 1 });
  };

  const quitarExtra = (idx) => setExtras((prev) => prev.filter((_, i) => i !== idx));

  // Editar la cantidad de un renglón ya agregado (recalcula subtotal).
  const editarCantidadExtra = (idx, valor) => {
    const cantidad = Math.max(0, Number(valor) || 0);
    setExtras((prev) => prev.map((x, i) =>
      i === idx ? { ...x, cantidad, subtotal: round2((Number(x.costoUnitario) || 0) * cantidad) } : x
    ));
  };

  // Guarda los extras (PUT) y recalcula el costeo para reflejar el total.
  const guardarYRecalcular = async () => {
    setGuardandoExtras(true);
    try {
      const r = await fetch(`${API_BASE}/cotizacion-personalizada/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ costeoExtras: extras }),
      });
      if (!r.ok) throw new Error((await r.json()).message || "Error guardando extras");
      await calcularCosteo();
    } catch (e) {
      Swal.fire({ icon: "error", title: e.message, timer: 2200, showConfirmButton: false });
    } finally {
      setGuardandoExtras(false);
    }
  };

  const extrasTotal = extras.reduce((acc, x) => acc + (Number(x.subtotal) || 0), 0);

  // ── Enlace público (invitado) ─────────────────────────────────────
  const enlacePublico = (tok) =>
    typeof window !== "undefined" ? `${window.location.origin}/cotizacion/ver/${tok}` : "";

  const copiarEnlace = async () => {
    try {
      let tok = cot.publicToken;
      if (!tok) {
        const r = await fetch(`${API_BASE}/cotizacion-personalizada/${id}/generar-enlace`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeader },
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j.message || "Error");
        tok = j.data.publicToken;
        setCot((c) => ({ ...c, publicToken: tok }));
      }
      await navigator.clipboard.writeText(enlacePublico(tok));
      Swal.fire({ icon: "success", title: "Enlace copiado", text: "Pégalo en WhatsApp para tu cliente.", timer: 1800, showConfirmButton: false, background: "#fff1f2", color: "#540027" });
    } catch (e) {
      Swal.fire({ icon: "error", title: e.message || "Error", timer: 2000, showConfirmButton: false });
    }
  };

  // ── Notas internas ───────────────────────────────────────────────
  const agregarNota = async () => {
    const texto = notaTexto.trim();
    if (!texto) return;
    try {
      const r = await fetch(`${API_BASE}/cotizacion-personalizada/${id}/notas-internas`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ texto }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Error");
      setNotaTexto("");
      recargar();
    } catch (e) {
      Swal.fire({ icon: "error", title: e.message, timer: 2200, showConfirmButton: false });
    }
  };

  const borrarNota = async (notaId) => {
    try {
      const r = await fetch(`${API_BASE}/cotizacion-personalizada/${id}/notas-internas/${notaId}`, {
        method: "DELETE",
        headers: authHeader,
      });
      if (!r.ok) throw new Error();
      recargar();
    } catch {
      Swal.fire({ icon: "error", title: "Error al borrar nota", timer: 1800, showConfirmButton: false });
    }
  };

  if (cargando || !cot) {
    return (
      <div className={poppins.className}>
        <NavbarAdmin />
        <div className="flex flex-row mt-16">
          <Asideadmin />
          <main className="flex-grow p-8">Cargando…</main>
        </div>
        <FooterDashboard />
      </div>
    );
  }

  const cs = cot.costeoSnapshot;

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className="flex-grow w-full max-w-screen-xl mx-auto px-4 md:px-8 pb-24 md:pb-8">
          <Link href="/dashboard/cotizaciones-personalizadas" className="text-xs text-accent hover:underline">
            ← Volver al listado
          </Link>
          <h1 className={`text-3xl py-3 ${sofia.className}`}>
            {cot.cliente?.nombre} — {cot.evento?.tipo}
          </h1>

          <div className="grid md:grid-cols-3 gap-4">
            {/* ── Columna izquierda: detalle de la solicitud ─── */}
            <section className="md:col-span-2 bg-white shadow rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-lg" style={{ color: "var(--burdeos)" }}>
                  Detalle de la solicitud
                </h2>
                {!editMode && (
                  <button onClick={iniciarEdicion} className="text-xs font-semibold px-3 py-1.5 rounded text-white" style={{ background: "var(--burdeos)" }}>
                    ✎ Editar
                  </button>
                )}
              </div>

              {editMode && edit ? (
                <EditForm edit={edit} setEdit={setEdit} catalogos={catalogos}
                  toggleDecoEdit={toggleDecoEdit} togglePostreEdit={togglePostreEdit}
                  onCancel={() => setEditMode(false)} onSave={guardarEdicion} guardando={guardandoEdit} />
              ) : (
              <>
              <Info label="Producto"   val={PRODUCTO_LABEL[cot.tipoProducto] || "Pastel"} />
              <Info label="Evento"     val={`${cot.evento?.tipo} · ${cot.evento?.invitados} ${cot.tipoProducto === "mesa-postres" ? "personas" : "invitados"}`} />
              <Info label="Fecha"      val={cot.evento?.fecha ? new Date(cot.evento.fecha).toLocaleDateString("es-MX", { timeZone: "UTC" }) : "—"} />

              {cot.tipoProducto === "mesa-postres" ? (
                <>
                  <Info label="Postres / persona" val={cot.postresPorPersona || "—"} />
                  <Info label="Total piezas" val={(cot.evento?.invitados || 0) * (cot.postresPorPersona || 0) || "—"} />
                  <Info label="Postres" val={(cot.postres || []).map((p) => p.nombre).join(", ") || "—"} />
                </>
              ) : (
                <>
                  {cot.tipoProducto !== "cupcake" && (
                    <Info label="Niveles" val={`${cot.niveles} piso${cot.niveles > 1 ? "s" : ""}`} />
                  )}
                  <Info label={cot.tipoProducto === "cupcake" ? "Cupcake" : "Bizcocho"} val={cot.sabor?.nombre || "—"} />
                  <Info label="Relleno"    val={cot.relleno?.nombre || "—"} />
                  <Info label="Cobertura"  val={cot.cobertura?.nombre || "—"} />
                  <Info label="Color principal" val={cot.colorPrincipal ? <span className="inline-block w-6 h-6 rounded-full align-middle" style={{ background: cot.colorPrincipal, border: "1px solid #eee" }} /> : "—"} />
                  <Info label="Decoraciones" val={(cot.decoraciones || []).map((d) => d.nombre).join(", ") || "—"} />
                </>
              )}
              <Info label="Estilo"     val={cot.estilo?.value || "—"} />
              {cot.estilo?.comentarios && (
                <div className="mt-2">
                  <div className="text-xs font-bold uppercase text-gray-500">Comentarios</div>
                  <p className="text-sm bg-gray-50 p-2 rounded">{cot.estilo.comentarios}</p>
                </div>
              )}
              <div className="mt-3">
                <div className="text-xs font-bold uppercase text-gray-500 mb-1">
                  Imagen de diseño / inspiración
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                  {(cot.estilo?.imagenesInspiracion || []).map((url) => (
                    <div key={url} className="relative">
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <img src={url} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6, border: "1px solid #eee" }} />
                      </a>
                      <button
                        onClick={() => quitarImagenDiseno(url)}
                        title="Quitar"
                        className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full w-5 h-5 text-xs text-red-500 leading-none"
                      >✕</button>
                    </div>
                  ))}
                  <label className="cursor-pointer text-xs px-3 py-2 rounded border border-dashed border-gray-400 text-gray-600 hover:bg-gray-50">
                    {subiendoImg ? "Subiendo…" : "+ Subir / cambiar imagen"}
                    <input type="file" accept="image/*" multiple className="hidden" onChange={subirImagenDiseno} disabled={subiendoImg} />
                  </label>
                </div>
              </div>

              <h3 className="font-bold text-md mt-5 mb-2" style={{ color: "var(--burdeos)" }}>Entrega</h3>
              <Info label="Tipo"      val={cot.entrega?.tipo || "—"} />
              <Info label="Fecha"     val={cot.evento?.fecha ? new Date(cot.evento.fecha).toLocaleDateString("es-MX", { timeZone: "UTC" }) : "—"} />
              <Info label="Hora"      val={cot.entrega?.hora || "—"} />
              <Info label="Dirección" val={cot.entrega?.direccion || "—"} />

              <h3 className="font-bold text-md mt-5 mb-2" style={{ color: "var(--burdeos)" }}>Cliente</h3>
              <Info label="Nombre"   val={cot.cliente?.nombre} />
              <Info label="Teléfono" val={cot.cliente?.telefono} />
              <Info label="Email"    val={cot.cliente?.email || "—"} />

              <h3 className="font-bold text-md mt-5 mb-2" style={{ color: "var(--burdeos)" }}>Validez</h3>
              <Info
                label="Válida hasta"
                val={cot.validUntil ? new Date(cot.validUntil).toLocaleDateString("es-MX", { timeZone: "UTC" }) : "—"}
              />
              <Info
                label="Imágenes"
                val={cot.imagenesEliminadasAt
                  ? `Eliminadas el ${new Date(cot.imagenesEliminadasAt).toLocaleDateString("es-MX")}`
                  : (cot.estilo?.imagenesInspiracion?.length || 0) + " adjunta(s)"}
              />
              </>
              )}
            </section>

            {/* ── Columna derecha: admin actions + costeo ─── */}
            <section className="space-y-4">
              {/* Status / precio */}
              <div className="bg-white shadow rounded-lg p-5">
                <h3 className="font-bold mb-3" style={{ color: "var(--burdeos)" }}>Acciones admin</h3>
                <label className="block text-xs font-semibold mb-1">Status</label>
                <select
                  className="border rounded px-3 py-2 w-full mb-3"
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                >
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <label className="block text-xs font-semibold mb-1">Precio final</label>
                <input
                  type="number"
                  className="border rounded px-3 py-2 w-full mb-3"
                  value={editForm.precio}
                  onChange={(e) => setEditForm({ ...editForm, precio: e.target.value })}
                  placeholder="MXN"
                />
                <label className="block text-xs font-semibold mb-1">Anticipo recibido</label>
                <input
                  type="number"
                  className="border rounded px-3 py-2 w-full mb-3"
                  value={editForm.anticipo}
                  onChange={(e) => setEditForm({ ...editForm, anticipo: e.target.value })}
                />
                <p className="text-[11px] text-gray-500 mb-3">
                  Cuando el precio esté listo, pon el status en <strong>"Cotizada"</strong> y
                  guarda: así el cliente verá el precio en su enlace y podrá agendar.
                </p>
                <button
                  onClick={guardarAdmin}
                  className="px-4 py-2 rounded text-sm font-semibold text-white shadow-md w-full"
                  style={{ background: "var(--burdeos)" }}
                >
                  Guardar
                </button>
              </div>

              {/* Enlace para el cliente (invitado) */}
              <div className="bg-white shadow rounded-lg p-5">
                <h3 className="font-bold mb-1" style={{ color: "var(--burdeos)" }}>Enlace para el cliente</h3>
                <p className="text-xs text-gray-500 mb-2">
                  Comparte este enlace por WhatsApp. El cliente ve su cotización y precio sin necesidad de cuenta.
                </p>
                {cot.publicToken && (
                  <div className="text-[11px] bg-gray-50 rounded p-2 mb-2 break-all text-gray-600">
                    {enlacePublico(cot.publicToken)}
                  </div>
                )}
                {cot.confirmacionCliente?.confirmado && (
                  <p className="text-xs mb-2" style={{ color: "var(--menta-deep, #2e9e76)" }}>
                    ✓ Cliente confirmó pago por {cot.confirmacionCliente.metodo}.
                  </p>
                )}
                <button
                  onClick={copiarEnlace}
                  className="px-4 py-2 rounded text-sm font-semibold text-white shadow-md w-full"
                  style={{ background: "var(--rosa)" }}
                >
                  {cot.publicToken ? "Copiar enlace" : "Generar y copiar enlace"}
                </button>
              </div>

              {/* Costeo automático */}
              <div className="bg-white shadow rounded-lg p-5">
                <h3 className="font-bold mb-2" style={{ color: "var(--burdeos)" }}>Pre-costeo</h3>
                <p className="text-xs text-gray-500 mb-3">
                  Calcula el costo real usando receta del bizcocho + técnicas creativas de las decoraciones.
                </p>
                <label className="block text-xs font-semibold mb-1">Markup (%)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="border rounded px-3 py-2 w-full mb-3"
                  value={markupPct}
                  onChange={(e) => setMarkupPct(e.target.value)}
                  placeholder="Global por defecto (ej. 60)"
                />
                <button
                  onClick={calcularCosteo}
                  disabled={calculando}
                  className="px-4 py-2 rounded text-sm font-semibold text-white shadow-md w-full disabled:opacity-50"
                  style={{ background: "var(--rosa)" }}
                >
                  {calculando ? "Calculando…" : (cs ? "Recalcular" : "Calcular costeo")}
                </button>

                {cs && (
                  <div className="mt-3 text-xs">
                    {cs.tipoProducto === "mesa-postres" ? (
                      <CostRow label="Postres" val={cs.costoPostres} sub={`${cs.postres?.length || 0} tipos · ${cs.piezasTotales} piezas`} />
                    ) : (
                      <>
                        <CostRow label="Bizcocho"    val={cs.costoBizcocho} sub={cs.bizcocho?.nombre} />
                        <CostRow label="Relleno"     val={cs.costoRelleno} sub={cs.relleno?.nombre} />
                        <CostRow label="Cobertura"   val={cs.costoCobertura} sub={cs.cobertura?.nombre} />
                        <CostRow label="Decoraciones" val={cs.costoDecoraciones} sub={`${cs.decoraciones?.length || 0} elementos`} />
                      </>
                    )}
                    {cs.costoExtras > 0 && (
                      <CostRow label="Extras" val={cs.costoExtras} sub={`${cs.extras?.length || 0} renglones`} />
                    )}
                    <div className="border-t mt-2 pt-2">
                      <CostRow label="Costo total" val={cs.costoTotal} bold />
                      <CostRow label={`Markup ${cs.markupPct}%`} val={cs.precioSugerido - cs.costoTotal} />
                      <CostRow label="Precio sugerido" val={cs.precioSugerido} highlight />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">
                      Calculado: {new Date(cs.fechaCosteo).toLocaleString("es-MX")}
                      {cs.multiplicadorNiveles ? ` · Niveles x${cs.multiplicadorNiveles}` : ""}
                    </p>
                  </div>
                )}
              </div>

              {/* Renglones extra del costeo */}
              <div className="bg-white shadow rounded-lg p-5">
                <h3 className="font-bold mb-1" style={{ color: "var(--burdeos)" }}>Renglones extra</h3>
                <p className="text-xs text-gray-500 mb-3">
                  Se suman a la base automática (estructura, técnicas, insumos, recetas o costo libre).
                </p>

                {extras.length > 0 && (
                  <div className="mb-3 space-y-1">
                    {extras.map((x, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 rounded px-2 py-1 text-xs gap-2">
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{x.concepto}</div>
                          <div className="text-[10px] text-gray-400">
                            {TIPO_EXTRA_LABEL[x.tipo]} · ${Number(x.costoUnitario).toFixed(2)} c/u
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={x.cantidad}
                            onChange={(e) => editarCantidadExtra(i, e.target.value)}
                            className="border rounded px-1.5 py-0.5 w-16 text-right text-xs"
                            title="Cantidad (ej. gramos)"
                          />
                          <span className="font-semibold w-16 text-right">${Number(x.subtotal).toFixed(2)}</span>
                          <button onClick={() => quitarExtra(i)} className="text-red-400 hover:text-red-600">✕</button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between text-xs font-bold pt-1">
                      <span>Subtotal extras</span>
                      <span>${extrasTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Form nuevo renglón */}
                <label className="block text-xs font-semibold mb-1">Tipo</label>
                <select
                  className="border rounded px-2 py-1.5 w-full mb-2 text-sm"
                  value={nuevoExtra.tipo}
                  onChange={(e) => setNuevoExtra({ ...nuevoExtra, tipo: e.target.value, refId: "", concepto: "", costoUnitario: 0 })}
                >
                  <option value="manual">Costo manual / estructura</option>
                  <option value="receta">Receta</option>
                  <option value="tecnica">Técnica creativa</option>
                  <option value="insumo">Insumo / trabajo manual</option>
                </select>

                {nuevoExtra.tipo === "manual" ? (
                  <>
                    <input
                      className="border rounded px-2 py-1.5 w-full mb-2 text-sm"
                      placeholder="Concepto (ej. estructura, base)"
                      value={nuevoExtra.concepto}
                      onChange={(e) => setNuevoExtra({ ...nuevoExtra, concepto: e.target.value })}
                    />
                    <input
                      type="number" step="0.01" min="0"
                      className="border rounded px-2 py-1.5 w-full mb-2 text-sm"
                      placeholder="Costo unitario"
                      value={nuevoExtra.costoUnitario}
                      onChange={(e) => setNuevoExtra({ ...nuevoExtra, costoUnitario: e.target.value })}
                    />
                  </>
                ) : (
                  <>
                    <select
                      className="border rounded px-2 py-1.5 w-full mb-2 text-sm"
                      value={nuevoExtra.refId}
                      onChange={(e) => {
                        const refId = e.target.value;
                        setNuevoExtra((prev) => ({
                          ...prev,
                          refId,
                          costoUnitario: refId ? costoSugerido(prev.tipo, refId) : 0,
                        }));
                      }}
                    >
                      <option value="">— Selecciona —</option>
                      {nuevoExtra.tipo === "receta" && fuentes.recetas.map((r) => (
                        <option key={r._id} value={r._id}>{r.nombre_receta} (${r.portions > 0 ? (r.total_cost / r.portions).toFixed(2) : "?"}/porción)</option>
                      ))}
                      {nuevoExtra.tipo === "tecnica" && fuentes.tecnicas.map((t) => (
                        <option key={t._id} value={t._id}>{t.nombre}</option>
                      ))}
                      {nuevoExtra.tipo === "insumo" && fuentes.insumos.map((i) => (
                        <option key={i._id} value={i._id}>{i.name} (${Number(i.cost).toFixed(2)}{i.unit ? `/${i.unit}` : ""})</option>
                      ))}
                    </select>
                    <label className="block text-xs font-semibold mb-1">Costo unitario (editable)</label>
                    <input
                      type="number" step="0.01" min="0"
                      className="border rounded px-2 py-1.5 w-full mb-2 text-sm"
                      value={nuevoExtra.costoUnitario}
                      onChange={(e) => setNuevoExtra({ ...nuevoExtra, costoUnitario: e.target.value })}
                      placeholder="Costo unitario"
                    />
                  </>
                )}

                <label className="block text-xs font-semibold mb-1">Cantidad (ej. gramos / piezas)</label>
                <input
                  type="number" min="1" step="1"
                  className="border rounded px-2 py-1.5 w-full mb-2 text-sm"
                  value={nuevoExtra.cantidad}
                  onChange={(e) => setNuevoExtra({ ...nuevoExtra, cantidad: e.target.value })}
                />

                <button
                  onClick={agregarExtra}
                  className="px-3 py-1.5 rounded text-xs font-semibold text-white w-full mb-2"
                  style={{ background: "var(--accent, #6FC9A8)" }}
                >
                  + Agregar renglón
                </button>
                <button
                  onClick={guardarYRecalcular}
                  disabled={guardandoExtras}
                  className="px-3 py-1.5 rounded text-xs font-semibold text-white w-full disabled:opacity-50"
                  style={{ background: "var(--rosa)" }}
                >
                  {guardandoExtras ? "Guardando…" : "Guardar extras y recalcular"}
                </button>
              </div>

              {/* Notas internas */}
              <div className="bg-white shadow rounded-lg p-5">
                <h3 className="font-bold mb-3" style={{ color: "var(--burdeos)" }}>Notas internas</h3>
                <div className="space-y-2 mb-3 max-h-60 overflow-y-auto">
                  {(cot.notasInternas || []).length === 0 ? (
                    <p className="text-xs text-gray-400 italic">Sin notas</p>
                  ) : (
                    cot.notasInternas.map((n) => (
                      <div key={n._id} className="bg-gray-50 p-2 rounded text-xs">
                        <p>{n.texto}</p>
                        <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                          <span>{n.autorNombre || n.autorEmail || "Admin"} · {new Date(n.fecha).toLocaleDateString("es-MX")}</span>
                          <button onClick={() => borrarNota(n._id)} className="text-red-400 hover:text-red-600">✕</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <textarea
                  rows={2}
                  className="border rounded px-3 py-2 w-full text-sm mb-2"
                  value={notaTexto}
                  onChange={(e) => setNotaTexto(e.target.value)}
                  placeholder="Nueva nota…"
                />
                <button
                  onClick={agregarNota}
                  disabled={!notaTexto.trim()}
                  className="px-3 py-1.5 rounded text-xs font-semibold text-white w-full disabled:opacity-50"
                  style={{ background: "var(--accent, #6FC9A8)" }}
                >
                  Agregar nota
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}

function Info({ label, val }) {
  return (
    <div className="flex justify-between text-sm py-1.5 border-b border-gray-100">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-right max-w-[60%]">{val ?? "—"}</span>
    </div>
  );
}

// Formulario de edición completa de la cotización (admin).
function EditForm({ edit, setEdit, catalogos, toggleDecoEdit, togglePostreEdit, onCancel, onSave, guardando }) {
  const set = (k, v) => setEdit((e) => ({ ...e, [k]: v }));
  const esMesa = edit.tipoProducto === "mesa-postres";
  const esCup = edit.tipoProducto === "cupcake";
  const inp = "border rounded px-3 py-2 w-full text-sm";
  const lbl = "block text-xs font-semibold mb-1 text-gray-600 mt-2";
  return (
    <div className="text-sm">
      <label className={lbl}>Tipo de producto</label>
      <select className={inp} value={edit.tipoProducto} onChange={(e) => set("tipoProducto", e.target.value)}>
        <option value="pastel">Pastel</option>
        <option value="cupcake">Cupcakes</option>
        <option value="mesa-postres">Mesa de postres</option>
      </select>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={lbl}>Evento</label>
          <select className={inp} value={edit.eventoTipo} onChange={(e) => set("eventoTipo", e.target.value)}>
            <option value="">—</option>
            {EVENTOS.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>Fecha del evento</label>
          <input type="date" className={inp} value={edit.eventoFecha} onChange={(e) => set("eventoFecha", e.target.value)} />
        </div>
        <div>
          <label className={lbl}>{esMesa ? "Personas" : "Porciones"}</label>
          <input type="number" min="1" className={inp} value={edit.invitados} onChange={(e) => set("invitados", e.target.value)} />
        </div>
        {!esMesa && !esCup && (
          <div>
            <label className={lbl}>Niveles</label>
            <input type="number" min="1" max="6" className={inp} value={edit.niveles} onChange={(e) => set("niveles", e.target.value)} />
          </div>
        )}
      </div>

      {esMesa ? (
        <>
          <label className={lbl}>Postres por persona</label>
          <input type="number" min="1" className={inp} value={edit.postresPorPersona} onChange={(e) => set("postresPorPersona", e.target.value)} />
          <label className={lbl}>Postres</label>
          <div className="flex flex-wrap gap-1.5">
            {catalogos.postres.map((p) => {
              const on = edit.postresSlugs.includes(p.slug);
              return <button key={p.slug} type="button" onClick={() => togglePostreEdit(p.slug)} className={`text-xs px-2 py-1 rounded border ${on ? "text-white" : "text-gray-600"}`} style={on ? { background: "var(--burdeos)", borderColor: "var(--burdeos)" } : {}}>{p.emoji || "🍰"} {p.nombre}</button>;
            })}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={lbl}>{esCup ? "Sabor cupcake" : "Bizcocho"}</label>
              <select className={inp} value={edit.saborSlug} onChange={(e) => set("saborSlug", e.target.value)}>
                <option value="">—</option>
                {catalogos.sabores.map((s) => <option key={s.slug} value={s.slug}>{s.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Relleno</label>
              <select className={inp} value={edit.rellenoSlug} onChange={(e) => set("rellenoSlug", e.target.value)}>
                <option value="">Sin relleno</option>
                {catalogos.rellenos.map((s) => <option key={s.slug} value={s.slug}>{s.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Cobertura</label>
              <select className={inp} value={edit.coberturaSlug} onChange={(e) => set("coberturaSlug", e.target.value)}>
                <option value="">—</option>
                {catalogos.coberturas.map((s) => <option key={s.slug} value={s.slug}>{s.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Color principal</label>
              <input type="color" className="border rounded w-full h-9" value={edit.colorPrincipal || "#ffffff"} onChange={(e) => set("colorPrincipal", e.target.value)} />
            </div>
          </div>
          <label className={lbl}>Decoraciones</label>
          <div className="flex flex-wrap gap-1.5">
            {catalogos.decoraciones.map((d) => {
              const on = edit.decoracionesSlugs.includes(d.slug);
              return <button key={d.slug} type="button" onClick={() => toggleDecoEdit(d.slug)} className={`text-xs px-2 py-1 rounded border ${on ? "text-white" : "text-gray-600"}`} style={on ? { background: "var(--burdeos)", borderColor: "var(--burdeos)" } : {}}>{d.emoji || "🎀"} {d.nombre}</button>;
            })}
          </div>
        </>
      )}

      <label className={lbl}>Estilo</label>
      <select className={inp} value={edit.estiloValue} onChange={(e) => set("estiloValue", e.target.value)}>
        <option value="">—</option>
        {ESTILOS.map((x) => <option key={x} value={x}>{x}</option>)}
      </select>

      <label className={lbl}>Comentarios / mensaje</label>
      <textarea rows={2} className={inp} value={edit.comentarios} onChange={(e) => set("comentarios", e.target.value)} />

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={lbl}>Entrega</label>
          <select className={inp} value={edit.entregaTipo} onChange={(e) => set("entregaTipo", e.target.value)}>
            <option value="">—</option>
            {ENTREGAS.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>Hora de entrega</label>
          <input type="time" className={inp} value={edit.entregaHora} onChange={(e) => set("entregaHora", e.target.value)} />
        </div>
      </div>
      {["domicilio", "evento"].includes(edit.entregaTipo) && (
        <>
          <label className={lbl}>Dirección / zona</label>
          <input className={inp} value={edit.entregaDireccion} onChange={(e) => set("entregaDireccion", e.target.value)} />
        </>
      )}

      <h3 className="font-bold text-md mt-4 mb-1" style={{ color: "var(--burdeos)" }}>Cliente</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={lbl}>Nombre</label>
          <input className={inp} value={edit.clienteNombre} onChange={(e) => set("clienteNombre", e.target.value)} />
        </div>
        <div>
          <label className={lbl}>Teléfono</label>
          <input className={inp} value={edit.clienteTelefono} onChange={(e) => set("clienteTelefono", e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className={lbl}>Email</label>
          <input className={inp} value={edit.clienteEmail} onChange={(e) => set("clienteEmail", e.target.value)} />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button onClick={onSave} disabled={guardando} className="px-4 py-2 rounded text-sm font-semibold text-white w-full disabled:opacity-50" style={{ background: "var(--burdeos)" }}>
          {guardando ? "Guardando…" : "Guardar cambios"}
        </button>
        <button onClick={onCancel} className="px-4 py-2 rounded text-sm font-semibold border text-gray-600">Cancelar</button>
      </div>
    </div>
  );
}

function CostRow({ label, val, sub, bold, highlight }) {
  return (
    <div className="flex justify-between py-0.5">
      <span className={highlight ? "font-bold text-burdeos" : bold ? "font-bold" : ""} style={highlight ? { color: "var(--burdeos)" } : {}}>
        {label}
        {sub && <span className="block text-[10px] text-gray-400 font-normal">{sub}</span>}
      </span>
      <span className={highlight ? "font-bold" : bold ? "font-bold" : ""} style={highlight ? { color: "var(--burdeos)" } : {}}>
        ${Number(val || 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    </div>
  );
}
