// src/hooks/useDocument.ts
import axios from 'axios';
import { useState } from 'react';

const api = import.meta.env.VITE_BACKEND_API;

export interface DocumentFile {
  _id: string;
  file: File;
  name: string;
  uploadedBy: string;
  propertyId: string;
  createdAt: Date;
}

export interface Document {
  _id: string;
  name: string;
  uploadedBy: string;
  propertyId: string;
  createdAt: Date;
  filePath: string;
}

export const useDocument = () => {
  const [documents, setDocuments] = useState<Document[]>([])

  const fetchDocuments = async (propertyId: string) => {
    try {
      const response = await fetch(`${api}/documents/asesor/${propertyId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("No se pudieron obtener los documentos");
      }

      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw new Error("Error fetching documents: " + (error as Error).message);
    }
  };

  const uploadDocument = async (file: File, name: string, propertyId: string) => {
    const formData = new FormData();

    const fileExtension = file.name.split('.').pop();


    const sanitizedFileName = name
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '')
      .toLowerCase();

    const newFileName = `${sanitizedFileName}.${fileExtension}`;

    const newFile = new File([file], newFileName, { type: file.type });

    formData.append('file', newFile);
    formData.append('name', name);
    formData.append('uploadedBy', 'asesor');
    formData.append('propertyId', propertyId);

    try {
      const response = await axios.post(`${api}/documents/upload/asesor`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.error("Error uploading document:", error);
      throw new Error("Error uploading document: " + (error as Error).message);
    }
};

  

  const deleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`${api}/documents/${documentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar el documento");
      }

      setDocuments(prev => prev.filter(doc => doc._id !== documentId));
    } catch (error) {
      console.error("Error deleting document:", error);
      throw new Error("Error deleting document: " + (error as Error).message);
    }
  };

  return { documents, uploadDocument, fetchDocuments, deleteDocument };
};
