"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext<{
  token: string | null;
  login: (t: string) => void;
  logout: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  const login = (t: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("token", t);
    }
    setToken(t);
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token");
    }
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}