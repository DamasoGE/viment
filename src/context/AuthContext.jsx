import { createContext, useState } from "react";

const AuthContext = createContext();
const api = import.meta.env.VITE_BACKEND_API;

export function AuthProvider({children}){
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState(localStorage.getItem("user"));

    const login = async (username, password) =>{
      try {
        const response = await fetch(`${api}/authseller/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if(data.auth){
          setIsAuth(data.auth);
          setUser(username);
          localStorage.setItem("user", username)
          return true;
        }else{
          console.log("Login failed");
          return false;
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    }

    const logout = async () =>{
      try {
          const response = await fetch(`${api}/authseller/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          })
          if(!response){
            throw new Error("No hay respuesta del servidor")
          }
          const data = await response.json();
          setIsAuth(data.auth);
          localStorage.removeItem("user")
          return true;
        } catch (error) {
          console.log("Error: ", error);
          return false;
    }
  }

    const checkAuth = async () =>{
        try {
            const response = await fetch(`${api}/authseller/check-auth`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            })
            if(!response){
              throw new Error("No hay respuesta del servidor")
            }
            const data = await response.json();
            setIsAuth(data.auth);
          } catch (error) {
            console.log("Error: ", error);
          }
    }



    return(
        <AuthContext.Provider value = {{ user, isAuth, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;