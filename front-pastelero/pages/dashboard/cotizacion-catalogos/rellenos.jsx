import CatalogoCrudPage from "@/src/components/cotizacionCatalogos/CatalogoCrudPage";

const DEFAULT = {
  slug: "",
  nombre: "",
  descripcion: "",
  costoPorPorcion: 0,
  activo: true,
  orden: 0,
};

export default function RellenosPage() {
  return (
    <CatalogoCrudPage
      tipo="rellenos"
      labelSingular="Relleno"
      labelPlural="Rellenos"
      defaultDoc={DEFAULT}
      columnas={[
        {
          key: "costoPorPorcion",
          label: "Costo / porción",
          render: (d) => `$${Number(d.costoPorPorcion ?? 0).toFixed(2)}`,
        },
      ]}
      renderFormFields={({ form, setForm }) => (
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
          <div className="text-[10px] text-gray-400 mt-1">
            Se suma al costo total del pastel para Fase D del costeo.
          </div>
        </div>
      )}
    />
  );
}
