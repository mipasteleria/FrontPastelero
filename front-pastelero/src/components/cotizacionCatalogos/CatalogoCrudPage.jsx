import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import NavbarAdmin from "@/src/components/navbar";
import Asideadmin from "@/src/components/asideadmin";
import FooterDashboard from "@/src/components/footeradmin";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import { useAuth } from "@/src/context";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * CatalogoCrudPage — pantalla CRUD genérica para los 4 catálogos de
 * cotización (sabor / relleno / cobertura / decoración).
 *
 * Cada catálogo invocador pasa:
 *  - `tipo`              "sabores" | "rellenos" | "coberturas" | "decoraciones"
 *  - `label`             singular ("Sabor") y plural ("Sabores") para titulos
 *  - `columnas`          definición de columnas de tabla
 *  - `defaultDoc`        valores por defecto al crear
 *  - `renderFormFields`  función que recibe ({ form, setForm }) y devuelve los
 *                        inputs específicos del catálogo (ej. selector de receta
 *                        para sabores, selector de técnica para decoraciones).
 *
 * Comportamiento común:
 *  - Carga ?incluyeInactivos=true para que el admin vea todo (también
 *    los activo:false).
 *  - Crear / editar inline en el mismo formulario; "editar" pre-llena.
 *  - Toggle activo con PUT { activo }.
 *  - Eliminar con confirm Swal.
 */
