import { useMemo, useCallback } from "react";
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

  const allowedActions = useMemo(() => {
    return actions.filter(
      (action) => !action.permission || can(action.permission),
    );
  }, [actions, can]);

  if (!allowedActions.length) return null;

  const forceCollapse =
    allowedActions.length > collapseWhenMoreThan || !screens.lg;

  const visibleActions = useMemo(() => {
    return forceCollapse ? [] : allowedActions.slice(0, maxVisible);
  }, [forceCollapse, allowedActions, maxVisible]);

  const hiddenActions = useMemo(() => {
    return forceCollapse ? allowedActions : allowedActions.slice(maxVisible);
  }, [forceCollapse, allowedActions, maxVisible]);

  const dropdownItems: MenuProps["items"] = useMemo(() => {
    return hiddenActions.map((action) => ({
      key: action.key,
      danger: action.danger,
      label: (
        <span className="row-actions-dropdown-item flex items-center gap-2">
          {action.icon}
          <span>{action.label}</span>
        </span>
      ),
    }));
  }, [hiddenActions]);

  const handleDropdownClick: MenuProps["onClick"] = useCallback(
    ({ key }: { key: string | number }) => {
      const keyStr = String(key);
      const action = hiddenActions.find((item) => item.key === keyStr);
      action?.onClick();
    },
    [hiddenActions],
  );

  return (
    <div className="row-actions-wrap flex items-center gap-1">
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
            onClick: handleDropdownClick,
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
