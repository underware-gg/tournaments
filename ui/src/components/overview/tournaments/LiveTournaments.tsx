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

interface LiveTournamentsProps {
  gameFilters: string[];
}

const LiveTournaments = ({ gameFilters }: LiveTournamentsProps) => {
  const { nameSpace } = useDojo();
  const hexTimestamp = useMemo(
    () => addAddressPadding(bigintToHex(BigInt(new Date().getTime()) / 1000n)),
    []
  );

  const { data: liveTournaments } = useGetLiveTournaments({
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
