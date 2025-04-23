import { useState, useEffect } from "react";

const api = import.meta.env.VITE_BACKEND_API;

export interface Seller {
  _id?: string;
  username: string;
  dni: string;
  createdAt?: Date;
}

const useSeller = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchSellers();
  }, []);

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

  return { sellers, loading, error, createSeller };
};

export default useSeller;
