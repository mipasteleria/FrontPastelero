import CatalogoCrudPage from "@/src/components/cotizacionCatalogos/CatalogoCrudPage";

const DEFAULT = { slug: "", nombre: "", niveles: 1, costo: 0, margen: 0, activo: true, orden: 0 };

export default function VintagePisosPage() {
  return (
    <CatalogoCrudPage
      basePath="vintage-catalogos"
      tipo="pisos"
      labelSingular="Nivel de pisos"
      labelPlural="Pisos (vintage)"
      defaultDoc={DEFAULT}
      columnas={[
        { key: "niveles", label: "Niveles", render: (d) => d.niveles },
        { key: "costo", label: "Costo", render: (d) => `$${Number(d.costo).toFixed(2)}` },
        { key: "margen", label: "Margen", render: (d) => `${d.margen}%` },
      ]}
      renderFormFields={({ form, setForm }) => (
        <>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Niveles</label>
            <input type="number" min="1" max="3" className="border rounded px-3 py-2 w-full"
              value={form.niveles ?? 1} onChange={(e) => setForm({ ...form, niveles: Number(e.target.value) })} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Costo extra</label>
            <input type="number" step="0.01" min="0" className="border rounded px-3 py-2 w-full"
              value={form.costo ?? 0} onChange={(e) => setForm({ ...form, costo: Number(e.target.value) })} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Margen (%)</label>
            <input type="number" min="0" className="border rounded px-3 py-2 w-full"
              value={form.margen ?? 0} onChange={(e) => setForm({ ...form, margen: Number(e.target.value) })} />
          </div>
        </>
      )}
    />
  );
}
