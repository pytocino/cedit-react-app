import React, { createContext, useState, useContext } from "react";
import {
  authenticate as authServiceAuthenticate,
  clearToken,
  getToken,
  isAuthenticated as authServiceIsAuthenticated,
} from "../Services/AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = getToken();
    if (token) {
      const [username] = atob(token).split(":");
      return { username, token };
    }
    return { username: null, token: null };
  });

  const login = async (username, password) => {
    try {
      await authServiceAuthenticate(username, password);
      setAuth({ username, token: getToken() });
    } catch (error) {
      console.error("Failed to login:", error);
      throw error;
    }
  };

  const logout = () => {
    clearToken();
    setAuth({ username: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
