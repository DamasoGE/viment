import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Form, Input, Button, Typography, Image } from "antd";
import { ContainerCentered, LoginBox } from "../styles/theme";

const { Title, Paragraph } = Typography;

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState("");
  const { login } = useAuth();

const handleSubmit = async (values: { username: string; password: string }) => {
  const success = await login(values.username, values.password);
  if (success) {
    window.location.href = "/";
  } else {
    setInfo("Error en las credenciales");
  }
};

  return (
    <ContainerCentered>
      <LoginBox>
        <Image
          width={100}
          src="/img/logo-login.png"
          alt="Logo"
          preview={false}
        />

        <Title level={3}>
          Iniciar Sesión
        </Title>

        {info && (
          <Paragraph type="danger">
            {info}
          </Paragraph>
        )}

        <Form onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Nombre de Usuario"
            name="username"
            rules={[{ required: true, message: "¡Introduzca su Nombre de Usuario!" }]}
          >
            <Input
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
            <Button type="primary" htmlType="submit" block>
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </LoginBox>
    </ContainerCentered>
  );
};

export default LoginPage;
