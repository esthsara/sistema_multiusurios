import { Flex, Typography } from "antd";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { AppTag } from "@/shared/components/atoms/AppTag";
import type { RolDetalle as UsuarioRolDetalle } from "../../../types/usuario.types";

type RolDetalleSimple = UsuarioRolDetalle;

const { Text } = Typography;

interface RolTableProps {
  roles: RolDetalleSimple[];
}

export const RolTable = ({ roles }: RolTableProps) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "var(--color-text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          display: "block",
          marginBottom: 12,
        }}
      >
        Roles asignados
      </Text>

      <Flex wrap="wrap" gap={8}>
        {roles.length === 0 ? (
          <AppTag tone="neutral" icon={<ShieldOff size={12} />}>
            Sin roles asignados
          </AppTag>
        ) : (
          roles.map((rol) => (
            <AppTag
              key={`rol-${rol.id}`}
              tone="primary"
              icon={<ShieldCheck size={12} />}
              style={{
                padding: "4px 12px",
                fontSize: "12px",
              }}
            >
              {rol.name}
            </AppTag>
          ))
        )}
      </Flex>
    </div>
  );
};
