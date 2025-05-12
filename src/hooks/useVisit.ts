import { useState, useEffect } from "react";
import { Property } from "./useProperty";

const api = import.meta.env.VITE_BACKEND_API;

export interface Visit {
  _id: string;
  appointment: Date;
  comment?: string;
  status: 'pending' | 'completed' | 'cencelled';
  createdAt?: Date;
  updatedAt?: Date;
  property: Property;
}

const useVisit = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        setLoading(true);
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
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Error desconocido al obtener las visitas");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

const createVisit = async (appointment: Date, propertyId: string) => {
    setLoading(true);
    setError(null);

    console.log(appointment);

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
        // Intentamos parsear JSON con { message }
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
      setVisits(v => [...v, created]);
      return created;

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido al crear la visita";
      console.error("createVisit error:", msg);
      setError(msg);

      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const updateVisit = async (visitId: string, field: string, value: string) => {
    const response = await fetch(`${api}/visit/${visitId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ [field]: value }),
    });
  
    if (!response.ok) {
      throw new Error('Error al actualizar la visita');
    }
  
    const updatedVisit = await response.json();
  
    setVisits((prev) =>
      prev.map((v) => (v._id === visitId ? updatedVisit : v))
    );
  };
  

  return { visits, loading, error, createVisit, updateVisit };
};

export default useVisit;
