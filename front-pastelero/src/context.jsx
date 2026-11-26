import { createContext, useState, useContext, useEffect, useCallback } from "react";

const AuthContext = createContext();

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * AuthProvider
 *
 * Nunca confía en el payload del JWT leído en el cliente: cada vez que
 * carga la app o cambia el token, pregunta a `GET /users/me` (endpoint
 * protegido). El backend verifica la firma del token y devuelve el
 * usuario tal como está en la BD — incluyendo el `role` real. Así un
 * atacante que edite su localStorage no puede ganar rol de admin.
 */
export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userPhone, setUserPhone] = useState(null);
  // Mientras loading sea true, los route-guards deben esperar antes de
  // redirigir; así evitamos un "parpadeo" hacia /login en el primer render.
  const [loading, setLoading] = useState(true);

  const clearAuth = useCallback(() => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserRole(null);
    setUserId(null);
    setUserEmail(null);
    setUserName(null);
    setUserPhone(null);
    setUserToken(null);
  }, []);

  const fetchMe = useCallback(async (token) => {
    if (!token) {
      clearAuth();
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        // Token inválido/expirado: limpiamos localStorage y tratamos como logged out.
        localStorage.removeItem("token");
        clearAuth();
        return;
      }
      const { data } = await res.json();
      setIsLoggedIn(true);
      setIsAdmin(data.role === "admin");
      setUserRole(data.role || null);
      setUserId(data._id);
      setUserEmail(data.email);
      setUserName(data.name);
      setUserPhone(data.phone);
      setUserToken(token);
    } catch (err) {
      console.error("Error validando sesión:", err);
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [clearAuth]);

  useEffect(() => {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;
    fetchMe(token);
  }, [fetchMe]);

  // ── Renovación deslizante de sesión ──
  //
  // El back devuelve un token fresco en la cabecera `X-Token-Renovado`
  // cuando al actual ya le pasó la mitad de su vida. Se intercepta
  // `fetch` una sola vez, aquí, en lugar de tocar las decenas de
  // llamadas repartidas por la app: cualquiera de ellas sirve para
  // mantener viva la sesión de quien está trabajando.
  //
  // Antes el token duraba 1 h sin forma de renovarse, así que sacaba al
  // usuario a mitad del trabajo — en el mostrador, a mitad de un cobro.
  useEffect(() => {
    if (typeof window === "undefined" || window.__fetchRenovacion) return;
    const original = window.fetch.bind(window);

    window.fetch = async (...args) => {
      const res = await original(...args);
      try {
        const nuevo = res.headers?.get?.("X-Token-Renovado");
        if (nuevo && nuevo !== localStorage.getItem("token")) {
          localStorage.setItem("token", nuevo);
          setUserToken(nuevo);
        }
      } catch {
        /* una cabecera ilegible nunca debe romper la petición */
      }
      return res;
    };

    window.__fetchRenovacion = true;
  }, []);

  const login = async (token) => {
    localStorage.setItem("token", token);
    setLoading(true);
    await fetchMe(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isAdmin,
        userRole,
        userId,
        userEmail,
        userName,
        userPhone,
        userToken,
        loading,
        login,
        logout,
        setIsLoggedIn,
        setIsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
}

export { AuthContext };
