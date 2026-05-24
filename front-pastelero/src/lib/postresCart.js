/**
 * Carrito de postres — almacenado en localStorage (separado del de galletas).
 *
 * Estructura:
 *   localStorage["postresCart"] = { items: [{ postreId, slug, nombre, precio, imagenUrl, cantidad }] }
 *
 * Todas las funciones son no-op en SSR (typeof window === "undefined").
 */

const KEY = "postresCart";

function read() {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || !Array.isArray(parsed.items)) return { items: [] };
    return parsed;
  } catch {
    return { items: [] };
  }
}

function write(cart) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {}
}

export function getCart() {
  return read();
}

export function addItem(postre, cantidad = 1) {
  const cart = read();
  const existing = cart.items.find((it) => it.postreId === postre._id);
  if (existing) {
    existing.cantidad += cantidad;
  } else {
    cart.items.push({
      postreId:  postre._id,
      slug:      postre.slug,
      nombre:    postre.nombre,
      precio:    Number(postre.precio) || 0,
      imagenUrl: postre.imagenUrl || "",
      cantidad,
    });
  }
  write(cart);
  return cart;
}

export function updateQty(postreId, cantidad) {
  const cart = read();
  const it = cart.items.find((i) => i.postreId === postreId);
  if (it) it.cantidad = Math.max(1, Number(cantidad) || 1);
  write(cart);
  return cart;
}

export function removeItem(postreId) {
  const cart = read();
  cart.items = cart.items.filter((i) => i.postreId !== postreId);
  write(cart);
  return cart;
}

export function clearCart() {
  write({ items: [] });
}

export function getCartCount() {
  return read().items.reduce((s, i) => s + (Number(i.cantidad) || 0), 0);
}

export function getCartTotal() {
  return read().items.reduce((s, i) => s + (Number(i.precio) || 0) * (Number(i.cantidad) || 0), 0);
}
