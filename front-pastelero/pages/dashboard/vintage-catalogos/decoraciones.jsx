import { useEffect, useState } from "react";
import CatalogoCrudPage from "@/src/components/cotizacionCatalogos/CatalogoCrudPage";
import ImgUploadField from "@/src/components/vintage/ImgUploadField";
import VariantesFormaPisos from "@/src/components/vintage/VariantesFormaPisos";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const DEFAULT = { slug: "", nombre: "", descripcion: "", costo: 0, margen: 0, colores: [], activo: true, orden: 0 };

export default function VintageDecoracionesPage() {
  const [formas, setFormas] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/vintage-catalogos/formas`)
      .then((r) => r.json())
      .then((j) => setFormas(j.data || []))
      .catch(() => {});
  }, []);

  return (
    <CatalogoCrudPage
      basePath="vintage-catalogos"
      tipo="decoraciones"
      labelSingular="Decoración"
      labelPlural="Decoraciones (vintage)"
      defaultDoc={DEFAULT}
      columnas={[
        { key: "costo", label: "Costo", render: (d) => `$${Number(d.costo).toFixed(2)}` },
        { key: "margen", label: "Margen", render: (d) => `${d.margen}%` },
        { key: "colores", label: "Colores", render: (d) => (d.colores || []).length },
      ]}
      renderFormFields={({ form, setForm }) => {
        const colores = form.colores || [];
        const setColor = (i, patch) => setForm({ ...form, colores: colores.map((c, idx) => idx === i ? { ...c, ...patch } : c) });
        const addColor = () => setForm({ ...form, colores: [...colores, { nombre: "", hex: "#FFC9D4", imagenUrl: "" }] });
        const delColor = (i) => setForm({ ...form, colores: colores.filter((_, idx) => idx !== i) });
        return (
          <>
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-600">Costo</label>
              <input type="number" step="0.01" min="0" className="border rounded px-3 py-2 w-full" value={form.costo ?? 0} onChange={(e) => setForm({ ...form, costo: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-600">Margen (%)</label>
              <input type="number" min="0" className="border rounded px-3 py-2 w-full" value={form.margen ?? 0} onChange={(e) => setForm({ ...form, margen: Number(e.target.value) })} />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-600">Variantes de color (cada una con su PNG sin fondo)</label>
                <button type="button" onClick={addColor} className="text-xs font-semibold text-accent">+ Agregar color</button>
              </div>
              {colores.length === 0 && <p className="text-[11px] text-gray-400">Agrega al menos un color (ej. Azul, Blanco) con su imagen para el visualizador.</p>}
              <div className="space-y-3">
                {colores.map((c, i) => (
                  <div key={i} className="border rounded p-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-start bg-gray-50">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-600">Nombre</label>
                      <input className="border rounded px-2 py-1.5 w-full text-sm" value={c.nombre} placeholder="Azul" onChange={(e) => setColor(i, { nombre: e.target.value })} />
                      <label className="block text-xs font-semibold mb-1 mt-2 text-gray-600">Color</label>
                      <input type="color" className="border rounded h-8 w-12" value={c.hex || "#FFFFFF"} onChange={(e) => setColor(i, { hex: e.target.value })} />
                    </div>
                    <div className="md:col-span-2 flex items-start justify-between gap-3">
                      <ImgUploadField value={c.imagenUrl} onChange={(url) => setColor(i, { imagenUrl: url })} label="PNG general (respaldo)" />
                      <button type="button" onClick={() => delColor(i)} className="text-red-500 text-xs">✕ Quitar</button>
                    </div>
                    <div className="md:col-span-3">
                      <VariantesFormaPisos compacto titulo="PNG por forma × pisos (opcional)"
                        value={c.variantes || []} onChange={(variantes) => setColor(i, { variantes })} formas={formas} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      }}
    />
  );
}
