/**
 * Disponibilidad de entrega para cotizaciones.
 *
 * - No se atiende los domingos.
 * - Horario disponible: 09:00 a 18:00 en intervalos de 30 min.
 *
 * Estas reglas aplican tanto al formulario del cliente como a la captura
 * manual del admin y al editor del dashboard.
 */

export const HORAS_DISPONIBLES = (() => {
  const out = [];
  for (let h = 9; h <= 18; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 18) out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out; // 09:00 … 18:00
})();

// `yyyymmdd` es el valor de un <input type="date"> ("2026-06-28").
export function esDiaNoDisponible(yyyymmdd) {
  if (!yyyymmdd) return false;
  const d = new Date(`${yyyymmdd}T00:00:00`); // medianoche local
  return d.getDay() === 0; // 0 = domingo
}

export const MENSAJE_DIA = "Los domingos no hay servicio. Elige otro día (Lun–Sáb).";
export const MENSAJE_BLOQUEADA = "Esa fecha no está disponible. Elige otro día, por favor.";

// Fechas bloqueadas por el admin (dashboard → calendario). Devuelve un Set
// de "YYYY-MM-DD". Falla silenciosamente a un Set vacío.
export async function fetchFechasBloqueadas(apiBase) {
  try {
    const r = await fetch(`${apiBase}/fechas-bloqueadas`);
    const j = await r.json();
    return new Set((j.data || []).map((b) => b.fecha));
  } catch {
    return new Set();
  }
}
