import { useState } from "react";

const api = import.meta.env.VITE_BACKEND_API;

export interface Asesor {
  _id?: string;
  username: string;
  password?: string;
  admin: boolean;
}

const useAsesor = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [asesors, setAsesors] = useState<Asesor[]>([]);
  const [user, setUser] = useState<Asesor | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(`${api}/asesor/me`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("No autorizado");
      const data = await res.json();
      setUser(data);
      console.log(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAsesores = async (): Promise<void> => {
    setLoading(true)
    try {
      const res = await fetch(`${api}/asesor`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("No autorizado");

      const data = await res.json();

      setAsesors(data);

    } catch (err) {
      console.error("Error al obtener asesores:", err);
      setError("Error al obtener los asesores");
    }finally{
      setLoading(false)
    }
  };

  const fetchAsesorById = async (id: string): Promise<Asesor | null> => {
    setLoading(true)
    try {
      const res = await fetch(`${api}/asesor/${id}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("No se pudo obtener el asesor");

      const data = await res.json();

      return data as Asesor;
    } catch (err) {
      console.error("Error al obtener asesor por ID:", err);
      return null;
    }finally{
      setLoading(false)
    }
  };

  const createAsesor = async (username: string): Promise<boolean> => {
    try {
      const res = await fetch(`${api}/asesor/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password: username,
        }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al crear asesor");

      const data = await res.json();
      console.log("Asesor creado:", data);

      await fetchAllAsesores();
      return true;
    } catch (err) {
      console.error("Error al crear asesor:", err);
      setError("Error al crear el asesor");
      return false;
    }
  };

  const updateAsesor = async (
    id: string,
    updatedData: Partial<Asesor>
  ): Promise<boolean> => {
    try {
      const res = await fetch(`${api}/asesor/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al actualizar el asesor");

      const data = await res.json();
      console.log("Asesor actualizado:", data);
      return true;
    } catch (err) {
      console.error("Error al actualizar asesor:", err);
      setError("Error al actualizar el asesor");
      return false;
    }
  };

  const deleteAsesor = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${api}/asesor/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al eliminar el asesor");

      await fetchAllAsesores();
      return true;
    } catch (err) {
      console.error("Error al eliminar asesor:", err);
      setError("Error al eliminar el asesor");
      return false;
    }
  };

  const changePassword = async (id: string, newPassword: string): Promise<boolean> => {
  try {
    const res = await fetch(`${api}/asesor/${id}/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: newPassword }),
      credentials: "include",
    });

    if (!res.ok) throw new Error("Error al cambiar la contraseña");

    const data = await res.json();
    console.log("Contraseña actualizada:", data);
    return true;
  } catch (err) {
    console.error("Error al cambiar la contraseña:", err);
    setError("Error al cambiar la contraseña");
    return false;
  }
};


  return {
    user,
    loading,
    asesors,
    error,
    fetchProfile,
    fetchAllAsesores,
    fetchAsesorById,
    createAsesor,
    updateAsesor,
    deleteAsesor,
    changePassword
  };
};

export default useAsesor;
