// src/features/roles/components/RolePermissionsModal.tsx
import { useMemo } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Modal,
  Row,
  Space,
  Typography,
  theme,
} from "antd";
import { Key, Pencil, ShieldCheck } from "lucide-react";
import { AppTag } from "@/shared/components/atoms/AppTag";
import type { RolDetalle } from "../types/rol.types";
import {
  agruparPermisosPorModulo,
  getAccionFromPermission,
} from "../utils/roles.utils";

const { Title, Text } = Typography;

const BASE_ACTIONS = ["ver", "crear", "editar", "eliminar"];

interface RolePermissionsModalProps {
  open: boolean;
  role: RolDetalle | null;
  onClose: () => void;
  onEdit?: (role: RolDetalle) => void;
}

export const RolePermissionsModal = ({
  open,
  role,
  onClose,
  onEdit,
}: RolePermissionsModalProps) => {
  const { token } = theme.useToken();

  /* ── Agrupación base ── */
  const moduleGroups = useMemo(
    () => agruparPermisosPorModulo(role?.permissions ?? []),
    [role],
  );

  /* ── Transformación a matriz ── */
  const matrixData = useMemo(() => {
    const groups = agruparPermisosPorModulo(role?.permissions ?? []);

    return groups.map((group) => {
      const base: Record<string, boolean> = {};
      BASE_ACTIONS.forEach((a) => (base[a] = false));

      const extras: string[] = [];

      group.permissions.forEach((p) => {
        let accion = getAccionFromPermission(p) || "";

        // 🔥 NORMALIZAR
        accion = accion.toLowerCase().trim();

        // 🔥 MATCH INTELIGENTE (no exacto)
        const matchedBase = BASE_ACTIONS.find((a) => accion.startsWith(a));

        if (matchedBase) {
          base[matchedBase] = true;
        } else {
          extras.push(accion);
        }
      });

      return {
        module: group.module,
        base,
        extras,
      };
    });
  }, [role]);

  /* ── Stats ── */
  const totalPermissions = role?.permissions.length ?? 0;
  const totalModules = moduleGroups.length;

  const totalActions = useMemo(() => {
    const actions = new Set<string>();
    moduleGroups.forEach((g) =>
      g.permissions.forEach((p) => actions.add(getAccionFromPermission(p))),
    );
    return actions.size;
  }, [moduleGroups]);

  // Widths compartidos header ↔ body
  const COL_MODULE = 160;
  const COL_ACTION = 88;

  const cellBase: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: COL_ACTION,
    flexShrink: 0,
    borderRight: `1px solid ${token.colorBorderSecondary}`,
  };

  const cellModule: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    width: COL_MODULE,
    flexShrink: 0,
    paddingLeft: 12,
    borderRight: `1px solid ${token.colorBorderSecondary}`,
  };

  const cellExtras: React.CSSProperties = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    paddingLeft: 12,
    minWidth: 0,
  };

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      width={900}
      centered
      destroyOnHidden
      title={
        <Flex align="center" gap="middle">
          <ShieldCheck size={24} style={{ color: token.colorPrimary }} />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {role ? `Permisos: ${role.name}` : "Permisos del rol"}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Vista resumida por módulo y acciones
            </Text>
          </div>
        </Flex>
      }
      styles={{
        mask: { backdropFilter: "blur(6px)" },
        body: { padding: 0 },
      }}
    >
      {!role ? (
        <Empty description="No hay rol seleccionado" style={{ padding: 40 }} />
      ) : (
        <div>
          {/* ── Stats ── */}
          <div style={{ padding: "20px 24px 0" }}>
            <Row gutter={[12, 12]}>
              {[
                {
                  label: "Permisos",
                  value: totalPermissions,
                  tone: "primary" as const,
                },
                {
                  label: "Módulos",
                  value: totalModules,
                  tone: "success" as const,
                },
                {
                  label: "Acciones",
                  value: totalActions,
                  tone: "warning" as const,
                },
              ].map(({ label, value, tone }) => (
                <Col xs={24} sm={8} key={label}>
                  <Card
                    size="small"
                    style={{
                      background: token.colorFillTertiary,
                      border: "none",
                      borderRadius: 8,
                      textAlign: "center",
                    }}
                  >
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {label}
                    </Text>
                    <Flex justify="center" align="center" gap={6}>
                      <Title
                        level={3}
                        style={{ margin: 0, color: token.colorPrimary }}
                      >
                        {value}
                      </Title>
                      <AppTag tone={tone} style={{ fontSize: 10 }}>
                        total
                      </AppTag>
                    </Flex>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* ── Tabla ── */}
          <div style={{ padding: "16px 24px" }}>
            <Flex align="center" gap={8} style={{ marginBottom: 12 }}>
              <Key size={16} style={{ color: token.colorPrimary }} />
              <Text strong>Permisos por módulo</Text>
              <Badge count={totalModules} showZero color={token.colorPrimary} />
            </Flex>

            {matrixData.length === 0 ? (
              <Card>
                <Empty description="Sin permisos asignados" />
              </Card>
            ) : (
              <div
                style={{
                  border: `1px solid ${token.colorBorder}`,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                {/* ── HEADER ── */}
                <Flex
                  style={{
                    background: token.colorFillSecondary,
                    borderBottom: `2px solid ${token.colorBorder}`,
                    height: 40,
                  }}
                >
                  {/* Módulo header */}
                  <div
                    style={{
                      ...cellModule,
                      fontWeight: 700,
                      fontSize: 12,
                      color: token.colorTextSecondary,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Módulo
                  </div>

                  {/* Acciones base headers */}
                  {BASE_ACTIONS.map((a) => (
                    <div
                      key={a}
                      style={{
                        ...cellBase,
                        fontWeight: 700,
                        fontSize: 12,
                        color: token.colorTextSecondary,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {a}
                    </div>
                  ))}

                  {/* Otros header */}
                  <div
                    style={{
                      ...cellExtras,
                      fontWeight: 700,
                      fontSize: 12,
                      color: token.colorTextSecondary,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Otros
                  </div>
                </Flex>

                {/* ── BODY ── */}
                <div style={{ maxHeight: 420, overflowY: "auto" }}>
                  {matrixData.map((row, idx) => (
                    <Flex
                      key={row.module}
                      align="stretch"
                      style={{
                        borderBottom:
                          idx < matrixData.length - 1
                            ? `1px solid ${token.colorBorderSecondary}`
                            : "none",
                        minHeight: 44,
                        background:
                          idx % 2 === 1
                            ? token.colorFillQuaternary
                            : token.colorBgContainer,
                        transition: "background 0.15s",
                      }}
                    >
                      {/* Módulo */}
                      <div
                        style={{
                          ...cellModule,
                          paddingTop: 8,
                          paddingBottom: 8,
                        }}
                      >
                        <Text
                          style={{
                            textTransform: "capitalize",
                            fontWeight: 500,
                            fontSize: 13,
                          }}
                        >
                          {row.module}
                        </Text>
                      </div>

                      {/* Acciones base */}
                      {BASE_ACTIONS.map((a) => (
                        <div key={a} style={cellBase}>
                          {row.base[a] ? (
                            <ShieldCheck
                              size={16}
                              style={{ color: token.colorSuccess }}
                            />
                          ) : (
                            <span
                              style={{
                                color: token.colorTextQuaternary,
                                fontSize: 16,
                                lineHeight: 1,
                              }}
                            >
                              —
                            </span>
                          )}
                        </div>
                      ))}

                      {/* Extras */}
                      <div
                        style={{
                          ...cellExtras,
                          paddingTop: 8,
                          paddingBottom: 8,
                          paddingRight: 12,
                        }}
                      >
                        <Flex wrap="wrap" gap={6}>
                          {row.extras.length === 0 ? (
                            <Text
                              type="secondary"
                              style={{ fontSize: 16, lineHeight: 1 }}
                            >
                              —
                            </Text>
                          ) : (
                            row.extras.map((e, i) => (
                              <AppTag
                                key={i}
                                tone="neutral"
                                style={{ margin: 0 }}
                              >
                                {e}
                              </AppTag>
                            ))
                          )}
                        </Flex>
                      </div>
                    </Flex>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          {onEdit && (
            <Flex
              justify="flex-end"
              style={{
                padding: "12px 24px 20px",
                borderTop: `1px solid ${token.colorBorder}`,
              }}
            >
              <Button
                type="primary"
                icon={<Pencil size={15} />}
                onClick={() => onEdit(role)}
              >
                Editar permisos
              </Button>
            </Flex>
          )}
        </div>
      )}
    </Modal>
  );
};

export default RolePermissionsModal;
