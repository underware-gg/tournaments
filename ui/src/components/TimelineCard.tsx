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
  completed?: boolean;
}

const TimelineCard = ({
  icon,
  date,
  duraton,
  label,
  showConnector = false,
  active = false,
  completed = false,
}: TimelineCardProps) => {
  return (
    <div
      className={`relative flex flex-col gap-2 ${
        active ? "animate-pulse" : ""
      }`}
    >
      <Card
        variant={completed ? "default" : "outline"}
        className={`p-2 ${
          completed ? "text-black bg-retro-green-dark" : "text-retro-green-dark"
        } h-10 w-10 sm:h-14 sm:w-14 flex items-center justify-center z-20`}
        borderColor={
          completed ? "rgba(0, 218, 163, 1)" : "rgba(0, 140, 105, 1)"
        }
      >
        {icon}
      </Card>
      {date && (
        <div className="flex flex-col items-center font-astronaut">
          <span className="text-xs">{format(date, "dd/MM")}</span>
          <span className="text-xs">{format(date, "HH:mm")}</span>
        </div>
      )}
      {label && (
        <span className="absolute -top-10 sm:-top-6 left-[calc(100%_-_0px)] w-[calc(100%_+_10px)] sm:w-[calc(100%_+_20px)] text-[10px] sm:text-[14px] text-center font-astronaut whitespace-nowrap text-retro-green-dark">
          {label}
        </span>
      )}
      {duraton && (
        <span className="absolute -top-6 sm:top-0 left-[calc(100%_-_0px)] w-[calc(100%_+_10px)] sm:w-[calc(100%_+_20px)] text-[12px] sm:text-[14px] text-center whitespace-nowrap">
          {duraton > 0 ? formatTime(duraton) : "Ended"}
        </span>
      )}
      {showConnector && (
        <motion.div
          className="absolute top-5 sm:top-7 left-[calc(100%_-_0px)] w-[calc(100%_+_10px)] sm:w-[calc(100%_+_20px)] h-0.5 border-t-4 border-dotted border-retro-green-dark z-10"
          initial={{ width: 0 }}
          animate={{ width: "calc(100% + var(--line-extension, 10px))" }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        />
      )}
    </div>
  );
};

export default TimelineCard;
