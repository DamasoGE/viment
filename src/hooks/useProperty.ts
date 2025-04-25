import { useState, useEffect } from "react";
import { Seller } from "./useSeller";

const api = import.meta.env.VITE_BACKEND_API;

export interface Property {
  _id?: string;
  address: string;
  ads: string[];
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

  const createProperty = async (address: string, sellerId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${api}/property/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ address, sellerId }),
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

  // Función para actualizar una propiedad
  const updateProperty = async (propertyId: string, field: string, value: string | string[] | number) => {
    try {
      const response = await fetch(`${api}/property/${propertyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la propiedad");
      }

      const updatedProperty = await response.json();

      console.log(updatedProperty);

      setProperties((prevProperties) =>
        prevProperties.map((p) => (p._id === propertyId ? updatedProperty : p))
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error desconocido al actualizar la propiedad");
      }
    }
  };

  return { properties, loading, error, createProperty, updateProperty };
};

export default useProperty;
