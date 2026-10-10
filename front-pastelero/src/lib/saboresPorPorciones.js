/**
 * Cuántos sabores de bizcocho puede combinar un pastel según su tamaño.
 * Espejo de src/utils/saboresPorPorciones.js del backend, que revalida la
 * regla al crear la cotización.
 *
 *   menos de 20 porciones → 1 sabor
 *   de 20 a 49            → hasta 2
 *   50 o más              → 3 o más (sin tope)
 */

export const MIN_DOS_SABORES = 20;
export const MIN_TRES_SABORES = 50;

/** Máximo permitido. Infinity significa "sin tope". */
export function maxSabores(porciones) {
  const p = Number(porciones) || 0;
  if (p >= MIN_TRES_SABORES) return Infinity;
  if (p >= MIN_DOS_SABORES) return 2;
  return 1;
}

/** Texto de ayuda bajo el selector. */
export function ayudaSabores(porciones) {
  const max = maxSabores(porciones);
  if (max === Infinity) return "Con este tamaño puedes combinar 3 o más sabores.";
  if (max === 2) return `Con ${MIN_DOS_SABORES} porciones o más puedes combinar hasta 2 sabores. Desde ${MIN_TRES_SABORES}, tres o más.`;
  return `A partir de ${MIN_DOS_SABORES} porciones podrás combinar 2 sabores, y desde ${MIN_TRES_SABORES} tres o más.`;
}
