import React, { createContext, useState, useContext } from "react";
import {
  authenticate as authServiceAuthenticate,
  clearToken,
  getToken,
  isAuthenticated as authServiceIsAuthenticated,
} from "../Services/AuthService";

// Crear contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  // Inicializar estado de autenticación
  const [auth, setAuth] = useState(() => {
    const token = getToken();
    if (token) {
      const [username, password] = atob(token).split(":");
      return { username, password, token };
    }
    return { username: null, password: null, token: null };
  });

  // Función de login
  const login = async (username, password) => {
    try {
      await authServiceAuthenticate(username, password);
      setAuth({ username, password, token: getToken() });
    } catch (error) {
      console.error("Failed to login:", error);
      throw error; // Lanzar error para manejarlo en el componente llamador
    }
  };

  // Función de logout
  const logout = () => {
    clearToken();
    setAuth({ username: null, password: null, token: null });
  };

  // Proveer contexto de autenticación
  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};
