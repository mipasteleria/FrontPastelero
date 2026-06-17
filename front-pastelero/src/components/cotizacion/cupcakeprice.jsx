import CakePersonalizado from "./cakePersonalizado";

/**
 * Cotización de cupcakes — reusa el flujo "game-like" del pastel
 * (mismos catálogos de sabor / relleno / cobertura / decoraciones) pero
 * sin la sección de niveles. Ver CakePersonalizado.
 */
export default function Cupcakeprice() {
  return <CakePersonalizado tipoProducto="cupcake" />;
}
