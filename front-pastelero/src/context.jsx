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
