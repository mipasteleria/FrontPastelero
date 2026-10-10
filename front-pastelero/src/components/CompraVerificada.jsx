/**
 * Sello de "Compra verificada".
 *
 * Es una afirmación de hecho, así que solo debe usarse con reseñas reales
 * de la base: el sistema únicamente las acepta de quien compró (productos
 * de catálogo) o desde el enlace de un pedido ya entregado (cotizaciones y
 * vintage). Nunca ponerlo sobre textos de ejemplo o de relleno.
 */
export default function CompraVerificada({ size = "sm" }) {
  const chico = size === "sm";
  return (
    <span
      title="Esta reseña proviene de un pedido confirmado"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        color: "#1D5A45",
        background: "#DCF5E9",
        border: "1px solid #B8E6D3",
        borderRadius: 999,
        padding: chico ? "2px 8px" : "3px 11px",
        fontSize: chico ? "0.68rem" : "0.74rem",
        fontWeight: 800,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
        lineHeight: 1.4,
      }}
    >
      <svg width={chico ? 11 : 13} height={chico ? 11 : 13} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.3-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7Z" />
      </svg>
      Compra verificada
    </span>
  );
}
