import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * Listado legacy de cotizaciones (pastelCotiza/cupcakesCotiza/snackCotiza),
 * reemplazado por el listado unificado de Cotizaciones personalizadas.
 * Redirige ahí para que todo quede en un solo lugar.
 */
export default function CotizacionesLegacyRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/cotizaciones-personalizadas");
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#540027" }}>
      Redirigiendo a Cotizaciones…
    </div>
  );
}
