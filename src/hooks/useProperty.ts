import { useState, useEffect } from "react";
import { Seller } from "./useSeller";

const api = import.meta.env.VITE_BACKEND_API;


export interface Property {
  _id?: string;
  address: string;
  seller: Seller;
  timesOffered?: number;
  createdAt?: Date;
}

const useProperty = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api}/property`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("No se pudieron obtener las propiedades");
        }
        const data = await response.json();
        setProperties(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Error desconocido al obtener las propiedades");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const createProperty = async (address: string, sellerId: string ) => {
    setLoading(true);
    try {
      const response = await fetch(`${api}/property/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({address, sellerId}),
      });
      
      if (!response.ok) {
        throw new Error("Error al crear la propiedad");
      }

      const createdProperty = await response.json();

      setProperties((prevProperties) => [...prevProperties, createdProperty]);
      return createdProperty;
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error desconocido al crear la propiedad");
      }
    } finally {
      setLoading(false);
    }
  };

  return { properties, loading, error, createProperty };
};

export default useProperty;
