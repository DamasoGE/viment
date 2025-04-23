import { useState, useEffect } from "react";
import { Property } from "./useProperty";

const api = import.meta.env.VITE_BACKEND_API;

export interface Visit {
  _id?: string;
  appointment: Date;
  comment?: string;
  status?: string;
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

    const appointmentISO = appointment.toISOString();

    try {
      const response = await fetch(`${api}/visit/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ appointment: appointmentISO, propertyId }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la visita");
      }

      const createdVisit = await response.json();

      setVisits((prevVisits) => [...prevVisits, createdVisit]);
      return createdVisit;
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error desconocido al crear la visita");
      }
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
