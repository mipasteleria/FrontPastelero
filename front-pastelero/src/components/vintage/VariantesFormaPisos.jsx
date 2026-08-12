import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Cuadrícula de PNGs por combinación forma × pisos (1/2/3), usada por los
 * catálogos vintage de Colores base y Decoraciones. `value` es el arreglo
 * [{formaSlug, niveles, imagenUrl}]; las celdas vacías caen al PNG general
 * del elemento en el visualizador.
 */
export default function VariantesFormaPisos({ value = [], onChange, formas, titulo = "PNG por forma × pisos", compacto = false }) {
  const niveles = [1, 2, 3];

  const get = (formaSlug, n) => value.find((v) => v.formaSlug === formaSlug && v.niveles === n);
  const setVar = (formaSlug, n, imagenUrl) => {
    const resto = value.filter((v) => !(v.formaSlug === formaSlug && v.niveles === n));
    onChange(imagenUrl ? [...resto, { formaSlug, niveles: n, imagenUrl }] : resto);
  };

  if (!formas?.length) return null;

  return (
    <div className={compacto ? "" : "border rounded-lg p-3"}>
      <p className="text-xs font-bold text-gray-600 uppercase mb-1">{titulo}</p>
      {!compacto && (
        <p className="text-[11px] text-gray-500 mb-3">
          La silueta cambia según forma y pisos. Sube el PNG de cada combinación que ofrezcas;
          las celdas vacías usan el PNG general como respaldo.
        </p>
      )}
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
                {niveles.map((n) => (
                  <td key={n} className="px-2 py-1">
                    <CeldaVariante valor={get(f.slug, n)?.imagenUrl || ""} onChange={(url) => setVar(f.slug, n, url)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Celda compacta: miniatura sobre fondo a cuadros + subir/quitar. */
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
