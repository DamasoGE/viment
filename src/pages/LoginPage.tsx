import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Form, Input, Button, Space, Typography } from "antd";

const { Title, Paragraph } = Typography;

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (values: { username: string; password: string }) => {
    const loginsuccess = await login(values.username, values.password);
    if (loginsuccess) {
      navigate("/");
    } else {
      setInfo("Error en las credenciales")
      console.log("Error de login");
    }
  };

  return (
    <div className="login-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop:"50px" }}>
      <div
        className="login-box"
        style={{
          maxWidth: "400px", // Máxima anchura del formulario
          width: "100%", // Asegura que el formulario ocupe todo el espacio disponible hasta el maxWidth
          padding: "20px",
        }}
      >
        <Title level={2} style={{ textAlign: "center" }}>Login</Title>
        <Paragraph type="danger" style={{ textAlign: "center" }}>{info ? info:""}</Paragraph>
        
        <Form
          onFinish={handleSubmit}
          initialValues={{ username, password }}
          layout="vertical"
          style={{ marginTop: "20px" }}
        >
          <Form.Item
            label="Nombre de Usuario"
            name="username"
            rules={[{ required: true, message: "¡Introduzca su Nombre de Usuario!" }]}
          >
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Introduce tu Nombre de Usuario"
            />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: "¡Introduzca su contraseña!" }]}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="**************"
            />
          </Form.Item>

          <Form.Item>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                Login
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
