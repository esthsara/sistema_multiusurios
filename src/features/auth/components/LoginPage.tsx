// src/features/auth/components/LoginPage.tsx
import { Form, Input, Button, Card, Divider } from "antd";
import { User, Lock } from "lucide-react";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import { sanitizeInput } from "@/shared/utils/sanitize";
import type { LoginDto } from "@/shared/types/auth.types";

const LoginPage = () => {
  const { login, isLoading } = useAuthActions();
  const [form] = Form.useForm<LoginDto>();

  const onFinish = (values: LoginDto) =>
    login({
      login: sanitizeInput(values.login, {
        trim: true,
        maxLength: 120,
        stripTags: true,
      }),
      /**
       * Password: no eliminamos caracteres válidos para no alterar
       * credenciales legítimas, solo quitamos controles invisibles.
       */
      password: sanitizeInput(values.password, {
        trim: false,
        maxLength: 256,
        stripTags: false,
      }),
    });

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/image/font-login-2.png')",
      }}
    >
      {/* OVERLAY oscuro para mejor contraste */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* CARD */}
      <div className="relative w-full max-w-sm px-4">
        <Card
          variant="outlined"
          className="shadow-2xl"
          style={{
            backgroundColor: "color-mix(in srgb, var(--color-bg-sidebar) 53%, transparent)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-card)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Header */}
          {/* Sara no te olvides con el modo claro */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold m-0" style={{ color: "var(--color-text-inverse)" }}>
              Bienvenido
            </h1>

            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Inicia sesión para continuar
            </p>
          </div>

          <Divider
            style={{ borderColor: "var(--color-border)", margin: "0 0 20px" }}
          />

          {/* FORM */}
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            autoComplete="off"
          >
            <Form.Item
              name="login"
              label={
                <span style={{ color: "var(--color-text-secondary)" }}>
                  Email o Usuario
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Ingresa tu email o usuario",
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
                placeholder="email o usuario"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <span style={{ color: "var(--color-text-secondary)" }}>
                  Contraseña
                </span>
              }
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
              />
            </Form.Item>

            <div className="text-right mb-3">
              <a
                href="/recuperar-password"
                className="text-xs hover:underline"
                style={{ color: "var(--color-primary-600)" }}
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            {/* SARA Funcionalidad de contraseña no te olvides   */}

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isLoading}
                block
                style={{ height: 44, fontWeight: 600 }}
              >
                {isLoading ? "Iniciando..." : "Iniciar Sesión"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
