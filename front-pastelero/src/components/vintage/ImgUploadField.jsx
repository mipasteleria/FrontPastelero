import { useState } from "react";
import { useAuth } from "@/src/context";
import { subirImagen } from "@/src/lib/imageUpload";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Campo de subida de imagen PNG (sin fondo) para catálogos vintage.
 * Muestra la imagen actual sobre un fondo a cuadros y permite reemplazarla.
 */
export default function ImgUploadField({ value, onChange, label = "Imagen PNG (sin fondo)" }) {
  const { userToken } = useAuth();
  const [subiendo, setSubiendo] = useState(false);

  const handle = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);
    try {
      const { fileUrl } = await subirImagen(file, API_BASE, userToken);
      onChange(fileUrl);
    } catch (err) {
      alert("Error subiendo imagen: " + err.message);
    } finally {
      setSubiendo(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold mb-1 text-gray-600">{label}</label>
      <div className="flex items-center gap-3">
        <div
          className="rounded border"
          style={{
            width: 64, height: 64, flexShrink: 0, overflow: "hidden",
            backgroundImage: "linear-gradient(45deg,#eee 25%,transparent 25%),linear-gradient(-45deg,#eee 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#eee 75%),linear-gradient(-45deg,transparent 75%,#eee 75%)",
            backgroundSize: "12px 12px", backgroundPosition: "0 0,0 6px,6px -6px,-6px 0",
          }}
        >
          {value ? <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : null}
        </div>
        <div className="flex flex-col gap-1">
          <label className="cursor-pointer text-xs px-3 py-2 rounded border border-dashed border-gray-400 text-gray-600 hover:bg-gray-50">
            {subiendo ? "Subiendo…" : value ? "Cambiar imagen" : "Subir imagen"}
            <input type="file" accept="image/png,image/*" className="hidden" onChange={handle} disabled={subiendo} />
          </label>
          {value && <button type="button" onClick={() => onChange("")} className="text-[11px] text-red-500 hover:underline text-left">Quitar</button>}
        </div>
      </div>
    </div>
  );
}
