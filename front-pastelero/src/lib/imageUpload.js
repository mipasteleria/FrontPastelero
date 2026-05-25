/**
 * Helpers para subir imágenes desde el navegador.
 *
 * Causa raíz histórica: Vercel tiene un límite de ~4.5 MB en el body
 * de funciones serverless. PNGs originales del celular o cámara DSLR
 * superan ese límite, llegan truncados al back y se ven cortados al
 * servirse (típicamente con un corte recto horizontal).
 *
 * Para evitarlo, SIEMPRE redimensionamos en cliente antes de subir.
 * 1200 px de lado mayor es suficiente para imagen de producto en
 * pantalla y deja archivos típicos de 200-500 KB.
 */

const MAX_LADO_PX = 1200;

/**
 * Redimensiona un File de imagen al lado mayor MAX_LADO_PX manteniendo
 * proporción y transparencia. Devuelve un File PNG nuevo. Si la imagen
 * original ya es más chica, igual la re-encodea como PNG limpio (sin
 * EXIF ni metadata pesada).
 *
 * @param {File} file  Imagen original del input file
 * @returns {Promise<File>}  Nuevo File listo para enviar a /upload
 */
export function redimensionarImagen(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const escala = Math.min(1, MAX_LADO_PX / Math.max(w, h));
      const targetW = Math.round(w * escala);
      const targetH = Math.round(h * escala);
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      canvas.getContext("2d").drawImage(img, 0, 0, targetW, targetH);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("No se pudo procesar la imagen"));
          const base = file.name.replace(/\.[^.]+$/, "") || "imagen";
          resolve(new File([blob], `${base}.png`, { type: "image/png" }));
        },
        "image/png"
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen"));
    };
    img.src = url;
  });
}

/**
 * Sube un File al endpoint /upload del back (multer + GCS) y devuelve
 * { fileUrl, fileName }.
 *
 * Hace el resize antes de subir automáticamente.
 *
 * @param {File} file
 * @param {string} apiBase  Base URL de la API (process.env.NEXT_PUBLIC_API_BASE_URL)
 * @param {string} token    JWT del usuario (autenticado)
 * @returns {Promise<{fileUrl: string, fileName: string}>}
 */
export async function subirImagen(file, apiBase, token) {
  if (!file) throw new Error("No se recibió archivo");
  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo debe ser una imagen");
  }
  const resized = await redimensionarImagen(file);
  const fd = new FormData();
  fd.append("files", resized);
  const r = await fetch(`${apiBase}/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  });
  if (!r.ok) throw new Error("Error al subir el archivo");
  const j = await r.json();
  const uploaded = Array.isArray(j) ? j[0] : j;
  if (!uploaded?.fileUrl) throw new Error("Respuesta de upload incompleta");
  return {
    fileUrl: uploaded.fileUrl,
    fileName: uploaded.fileName || "",
  };
}
