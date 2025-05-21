import { useEffect, useState } from "react";

const api = import.meta.env.VITE_BACKEND_API;

export interface Asesor {
  _id?: string;
  username: string;
  password?: string;
  admin: boolean;
}

const useAsesor = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [asesors, setAsesors] = useState<Asesor[]>([]);
  const [user, setUser]=useState<Asesor | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${api}/asesor/me`, {
          credentials: "include"
        });

        if (!res.ok) {
          throw new Error("No autorizado");
        }

        const data = await res.json();

        setUser(data);
        setIsAdmin(data.admin);
      } catch (err) {
        console.log(err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem("user")) {
      fetchProfile();
    }
  }, []);

  const fetchAllAsesores = async () => {
    try {
      const res = await fetch(`${api}/asesor`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("No autorizado");
      }

      const data = await res.json();
      setAsesors(data);
    } catch (err) {
      console.error("Error al obtener asesores:", err);
      setError("Error al obtener los asesores");
    }
  };

  const fetchAsesorById = async (id: string): Promise<Asesor | null> => {
    try {
      const res = await fetch(`${api}/asesor/${id}`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("No se pudo obtener el asesor");
      }

      const data = await res.json();
      return data as Asesor;
    } catch (err) {
      console.error("Error al obtener asesor por ID:", err);
      return null;
    }
  };

  const createAsesor = async (username: string) => {
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

      if (!res.ok) {
        throw new Error("Error al crear asesor");
      }

      const data = await res.json();
      console.log("Asesor creado:", data);

      fetchAllAsesores();
    } catch (err) {
      console.error("Error al crear asesor:", err);
      setError("Error al crear el asesor");
    }
  };

  const updateAsesor = async (id: string, updatedData: Partial<Asesor>) => {
    try {
      const res = await fetch(`${api}/asesor/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Error al actualizar el asesor");
      }

      const data = await res.json();
      console.log("Asesor actualizado:", data);
    } catch (err) {
      console.error("Error al actualizar asesor:", err);
      setError("Error al actualizar el asesor");
    }
  };

  const deleteAsesor = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(`${api}/asesor/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Error al eliminar el asesor");
    }

    // Actualiza la lista después de eliminar
    await fetchAllAsesores();

    return true;
  } catch (err) {
    console.error("Error al eliminar asesor:", err);
    setError("Error al eliminar el asesor");
    return false;
  }
};

  return {
    user,
    isAdmin,
    loading,
    asesors,
    error,
    fetchAllAsesores,
    fetchAsesorById,
    createAsesor,
    updateAsesor,
    deleteAsesor
  };
};

export default useAsesor;
