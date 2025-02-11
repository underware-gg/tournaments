import { Card } from "@/components/ui/card";
import { FLAG, LEADERBOARD, REGISTER } from "@/components/Icons";
import { motion } from "framer-motion";
import { format } from "date-fns";
import TimelineCard from "@/components/TimelineCard";

interface TournamentTimelineProps {
  type: string;
  startTime: number;
  duration: number;
  submissionPeriod: number;
}

const TournamentTimeline = ({
  type,
  startTime,
  duration,
  submissionPeriod,
}: TournamentTimelineProps) => {
  const startDate = new Date(startTime * 1000);
  const endDate = new Date((startTime + duration) * 1000);
  const submissionEndDate = new Date(
    (startTime + duration + submissionPeriod) * 1000
  );
  const registrationPeriod =
    startTime - Number(BigInt(new Date().getTime()) / BigInt(1000));

  return (
    <div className="flex flex-row items-center justify-center gap-20 mt-4">
      {type === "fixed" && (
        <TimelineCard
          icon={<REGISTER />}
          date={new Date()}
          duraton={registrationPeriod}
          label="Registration"
          showConnector
        />
      )}
      <TimelineCard
        icon={<FLAG />}
        date={startDate}
        duraton={duration}
        label="Duration"
        showConnector
        color="text-green-700"
      />
      <TimelineCard
        icon={<FLAG />}
        date={endDate}
        duraton={submissionPeriod}
        label="Submission"
        showConnector
        color="text-red-700"
      />
      <TimelineCard icon={<LEADERBOARD />} date={submissionEndDate} />
    </div>
  );
};

export default TournamentTimeline;
