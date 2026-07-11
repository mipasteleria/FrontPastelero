import { useEffect, useState } from "react";
import CatalogoCrudPage from "@/src/components/cotizacionCatalogos/CatalogoCrudPage";
import ImgUploadField from "@/src/components/vintage/ImgUploadField";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const DEFAULT = { slug: "", nombre: "", hex: "#FFC9D4", imagenUrl: "", variantes: [], costo: 0, margen: 0, activo: true, orden: 0 };

/**
 * Editor de variantes del color: un PNG por combinación forma × pisos.
 * La silueta del pastel cambia con la forma y el número de pisos, así que
 * cada celda puede tener su propia imagen. Las celdas vacías usan el PNG
 * general como respaldo en el visualizador.
 */
function VariantesGrid({ form, setForm, formas }) {
  const niveles = [1, 2, 3];
  const variantes = form.variantes || [];

  const get = (formaSlug, n) => variantes.find((v) => v.formaSlug === formaSlug && v.niveles === n);
  const setVar = (formaSlug, n, imagenUrl) => {
    const resto = variantes.filter((v) => !(v.formaSlug === formaSlug && v.niveles === n));
    setForm({ ...form, variantes: imagenUrl ? [...resto, { formaSlug, niveles: n, imagenUrl }] : resto });
  };

  if (formas.length === 0) return null;

  return (
    <div className="md:col-span-2 border rounded-lg p-3">
      <p className="text-xs font-bold text-gray-600 uppercase mb-1">PNG por forma × pisos</p>
      <p className="text-[11px] text-gray-500 mb-3">
        La silueta cambia según forma y pisos. Sube el PNG de cada combinación que ofrezcas;
        las celdas vacías usan el PNG general de arriba como respaldo.
      </p>
      <div className="overflow-x-auto">
        <table className="text-xs">
          <thead>
            <tr>
              <th className="pr-3 pb-2 text-left text-gray-500">Forma</th>
              {niveles.map((n) => <th key={n} className="px-2 pb-2 text-gray-500">{n} piso{n > 1 ? "s" : ""}</th>)}
            </tr>
          </thead>
          <tbody>
            {formas.map((f) => (
              <tr key={f.slug} className="align-top">
                <td className="pr-3 py-1 font-semibold text-gray-700 whitespace-nowrap">{f.emoji ? `${f.emoji} ` : ""}{f.nombre}</td>
                {niveles.map((n) => {
                  const v = get(f.slug, n);
                  return (
                    <td key={n} className="px-2 py-1">
                      <CeldaVariante valor={v?.imagenUrl || ""} onChange={(url) => setVar(f.slug, n, url)} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Celda compacta: miniatura + subir/quitar. */
function CeldaVariante({ valor, onChange }) {
  const [subiendo, setSubiendo] = useState(false);

  const handle = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);
    try {
      const { subirImagen } = await import("@/src/lib/imageUpload");
      const token = localStorage.getItem("token");
      const { fileUrl } = await subirImagen(file, API_BASE, token);
      onChange(fileUrl);
    } catch (err) {
      alert("Error subiendo imagen: " + err.message);
    } finally {
      setSubiendo(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-1" style={{ width: 74 }}>
      <label className="cursor-pointer block" title={valor ? "Reemplazar PNG" : "Subir PNG"}>
        <div className="border border-dashed rounded flex items-center justify-center overflow-hidden"
          style={{ width: 64, height: 64, background: "repeating-conic-gradient(#eee 0% 25%, #fff 0% 50%) 0 0/12px 12px" }}>
          {subiendo ? <span className="text-[10px] text-gray-400">…</span>
            : valor ? <img src={valor} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            : <span className="text-lg text-gray-300">+</span>}
        </div>
        <input type="file" accept="image/png,image/webp" className="hidden" onChange={handle} disabled={subiendo} />
      </label>
      {valor && (
        <button type="button" onClick={() => onChange("")} className="text-[10px] text-red-400">Quitar</button>
      )}
    </div>
  );
}

export default function VintageColoresPage() {
  const [formas, setFormas] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/vintage-catalogos/formas`)
      .then((r) => r.json())
      .then((j) => setFormas(j.data || []))
      .catch(() => {});
  }, []);

  const conVariantes = (d) => (d.variantes || []).length;

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
        { key: "variantes", label: "PNGs forma×pisos", render: (d) => conVariantes(d) ? `${conVariantes(d)} variante${conVariantes(d) === 1 ? "" : "s"}` : "Solo general" },
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
          <ImgUploadField value={form.imagenUrl} onChange={(url) => setForm({ ...form, imagenUrl: url })} label="PNG general (respaldo si falta la variante)" />
          <VariantesGrid form={form} setForm={setForm} formas={formas} />
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
