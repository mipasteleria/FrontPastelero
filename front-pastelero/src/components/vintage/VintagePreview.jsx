/**
 * Visualizador del pastel vintage: compone las capas PNG de la selección
 * (forma → color → decoraciones). La silueta del color y de cada
 * decoración depende de la forma y del número de pisos, así que se busca
 * la variante exacta y, si no existe, se usa el PNG general.
 *
 * Lo usan el builder del cliente y el detalle del pedido en el dashboard,
 * para que ambos muestren exactamente la misma imagen.
 */

/** Devuelve las URLs de las capas, de abajo hacia arriba. */
export function capasVintage(seleccion, cat) {
  const sel = seleccion || {};
  const niveles = (cat.pisos || []).find((p) => p.slug === sel.pisosSlug)?.niveles || 1;

  const conVariante = (obj) =>
    (obj?.variantes || []).find((v) => v.formaSlug === sel.formaSlug && v.niveles === niveles)?.imagenUrl ||
    obj?.imagenUrl;

  const color = (cat.colores || []).find((c) => c.slug === sel.colorSlug);

  const capasDeco = (sel.decoraciones || []).map((d) => {
    const deco = (cat.decoraciones || []).find((x) => x.slug === d.slug);
    const varianteColor = (deco?.colores || []).find((c) => c.nombre === d.colorNombre);
    return conVariante(varianteColor) || d.imagenUrl;
  });

  return [
    (cat.formas || []).find((f) => f.slug === sel.formaSlug)?.imagenUrl,
    conVariante(color),
    ...capasDeco,
  ].filter(Boolean);
}

export default function VintagePreview({ seleccion, cat, alto = "auto", vacio = "Sin imagen" }) {
  const capas = capasVintage(seleccion, cat || {});
  const color = (cat?.colores || []).find((c) => c.slug === seleccion?.colorSlug);

  return (
    <div
      style={{
        borderRadius: "var(--r-2xl, 20px)",
        overflow: "hidden",
        background: color?.hex ? `${color.hex}33` : "var(--rosa-4, #FFF3F5)",
        aspectRatio: "1/1",
        height: alto,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {capas.length === 0 ? (
        <span style={{ color: "var(--text-soft, #8B6B7A)", fontSize: ".85rem", textAlign: "center", padding: 16 }}>
          {vacio}
        </span>
      ) : (
        capas.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "8%",
            }}
          />
        ))
      )}
    </div>
  );
}
