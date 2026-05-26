import CatalogoCrudPage from "@/src/components/cotizacionCatalogos/CatalogoCrudPage";

const DEFAULT = {
  slug: "",
  nombre: "",
  descripcion: "",
  costoPorPorcion: 0,
  esFondant: false,
  activo: true,
  orden: 0,
};

export default function CoberturasPage() {
  return (
    <CatalogoCrudPage
      tipo="coberturas"
      labelSingular="Cobertura"
      labelPlural="Coberturas"
      defaultDoc={DEFAULT}
      columnas={[
        {
          key: "costoPorPorcion",
          label: "Costo / porción",
          render: (d) => `$${Number(d.costoPorPorcion ?? 0).toFixed(2)}`,
        },
        {
          key: "esFondant",
          label: "Fondant",
          render: (d) => d.esFondant
            ? <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-700">Sí</span>
            : <span className="text-xs text-gray-400">—</span>,
        },
      ]}
      renderFormFields={({ form, setForm }) => (
        <>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">
              Costo extra / porción
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="border rounded px-3 py-2 w-full"
              value={form.costoPorPorcion ?? 0}
              onChange={(e) => setForm({ ...form, costoPorPorcion: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">¿Es fondant?</label>
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={!!form.esFondant}
                onChange={(e) => setForm({ ...form, esFondant: e.target.checked })}
              />
              <span className="text-sm">
                {form.esFondant ? "Sí — muestra toggle especial en /cotizacion" : "No"}
              </span>
            </label>
          </div>
        </>
      )}
    />
  );
}
