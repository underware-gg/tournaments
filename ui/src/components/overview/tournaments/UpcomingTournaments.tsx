import { useMemo } from "react";
import {
  useGetUpcomingTournamentsQuery,
  useGetTournamentDetailsInListQuery,
} from "@/dojo/hooks/useSdkQueries";
import { useGetUpcomingTournaments } from "@/dojo/hooks/useSqlQueries";
import { bigintToHex } from "@/lib/utils";
import { Tournament } from "@/generated/models.gen";
import { TournamentCard } from "@/components/overview/TournamanentCard";
import { addAddressPadding } from "starknet";
import EmptyResults from "@/components/overview/tournaments/EmptyResults";
import { useDojoStore } from "@/dojo/hooks/useDojoStore";
import { Prize } from "@/generated/models.gen";
interface UpcomingTournamentsProps {
  gameFilters: string[];
}

const UpcomingTournaments = ({ gameFilters }: UpcomingTournamentsProps) => {
  const state = useDojoStore.getState();
  const hexTimestamp = useMemo(
    () => addAddressPadding(bigintToHex(BigInt(new Date().getTime()) / 1000n)),
    []
  );

  const { entities: tournamentEntities } = useGetUpcomingTournamentsQuery(
    hexTimestamp,
    12,
    0
  );

  console.log(state.entities);

  const formattedTournaments = (tournamentEntities ?? []).map(
    (tournament) => tournament?.Tournament! as unknown as Tournament
  );

  console.log(formattedTournaments);

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

  const { data: upcomingTournaments } = useGetUpcomingTournaments({
    currentTime: hexTimestamp,
    offset: 0,
    limit: 12,
  });

  const upcomingTournamentsData = upcomingTournaments.map((tournament) => {
    return {
      ...tournament,
      prizes: tournament.prizes
        ? tournament.prizes
            .split("|")
            .map((prizeStr: string) => {
              const prize = JSON.parse(prizeStr);
              return {
                ...prize,
                isValid: Boolean(prize.isValid),
              };
            })
            .filter((prize: any) => prize.isValid)
            .sort((a: any, b: any) => a.position - b.position)
        : null,
    };
  });

  console.log(upcomingTournamentsData);

  return (
    <>
      {filteredTournaments.length > 0 ? (
        filteredTournaments.map((tournament, index) => (
          <TournamentCard
            key={index}
            tournament={tournament}
            index={index}
            status="upcoming"
          />
        ))
      ) : (
        <EmptyResults gameFilters={gameFilters} />
      )}
    </>
  );
};

export default UpcomingTournaments;
