import { createContext, useState, useContext, useEffect } from "react";
import jwt from "jsonwebtoken";

const AuthContext = createContext(); 

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userToken, setUserToken] = useState(null);

  const updateAuthState = (token) => {
    if (token) {
      try {
        const decodedToken = jwt.decode(token);
        setIsLoggedIn(true);
        setIsAdmin(decodedToken.role === "admin");
        setUserId(decodedToken._id);
        setUserEmail(decodedToken.email);
        setUserToken(token);
      } catch (error) {
        console.error("Token decode failed:", error);
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUserId(null);
      setUserEmail(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token)
    updateAuthState(token);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    updateAuthState(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    updateAuthState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isAdmin,
        userId,
        userEmail,
        login,
        logout,
        setIsLoggedIn,
        setIsAdmin, 
        userToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
}

export { AuthContext };
