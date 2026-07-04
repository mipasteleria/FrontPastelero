/**
 * Carrito unificado — lee/escribe los carritos existentes en localStorage:
 *   galletasCart  { boxes: [{ tamano, items: [{ saborSlug, saborNombre, precio, cantidad }] }] }
 *   postresCart   { items: [{ postreId, nombre, precio, cantidad }] }
 *   vintageCart   { config, resumen: { total, items } }  (un solo pastel a la vez)
 *
 * Todas las funciones son no-op en SSR.
 */

const safe = (fn, fallback) => {
  if (typeof window === "undefined") return fallback;
  try { return fn(); } catch { return fallback; }
};

export function getGalletas() {
  return safe(() => JSON.parse(localStorage.getItem("galletasCart"))?.boxes || [], []);
}
export function setGalletas(boxes) {
  safe(() => localStorage.setItem("galletasCart", JSON.stringify({ boxes })), null);
}
export function getPostres() {
  return safe(() => JSON.parse(localStorage.getItem("postresCart"))?.items || [], []);
}
export function setPostres(items) {
  safe(() => localStorage.setItem("postresCart", JSON.stringify({ items })), null);
}
export function getVintage() {
  return safe(() => JSON.parse(localStorage.getItem("vintageCart")) || null, null);
}
export function setVintage(entry) {
  safe(() => entry ? localStorage.setItem("vintageCart", JSON.stringify(entry)) : localStorage.removeItem("vintageCart"), null);
}

export function clearAll() {
  safe(() => {
    localStorage.removeItem("galletasCart");
    localStorage.removeItem("postresCart");
    localStorage.removeItem("vintageCart");
  }, null);
}

export function cartCount() {
  const g = getGalletas().length;
  const p = getPostres().reduce((s, it) => s + (it.cantidad || 0), 0);
  const v = getVintage() ? 1 : 0;
  return g + p + v;
}
