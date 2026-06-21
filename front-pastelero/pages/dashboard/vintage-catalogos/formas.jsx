import CatalogoCrudPage from "@/src/components/cotizacionCatalogos/CatalogoCrudPage";
import ImgUploadField from "@/src/components/vintage/ImgUploadField";

const DEFAULT = { slug: "", nombre: "", emoji: "", imagenUrl: "", activo: true, orden: 0 };

export default function VintageFormasPage() {
  return (
    <CatalogoCrudPage
      basePath="vintage-catalogos"
      tipo="formas"
      labelSingular="Forma"
      labelPlural="Formas (vintage)"
      defaultDoc={DEFAULT}
      renderRowExtra={(d) => (d.imagenUrl ? <img src={d.imagenUrl} alt="" style={{ width: 28, height: 28, objectFit: "contain" }} /> : <span style={{ fontSize: 22 }}>{d.emoji || "⬭"}</span>)}
      columnas={[]}
      renderFormFields={({ form, setForm }) => (
        <>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-600">Emoji opcional</label>
            <input className="border rounded px-3 py-2 w-full" value={form.emoji || ""} maxLength={4}
              onChange={(e) => setForm({ ...form, emoji: e.target.value })} placeholder="❤️ ⬛ ⬡" />
          </div>
          <ImgUploadField value={form.imagenUrl} onChange={(url) => setForm({ ...form, imagenUrl: url })} label="Imagen de la forma (opcional)" />
        </>
      )}
    />
  );
}
