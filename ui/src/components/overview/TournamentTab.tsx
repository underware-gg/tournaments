import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface TournamentTabProps {
  selected: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  count?: number;
}

export const TournamentTab = ({
  selected,
  onClick,
  icon,
  label,
  count,
}: TournamentTabProps) => {
  return (
    <div className="relative hover:cursor-pointer" onClick={onClick}>
      <Button
        variant={selected ? "default" : "outline"}
        borderColor="rgba(0, 218, 163, 1)"
        className="[border-image-width:4px_4px_0_4px] rounded-b-none"
      >
        {icon}
        {label}
      </Button>
      {count !== undefined && (
        <span className="absolute top-0 right-0 flex items-center justify-center text-black h-4 w-4 text-xs">
          {count}
        </span>
      )}
    </div>
  );
};
