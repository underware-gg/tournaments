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
import { HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { HoverCard } from "@/components/ui/hover-card";
import { DialogContent } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";

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
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [isMobileDialogOpen, setIsMobileDialogOpen] = useState(false);
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
    gameAddress: indexAddress(gameAddress?.toString() ?? "0x0"),
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

  // Function to render player details content
  const renderPlayerDetails = (registration: any, index: number) => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 px-4">
        <div className="flex flex-row gap-2">
          <span className="text-primary-dark">Player Name:</span>
          <span>{feltToString(registration?.player_name)}</span>
        </div>
        <div className="flex flex-row gap-2">
          <span className="text-primary-dark">Owner:</span>
          <span>
            {usernames?.get(ownerAddresses?.[index] ?? "") ||
              displayAddress(ownerAddresses?.[index] ?? "")}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <Card
      variant="outline"
      className={`sm:w-1/2 transition-all duration-300 ease-in-out ${
        showParticipants ? "h-[200px]" : "h-[45px] sm:h-[60px]"
      }`}
    >
      <div className="flex flex-col justify-between">
        <div className="flex flex-row justify-between h-8">
          <span className="font-astronaut text-lg sm:text-2xl">Entrants</span>
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
                  className="h-4 sm:h-6"
                />
              </>
            )}
            <div className="flex flex-row items-center font-astronaut text-lg sm:text-2xl">
              <span className="w-8 sm:w-10">
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
          <div className="w-full h-0.5 bg-primary/25 mt-2" />
          {!loading ? (
            <div className="flex flex-col py-2">
              {[0, 1].map((colIndex) => (
                <div key={colIndex} className="flex flex-col w-1/2">
                  {entrants
                    ?.slice(colIndex * 5, colIndex * 5 + 5)
                    .map((registration, index) => (
                      <div key={index}>
                        <div className="hidden sm:block">
                          <HoverCard openDelay={50} closeDelay={0}>
                            <HoverCardTrigger asChild>
                              <div className="flex flex-row items-center sm:gap-2 pr-2 hover:cursor-pointer hover:bg-primary/25 hover:border-primary/30 border border-transparent rounded transition-all duration-200">
                                <span className="w-4 flex-none font-astronaut">
                                  {index +
                                    1 +
                                    colIndex * 5 +
                                    (currentPage - 1) * 10}
                                  .
                                </span>
                                <span className="w-6 flex-none">
                                  <USER />
                                </span>
                                <span className="flex-none max-w-20 group-hover:text-primary transition-colors duration-200">
                                  {feltToString(registration?.player_name)}
                                </span>
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent
                              className="py-4 px-0 text-sm z-50"
                              align="center"
                              side="top"
                            >
                              {renderPlayerDetails(registration, index)}
                            </HoverCardContent>
                          </HoverCard>
                        </div>

                        {/* Mobile clickable row (hidden on desktop) */}
                        <div
                          className="sm:hidden flex flex-row items-center sm:gap-2 pr-2 hover:cursor-pointer hover:bg-primary/25 hover:border-primary/30 border border-transparent rounded transition-all duration-200"
                          onClick={() => {
                            setSelectedPlayer({ registration, index });
                            setIsMobileDialogOpen(true);
                          }}
                        >
                          <span className="w-4 flex-none font-astronaut">
                            {index + 1 + colIndex * 5 + (currentPage - 1) * 10}.
                          </span>
                          <span className="w-6 flex-none">
                            <USER />
                          </span>
                          <span className="flex-none max-w-20 group-hover:text-primary transition-colors duration-200">
                            {feltToString(registration?.player_name)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-row">
              {[0, 1].map((colIndex) => (
                <div key={colIndex} className="flex flex-col gap-1 py-2 w-1/2">
                  {[...Array(Math.min(entryCount - offset, 5))].map(
                    (_, index) => (
                      <RowSkeleton key={index} />
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile dialog for player details */}
      <Dialog open={isMobileDialogOpen} onOpenChange={setIsMobileDialogOpen}>
        <DialogContent className="sm:hidden bg-black border border-primary p-4 rounded-lg max-w-[90vw] mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-astronaut text-lg text-primary">
              Player Details
            </h3>
          </div>

          {selectedPlayer &&
            renderPlayerDetails(
              selectedPlayer.registration,
              selectedPlayer.index
            )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EntrantsTable;
