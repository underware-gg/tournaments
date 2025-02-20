import { useMemo } from "react";
import { useGetEndedTournaments } from "@/dojo/hooks/useSqlQueries";
import { bigintToHex } from "@/lib/utils";
import { TournamentCard } from "@/components/overview/TournamanentCard";
import { addAddressPadding } from "starknet";
import EmptyResults from "@/components/overview/tournaments/EmptyResults";
import {
  processPrizesFromSql,
  processTournamentFromSql,
} from "@/lib/utils/formatting";
import { useDojo } from "@/context/dojo";

interface EndedTournamentsProps {
  gameFilters: string[];
}

const EndedTournaments = ({ gameFilters }: EndedTournamentsProps) => {
  const { nameSpace } = useDojo();
  const hexTimestamp = useMemo(
    () => addAddressPadding(bigintToHex(BigInt(new Date().getTime()) / 1000n)),
    []
  );

  const { data: endedTournaments } = useGetEndedTournaments({
    namespace: nameSpace,
    currentTime: hexTimestamp,
    gameFilters: gameFilters,
    offset: 0,
    limit: 12,
  });

  const endedTournamentsData = endedTournaments.map((tournament) => {
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
      {endedTournamentsData.length > 0 ? (
        endedTournamentsData.map((tournament, index) => (
          <TournamentCard
            key={index}
            tournament={tournament.tournament}
            index={index}
            status="ended"
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

export default EndedTournaments;
