"use client";
import { createContext, useState, useContext, ReactNode } from "react";

/* 1. Interface */
interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

/* 2. Context */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* 3. Provider */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  const login = (token: string) => {
    console.log("Logged in with:", token);
    setToken(token);
  };

  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* 4. Hook */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
