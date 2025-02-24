import Header from "@/components/Header";
import Overview from "@/containers/Overview";
import Tournament from "@/containers/Tournament";
import CreateTournament from "@/containers/CreateTournament";
import RegisterToken from "@/containers/RegisterToken";
import Play from "@/containers/Play";
import { Routes, Route } from "react-router-dom";
import { useGetTokensQuery } from "@/dojo/hooks/useSdkQueries";
import {
  useGetGameNamespaces,
  useGetGamesMetadata,
  useGetUpcomingTournamentsCount,
} from "@/dojo/hooks/useSqlQueries";
import { addAddressPadding } from "starknet";
import { bigintToHex } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { useDojo } from "@/context/dojo";
import useUIStore from "@/hooks/useUIStore";
import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
function App() {
  const { nameSpace } = useDojo();
  const { setGameData } = useUIStore();

  useGetTokensQuery();

  const currentTime = Math.floor(Date.now() / 1000);
  const formattedTime = addAddressPadding(bigintToHex(currentTime));

  useGetUpcomingTournamentsCount({
    namespace: nameSpace,
    currentTime: formattedTime,
  });

  const { data: gameNamespaces } = useGetGameNamespaces();

  const formattedGameNamespaces = gameNamespaces?.map(
    (namespace) => namespace.namespace
  );

  const { data: gamesMetadata } = useGetGamesMetadata({
    gameNamespaces: formattedGameNamespaces || [],
  });

  useEffect(() => {
    if (gamesMetadata) {
      setGameData(gamesMetadata);
    }
  }, [gamesMetadata]);

  return (
    <TooltipProvider>
      <div className="min-h-screen flex-col w-full">
        <Header />
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/tournament">
            <Route path=":id" element={<Tournament />} />
          </Route>
          <Route path="/create-tournament" element={<CreateTournament />} />
          <Route path="/register-token" element={<RegisterToken />} />
          <Route path="/play" element={<Play />} />
        </Routes>
        <Toaster />
      </div>
    </TooltipProvider>
  );
}

export default App;
