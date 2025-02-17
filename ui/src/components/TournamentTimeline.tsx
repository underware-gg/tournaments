import { FLAG, LEADERBOARD, REGISTER } from "@/components/Icons";
import TimelineCard from "@/components/TimelineCard";

interface TournamentTimelineProps {
  type: string;
  startTime: number;
  duration: number;
  submissionPeriod: number;
  pulse?: boolean;
}

const TournamentTimeline = ({
  type,
  startTime,
  duration,
  submissionPeriod,
  pulse = false,
}: TournamentTimelineProps) => {
  const startDate = new Date(startTime * 1000);
  const endDate = new Date((startTime + duration) * 1000);
  const submissionEndDate = new Date(
    (startTime + duration + submissionPeriod) * 1000
  );
  const registrationPeriod =
    startTime - Number(BigInt(new Date().getTime()) / BigInt(1000));

  const isStarted =
    startTime < Number(BigInt(new Date().getTime()) / BigInt(1000));
  console.log(isStarted);
  const isEnded =
    startTime + duration < Number(BigInt(new Date().getTime()) / BigInt(1000));
  const isSubmissionEnded =
    startTime + duration + submissionPeriod <
    Number(BigInt(new Date().getTime()) / BigInt(1000));

  return (
    <div className="flex flex-row items-center justify-center gap-20 mt-4">
      {type === "fixed" && (
        <TimelineCard
          icon={<REGISTER />}
          date={new Date()}
          duraton={registrationPeriod}
          label="Registration"
          showConnector
          active={pulse ? !isStarted : false}
        />
      )}
      <TimelineCard
        icon={<FLAG />}
        date={startDate}
        duraton={duration}
        label="Duration"
        showConnector
        color="text-green-700"
        active={pulse ? isStarted : false}
      />
      <TimelineCard
        icon={<FLAG />}
        date={endDate}
        duraton={submissionPeriod}
        label="Submission"
        showConnector
        color="text-red-700"
        active={pulse ? isSubmissionEnded : false}
      />
      <TimelineCard
        icon={<LEADERBOARD />}
        date={submissionEndDate}
        active={pulse ? isEnded : false}
      />
    </div>
  );
};

export default TournamentTimeline;
