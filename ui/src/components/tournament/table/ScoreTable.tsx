import { Card } from "@/components/ui/card";
import Pagination from "@/components/table/Pagination";
import { USER } from "@/components/Icons";
import { useState, useEffect, useMemo } from "react";
import { Switch } from "@/components/ui/switch";
import { addAddressPadding, BigNumberish } from "starknet";
import {
  useGetTokenOwnerQuery,
  useGetTournamentLeaderboard,
} from "@/dojo/hooks/useSqlQueries";
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
  const { selectedChainConfig, nameSpace } = useDojo();
  const isSepolia = selectedChainConfig.chainId === ChainId.SN_SEPOLIA;

  const { data: leaderboard } = useGetTournamentLeaderboard({
    namespace: nameSpace,
    tournamentId: tournamentId,
    gameNamespace: gameNamespace,
    isSepolia: isSepolia,
    limit: 5,
    offset: (currentPage - 1) * 5,
  });

  const tokenIds = useMemo(
    () =>
      leaderboard?.map((registration) =>
        addAddressPadding(bigintToHex(registration?.game_token_id!))
      ),
    [leaderboard]
  );

  const { data: tokenOwners } = useGetTokenOwnerQuery(
    indexAddress(gameAddress.toString()),
    tokenIds ?? []
  );

  console.log(tokenOwners, tokenIds, indexAddress(gameAddress.toString()));

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
      className={`w-1/2 transition-all duration-300 ease-in-out ${
        showParticipants ? "h-[200px]" : "h-[60px]"
      }`}
    >
      <div className="flex flex-col justify-between">
        <div className="flex flex-row justify-between h-8">
          <span className="font-astronaut text-2xl">Scores</span>
          {showParticipants && entryCount > 5 && (
            <Pagination
              totalPages={Math.ceil(entryCount / 5)}
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
            {leaderboard?.map((registration, index) => (
              <div key={index} className="flex flex-row items-center gap-2">
                <span className="w-4 flex-none">
                  {index + 1 + (currentPage - 1) * 5}.
                </span>
                <span className="w-6 flex-none">
                  <USER />
                </span>
                <span className="flex-none">
                  {feltToString(registration?.player_name)}
                </span>
                -
                <div className="relative flex-none">
                  <span className="text-retro-green-dark">
                    {usernames?.get(
                      indexAddress(tokenOwners?.[index]?.account_address ?? "")
                    ) ||
                      displayAddress(
                        tokenOwners?.[index]?.account_address ?? ""
                      )}
                  </span>
                  <div className="absolute -top-1 -right-8 flex items-center justify-center rounded-lg bg-retro-green-dark text-black h-4 w-6 text-[10px]">
                    <span>x</span>
                    <span>{registration?.entry_number?.toString()}</span>
                  </div>
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
                  {registration.score ?? 0}
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
