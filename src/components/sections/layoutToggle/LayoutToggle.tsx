import { IconLayoutGrid, IconLayoutList } from "@tabler/icons-react";

interface LayoutToggleProps {
  displayType: string;
  onGridClick: () => void;
  onListClick: () => void;
  gridIconSize?: number;
  listIconSize?: number;
  activeColor?: string;
  inactiveColor?: string;
}

export function LayoutToggle({
  displayType,
  onGridClick,
  onListClick,
  gridIconSize = 30,
  listIconSize = 30,
  activeColor = "black",
  inactiveColor = "silver",
}: LayoutToggleProps) {
  return (
    <div>
      <IconLayoutGrid
        size={gridIconSize}
        onClick={onGridClick}
        style={{ cursor: "pointer" }}
        color={displayType === "column" ? activeColor : inactiveColor}
      />
      <IconLayoutList
        size={listIconSize}
        onClick={onListClick}
        style={{ cursor: "pointer" }}
        color={displayType !== "column" ? activeColor : inactiveColor}
      />
    </div>
  );
}
