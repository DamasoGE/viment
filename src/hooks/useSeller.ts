import { useState } from "react";
import { Property } from "./useProperty";

const api = import.meta.env.VITE_BACKEND_API;

export interface Seller {
  _id?: string;
  username: string;
  dni: string;
  requireAsesor?: boolean;
  createdAt?: Date;
  properties?: Property[];
}

const useSeller = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api}/seller`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("No se pudieron obtener los vendedores");
      }
      const data = await response.json();
      setSellers(data);
      setError(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error desconocido al obtener los vendedores");
      }
    } finally {
      setLoading(false);
    }
  };

   const fetchSellerById = async (sellerId: string): Promise<Seller | null> => {
    try {
      setLoading(true);
      const response = await fetch(`${api}/seller/${sellerId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener el vendedor");
      }

      const data = await response.json();
      setError(null);
      return data as Seller;
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error desconocido al obtener el vendedor");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createSeller = async (newSeller: Seller) => {
    setLoading(true);
    try {
      const response = await fetch(`${api}/seller/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newSeller),
      });

      if (!response.ok) {
        throw new Error("Error al crear el seller");
      }

      const createdSeller = await response.json();
      setSellers((prevSellers) => [...prevSellers, createdSeller]);
      setError(null);
      return createdSeller;
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error desconocido al crear el seller");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteSeller = async (sellerId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${api}/seller/${sellerId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el vendedor");
      }

      setSellers((prevSellers) =>
        prevSellers.filter((seller) => seller._id !== sellerId)
      );
      setError(null);
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error desconocido al eliminar el vendedor");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleRequireAsesor = async (sellerId: string) => {
    try {
      const response = await fetch(`${api}/seller/toggleasesor`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ sellerId }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar requireAsesor");
      }

      setSellers((prevSellers) =>
        prevSellers.map((seller) =>
          seller._id === sellerId
            ? { ...seller, requireAsesor: !seller.requireAsesor }
            : seller
        )
      );
      setError(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error desconocido al actualizar requireAsesor");
      }
    }
  };


  return {
    sellers,
    loading,
    error,
    fetchSellers,
    fetchSellerById,
    createSeller,
    deleteSeller,
    toggleRequireAsesor,
  };
};

export default useSeller;
