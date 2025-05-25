import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Upload, message, Typography, Divider, List, Avatar, Popconfirm } from 'antd';
import { FileOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import { useDocument } from '../hooks/useDocument';

const { Title } = Typography;

const uploads = import.meta.env.VITE_URL_STORAGE;

interface DocumentFormValues {
  documentName: string;
  file: UploadFile[];
}

const PropertyDocumentSection: React.FC<{ propertyId: string; }> = ({ propertyId }) => {
  const { documents, uploadDocument, fetchDocuments, deleteDocument } = useDocument();
  const [form] = Form.useForm<DocumentFormValues>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      try {
        await fetchDocuments(propertyId);
      } catch (error) {
        message.error('Error al obtener los documentos: ' + error);
      } finally {
        setLoading(false);
      }
    };
    loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (values: DocumentFormValues) => {
    const file = values.file?.[0]?.originFileObj as RcFile | undefined;

    if (!file) {
      message.error('Por favor, sube un archivo válido.');
      return;
    }

    try {
      await uploadDocument(file, values.documentName, propertyId);
      message.success('Documento subido exitosamente');
      form.resetFields();

      await fetchDocuments(propertyId);
    } catch (error) {
      message.error('Error al subir el documento: ' + (error as Error).message);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
      message.success('Documento eliminado correctamente');
    } catch (error) {
      message.error('Error al eliminar el documento: ' + (error as Error).message);
    }
  };

  const normFile = (e: UploadChangeParam) => {
    console.log('Upload event:', e);

    if (Array.isArray(e.fileList)) {

      e.fileList = e.fileList.map((file) => {
        const newFile = { ...file }; 
        if (newFile.name.length > 15) {
          newFile.name = `${newFile.name.substring(0, 30)}...`;
        }
        return newFile;
      });
      return e.fileList;
    }

    return e?.fileList;
  };

  if (loading) {
    return "Cargando...";
  }

  const advisorDocuments = documents.filter((doc) => doc.uploadedBy === 'asesor');
  const sellerDocuments = documents.filter((doc) => doc.uploadedBy === 'seller');

  return (
    <div style={{ marginBottom: 24 }}>
      <Title level={4}>Documentos del Asesor</Title>

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 16,
            width: '100%',
          }}
        >
          <div style={{ flex: 1 }}>
            <Form.Item
              name="documentName"
              rules={[{ required: true, message: 'Ingresa el nombre del documento' }]}
              style={{ marginBottom: 0, minHeight: 60 }}
            >
              <Input placeholder="Nombre del documento" />
            </Form.Item>
          </div>

          <div style={{ flex: 1 }}>
            <Form.Item
              name="file"
              rules={[{ required: true, message: 'Sube un archivo' }]}
              valuePropName="fileList"
              getValueFromEvent={normFile}
              style={{ marginBottom: 0, minHeight: 60 }}
            >
              <Upload beforeUpload={() => false} maxCount={1}>
                <Button icon={<UploadOutlined />}>Archivo</Button>
              </Upload>
            </Form.Item>
          </div>

          <div style={{ flex: 1 }}>
            <Form.Item style={{ marginBottom: 0, minHeight: 60 }}>
              <Button type="primary" htmlType="submit">
                Subir documento
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>

      <Title level={5}>Lista de documentos del Asesor</Title>
      <List
        loading={loading}
        dataSource={advisorDocuments}
        locale={{ emptyText: 'No hay documentos aún.' }}
        renderItem={(doc) => (
          <List.Item key={doc._id}>
            <List.Item.Meta
              avatar={<Avatar icon={<FileOutlined />} />}
              title={
                <a
                  href={`${uploads}/${doc.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {doc.name}
                </a>
              }
              description={`${new Date(doc.createdAt).toLocaleString()}`}
            />
            <Popconfirm
              title="¿Estás seguro de que deseas eliminar este documento?"
              onConfirm={() => handleDelete(doc._id)}
              okText="Sí"
              cancelText="No"
            >
              <Button icon={<DeleteOutlined />} danger size="small" />
            </Popconfirm>
          </List.Item>
        )}
      />

      <Divider />

      <Title level={4}>Documentos del Vendedor</Title>
      <List
        loading={loading}
        dataSource={sellerDocuments}
        locale={{ emptyText: 'No hay documentos aún.' }}
        renderItem={(doc) => (
          <List.Item key={doc._id}>
            <List.Item.Meta
              avatar={<Avatar icon={<FileOutlined />} />}
              title={
                <a
                  href={`${uploads}/${doc.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {doc.name}
                </a>
              }
              description={`${new Date(doc.createdAt).toLocaleString()}`}
            />
            <Popconfirm
              title="¿Estás seguro de que deseas eliminar este documento?"
              onConfirm={() => handleDelete(doc._id)}
              okText="Sí"
              cancelText="No"
            >
              <Button icon={<DeleteOutlined />} danger size="small" />
            </Popconfirm>
          </List.Item>
        )}
      />
    </div>
  );
};

export default PropertyDocumentSection;
