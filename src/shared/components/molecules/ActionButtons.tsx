import { Button, Tooltip } from "antd";
import { Eye, Pencil, Trash2 } from "lucide-react";

export const ActionButtons = ({
  onView,
  onEdit,
  onDelete,
}: {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) => {
  return (
    <div className="flex gap-1">
      {onView && (
        <Tooltip title="Ver">
          <Button
            type="text"
            size="small"
            icon={<Eye size={14} />}
            onClick={onView}
          />
        </Tooltip>
      )}

      {onEdit && (
        <Tooltip title="Editar">
          <Button
            type="text"
            size="small"
            icon={<Pencil size={14} />}
            onClick={onEdit}
          />
        </Tooltip>
      )}

      {onDelete && (
        <Tooltip title="Eliminar">
          <Button
            type="text"
            size="small"
            danger
            icon={<Trash2 size={14} />}
            onClick={onDelete}
          />
        </Tooltip>
      )}
    </div>
  );
};
