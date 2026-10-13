const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Pide las tarifas con reintentos. Separada del hook a propósito: no
 * depende de React, así que se puede probar simulando respuestas.
 *
 * Devuelve { ok: true, laborCosts, fixedCosts } o { ok: false, error }.
 * NUNCA devuelve ceros de relleno: si no se pudo leer, se dice.
 */
export async function obtenerTarifas({ fetchImpl, esperas = [0, 1200, 3000], base = API_BASE } = {}) {
  const f = fetchImpl || (typeof fetch !== "undefined" ? fetch : null);
  if (!f) return { ok: false, error: "fetch no disponible" };

  let ultimoError = "No se pudo conectar";
  for (const espera of esperas) {
    if (espera) await new Promise((r) => setTimeout(r, espera));
    try {
      const res = await f(`${base}/costs`);
      if (!res.ok) { ultimoError = `El servidor respondió ${res.status}`; continue; }
      const data = await res.json();
      const laborCosts = Number(data?.laborCosts);
      const fixedCosts = Number(data?.fixedCosts);
      if (!Number.isFinite(laborCosts) || !Number.isFinite(fixedCosts)) {
        ultimoError = "La respuesta no traía las tarifas";
        continue;
      }
      return { ok: true, laborCosts, fixedCosts };
    } catch (e) {
      ultimoError = e.message || "No se pudo conectar";
    }
  }
  return { ok: false, error: ultimoError };
}
