import { useEffect, useState } from "react";
import NavbarAdmin from "@/src/components/navbar";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import Swal from "sweetalert2";
import { useAuth } from "@/src/context";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const MAX_LADO_PX = 1200;
const MAX_DESTACADOS = 4;

/** Genera un slug normalizado (minúsculas, sin acentos, guiones). */
function generarSlug(texto) {
  return (texto || "")
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita marcas diacríticas (acentos, ñ→n etc.)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Redimensiona imagen en canvas a max MAX_LADO_PX manteniendo proporción.
 *  Mismo helper que en home-config — evita el truncamiento del PNG por
 *  el límite de body de Vercel y deja archivos chicos en GCS. */
function redimensionarImagen(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const escala = Math.min(1, MAX_LADO_PX / Math.max(w, h));
      const targetW = Math.round(w * escala);
      const targetH = Math.round(h * escala);
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      canvas.getContext("2d").drawImage(img, 0, 0, targetW, targetH);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("No se pudo procesar la imagen"));
          const base = file.name.replace(/\.[^.]+$/, "") || "imagen";
          resolve(new File([blob], `${base}.png`, { type: "image/png" }));
        },
        "image/png"
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen"));
    };
    img.src = url;
  });
}

const FORM_VACIO = {
  _id: null,
  slug: "",
  nombre: "",
  descripcion: "",
  precio: "",
  imagenUrl: "",
  imagenFileName: "",
  activo: true,
  destacado: false,
  orden: 0,
};

