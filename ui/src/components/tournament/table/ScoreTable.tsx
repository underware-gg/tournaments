import { Card } from "@/components/ui/card";
import Pagination from "@/components/table/Pagination";
import { USER } from "@/components/Icons";
import { useState, useEffect, useMemo } from "react";
import { Switch } from "@/components/ui/switch";
import {
  useGetTournamentRegistrationsQuery,
  useGetGameScoresInListQuery,
} from "@/dojo/hooks/useSdkQueries";
import { addAddressPadding, BigNumberish } from "starknet";
import { useGetTokenOwnerQuery } from "@/dojo/hooks/useSqlQueries";
import {
  bigintToHex,
  displayAddress,
  feltToString,
  indexAddress,
} from "@/lib/utils";
import { useDojo } from "@/context/dojo";
import { useGetUsernames } from "@/hooks/useController";

import { ChainId } from "@/dojo/config";

interface ScoreTableProps {
  tournamentId: BigNumberish;
  entryCount: number;
  gameAddress: BigNumberish;
  gameNamespace: string;
}

const ScoreTable = ({
  tournamentId,
  entryCount,
  gameAddress,
  gameNamespace,
}: ScoreTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showParticipants, setShowParticipants] = useState(false);
  const { selectedChainConfig } = useDojo();
  const isSepolia = selectedChainConfig.chainId === ChainId.SN_SEPOLIA;
  const { entities: registrations } = useGetTournamentRegistrationsQuery({
    tournamentId: tournamentId,
    limit: 5,
    offset: (currentPage - 1) * 5,
  });

  const tokenIds = useMemo(
    () =>
      registrations?.map((registration) =>
        addAddressPadding(bigintToHex(registration.Registration?.game_token_id))
      ),
    [registrations]
  );

  const { data: tokenOwners } = useGetTokenOwnerQuery(
    indexAddress(gameAddress.toString()),
    tokenIds ?? []
  );

  const { entities: scores } = useGetGameScoresInListQuery({
    namespace: gameNamespace,
    gameIds: tokenIds ?? [],
    isSepolia: isSepolia,
  });

  console.log(scores, tokenIds);

  const currentScores = useMemo(() => {
    if (!scores) return {};
    return scores.reduce(
      (acc: Record<string, { score: number; playerName: string }>, entity) => {
        if (entity?.TokenMetadata?.token_id) {
          acc[entity?.TokenMetadata?.token_id] = {
            score: entity.Score?.score,
            playerName: feltToString(entity.TokenMetadata?.player_name),
          };
        }
        return acc;
      },
      {}
    );
  }, [scores]);

  console.log(currentScores);

  // const { entities: gameMetadata } = useGetGameMetadataInListQuery({
  //   nameSpace: gameNamespace,
  //   gameIds: tokenIds ?? [],
  // });

  useEffect(() => {
    setShowParticipants(entryCount > 0);
  }, [entryCount]);

  const ownerAddresses = useMemo(
    () => tokenOwners?.map((owner) => owner.account_address),
    [tokenOwners]
  );

  const { usernames } = useGetUsernames(ownerAddresses ?? []);

  return (
    <Card
      variant="outline"
      borderColor="rgba(0, 218, 163, 1)"
      className={`w-1/2 transition-all duration-300 ease-in-out ${
        showParticipants ? "h-[200px]" : "h-[60px]"
      }`}
    >
      <div className="flex flex-col justify-between">
        <div className="flex flex-row justify-between h-8">
          <span className="font-astronaut text-2xl">Scores</span>
          {showParticipants && entryCount > 5 && (
            <Pagination
              totalPages={entryCount}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
          <div className="flex flex-row items-center gap-2">
            {entryCount > 0 && (
              <>
                <span className="text-neutral-500">
                  {showParticipants ? "Hide" : "Show Participants"}
                </span>
                <Switch
                  checked={showParticipants}
                  onCheckedChange={setShowParticipants}
                />
              </>
            )}
            <div className="flex flex-row items-center font-astronaut text-2xl">
              <span className="w-10">
                <USER />
              </span>
              : {entryCount}
            </div>
          </div>
        </div>
        <div
          className={`transition-all duration-300 delay-150 ease-in-out ${
            showParticipants ? "h-auto opacity-100" : "h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="w-full h-0.5 bg-retro-green/25 mt-2" />
          <div className="flex flex-col py-2">
            {registrations?.map((registration, index) => (
              <div key={index} className="flex flex-row items-center gap-2">
                <span className="w-4 flex-none">
                  {index + 1 + (currentPage - 1) * 5}.
                </span>
                <span className="w-6 flex-none">
                  <USER />
                </span>
                <span className="flex-none">
                  {
                    currentScores[registration.Registration?.game_token_id]
                      ?.playerName
                  }
                </span>
                -
                <div className="relative flex-none">
                  <span className="text-retro-green-dark">
                    {usernames?.get(
                      indexAddress(tokenOwners?.[index]?.account_address)
                    ) || displayAddress(tokenOwners?.[index]?.account_address)}
                  </span>
                  <span className="absolute -top-2 -right-3 flex items-center justify-center rounded-lg bg-retro-green-dark text-black h-4 w-4 text-[10px]">
                    {registration.Registration?.entry_number}
                  </span>
                </div>
                <p
                  className="flex-1 h-[2px] bg-repeat-x"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, currentColor 1px, transparent 1px)",
                    backgroundSize: "8px 8px",
                    backgroundPosition: "0 center",
                  }}
                ></p>
                <span className="flex-none text-retro-green">
                  {currentScores[registration.Registration?.game_token_id]
                    ?.score ?? 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ScoreTable;
