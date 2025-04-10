// hooks/useProperties.ts

import { useState, useEffect } from 'react';

// Interface de propiedad
interface Property {
  id: number;
  name: string;
  description: string;
  price: number;
}

const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('https://api.example.com/properties');
        if (!response.ok) throw new Error('Error al cargar las propiedades');
        const data = await response.json();
        setProperties(data);
      } catch (err) {
        setError('Error al cargar las propiedades: '+err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const createProperty = async (property: Property) => {
    try {
      const response = await fetch('https://api.example.com/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(property),
      });
      if (!response.ok) throw new Error('Error al crear la propiedad');
      const newProperty = await response.json();
      setProperties((prevProperties) => [...prevProperties, newProperty]);
    } catch (err) {
      setError('Error al crear la propiedad: '+err);
    }
  };

  const updateProperty = async (id: number, updatedProperty: Property) => {
    try {
      const response = await fetch(`https://api.example.com/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProperty),
      });
      if (!response.ok) throw new Error('Error al actualizar la propiedad');
      const data = await response.json();
      setProperties((prevProperties) =>
        prevProperties.map((property) =>
          property.id === id ? { ...property, ...data } : property
        )
      );
    } catch (err) {
      setError('Error al actualizar la propiedad:'+err);
    }
  };

  const deleteProperty = async (id: number) => {
    try {
      const response = await fetch(`https://api.example.com/properties/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar la propiedad');
      setProperties((prevProperties) =>
        prevProperties.filter((property) => property.id !== id)
      );
    } catch (err) {
      setError('Error al eliminar la propiedad:'+err);
    }
  };

  return {
    properties,
    loading,
    error,
    createProperty,
    updateProperty,
    deleteProperty,
  };
};

export default useProperties;
