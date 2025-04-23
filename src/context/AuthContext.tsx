import React, { createContext, useState, ReactNode } from "react";

export interface AuthContextType {
  user: string | null;
  isAuth: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const api = import.meta.env.VITE_BACKEND_API;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>(localStorage.getItem("user"));


  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${api}/authasesor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.auth) {
        setIsAuth(data.auth);
        setUser(username);
        localStorage.setItem("user", username);
        return true;
      } else {
        console.log("Login failed");
        return false;
      }
    } catch (error) {
      console.log("Error: ", error);
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${api}/authasesor/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (!response) {
        throw new Error("No hay respuesta del servidor");
      }
      const data = await response.json();
      setIsAuth(data.auth);
      setUser(null);
      localStorage.removeItem("user");
      return true;
    } catch (error) {
      console.log("Error: ", error);
      return false;
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${api}/authasesor/check-auth`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (!response) {
        throw new Error("No hay respuesta del servidor");
      }
      const data = await response.json();
      setIsAuth(data.auth);

      return data.auth;
    } catch (error) {
      console.log("Error: ", error);
      return false;

    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuth, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
