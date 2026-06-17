import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * Página legacy de cotización manual — reemplazada por el flujo unificado
 * en /cotizacion (modo captura admin). Redirige ahí para que bookmarks y
 * enlaces viejos no muestren la UI antigua.
 */
export default function CotizacionManualRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/cotizacion");
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#540027" }}>
      Redirigiendo a la nueva captura de cotización…
    </div>
  );
}
