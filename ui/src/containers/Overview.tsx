import { useState, useRef, useEffect, useMemo } from "react";
import { X, CHEVRON_DOWN } from "@/components/Icons";
import useUIStore from "@/hooks/useUIStore";
import { getGames } from "@/assets/games";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GameFilters from "@/components/overview/GameFilters";
import GameIcon from "@/components/icons/GameIcon";
import UpcomingTournaments from "@/components/overview/tournaments/UpcomingTournaments";
import MyTournaments from "@/components/overview/tournaments/MyTournaments";
import LiveTournaments from "@/components/overview/tournaments/LiveTournaments";
import TournamentTabs from "@/components/overview/TournamentTabs";
import {
  useGetUpcomingTournamentsCount,
  useGetLiveTournamentsCount,
  useGetEndedTournamentsCount,
} from "@/dojo/hooks/useSqlQueries";
import { bigintToHex } from "@/lib/utils";
import { addAddressPadding } from "starknet";

const Overview = () => {
  const [selectedTab, setSelectedTab] = useState<
    "all" | "my" | "live" | "ended"
  >("all");
  const { gameFilters, setGameFilters } = useUIStore();
  const [sortBy, setSortBy] = useState<string>("start");

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentTime = useMemo(() => {
    return addAddressPadding(bigintToHex(BigInt(Date.now()) / 1000n));
  }, []);

  const { data: upcomingTournamentsCount } =
    useGetUpcomingTournamentsCount(currentTime);

  const { data: liveTournamentsCount } =
    useGetLiveTournamentsCount(currentTime);

  const { data: endedTournamentsCount } =
    useGetEndedTournamentsCount(currentTime);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [gameFilters]); // Reset scroll when filters change

  const removeGameFilter = (filter: keyof ReturnType<typeof getGames>) => {
    setGameFilters(gameFilters.filter((f) => f !== filter));
  };

  const games = getGames();

  return (
    <div className="flex flex-row px-20 pt-20 gap-5 h-[calc(100vh-80px)]">
      <GameFilters />
      <div className="flex flex-col w-4/5 p-2">
        <div className="flex flex-row justify-between w-full border-b-4 border-retro-green">
          <TournamentTabs
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            upcomingTournamentsCount={upcomingTournamentsCount}
            liveTournamentsCount={liveTournamentsCount}
            endedTournamentsCount={endedTournamentsCount}
          />
          <div className="flex flex-row gap-4 items-center">
            Sort By:
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-black border-2 border-retro-grey px-2 min-w-[100px]">
                <div className="flex flex-row items-center justify-between capitalize w-full gap-2">
                  {sortBy}
                  <span className="w-6">
                    <CHEVRON_DOWN />
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black border-2 border-retro-grey">
                <DropdownMenuLabel className="text-retro-green">
                  Options
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-retro-green-dark" />
                <DropdownMenuItem
                  className="text-retro-green cursor-pointer"
                  onClick={() => setSortBy("start time")}
                >
                  Start Time
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-retro-green cursor-pointer"
                  onClick={() => setSortBy("end time")}
                >
                  End Time
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-retro-green cursor-pointer"
                  onClick={() => setSortBy("pot size")}
                >
                  Pot Size
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-retro-green cursor-pointer"
                  onClick={() => setSortBy("players")}
                >
                  Players
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-col overflow-hidden">
          <div
            className={`
            transition-[height] duration-300 ease-in-out
            ${gameFilters.length > 0 ? "h-[72px] py-2" : "h-0"}
          `}
          >
            {gameFilters.length > 0 && (
              <div className="flex flex-row items-center gap-4 p-4 h-[72px] overflow-x-auto w-full">
                {gameFilters.map((filter) => (
                  <div
                    key={filter}
                    className="flex flex-row items-center gap-4 bg-black border-2 border-retro-grey py-2 px-4 shrink-0"
                  >
                    <GameIcon game={filter} />
                    <span className="text-2xl font-astronaut">
                      {games[filter].name}
                    </span>
                    <span
                      className="w-6 h-6 text-retro-green-dark cursor-pointer"
                      onClick={() => removeGameFilter(filter)}
                    >
                      <X />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            ref={scrollContainerRef}
            className="grid grid-cols-3 gap-4 transition-all duration-300 ease-in-out py-4 overflow-y-auto"
          >
            {selectedTab === "all" ? (
              <UpcomingTournaments gameFilters={gameFilters} />
            ) : selectedTab === "live" ? (
              <LiveTournaments gameFilters={gameFilters} />
            ) : (
              <MyTournaments gameFilters={gameFilters} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
