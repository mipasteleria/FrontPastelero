import { createContext, useState, useContext, useEffect } from "react";
import jwt from "jsonwebtoken";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwt.decode(token);

        setIsLoggedIn(true);
        setIsAdmin(decodedToken.role === "admin");
        setUserId(decodedToken._id);
        setUserEmail(decodedToken.email);

      } catch (error) {
        console.error("Token decode failed:", error);
      }
    } 
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isAdmin, userId, userEmail, setIsLoggedIn, setIsAdmin, }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export { AuthContext };
