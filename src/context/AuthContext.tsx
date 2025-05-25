import React, { createContext, useState, ReactNode } from "react";

export interface User {
  _id: string;
  username: string;
}

export interface AuthContextType {
  user: User | null;
  isAuth: boolean;
  isAdmin: boolean;
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
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const stored = localStorage.getItem("admin");
    return stored === "true";
  });

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

        const userData: User = { _id: data._id, username: data.username };
        setUser(userData);

        const adminStatus = data.admin === true || data.admin === "true";
        setIsAdmin(adminStatus);

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("admin", adminStatus.toString());

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
      });
      if (!response) {
        throw new Error("No hay respuesta del servidor");
      }
      const data = await response.json();
      setIsAuth(data.auth);
      setIsAdmin(false);
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("admin");
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
      if (!response) throw new Error("No hay respuesta del servidor");

      const data = await response.json();
      setIsAuth(data.auth);

      if (data.user) {
        const userData: User = { _id: data.user._id, username: data.user.username };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }

      if (data.admin !== undefined) {
        const adminStatus = data.admin === true || data.admin === "true";
        setIsAdmin(adminStatus);
        localStorage.setItem("admin", adminStatus.toString());
      }

      return data.auth;
    } catch (error) {
      console.log("Error: ", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuth, isAdmin, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
