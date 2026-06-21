import CatalogoCrudPage from "@/src/components/cotizacionCatalogos/CatalogoCrudPage";

const DEFAULT = {
  slug: "", nombre: "", porciones: 12, pisosMax: 1, anticipacionDias: 5,
  costoBase: 0, margenBase: 0, costoDomo: 0, margenDomo: 0, costoBranding: 0, margenBranding: 0,
  activo: true, orden: 0,
};

const Num = ({ label, k, form, setForm, step = "1" }) => (
  <div>
    <label className="block text-xs font-semibold mb-1 text-gray-600">{label}</label>
    <input type="number" step={step} min="0" className="border rounded px-3 py-2 w-full"
      value={form[k] ?? 0} onChange={(e) => setForm({ ...form, [k]: Number(e.target.value) })} />
  </div>
);

export default function VintagePorcionesPage() {
  return (
    <CatalogoCrudPage
      basePath="vintage-catalogos"
      tipo="porciones"
      labelSingular="Tamaño"
      labelPlural="Porciones (vintage)"
      defaultDoc={DEFAULT}
      columnas={[
        { key: "porciones", label: "Porciones", render: (d) => d.porciones },
        { key: "pisosMax", label: "Pisos máx", render: (d) => d.pisosMax },
        { key: "anticipacionDias", label: "Anticip. (días háb.)", render: (d) => d.anticipacionDias },
        { key: "costoBase", label: "Base/Domo/Brand", render: (d) => `$${d.costoBase} / $${d.costoDomo} / $${d.costoBranding}` },
      ]}
      renderFormFields={({ form, setForm }) => (
        <>
          <Num label="Porciones" k="porciones" form={form} setForm={setForm} />
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Pisos máximos</label>
            <select className="border rounded px-3 py-2 w-full" value={form.pisosMax} onChange={(e) => setForm({ ...form, pisosMax: Number(e.target.value) })}>
              <option value={1}>1 piso</option>
              <option value={2}>Hasta 2 pisos</option>
              <option value={3}>Hasta 3 pisos</option>
            </select>
          </div>
          <Num label="Anticipación (días hábiles)" k="anticipacionDias" form={form} setForm={setForm} />
          <div className="md:col-span-2 border-t pt-2 mt-1 text-xs font-bold text-gray-500 uppercase">Costos incluidos (con su margen)</div>
          <Num label="Costo base" k="costoBase" form={form} setForm={setForm} step="0.01" />
          <Num label="Margen base (%)" k="margenBase" form={form} setForm={setForm} />
          <Num label="Costo domo" k="costoDomo" form={form} setForm={setForm} step="0.01" />
          <Num label="Margen domo (%)" k="margenDomo" form={form} setForm={setForm} />
          <Num label="Costo branding" k="costoBranding" form={form} setForm={setForm} step="0.01" />
          <Num label="Margen branding (%)" k="margenBranding" form={form} setForm={setForm} />
        </>
      )}
    />
  );
}