export default function CatalogoCrudPage({
  tipo,
  labelSingular,
  labelPlural,
  columnas,
  defaultDoc,
  renderFormFields,
  // Opcional: render extra a la derecha del nombre en cada fila (ej. swatch).
  renderRowExtra,
  // Hook opcional para post-procesar la lista (ej. ordenar visualmente).
  postProcesarLista,
}) {
  const { userToken } = useAuth();
  const authHeader = userToken ? { Authorization: `Bearer ${userToken}` } : {};

  const [docs, setDocs] = useState([]);
  const [form, setForm] = useState(defaultDoc);
  const [editingId, setEditingId] = useState(null);
  const [cargando, setCargando] = useState(false);

  const url = `${API_BASE}/cotizacion-catalogos/${tipo}`;

  // ── Cargar ───────────────────────────────────────────────────────
  const recargar = async () => {
    try {
      const r = await fetch(`${url}?incluyeInactivos=true`, { headers: authHeader });
      const j = await r.json();
      let list = j.data ?? [];
      if (postProcesarLista) list = postProcesarLista(list);
      setDocs(list);
    } catch (e) {
      console.error("Error cargando catálogo:", e);
    }
  };
  useEffect(() => { recargar(); /* eslint-disable-line */ }, [userToken]);

  // ── Submit (crear/editar) ────────────────────────────────────────
  const submit = async (e) => {
    e?.preventDefault();
    setCargando(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const endpoint = editingId ? `${url}/${editingId}` : url;
      const r = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify(form),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Error");

      await recargar();
      setForm(defaultDoc);
      setEditingId(null);
      Swal.fire({
        icon: "success",
        title: editingId ? `${labelSingular} actualizado` : `${labelSingular} creado`,
        timer: 1600,
        showConfirmButton: false,
        background: "#fff1f2",
        color: "#540027",
      });
    } catch (e) {
      Swal.fire({ icon: "error", title: e.message, timer: 2200, showConfirmButton: false });
    } finally {
      setCargando(false);
    }
  };

  const editar = (doc) => {
    setEditingId(doc._id);
    setForm({ ...defaultDoc, ...doc });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicion = () => {
    setEditingId(null);
    setForm(defaultDoc);
  };

  const toggleActivo = async (doc) => {
    try {
      const r = await fetch(`${url}/${doc._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ activo: !doc.activo }),
      });
      if (!r.ok) throw new Error();
      await recargar();
    } catch {
      Swal.fire({ icon: "error", title: "Error al actualizar", timer: 1800, showConfirmButton: false });
    }
  };

  const eliminar = async (doc) => {
    const result = await Swal.fire({
      title: "¿Eliminar?",
      text: `Se eliminará "${doc.nombre}" del catálogo.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF6F7D",
      cancelButtonColor: "#D6A7BC",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;

    try {
      const r = await fetch(`${url}/${doc._id}`, { method: "DELETE", headers: authHeader });
      if (!r.ok) throw new Error();
      await recargar();
      Swal.fire({ icon: "success", title: "Eliminado", timer: 1600, showConfirmButton: false, background: "#fff1f2", color: "#540027" });
    } catch {
      Swal.fire({ icon: "error", title: "Error al eliminar", timer: 1800, showConfirmButton: false });
    }
  };

  return (
    <div className={`text-text ${poppins.className}`}>
      <NavbarAdmin className="fixed top-0 w-full z-50" />
      <div className="flex flex-row mt-16">
        <Asideadmin />
        <main className="flex-grow w-full max-w-screen-xl mx-auto px-4 md:px-8 pb-24 md:pb-8">
          <h1 className={`text-4xl py-4 ${sofia.className}`}>{labelPlural}</h1>
          <p className="text-sm text-gray-500 -mt-2 mb-4">
            Catálogo de {labelPlural.toLowerCase()} para la cotización personalizada.
            El cliente lo ve en <code className="px-1 bg-gray-100 rounded">/cotizacion</code>.
          </p>

          {/* ── Form ───────────────────────────────────────────── */}
          <form
            onSubmit={submit}
            className="shadow-md rounded-lg p-4 md:p-6 mb-6"
            style={{ background: "#fff", border: "1px solid var(--border-color)" }}
          >
            <div className="text-sm font-bold mb-3" style={{ color: "var(--burdeos)" }}>
              {editingId ? `Editar ${labelSingular.toLowerCase()}` : `Nuevo ${labelSingular.toLowerCase()}`}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Nombre">
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={form.nombre || ""}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                />
              </Field>
              <Field label="Slug (URL-friendly)">
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={form.slug || ""}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                  required
                  placeholder="vainilla-clasica"
                  pattern="[a-z0-9-]+"
                />
              </Field>
              <Field label="Descripción" full>
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={form.descripcion || ""}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                />
              </Field>

              {renderFormFields({ form, setForm, authHeader })}

              <Field label="Orden">
                <input
                  type="number"
                  className="border rounded px-3 py-2 w-full"
                  value={form.orden ?? 0}
                  onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })}
                />
              </Field>
              <Field label="Activo">
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={!!form.activo}
                    onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                  />
                  <span className="text-sm">{form.activo ? "Sí — visible al cliente" : "No — oculto"}</span>
                </label>
              </Field>
            </div>

            <div className="flex gap-2 mt-4 justify-end">
              {editingId && (
                <button
                  type="button"
                  onClick={cancelarEdicion}
                  className="px-4 py-2 rounded text-sm font-semibold text-gray-600 border"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={cargando}
                className="px-6 py-2 rounded text-sm font-semibold text-white shadow-md disabled:opacity-50"
                style={{ background: "var(--burdeos)" }}
              >
                {cargando ? "Guardando…" : editingId ? "Guardar cambios" : `Crear ${labelSingular.toLowerCase()}`}
              </button>
            </div>
          </form>

          {/* ── Tabla ──────────────────────────────────────────── */}
          <div className="shadow-md rounded-lg overflow-x-auto" style={{ background: "#fff" }}>
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase border-b border-secondary">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  {columnas.map((c) => (
                    <th key={c.key} className="px-4 py-3">{c.label}</th>
                  ))}
                  <th className="px-4 py-3">Activo</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {docs.length === 0 ? (
                  <tr>
                    <td colSpan={3 + columnas.length} className="px-4 py-6 text-center text-gray-400">
                      Sin {labelPlural.toLowerCase()}. Crea el primero arriba.
                    </td>
                  </tr>
                ) : (
                  docs.map((d) => (
                    <tr key={d._id} className="border-b border-secondary">
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-2">
                          {renderRowExtra && renderRowExtra(d)}
                          <div>
                            <div>{d.nombre}</div>
                            <div className="text-xs text-gray-400">{d.slug}</div>
                          </div>
                        </div>
                      </td>
                      {columnas.map((c) => (
                        <td key={c.key} className="px-4 py-3">
                          {c.render ? c.render(d) : d[c.key]}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleActivo(d)}
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            d.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {d.activo ? "Sí" : "No"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <button onClick={() => editar(d)} className="text-accent hover:underline text-xs">
                            Editar
                          </button>
                          <button onClick={() => eliminar(d)} className="text-red-500 hover:text-red-700 text-xs">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <FooterDashboard />
    </div>
  );
}

// Pequeño wrapper de label + input para limpiar el JSX del form.
function Field({ label, children, full }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-xs font-semibold mb-1 text-gray-600">{label}</label>
      {children}
    </div>
  );
}
