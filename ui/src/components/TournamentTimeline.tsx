import { Card } from "@/components/ui/card";
import { FLAG, LEADERBOARD, REGISTER } from "@/components/Icons";
import { motion } from "framer-motion";
import { format, addDays, addHours } from "date-fns";

interface TournamentTimelineProps {
  type: string;
  startTime: Date;
  duration: number;
  submissionPeriod: string;
}

const TournamentTimeline = ({
  type,
  startTime,
  duration,
  submissionPeriod,
}: TournamentTimelineProps) => {
  return (
    <div className="flex flex-row items-center justify-center gap-14 mt-4">
      {type === "fixed" && (
        <div className="relative flex flex-col gap-2">
          <Card
            variant="outline"
            className="p-2 text-retro-green-dark border-2 border-retro-green-dark h-14 w-14 flex items-center justify-center relative z-20"
          >
            <span className="w-10">
              <REGISTER />
            </span>
          </Card>
          <div className="flex flex-col items-center font-astronaut">
            <span className="text-xs">{format(new Date(), "dd/MM")}</span>
            <span className="text-xs">{format(new Date(), "HH:mm")}</span>
          </div>
          <span className="absolute -top-6 left-[calc(100%_-_8px)] w-[calc(100%_+_12px)] text-[14px] text-center font-astronaut whitespace-nowrap">
            Registration
          </span>
          <motion.div
            className="absolute top-7 left-[calc(100%_-_8px)] w-[calc(100%_+_12px)] h-0.5 border-t-4 border-dotted border-retro-green-dark z-10"
            initial={{ width: 0 }}
            animate={{ width: "calc(100% + 12px)" }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          />
        </div>
      )}
      <div className="relative flex flex-col gap-2">
        <Card
          variant="outline"
          className="p-2 text-green-700 border-2 border-retro-green-dark h-14 w-14 flex items-center justify-center z-20"
        >
          <span className="w-10">
            <FLAG />
          </span>
        </Card>
        <div className="flex flex-col items-center font-astronaut">
          <span className="text-xs">{format(startTime, "dd/MM")}</span>
          <span className="text-xs">{format(startTime, "HH:mm")}</span>
        </div>
        <span className="absolute -top-6 left-[calc(100%_-_8px)] w-[calc(100%_+_12px)] text-[14px] text-center font-astronaut whitespace-nowrap">
          Duration
        </span>
        <motion.div
          className="absolute top-7 left-[calc(100%_-_8px)] w-[calc(100%_+_12px)] h-0.5 border-t-4 border-dotted border-retro-green-dark z-10"
          initial={{ width: 0 }}
          animate={{ width: "calc(100% + 12px)" }}
          transition={{
            duration: 0.5,
            delay: 0 * 0.2 + 0.3,
            ease: "easeOut",
          }}
        />
      </div>
      <div className="relative flex flex-col gap-2">
        <Card
          variant="outline"
          className="p-2 text-red-700 border-2 border-retro-green-dark h-14 w-14 flex items-center justify-center z-20"
        >
          <span className="w-10">
            <FLAG />
          </span>
        </Card>
        <div className="flex flex-col items-center font-astronaut">
          <span className="text-xs">
            {format(addDays(startTime, duration), "dd/MM")}
          </span>
          <span className="text-xs">
            {format(addDays(startTime, duration), "HH:mm")}
          </span>
        </div>
        <span className="absolute -top-6 left-[calc(100%_-_8px)] w-[calc(100%_+_12px)] text-[14px] text-center font-astronaut whitespace-nowrap">
          Submission
        </span>
        <motion.div
          className="absolute top-7 left-[calc(100%_-_8px)] w-[calc(100%_+_12px)] h-0.5 border-t-4 border-dotted border-retro-green-dark z-10"
          initial={{ width: 0 }}
          animate={{ width: "calc(100% + 12px)" }}
          transition={{
            duration: 0.5,
            delay: 0 * 0.2 + 0.3,
            ease: "easeOut",
          }}
        />
      </div>
      <div className="relative flex flex-col gap-2">
        <Card
          variant="outline"
          className="p-2 text-retro-green-dark border-2 border-retro-green-dark h-14 w-14 flex items-center justify-center z-20"
        >
          <span className="w-10">
            <LEADERBOARD />
          </span>
        </Card>
        <div className="flex flex-col items-center font-astronaut">
          <span className="text-xs">
            {format(
              addHours(
                addDays(startTime, duration),
                parseInt(submissionPeriod || "1")
              ),
              "dd/MM"
            )}
          </span>
          <span className="text-xs">
            {format(
              addHours(
                addDays(startTime, duration),
                parseInt(submissionPeriod || "1")
              ),
              "HH:mm"
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TournamentTimeline;
