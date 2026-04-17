import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/src/context";

/**
 * AdminGuard
 *
 * Envuelve cualquier página que requiera rol admin. Mientras el contexto
 * valida el token contra `/users/me` (loading=true), muestra un placeholder;
 * después:
 *   - sin sesión válida → /login
 *   - sesión válida pero no admin → /
 *   - admin → renderiza children
 *
 * El guard es puramente UX; la autorización real la impone el backend en
 * cada endpoint protegido. Sin esto, un no-admin vería brevemente el UI
 * del dashboard antes de que las llamadas fallen con 403.
 */
export default function AdminGuard({ children }) {
  const { isLoggedIn, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }
    if (!isAdmin) {
      router.replace("/");
    }
  }, [loading, isLoggedIn, isAdmin, router]);

  if (loading || !isLoggedIn || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text">Verificando sesión…</p>
      </div>
    );
  }

  return children;
}
