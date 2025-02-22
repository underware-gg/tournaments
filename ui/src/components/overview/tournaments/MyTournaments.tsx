import { useMemo } from "react";
import { indexAddress } from "@/lib/utils";
import { TournamentCard } from "@/components/overview/TournamanentCard";
import EmptyResults from "@/components/overview/tournaments/EmptyResults";
import NoAccount from "@/components/overview/tournaments/NoAccount";
import { useAccount } from "@starknet-react/core";
import { useGetMyTournaments } from "@/dojo/hooks/useSqlQueries";
import useUIStore from "@/hooks/useUIStore";
import { useDojo } from "@/context/dojo";
import { processPrizesFromSql } from "@/lib/utils/formatting";
import { processTournamentFromSql } from "@/lib/utils/formatting";

interface MyTournamentsProps {
  gameFilters: string[];
}

const MyTournaments = ({ gameFilters }: MyTournamentsProps) => {
  const { address } = useAccount();
  const { gameData } = useUIStore();
  const { nameSpace } = useDojo();

  const queryAddress = useMemo(() => {
    if (!address || address === "0x0") return null;
    return indexAddress(address);
  }, [address]);

  const gameAddresses = useMemo(() => {
    return gameData?.map((game) => indexAddress(game.contract_address));
  }, [gameData]);

  const { data: myTournaments } = useGetMyTournaments({
    namespace: nameSpace,
    address: queryAddress,
    gameAddresses: gameAddresses ?? [],
    gameFilters: gameFilters,
    limit: 5,
    offset: 0,
  });

  const myTournamentsData = myTournaments.map((tournament) => {
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
      {address ? (
        <>
          {myTournamentsData.length > 0 ? (
            myTournamentsData.map((tournament, index) => (
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
      ) : (
        <NoAccount />
      )}
    </>
  );
};

export default MyTournaments;
