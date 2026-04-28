import { Button, Dropdown, Grid, Tooltip } from "antd";
import type { MenuProps } from "antd";
import { Ellipsis } from "lucide-react";
import { usePermissions } from "@/shared/hooks/usePermissions";
import type { PermissionString } from "@/shared/types/auth.types";

export interface RowActionItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  permission?: PermissionString;
}

interface RowActionsProps {
  actions: RowActionItem[];
  maxVisible?: number;
  collapseWhenMoreThan?: number;
}

export const RowActions = ({
  actions,
  maxVisible = 4,
  collapseWhenMoreThan = 4,
}: RowActionsProps) => {
  const { can } = usePermissions();
  const screens = Grid.useBreakpoint();

  const allowedActions = actions.filter(
    (action) => !action.permission || can(action.permission),
  );

  if (!allowedActions.length) return null;

  const forceCollapse =
    allowedActions.length > collapseWhenMoreThan || !screens.lg;

  const visibleActions = forceCollapse
    ? []
    : allowedActions.slice(0, maxVisible);

  const hiddenActions = forceCollapse
    ? allowedActions
    : allowedActions.slice(maxVisible);

  const dropdownItems: MenuProps["items"] = hiddenActions.map((action) => ({
    key: action.key,
    danger: action.danger,
    label: (
      <span className="row-actions-dropdown-item">
        {action.icon}
        <span>{action.label}</span>
      </span>
    ),
  }));

  return (
    <div className="row-actions-wrap">
      {visibleActions.map((action) => (
        <Tooltip key={action.key} title={action.label}>
          <Button
            type="text"
            size="small"
            danger={action.danger}
            icon={action.icon}
            onClick={action.onClick}
            className="row-action-btn"
          />
        </Tooltip>
      ))}

      {hiddenActions.length > 0 && (
        <Dropdown
          trigger={["hover", "click"]}
          menu={{
            items: dropdownItems,
            onClick: ({ key }) => {
              const action = hiddenActions.find((item) => item.key === key);
              action?.onClick();
            },
          }}
        >
          <Button
            type="text"
            size="small"
            icon={<Ellipsis size={15} />}
            className="row-actions-trigger"
          />
        </Dropdown>
      )}
    </div>
  );
};
