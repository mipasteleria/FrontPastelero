import { useCallback, useEffect, useState } from "react";

import { obtenerTarifas } from "./tarifas";

/**
 * Tarifas horarias globales (mano de obra y gastos fijos) desde /costs.
 *
 * Por qué existe este hook en lugar de un fetch suelto por pantalla:
 *
 * El back corre en Vercel y, en arranque frío, el middleware de conexión a
 * Mongo hace fail-fast a los 8 s y devuelve 503. Las pantallas hacían
 * `catch { console.error }` arrancando el state en 0, así que un 503
 * transitorio se veía como "la tarifa es $0" — y como el costeo de la
 * receta se calcula con esas tarifas y se guarda en `total_cost`, guardar
 * durante esa ventana escribía una receta sin mano de obra ni gastos
 * fijos (el ~70% de su costo) sin avisar nada.
 *
 * Aquí se distinguen tres estados — "cargando", "error" y "listo" — para
 * que la pantalla pueda bloquear el guardado mientras no haya tarifas
 * confiables, en vez de dejar que un 0 provisional se vuelva permanente.
 * Además se reintenta: el arranque frío se resuelve solo al segundo
 * intento, que es justo lo que se sentía como "refresco una o dos veces y
 * vuelven".
 */

export default function useTarifas() {
  const [tarifaLaborHora, setTarifaLaborHora] = useState(null);
  const [tarifaFijaHora, setTarifaFijaHora] = useState(null);
  const [estado, setEstado] = useState("cargando"); // cargando | listo | error
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    setEstado("cargando");
    setError("");
    const r = await obtenerTarifas();
    if (r.ok) {
      setTarifaLaborHora(r.laborCosts);
      setTarifaFijaHora(r.fixedCosts);
      setEstado("listo");
      return;
    }
    // Se dejan en null a propósito: null significa "no sé", 0 significaría
    // "la tarifa es cero", y confundir ambos es justo el bug original.
    setTarifaLaborHora(null);
    setTarifaFijaHora(null);
    setEstado("error");
    setError(r.error);
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  return {
    tarifaLaborHora,
    tarifaFijaHora,
    estado,
    error,
    recargar: cargar,
    // Atajo para las pantallas: si esto es false, NO se debe permitir
    // guardar nada que dependa de las tarifas.
    tarifasListas: estado === "listo",
  };
}
