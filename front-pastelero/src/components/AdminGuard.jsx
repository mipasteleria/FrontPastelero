import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/src/context";

/** Única ruta del dashboard que el personal de mostrador puede abrir. */
export const RUTA_MOSTRADOR = "/dashboard/punto-de-venta";

/**
 * AdminGuard
 *
 * Envuelve las páginas de /dashboard. Mientras el contexto valida el
 * token (loading=true) muestra un placeholder; después:
 *   - sin sesión válida → /login
 *   - admin → cualquier página del dashboard
 *   - empleado → SOLO el punto de venta; cualquier otra lo manda ahí
 *   - cualquier otro rol → /
 *
 * El empleado existe para cobrar en mostrador sin ver costos, recetas ni
 * cotizaciones, así que el guard lo encierra en su única pantalla.
 *
 * Esto es UX: la autorización real la impone el backend en cada endpoint.
 * Sin el guard, un no-admin vería un instante el dashboard antes de que
 * las llamadas fallaran con 403.
 */
export default function AdminGuard({ children }) {
  const { isLoggedIn, isAdmin, userRole, loading } = useAuth();
  const router = useRouter();

  const esEmpleado = userRole === "empleado";
  const enMostrador = router.pathname === RUTA_MOSTRADOR;
  const permitido = isAdmin || (esEmpleado && enMostrador);

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn) { router.replace("/login"); return; }
    if (isAdmin) return;
    if (esEmpleado) {
      if (!enMostrador) router.replace(RUTA_MOSTRADOR);
      return;
    }
    router.replace("/");
  }, [loading, isLoggedIn, isAdmin, esEmpleado, enMostrador, router]);

  if (loading || !isLoggedIn || !permitido) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text">Verificando sesión…</p>
      </div>
    );
  }

  return children;
}
