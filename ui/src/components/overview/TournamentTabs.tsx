import { TournamentTab } from "./TournamentTab";
import { GLOBE, FLAG, MINUS, TROPHY } from "@/components/Icons";

type TabType = "all" | "live" | "ended" | "my";

interface TournamentTabsProps {
  selectedTab: TabType;
  setSelectedTab: (tab: TabType) => void;
  upcomingTournamentsCount?: number;
  liveTournamentsCount?: number;
  endedTournamentsCount?: number;
}

const TournamentTabs = ({
  selectedTab,
  setSelectedTab,
  upcomingTournamentsCount,
  liveTournamentsCount,
  endedTournamentsCount,
}: TournamentTabsProps) => {
  return (
    <div className="flex flex-row gap-2">
      <TournamentTab
        selected={selectedTab === "all"}
        onClick={() => setSelectedTab("all")}
        icon={<GLOBE />}
        label="All Tournaments"
        count={upcomingTournamentsCount}
      />
      <TournamentTab
        selected={selectedTab === "live"}
        onClick={() => setSelectedTab("live")}
        icon={<FLAG />}
        label="Live Tournaments"
        count={liveTournamentsCount}
      />
      <TournamentTab
        selected={selectedTab === "ended"}
        onClick={() => setSelectedTab("ended")}
        icon={<MINUS />}
        label="Ended Tournaments"
        count={endedTournamentsCount}
      />
      <TournamentTab
        selected={selectedTab === "my"}
        onClick={() => setSelectedTab("my")}
        icon={<TROPHY />}
        label="My Tournaments"
      />
    </div>
  );
};

export default TournamentTabs;
