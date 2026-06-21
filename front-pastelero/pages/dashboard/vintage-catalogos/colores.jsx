import CatalogoCrudPage from "@/src/components/cotizacionCatalogos/CatalogoCrudPage";
import ImgUploadField from "@/src/components/vintage/ImgUploadField";

const DEFAULT = { slug: "", nombre: "", hex: "#FFC9D4", imagenUrl: "", costo: 0, margen: 0, activo: true, orden: 0 };

export default function VintageColoresPage() {
  return (
    <CatalogoCrudPage
      basePath="vintage-catalogos"
      tipo="colores"
      labelSingular="Color base"
      labelPlural="Colores base (vintage)"
      defaultDoc={DEFAULT}
      renderRowExtra={(d) => (
        d.imagenUrl
          ? <img src={d.imagenUrl} alt="" style={{ width: 28, height: 28, objectFit: "contain" }} />
          : <span style={{ width: 22, height: 22, borderRadius: "50%", background: d.hex, border: "1px solid #ddd", display: "inline-block" }} />
      )}
      columnas={[
        { key: "hex", label: "Color", render: (d) => <span className="inline-flex items-center gap-2"><span style={{ width: 16, height: 16, borderRadius: "50%", background: d.hex, border: "1px solid #ddd" }} />{d.hex}</span> },
        { key: "costo", label: "Costo", render: (d) => `$${Number(d.costo).toFixed(2)}` },
        { key: "margen", label: "Margen", render: (d) => `${d.margen}%` },
      ]}
      renderFormFields={({ form, setForm }) => (
        <>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Color (hex)</label>
            <div className="flex items-center gap-2">
              <input type="color" className="border rounded h-9 w-12" value={form.hex || "#FFFFFF"} onChange={(e) => setForm({ ...form, hex: e.target.value })} />
              <input className="border rounded px-3 py-2 w-full font-mono text-xs" value={form.hex || ""} onChange={(e) => setForm({ ...form, hex: e.target.value })} />
            </div>
          </div>
          <ImgUploadField value={form.imagenUrl} onChange={(url) => setForm({ ...form, imagenUrl: url })} label="PNG del pastel en este color (sin fondo)" />
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Costo (opcional)</label>
            <input type="number" step="0.01" min="0" className="border rounded px-3 py-2 w-full" value={form.costo ?? 0} onChange={(e) => setForm({ ...form, costo: Number(e.target.value) })} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Margen (%)</label>
            <input type="number" min="0" className="border rounded px-3 py-2 w-full" value={form.margen ?? 0} onChange={(e) => setForm({ ...form, margen: Number(e.target.value) })} />
          </div>
        </>
      )}
    />
  );
}
