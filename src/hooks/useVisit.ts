import { useState } from "react";
import { Property } from "./useProperty";

const api = import.meta.env.VITE_BACKEND_API;

export interface Visit {
  _id: string;
  appointment: Date;
  comment?: string;
  status: "pending" | "completed" | "canceled";
  createdAt?: Date;
  updatedAt?: Date;
  property: Property;
}

const useVisit = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVisits = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${api}/visit`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("No se pudieron obtener las visitas");
      }

      const data = await response.json();
      setVisits(data);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Error desconocido al obtener las visitas"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchVisitById = async (visitId: string): Promise<Visit | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${api}/visit/${visitId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener la visita");
      }

      const visit: Visit = await response.json();
      return visit;
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Error desconocido al obtener la visita"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createVisit = async (appointment: Date, propertyId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${api}/visit/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          appointment: appointment.toISOString(),
          propertyId,
        }),
      });

      if (!response.ok) {
        let errMsg: string;
        try {
          const body = await response.json();
          errMsg = body?.message ?? response.statusText;
        } catch {
          errMsg = response.statusText || "Error al crear la visita";
        }
        throw new Error(errMsg);
      }

      const created = await response.json();
      setVisits((v) => [...v, created]);
      return created;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error desconocido al crear la visita";
      console.error("createVisit error:", msg);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const updateVisit = async (visitId: string, field: string, value: string) => {
    try {
      const response = await fetch(`${api}/visit/${visitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la visita");
      }

      const updatedVisit = await response.json();
      setVisits((prev) =>
        prev.map((v) => (v._id === visitId ? updatedVisit : v))
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al actualizar la visita"
      );
      throw err;
    }
  };

  const deleteVisit = async (visitId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${api}/visit/${visitId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la visita");
      }

      setVisits((prevVisits) =>
        prevVisits.filter((visit) => visit._id !== visitId)
      );

      return true;
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Error desconocido al eliminar la visita"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    visits,
    loading,
    error,
    fetchVisits,
    fetchVisitById,
    createVisit,
    updateVisit,
    deleteVisit,
  };
};

export default useVisit;
