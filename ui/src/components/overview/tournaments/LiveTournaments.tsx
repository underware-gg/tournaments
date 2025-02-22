import { useMemo } from "react";
import { useGetLiveTournaments } from "@/dojo/hooks/useSqlQueries";
import { bigintToHex } from "@/lib/utils";
import { TournamentCard } from "@/components/overview/TournamanentCard";
import { addAddressPadding } from "starknet";
import EmptyResults from "@/components/overview/tournaments/EmptyResults";
import {
  processPrizesFromSql,
  processTournamentFromSql,
} from "@/lib/utils/formatting";
import { useDojo } from "@/context/dojo";
import TournamentSkeletons from "@/components/overview/TournamentSkeletons";

interface LiveTournamentsProps {
  gameFilters: string[];
  tournamentsCount: number;
}

const LiveTournaments = ({
  gameFilters,
  tournamentsCount,
}: LiveTournamentsProps) => {
  const { nameSpace } = useDojo();
  const hexTimestamp = useMemo(
    () => addAddressPadding(bigintToHex(BigInt(new Date().getTime()) / 1000n)),
    []
  );

  const { data: liveTournaments, loading } = useGetLiveTournaments({
    namespace: nameSpace,
    currentTime: hexTimestamp,
    gameFilters: gameFilters,
    offset: 0,
    limit: 12,
  });

  const liveTournamentsData = liveTournaments.map((tournament) => {
    const processedTournament = processTournamentFromSql(tournament);
    const processedPrizes = processPrizesFromSql(
      tournament.prizes,
      tournament.id
    );
    return {
      tournament: processedTournament,
      prizes: processedPrizes,
      entryCount: Number(tournament.entry_count),
    };
  });

  if (loading && tournamentsCount > 0) {
    return <TournamentSkeletons tournamentsCount={tournamentsCount} />;
  }

  return (
    <>
      {liveTournamentsData.length > 0 ? (
        liveTournamentsData.map((tournament, index) => (
          <TournamentCard
            key={index}
            tournament={tournament.tournament}
            index={index}
            status="live"
            prizes={tournament.prizes}
            entryCount={tournament.entryCount}
          />
        ))
      ) : (
        <EmptyResults gameFilters={gameFilters} />
      )}
    </>
  );
};

export default LiveTournaments;
