import { Card } from "@/components/ui/card";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { formatTime } from "@/lib/utils";

interface TimelineCardProps {
  icon: ReactNode;
  date?: Date;
  duraton?: number;
  label?: string;
  showConnector?: boolean;
  color?: string;
  active?: boolean;
}

const TimelineCard = ({
  icon,
  date,
  duraton,
  label,
  showConnector = false,
  color = "text-retro-green-dark",
  active = false,
}: TimelineCardProps) => {
  console.log(active);
  return (
    <div
      className={`relative flex flex-col gap-2 ${
        active ? "animate-pulse" : ""
      }`}
    >
      <Card
        variant="outline"
        className={`p-2 ${color} border-2 border-retro-green-dark h-14 w-14 flex items-center justify-center z-20`}
      >
        <span className="w-10">{icon}</span>
      </Card>
      {date && (
        <div className="flex flex-col items-center font-astronaut">
          <span className="text-xs">{format(date, "dd/MM")}</span>
          <span className="text-xs">{format(date, "HH:mm")}</span>
        </div>
      )}
      {label && (
        <span className="absolute -top-6 left-[calc(100%_-_0px)] w-[calc(100%_+_20px)] text-[14px] text-center font-astronaut whitespace-nowrap text-retro-green-dark">
          {label}
        </span>
      )}
      {duraton && (
        <span className="absolute top-0 left-[calc(100%_-_0px)] w-[calc(100%_+_20px)] text-[14px] text-center whitespace-nowrap">
          {duraton > 0 ? formatTime(duraton) : "Ended"}
        </span>
      )}
      {showConnector && (
        <motion.div
          className="absolute top-7 left-[calc(100%_-_0px)] w-[calc(100%_+_20px)] h-0.5 border-t-4 border-dotted border-retro-green-dark z-10"
          initial={{ width: 0 }}
          animate={{ width: "calc(100% + 20px)" }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        />
      )}
    </div>
  );
};

export default TimelineCard;
