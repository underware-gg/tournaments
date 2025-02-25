import { Card } from "@/components/ui/card";
import Pagination from "@/components/table/Pagination";
import { USER } from "@/components/Icons";
import { useState, useEffect, useMemo } from "react";
import { Switch } from "@/components/ui/switch";
import { BigNumberish } from "starknet";
import { useGetTournamentEntrants } from "@/dojo/hooks/useSqlQueries";
import { displayAddress, feltToString, indexAddress } from "@/lib/utils";
import { useDojo } from "@/context/dojo";
import { useGetUsernames } from "@/hooks/useController";
import RowSkeleton from "./RowSkeleton";

interface EntrantsTableProps {
  tournamentId: BigNumberish;
  entryCount: number;
  gameAddress: BigNumberish;
  gameNamespace: string;
}

const EntrantsTable = ({
  tournamentId,
  entryCount,
  gameAddress,
  gameNamespace,
}: EntrantsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showParticipants, setShowParticipants] = useState(false);
  const { nameSpace } = useDojo();

  const offset = (currentPage - 1) * 5;

  const {
    data: entrants,
    refetch: refetchEntrants,
    loading,
  } = useGetTournamentEntrants({
    namespace: nameSpace,
    tournamentId: tournamentId,
    gameNamespace: gameNamespace,
    gameAddress: indexAddress(gameAddress.toString()),
    limit: 5,
    offset: offset,
  });

  const ownerAddresses = useMemo(
    () => entrants?.map((registration) => registration?.account_address),
    [entrants]
  );

  useEffect(() => {
    refetchEntrants();
  }, [entryCount]);

  useEffect(() => {
    setShowParticipants(entryCount > 0);
  }, [entryCount]);

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
          <span className="font-astronaut text-2xl">Entrants</span>
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
          {!loading ? (
            <div className="flex flex-col py-2">
              {entrants?.map((entrant, index) => (
                <div key={index} className="flex flex-row items-center gap-2">
                  <span className="w-4 flex-none">
                    {index + 1 + (currentPage - 1) * 5}.
                  </span>
                  <span className="w-6 flex-none">
                    <USER />
                  </span>
                  <span className="flex-none">
                    {feltToString(entrant?.player_name)}
                  </span>
                  -
                  <div className="relative flex-none">
                    <span className="text-retro-green-dark">
                      {usernames?.get(ownerAddresses?.[index] ?? "") ||
                        displayAddress(ownerAddresses?.[index] ?? "")}
                    </span>
                    <div className="absolute -top-1 -right-8 flex items-center justify-center rounded-lg bg-retro-green-dark text-black h-4 w-6 text-[10px]">
                      <span>x</span>
                      <span>{entrant?.entry_number?.toString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-1 py-2">
              {[...Array(entryCount - offset)].map((_, index) => (
                <RowSkeleton key={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EntrantsTable;
