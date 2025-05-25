import { useState } from "react";
import { Seller } from "./useSeller";
import { Visit } from "./useVisit";

const api = import.meta.env.VITE_BACKEND_API;

export interface Property {
  _id?: string;
  address: string;
  ads: string[];
  seller: Seller;
  timesOffered?: number;
  timesListed?: number;
  timesVisited?: number;
  timesInterested?: number;
  timesDetailView?: number;
  createdAt?: Date;
  visits: Visit[];
}

const useProperty = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    setLoading(true);
    try {
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

  const fetchPropertyById = async (propertyId: string): Promise<Property | null> => {
    setLoading(true);
    try {
      const response = await fetch(`${api}/property/${propertyId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error al obtener la propiedad");
      }
      const data = await response.json();
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error desconocido al obtener la propiedad");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

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
      setProperties((prev) => [...prev, createdProperty]);
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

  const updateProperty = async (
    propertyId: string,
    field: string,
    value: string | string[] | number
  ) => {
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

      setProperties((prev) =>
        prev.map((p) => (p._id === propertyId ? updatedProperty : p))
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error desconocido al actualizar la propiedad");
      }
    }
  };

  const deleteProperty = async (propertyId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${api}/property/${propertyId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la propiedad");
      }

      setProperties((prev) =>
        prev.filter((property) => property._id !== propertyId)
      );
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error desconocido al eliminar la propiedad");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    properties,
    loading,
    error,
    fetchProperties,
    fetchPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
  };
};

export default useProperty;