export default function DashboardPostres() {
  const { userToken } = useAuth();
  const [postres, setPostres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(FORM_VACIO);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const editando = form._id != null;
  const destacadosCount = postres.filter((p) => p.destacado && p.activo).length;

  /* ── Carga inicial ── */
  async function cargar() {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/postres?incluyeInactivos=true`);
      const j = await r.json();
      setPostres(j?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { cargar(); }, []);

  /* ── Editar / Nuevo ── */
  const editar = (p) => {
    setForm({
      _id: p._id,
      slug: p.slug || "",
      nombre: p.nombre || "",
      descripcion: p.descripcion || "",
      precio: p.precio ?? "",
      imagenUrl: p.imagenUrl || "",
      imagenFileName: p.imagenFileName || "",
      activo: p.activo !== false,
      destacado: !!p.destacado,
      orden: p.orden ?? 0,
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };
  const nuevo = () => setForm(FORM_VACIO);

  /* ── Auto-slug al cambiar nombre (solo si estamos creando) ── */
  const onNombreChange = (e) => {
    const nombre = e.target.value;
    setForm((p) => ({
      ...p,
      nombre,
      slug: editando ? p.slug : generarSlug(nombre),
    }));
  };

  /* ── Submit (create / update) ── */
  const guardar = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      return Swal.fire({ icon: "warning", title: "El nombre es obligatorio", background: "#fff1f2", color: "#540027" });
    }
    if (!form.slug.trim()) {
      return Swal.fire({ icon: "warning", title: "El slug es obligatorio", background: "#fff1f2", color: "#540027" });
    }
    const precioNum = Number(form.precio);
    if (!Number.isFinite(precioNum) || precioNum < 0) {
      return Swal.fire({ icon: "warning", title: "El precio debe ser un número ≥ 0", background: "#fff1f2", color: "#540027" });
    }

    setSubmitting(true);
    try {
      const url = editando ? `${API_BASE}/postres/${form._id}` : `${API_BASE}/postres`;
      const method = editando ? "PUT" : "POST";
      const payload = {
        slug: form.slug.trim(),
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio: precioNum,
        imagenUrl: form.imagenUrl,
        imagenFileName: form.imagenFileName,
        activo: form.activo,
        destacado: form.destacado,
        orden: Number(form.orden) || 0,
      };
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.message || `HTTP ${r.status}`);
      await cargar();
      setForm(FORM_VACIO);
      Swal.fire({ icon: "success", title: editando ? "Postre actualizado" : "Postre creado", timer: 1500, showConfirmButton: false, background: "#fff1f2", color: "#540027" });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "No se pudo guardar", text: String(err.message || err), background: "#fff1f2", color: "#540027" });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Borrar ── */
  const borrar = async (p) => {
    const c = await Swal.fire({
      icon: "warning",
      title: `¿Borrar "${p.nombre}"?`,
      text: "Acción irreversible. También se borrará su imagen del bucket.",
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      background: "#fff1f2",
      color: "#540027",
    });
    if (!c.isConfirmed) return;
    try {
      const r = await fetch(`${API_BASE}/postres/${p._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      await cargar();
      if (form._id === p._id) setForm(FORM_VACIO);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "No se pudo borrar", background: "#fff1f2", color: "#540027" });
    }
  };

  /* ── Toggle destacado inline (sin abrir form) ── */
  const toggleDestacado = async (p) => {
    const proximo = !p.destacado;
    if (proximo && destacadosCount >= MAX_DESTACADOS) {
      return Swal.fire({
        icon: "info",
        title: `Ya hay ${MAX_DESTACADOS} destacados`,
        text: "Quita uno antes de marcar este.",
        background: "#fff1f2", color: "#540027",
      });
    }
    try {
      const r = await fetch(`${API_BASE}/postres/${p._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` },
        body: JSON.stringify({ destacado: proximo }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.message || `HTTP ${r.status}`);
      await cargar();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "No se pudo actualizar", text: String(err.message || err), background: "#fff1f2", color: "#540027" });
    }
  };

  /* ── Subir imagen del postre actual (form) ── */
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      return Swal.fire({ icon: "warning", title: "Debe ser una imagen", background: "#fff1f2", color: "#540027" });
    }
    setUploading(true);
    try {
      const fileResized = await redimensionarImagen(file);
      const fd = new FormData();
      fd.append("files", fileResized);
      const r = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${userToken}` },
        body: fd,
      });
      if (!r.ok) throw new Error("Error al subir el archivo");
      const j = await r.json();
      const up = Array.isArray(j) ? j[0] : j;
      if (!up?.fileUrl) throw new Error("Respuesta de upload incompleta");
      setForm((p) => ({ ...p, imagenUrl: up.fileUrl, imagenFileName: up.fileName || "" }));
      Swal.fire({ icon: "success", title: "Imagen subida", text: "No olvides guardar el postre.", timer: 1800, showConfirmButton: false, background: "#fff1f2", color: "#540027" });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "No se pudo subir", text: String(err.message || err), background: "#fff1f2", color: "#540027" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const inputStyle = "bg-gray-50 border border-secondary text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5";

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className="flex-grow md:w-3/4 mb-14 max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between px-6 pt-6">
            <h1 className={`text-4xl ${sofia.className}`}>Postres</h1>
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              Destacados: <strong>{destacadosCount}/{MAX_DESTACADOS}</strong>
            </span>
          </div>

          {/* ── Lista ─────────────────────────────────────────── */}
          <section className="px-6 mt-4">
            {loading ? (
              <p>Cargando…</p>
            ) : postres.length === 0 ? (
              <div className="border border-dashed border-secondary rounded-2xl p-8 text-center text-gray-600">
                Aún no hay postres. Crea el primero usando el formulario de abajo.
              </div>
            ) : (
              <div className="overflow-x-auto border border-secondary rounded-2xl bg-white">
                <table className="w-full text-sm">
                  <thead style={{ background: "#fff1f2", color: "#540027" }}>
                    <tr>
                      <th className="text-left p-3">Imagen</th>
                      <th className="text-left p-3">Nombre</th>
                      <th className="text-left p-3">Precio</th>
                      <th className="text-center p-3">Activo</th>
                      <th className="text-center p-3">Destacado</th>
                      <th className="text-center p-3">Orden</th>
                      <th className="text-right p-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postres.map((p) => (
                      <tr key={p._id} className="border-t border-secondary">
                        <td className="p-3">
                          <div
                            style={{
                              width: 56, height: 56, borderRadius: 12,
                              background: "#fafafa", border: "1px solid #eee",
                              backgroundImage: p.imagenUrl ? `url(${p.imagenUrl})` : "none",
                              backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center",
                            }}
                          />
                        </td>
                        <td className="p-3">
                          <div className="font-semibold">{p.nombre}</div>
                          <div className="text-xs text-gray-500">{p.slug}</div>
                        </td>
                        <td className="p-3 font-bold">${Number(p.precio).toFixed(2)}</td>
                        <td className="p-3 text-center">{p.activo ? "✓" : "—"}</td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleDestacado(p)}
                            title={p.destacado ? "Quitar de destacados" : "Marcar como destacado"}
                            className="text-lg"
                            style={{ color: p.destacado ? "#FF6F7D" : "#bbb" }}
                          >
                            {p.destacado ? "★" : "☆"}
                          </button>
                        </td>
                        <td className="p-3 text-center text-gray-600">{p.orden}</td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => editar(p)}
                            className="px-3 py-1 rounded-full border border-secondary mr-2 hover:bg-rosa-4"
                            style={{ color: "var(--burdeos)" }}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => borrar(p)}
                            className="px-3 py-1 rounded-full text-white hover:opacity-90"
                            style={{ background: "#dc2626" }}
                          >
                            Borrar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── Form crear / editar ─────────────────────────── */}
          <section className="px-6 mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className={`text-2xl ${sofia.className}`}>
                {editando ? `Editar "${form.nombre}"` : "Nuevo postre"}
              </h2>
              {editando && (
                <button
                  type="button"
                  onClick={nuevo}
                  className="px-4 py-2 rounded-full border border-secondary hover:bg-rosa-4"
                  style={{ color: "var(--burdeos)" }}
                >
                  + Nuevo (limpiar form)
                </button>
              )}
            </div>

            <form onSubmit={guardar} className="border border-secondary rounded-2xl p-6 bg-white space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Nombre *</label>
                  <input type="text" value={form.nombre} onChange={onNombreChange} className={inputStyle} placeholder="Pay de pistache" />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Slug (URL) *</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                    className={inputStyle}
                    placeholder="pay-de-pistache"
                    pattern="[a-z0-9-]+"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minúsculas, números y guiones. Aparece en la URL pública.</p>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
                  className={inputStyle}
                  rows={3}
                  placeholder="Masa de mantequilla rellena de crema de pistache…"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Precio (MXN) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.precio}
                    onChange={(e) => setForm((p) => ({ ...p, precio: e.target.value }))}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Orden</label>
                  <input
                    type="number"
                    value={form.orden}
                    onChange={(e) => setForm((p) => ({ ...p, orden: e.target.value }))}
                    className={inputStyle}
                  />
                  <p className="text-xs text-gray-500 mt-1">Menor = aparece antes.</p>
                </div>
                <div className="flex flex-col gap-2 pt-6">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={form.activo} onChange={(e) => setForm((p) => ({ ...p, activo: e.target.checked }))} />
                    <span className="text-sm">Activo (visible en el catálogo)</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.destacado}
                      onChange={(e) => {
                        const proximo = e.target.checked;
                        if (proximo && !form.destacado && destacadosCount >= MAX_DESTACADOS) {
                          Swal.fire({ icon: "info", title: `Ya hay ${MAX_DESTACADOS} destacados`, background: "#fff1f2", color: "#540027" });
                          return;
                        }
                        setForm((p) => ({ ...p, destacado: proximo }));
                      }}
                    />
                    <span className="text-sm">Destacado (aparece en el home)</span>
                  </label>
                </div>
              </div>

              {/* ── Imagen ──────────────────────────────────── */}
              <div>
                <label className="block mb-1 text-sm font-medium">Imagen</label>
                <div className="flex items-center gap-4 flex-wrap">
                  <div
                    style={{
                      width: 120, height: 120, borderRadius: 16,
                      background: "#fafafa", border: "1px dashed #ddd",
                      backgroundImage: form.imagenUrl ? `url(${form.imagenUrl})` : "none",
                      backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center",
                    }}
                  />
                  <div>
                    <label className="inline-block px-4 py-2 rounded-full text-white font-bold cursor-pointer hover:opacity-90" style={{ background: "var(--burdeos)" }}>
                      <input type="file" accept="image/png,image/webp,image/jpeg" onChange={handleFileChange} disabled={uploading} style={{ display: "none" }} />
                      {uploading ? "Subiendo…" : (form.imagenUrl ? "Reemplazar imagen" : "Subir imagen")}
                    </label>
                    {form.imagenUrl && (
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, imagenUrl: "", imagenFileName: "" }))}
                        className="ml-3 px-4 py-2 rounded-full border border-secondary hover:bg-rosa-4"
                        style={{ color: "var(--burdeos)" }}
                        disabled={uploading}
                      >
                        Quitar imagen
                      </button>
                    )}
                    <p className="text-xs text-gray-500 mt-2">PNG (transparente recomendado), WEBP o JPG. Se redimensiona a 1200 px de lado mayor.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="px-6 py-3 rounded-full text-white font-bold disabled:opacity-50"
                  style={{ background: "var(--burdeos)" }}
                >
                  {submitting ? "Guardando…" : (editando ? "Guardar cambios" : "Crear postre")}
                </button>
                {editando && (
                  <button
                    type="button"
                    onClick={nuevo}
                    disabled={submitting || uploading}
                    className="px-6 py-3 rounded-full border border-secondary"
                    style={{ color: "var(--burdeos)" }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </section>
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}
