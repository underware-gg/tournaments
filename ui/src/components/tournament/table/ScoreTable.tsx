import { Card } from "@/components/ui/card";
import Pagination from "@/components/table/Pagination";
import { USER, VERIFIED, QUESTION } from "@/components/Icons";
import { useState, useEffect, useMemo } from "react";
import { Switch } from "@/components/ui/switch";
import { BigNumberish } from "starknet";
import { useGetTournamentLeaderboard } from "@/dojo/hooks/useSqlQueries";
import { displayAddress, feltToString, indexAddress } from "@/lib/utils";
import { useDojo } from "@/context/dojo";
import { useGetUsernames } from "@/hooks/useController";
import RowSkeleton from "./RowSkeleton";
import { HoverCardContent } from "@/components/ui/hover-card";
import { HoverCard } from "@/components/ui/hover-card";
import { HoverCardTrigger } from "@/components/ui/hover-card";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ScoreTableProps {
  tournamentId: BigNumberish;
  entryCount: number;
  gameAddress: BigNumberish;
  gameNamespace: string;
  gameScoreModel: string;
  gameScoreAttribute: string;
  isEnded: boolean;
}

const ScoreTable = ({
  tournamentId,
  entryCount,
  gameAddress,
  gameNamespace,
  gameScoreModel,
  gameScoreAttribute,
  isEnded,
}: ScoreTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showParticipants, setShowParticipants] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [isMobileDialogOpen, setIsMobileDialogOpen] = useState(false);
  const { nameSpace } = useDojo();

  const offset = (currentPage - 1) * 10;

  const { data: leaderboard, loading } = useGetTournamentLeaderboard({
    namespace: nameSpace,
    tournamentId: tournamentId,
    gameNamespace: gameNamespace,
    gameAddress: indexAddress(gameAddress?.toString() ?? "0x0"),
    gameScoreModel: gameScoreModel,
    gameScoreAttribute: gameScoreAttribute,
    limit: 10,
    offset: offset,
  });

  const ownerAddresses = useMemo(
    () => leaderboard?.map((registration) => registration?.account_address),
    [leaderboard]
  );

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
      <div className="w-full h-0.5 bg-primary/50" />
      {registration?.metadata !== "" ? (
        <img
          src={JSON.parse(registration?.metadata)?.image}
          alt="metadata"
          className="w-full h-auto px-4"
        />
      ) : (
        <span className="text-center text-neutral-500">No Token URI</span>
      )}
      {isEnded && (
        <div className="flex items-center gap-2 justify-center mt-2">
          <span className="text-primary">
            {registration.has_submitted ? <VERIFIED /> : <QUESTION />}
          </span>
          <span>
            {registration.has_submitted ? "Submitted" : "Not submitted"}
          </span>
        </div>
      )}
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
        <div className="flex flex-row justify-between h-6 sm:h-8">
          <span className="font-astronaut text-lg sm:text-2xl">Scores</span>
          {showParticipants && entryCount > 10 && (
            <Pagination
              totalPages={Math.ceil(entryCount / 10)}
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
            <div className="flex flex-row py-2">
              {[0, 1].map((colIndex) => (
                <div key={colIndex} className="flex flex-col w-1/2">
                  {leaderboard
                    ?.slice(colIndex * 5, colIndex * 5 + 5)
                    .map((registration, index) => (
                      <div key={index}>
                        {/* Desktop hover card (hidden on mobile) */}
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
                                <p
                                  className="flex-1 h-[2px] bg-repeat-x"
                                  style={{
                                    backgroundImage:
                                      "radial-gradient(circle, currentColor 1px, transparent 1px)",
                                    backgroundSize: "8px 8px",
                                    backgroundPosition: "0 center",
                                  }}
                                ></p>
                                <div className="flex flex-row items-center gap-2">
                                  <span className="flex-none text-primary font-astronaut">
                                    {registration.score ?? 0}
                                  </span>
                                </div>
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
                          <p
                            className="flex-1 h-[2px] bg-repeat-x"
                            style={{
                              backgroundImage:
                                "radial-gradient(circle, currentColor 1px, transparent 1px)",
                              backgroundSize: "8px 8px",
                              backgroundPosition: "0 center",
                            }}
                          ></p>
                          <div className="flex flex-row items-center gap-2">
                            <span className="flex-none text-primary font-astronaut">
                              {registration.score ?? 0}
                            </span>
                          </div>
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

export default ScoreTable;
