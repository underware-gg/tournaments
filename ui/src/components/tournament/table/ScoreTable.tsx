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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HoverCardContent } from "@/components/ui/hover-card";
import { HoverCard } from "@/components/ui/hover-card";
import { HoverCardTrigger } from "@/components/ui/hover-card";

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
  const { nameSpace } = useDojo();

  const offset = (currentPage - 1) * 5;

  const { data: leaderboard, loading } = useGetTournamentLeaderboard({
    namespace: nameSpace,
    tournamentId: tournamentId,
    gameNamespace: gameNamespace,
    gameAddress: indexAddress(gameAddress?.toString() ?? "0x0"),
    gameScoreModel: gameScoreModel,
    gameScoreAttribute: gameScoreAttribute,
    limit: 5,
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

  console.log(isEnded);

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
          {!loading ? (
            <div className="flex flex-row py-2">
              {[0, 1].map((colIndex) => (
                <div key={colIndex} className="flex flex-col w-1/2">
                  {leaderboard
                    ?.slice(colIndex * 5, colIndex * 5 + 5)
                    .map((registration, index) => (
                      <HoverCard key={index} openDelay={50} closeDelay={0}>
                        <HoverCardTrigger asChild>
                          <div className="flex flex-row items-center gap-2 pr-2 hover:cursor-pointer hover:bg-retro-green/25 hover:border-retro-green/30 border border-transparent rounded transition-all duration-200">
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
                            <span className="flex-none max-w-20 group-hover:text-retro-green transition-colors duration-200">
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
                              <span className="flex-none text-retro-green font-astronaut">
                                {registration.score ?? 0}
                              </span>
                            </div>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent
                          className="w-60 py-4 px-0 text-sm z-50"
                          align="start"
                          alignOffset={-75}
                          side="top"
                          sideOffset={10}
                        >
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2 px-4">
                              <div className="flex flex-row gap-2">
                                <span className="text-retro-green-dark">
                                  Player Name:
                                </span>
                                <span>
                                  {feltToString(registration?.player_name)}
                                </span>
                              </div>
                              <div className="flex flex-row gap-2">
                                <span className="text-retro-green-dark">
                                  Owner:
                                </span>
                                <span>
                                  {usernames?.get(
                                    ownerAddresses?.[index] ?? ""
                                  ) ||
                                    displayAddress(
                                      ownerAddresses?.[index] ?? ""
                                    )}
                                </span>
                              </div>
                            </div>
                            <div className="w-full h-0.5 bg-retro-green/50" />
                            {registration?.metadata !== "" ? (
                              <img
                                src={JSON.parse(registration?.metadata)?.image}
                                alt="metadata"
                                className="w-full h-auto px-4"
                              />
                            ) : (
                              <span className="text-center text-neutral-500">
                                No Token URI
                              </span>
                            )}
                            {isEnded && (
                              <Tooltip delayDuration={50}>
                                <TooltipTrigger asChild>
                                  <div className="absolute top-2 right-2 w-8 text-retro-green hover:cursor-pointer">
                                    {registration.has_submitted ? (
                                      <VERIFIED />
                                    ) : (
                                      <QUESTION />
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="border-retro-green-dark bg-black text-neutral-500">
                                  {registration.has_submitted
                                    ? "Submitted"
                                    : "Not submitted"}
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
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
    </Card>
  );
};

export default ScoreTable;
