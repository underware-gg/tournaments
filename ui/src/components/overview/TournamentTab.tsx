import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { COUNTER } from "@/components/Icons";

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
      {count !== undefined && count > 0 && (
        <span className="absolute -top-2 -right-1 flex items-center justify-center text-retro-green-darker h-6 w-6 text-xs">
          <COUNTER />
          <span className="absolute inset-0 flex items-center justify-center text-retro-green text-center">
            {count}
          </span>
        </span>
      )}
    </div>
  );
};
