import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Divider,
  Result,
  Button,
  Typography,
  Collapse,
  message,
  Popconfirm,
  Row,
  Col,
  Tooltip,
  Tag,
} from "antd";
import useProperty, { Property } from "../hooks/useProperty";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import PropertyAdSection from "../components/PropertyAdSection";
import PropertyDocumentSection from "../components/PropertyDocumentSection";
import CenteredSpin from "../components/CenteredSpin";
import { HeaderPageContainer } from "../styles/theme";
import dayjs from "dayjs";
import { getStatusColor } from "../helpers/status";

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchPropertyById, loading, updateProperty, deleteProperty } =
    useProperty();
  const [property, setProperty] = useState<Property | null>(null);
  const navigate = useNavigate();
  const { Text } = Typography;

  useEffect(() => {
    const aux = async () => {
      if (id) {
        const propertyFetch = await fetchPropertyById(id);
        setProperty(propertyFetch);
      }
    };
    aux();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteProperty = async () => {
    if (!property?._id) return;

    try {
      const success = await deleteProperty(property._id);
      if (success) {
        message.success("Propiedad eliminada correctamente");
        navigate("/property");
      } else {
        message.error("No se pudo eliminar la propiedad");
      }
    } catch (err) {
      console.error("Error al eliminar la propiedad:", err);
      message.error("Ocurrió un error al intentar eliminar la propiedad");
    }
  };

  const [timesOffered, setTimesOffered] = useState<number>(
    property?.timesOffered || 0
  );
  const [timesListed, setTimesListed] = useState<number>(
    property?.timesListed || 0
  );
  const [timesInterested, setTimesInterested] = useState<number>(
    property?.timesInterested || 0
  );
  const [timesDetailView, setTimesDetailView] = useState<number>(
    property?.timesDetailView || 0
  );
  const [ads, setAds] = useState<string[]>(property?.ads || []);

  useEffect(() => {
    if (property) {
      setTimesOffered(property.timesOffered || 0);
      setTimesListed(property.timesListed || 0);
      setTimesInterested(property.timesInterested || 0);
      setTimesDetailView(property.timesDetailView || 0);
      setAds(property.ads || []);
    }
  }, [property]);

  const changeCounter = async (
    field: keyof Property,
    value: number,
    setValue: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (!property?._id) return;
    const newValue = Math.max(0, value);
    setValue(newValue);
    await updateProperty(property._id, field, newValue.toString());
  };

  const renderCounter = (
    label: string,
    value: number,
    field: keyof Property,
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ fontWeight: 500 }}>{value}</span>
      <div style={{ display: "flex", flexDirection: "column", marginLeft: 8 }}>
        <Tooltip title={`Aumentar ${label.toLowerCase()}`}>
          <Button
            icon={<UpOutlined />}
            onClick={() => changeCounter(field, value + 1, setter)}
            size="small"
            type="default"
            style={{ padding: "0 6px", height: 15, width: 15 }}
          />
        </Tooltip>
        <Tooltip title={`Disminuir ${label.toLowerCase()}`}>
          <Button
            icon={<DownOutlined />}
            onClick={() => changeCounter(field, value - 1, setter)}
            size="small"
            type="default"
            style={{ padding: "0 6px", height: 15, width: 15 }}
            disabled={value <= 0}
          />
        </Tooltip>
      </div>
    </div>
  );

  const getTimesVisited = (): number => {
    if (!property || !property.visits) return 0;
    return property.visits.filter((v) => v.status === "completed").length;
  };

  // Agrupa visitas por fecha (YYYY-MM-DD)
  const groupVisitsByDay = (visits: Property["visits"]) => {
    const groups: Record<string, typeof visits> = {};
    visits.forEach((visit) => {
      const day = dayjs(visit.appointment).format("YYYY-MM-DD");
      if (!groups[day]) groups[day] = [];
      groups[day].push(visit);
    });
    return groups;
  };

  if (loading) {
    return <CenteredSpin tipText="Cargando Propiedad..." />;
  }

  if (!property) {
    return (
      <Result
        status="404"
        title="Propiedad no encontrada"
        subTitle="No pudimos encontrar una propiedad con ese ID."
        extra={
          <Button type="primary" href="/property">
            Volver al listado
          </Button>
        }
      />
    );
  }

  return (
    <>
      <HeaderPageContainer>
        <h1 style={{ margin: 0 }}>Información de la propiedad</h1>
        <Popconfirm
          title="¿Estás seguro de borrar esta propiedad? Se eliminarán también las visitas asociadas"
          onConfirm={handleDeleteProperty}
          okText="Sí"
          cancelText="No"
        >
          <Button type="primary" danger>
            Borrar Propiedad
          </Button>
        </Popconfirm>
      </HeaderPageContainer>

      <Card style={{ padding: 16 }}>
        <Row gutter={[16, 12]}>
          <Col span={12}>
            <Text strong>Dirección:</Text>
            <br />
            <Text>{property.address}</Text>
          </Col>

          <Col span={12}>
            <Text strong>Vendedor:</Text>
            <br />
            {property.seller ? (
              <Link to={`/seller/${property.seller._id}`}>
                {property.seller.username}
              </Link>
            ) : (
              <Text>No asignado</Text>
            )}
          </Col>

          <Divider />
          {/* Contadores */}
          <Col span={12}>
            <Text strong>Vistas Detalle:</Text>
            <br />
            {renderCounter(
              "Vistas Detalle",
              timesDetailView,
              "timesDetailView",
              setTimesDetailView
            )}
          </Col>

          <Col span={12}>
            <Text strong>Veces Interesado:</Text>
            <br />
            {renderCounter(
              "Veces Interesado",
              timesInterested,
              "timesInterested",
              setTimesInterested
            )}
          </Col>

          <Col span={12}>
            <Text strong>Veces Listada:</Text>
            <br />
            {renderCounter(
              "Veces Listada",
              timesListed,
              "timesListed",
              setTimesListed
            )}
          </Col>

          <Col span={12}>
            <Text strong>Veces Ofrecida:</Text>
            <br />
            {renderCounter(
              "Veces Ofrecida",
              timesOffered,
              "timesOffered",
              setTimesOffered
            )}
          </Col>

          {/* Solo lectura */}
          <Col span={12}>
            <Text strong>Veces Visitada:</Text>
            <br />
            <Text>{getTimesVisited()}</Text>
          </Col>

          <Col span={12}>
            <Text strong>Fecha de Registro:</Text>
            <br />
            <Text>
              {property.createdAt
                ? new Date(property.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : "No disponible"}
            </Text>
          </Col>
        </Row>
      </Card>

      <Divider />

      <Collapse accordion={false}>
        <Collapse.Panel header="Anuncios (Ads)" key="2">
          <PropertyAdSection
            propertyAds={ads}
            propertyId={property._id as string}
          />
        </Collapse.Panel>

        <Collapse.Panel header="Visitas a esta propiedad" key="3">
          {!property.visits || property.visits.length === 0 ? (
            <Typography.Text type="secondary">
              No hay visitas registradas.
            </Typography.Text>
          ) : (
            <>
              {(() => {
                const groupedVisits = groupVisitsByDay(property.visits);
                const sortedDays = Object.keys(groupedVisits).sort((a, b) =>
                  a < b ? 1 : -1
                );

                return sortedDays.map((day) => (
                  <div key={day} style={{ marginBottom: 24 }}>
                    <Typography.Title level={5} style={{ marginBottom: 12 }}>
                      {dayjs(day).format("dddd, D [de] MMMM YYYY")}
                    </Typography.Title>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                      {groupedVisits[day].map((visit) => (
                        <Card
                          key={property._id}
                          hoverable
                          onMouseEnter={(e) => {
                            const card = e.currentTarget as HTMLDivElement;
                            card.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
                          }}
                          onMouseLeave={(e) => {
                            const card = e.currentTarget as HTMLDivElement;
                            card.style.boxShadow = "none";
                          }}
                          onClick={() => navigate(`/visit/${visit._id}`)}
                          style={{ backgroundColor: "#fafafa", width: "250px" }}
                        >
                          <Typography.Text>
                            <strong>Hora:</strong>{" "}
                            {dayjs(visit.appointment).format("HH:mm")}
                          </Typography.Text>
                          <br />
                          <Typography.Text>
                            <strong>Estado:</strong>{" "}
                            <Tag color={getStatusColor(visit.status)}>
                              {visit.status.charAt(0).toUpperCase() +
                                visit.status.slice(1)}
                            </Tag>
                          </Typography.Text>
                          <br />
                          <Typography.Text>
                            <strong>Comentario:</strong>{" "}
                            {visit.comment
                              ? visit.comment.length > 250
                                ? `${visit.comment.slice(0, 250)}[...]`
                                : visit.comment
                              : "Ninguno"}
                          </Typography.Text>
                        </Card>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </>
          )}
        </Collapse.Panel>

        <Collapse.Panel header="Documentos del Asesor" key="4">
          <PropertyDocumentSection propertyId={property._id as string} />
        </Collapse.Panel>
      </Collapse>

      <Button type="primary" style={{ marginTop: 24 }}>
        <Link to="/property" style={{ color: "inherit" }}>
          Volver a la lista de propiedades
        </Link>
      </Button>
    </>
  );
};

export default PropertyDetailsPage;
