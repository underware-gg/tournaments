import { useMemo } from "react";
import {
  useGetLiveTournamentsQuery,
  useGetTournamentDetailsInListQuery,
} from "@/dojo/hooks/useSdkQueries";
import { bigintToHex, indexAddress } from "@/lib/utils";
import { Tournament } from "@/generated/models.gen";
import { TournamentCard } from "@/components/overview/TournamanentCard";
import { addAddressPadding } from "starknet";
import EmptyResults from "@/components/overview/tournaments/EmptyResults";
import { useAccount } from "@starknet-react/core";
import { useGetAccountTokenIds } from "@/dojo/hooks/useSqlQueries";

interface MyTournamentsProps {
  gameFilters: string[];
}

const MyTournaments = ({ gameFilters }: MyTournamentsProps) => {
  const { address } = useAccount();

  const queryAddress = useMemo(() => {
    if (!address || address === "0x0") return null;
    return indexAddress(address);
  }, [address]);

  const { data: ownedTokens } = useGetAccountTokenIds(
    // indexAddress(address ?? "0x0"),
    queryAddress ?? "0x0",
    // "0x77b8ed8356a7c1f0903fc4ba6e15f9b09cf437ce04f21b2cbf32dc2790183d0",
    ["0x2f3f1675be75c1c9424d777cc79f60f29c9e24cf08775a4bb90f3d44812781c"]
  );

  const ownedTokenIds = useMemo(() => {
    return ownedTokens
      ?.map((token) => {
        const parts = token.token_id?.split(":");
        return parts?.[1] ?? null;
      })
      .filter(Boolean);
  }, [ownedTokens]);

  console.log(ownedTokenIds);

  // const handleGetGameTokens = async () => {
  //   const tokenBalances = await sdk.getTokenBalances(
  //     ["0x77b8ed8356a7c1f0903fc4ba6e15f9b09cf437ce04f21b2cbf32dc2790183d0"],
  //     ["0x2f3f1675be75c1c9424d777cc79f60f29c9e24cf08775a4bb90f3d44812781c"]
  //   );
  //   console.log(tokenBalances);
  //   // const gameTokens = tokenBalances.filter((token) =>
  //   //   gameFilters.includes(token.contractAddress)
  //   // );
  //   // return gameTokens;
  // };

  // useEffect(() => {
  //   handleGetGameTokens();
  // }, [sdk]);

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

export default MyTournaments;
