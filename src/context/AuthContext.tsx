import React, { createContext, useState, ReactNode } from "react";

// 1. Definimos los tipos para el contexto
export interface AuthContextType {
  user: string | null;
  isAuth: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
}

// 2. Inicializamos el contexto con un valor por defecto vacío
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const api = import.meta.env.VITE_BACKEND_API;

// 3. El tipo de las props del provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // 4. Tipamos los estados
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>(localStorage.getItem("user"));

  // 5. La función de login
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${api}/authseller/login`, {
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

  // 6. La función de logout
  const logout = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${api}/authseller/logout`, {
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
      localStorage.removeItem("user");
      return true;
    } catch (error) {
      console.log("Error: ", error);
      return false;
    }
  };

  // 7. La función de checkAuth
  const checkAuth = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${api}/authseller/check-auth`, {
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
      return true;
    } catch (error) {
      return false;
      console.log("Error: ", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuth, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
