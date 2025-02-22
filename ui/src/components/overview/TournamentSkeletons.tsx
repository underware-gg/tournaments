import { Skeleton } from "@/components/ui/skeleton";

interface TournamentSkeletonsProps {
  tournamentsCount: number;
}

const TournamentSkeletons = ({
  tournamentsCount,
}: TournamentSkeletonsProps) => {
  return (
    <>
      {[...Array(tournamentsCount)].map((_, index) => (
        <div
          key={index}
          className="w-full p-4 space-y-4 border border-retro-green-dark rounded-lg bg-background"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
          <Skeleton className="h-20 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      ))}
    </>
  );
};

export default TournamentSkeletons;
