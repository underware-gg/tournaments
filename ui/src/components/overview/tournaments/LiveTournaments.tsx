import { useMemo } from "react";
import {
  useGetLiveTournamentsQuery,
  useGetTournamentDetailsInListQuery,
} from "@/dojo/hooks/useSdkQueries";
import { bigintToHex } from "@/lib/utils";
import { Tournament } from "@/generated/models.gen";
import { TournamentCard } from "@/components/overview/TournamanentCard";
import { addAddressPadding } from "starknet";
import EmptyResults from "@/components/overview/tournaments/EmptyResults";

interface LiveTournamentsProps {
  gameFilters: string[];
}

const LiveTournaments = ({ gameFilters }: LiveTournamentsProps) => {
  const hexTimestamp = useMemo(
    () => bigintToHex(BigInt(new Date().getTime()) / 1000n),
    []
  );

  const { entities: tournamentEntities } = useGetLiveTournamentsQuery(
    hexTimestamp,
    12,
    0
  );

  const formattedTournaments = (tournamentEntities ?? []).map(
    (tournament) => tournament?.Tournament! as unknown as Tournament
  );

  const filteredTournaments = useMemo(() => {
    if (gameFilters.length === 0) return formattedTournaments;

    return formattedTournaments.filter((tournament) => {
      // Get the game address from the tournament
      const tournamentGameAddress = addAddressPadding(
        tournament.game_config.address
      );

      // Check if any of the selected game filters match the tournament's game
      return gameFilters.some((gameAddress) => {
        return gameAddress === tournamentGameAddress;
      });
    });
  }, [formattedTournaments, gameFilters]);

  const prizeTournamentIds = filteredTournaments.map((tournament) =>
    addAddressPadding(bigintToHex(BigInt(tournament.id)))
  );

  useGetTournamentDetailsInListQuery(prizeTournamentIds);

  return (
    <>
      {filteredTournaments.length > 0 ? (
        filteredTournaments.map((tournament, index) => (
          <TournamentCard
            key={index}
            tournament={tournament}
            index={index}
            status="live"
          />
        ))
      ) : (
        <EmptyResults gameFilters={gameFilters} />
      )}
    </>
  );
};

export default LiveTournaments;
