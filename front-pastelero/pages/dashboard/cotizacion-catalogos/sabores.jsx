import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import CatalogoCrudPage from "@/src/components/cotizacionCatalogos/CatalogoCrudPage";
import { useAuth } from "@/src/context";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const DEFAULT = {
  slug: "",
  nombre: "",
  descripcion: "",
  swatch: "linear-gradient(135deg,#FFE2E7,#FFC3C9)",
  emoji: "",
  recetaId: "",
  costoManualPorPorcion: 0,
  activo: true,
  orden: 0,
};

export default function SaboresPage() {
  const { userToken } = useAuth();
  const [recetas, setRecetas] = useState([]);

  // Cargar recetas para el selector — solo una vez.
  useEffect(() => {
    if (!userToken) return;
    fetch(`${API_BASE}/recetas/recetas`, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
      .then((r) => r.json())
      .then((j) => setRecetas(j.data || j || []))
      .catch(console.error);
  }, [userToken]);

  // Recosteo manual desde la receta vinculada — pide el costo unitario al back.
  const recostear = async (id) => {
    try {
      const r = await fetch(`${API_BASE}/cotizacion-catalogos/sabores/${id}/recostear`, {
        method: "POST",
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Error");
      Swal.fire({
        icon: "success",
        title: `Recosteado: $${j.data?.costoUnitarioSnapshot?.toFixed(2) ?? "?"} / porción`,
        timer: 2200,
        showConfirmButton: false,
        background: "#fff1f2",
        color: "#540027",
      });
      // Trigger reload — el componente padre maneja el fetch; un truco
      // simple es recargar la página. TODO: pasar callback de refresh.
      window.location.reload();
    } catch (e) {
      Swal.fire({ icon: "error", title: e.message, timer: 2200, showConfirmButton: false });
    }
  };

  return (
    <CatalogoCrudPage
      tipo="sabores"
      labelSingular="Sabor"
      labelPlural="Sabores del bizcocho"
      defaultDoc={DEFAULT}
      renderRowExtra={(d) => (
        <div
          aria-hidden="true"
          style={{
            width: 28, height: 28, borderRadius: "50%",
            background: d.swatch || "var(--rosa-3)",
            flexShrink: 0,
            border: "1px solid #eee",
          }}
        />
      )}
      columnas={[
        {
          key: "receta",
          label: "Receta",
          render: (d) => {
            const r = recetas.find((x) => String(x._id) === String(d.recetaId?._id || d.recetaId));
            return r ? r.nombre_receta : <span className="text-gray-400 italic">manual</span>;
          },
        },
        {
          key: "costo",
          label: "Costo / porción",
          render: (d) => {
            const c = d.costoUnitarioSnapshot ?? d.costoManualPorPorcion ?? 0;
            return `$${Number(c).toFixed(2)}`;
          },
        },
        {
          key: "recostear",
          label: "Recosteo",
          render: (d) => (
            d.recetaId ? (
              <button
                onClick={() => recostear(d._id)}
                className="text-xs text-accent hover:underline"
              >
                Recostear
              </button>
            ) : <span className="text-xs text-gray-300">—</span>
          ),
        },
      ]}
      renderFormFields={({ form, setForm }) => (
        <>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Emoji opcional</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={form.emoji || ""}
              onChange={(e) => setForm({ ...form, emoji: e.target.value })}
              placeholder="🍰"
              maxLength={4}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Swatch (CSS background)</label>
            <input
              className="border rounded px-3 py-2 w-full font-mono text-xs"
              value={form.swatch || ""}
              onChange={(e) => setForm({ ...form, swatch: e.target.value })}
            />
            <div className="mt-1 h-6 rounded" style={{ background: form.swatch }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Receta vinculada (opcional)</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={form.recetaId || ""}
              onChange={(e) => setForm({ ...form, recetaId: e.target.value || null })}
            >
              <option value="">— Sin receta (costo manual) —</option>
              {recetas.map((r) => (
                <option key={r._id} value={r._id}>{r.nombre_receta}</option>
              ))}
            </select>
            <div className="text-[10px] text-gray-400 mt-1">
              Si eliges receta, el botón "Recostear" en la tabla congela el costo unitario.
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">
              Costo manual / porción (fallback)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="border rounded px-3 py-2 w-full"
              value={form.costoManualPorPorcion ?? 0}
              onChange={(e) => setForm({ ...form, costoManualPorPorcion: Number(e.target.value) })}
            />
            <div className="text-[10px] text-gray-400 mt-1">
              Solo se usa si no hay receta o si la receta aún no se ha recosteado.
            </div>
          </div>
        </>
      )}
    />
  );
}
