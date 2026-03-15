// src/features/auth/components/LoginPage.tsx
import { Form, Input, Button, Card, Divider } from "antd";
import { User, Lock, LogIn } from "lucide-react";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import type { LoginDto } from "@/shared/types/auth.types";

const LoginPage = () => {
  const { login, isLoading } = useAuthActions();
  const [form] = Form.useForm<LoginDto>();

  const onFinish = (values: LoginDto) => login(values);

  return (
    <div className="w-full max-w-md px-4">
      <Card
        className="shadow-lg"
        style={{
          backgroundColor: "var(--color-bg-base)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-card)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center
                          w-14 h-14 rounded-2xl mb-4"
            style={{ backgroundColor: "var(--color-primary-600)" }}
          >
            <LogIn size={28} color="white" />
          </div>
          <h1
            className="text-2xl font-bold m-0"
            style={{ color: "var(--color-text-primary)" }}
          >
            Panel Administrativo
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <Divider
          style={{ borderColor: "var(--color-border)", margin: "0 0 24px" }}
        />

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          autoComplete="off"
        >
          <Form.Item
            name="login"
            label="Email o Usuario"
            rules={[
              {
                required: true,
                message: "Ingresa tu email o nombre de usuario",
              },
            ]}
          >
            <Input
              prefix={
                <User
                  size={16}
                  style={{ color: "var(--color-text-disabled)" }}
                />
              }
              placeholder="email@ejemplo.com o usuario"
              size="large"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            rules={[{ required: true, message: "Ingresa tu contraseña" }]}
          >
            <Input.Password
              prefix={
                <Lock
                  size={16}
                  style={{ color: "var(--color-text-disabled)" }}
                />
              }
              placeholder="••••••••"
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isLoading}
              block
              icon={<LogIn size={16} />}
              style={{ height: 48, fontWeight: 600 }}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
