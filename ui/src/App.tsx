import Header from "@/components/Header";
import Overview from "@/containers/Overview";
import Tournament from "@/containers/Tournament";
import CreateTournament from "@/containers/CreateTournament";
import RegisterToken from "@/containers/RegisterToken";
import Play from "@/containers/Play";
import { Routes, Route, useParams } from "react-router-dom";
import { useGetTokensQuery } from "@/dojo/hooks/useSdkQueries";
import {
  useGetGameNamespaces,
  useGetGamesMetadata,
} from "@/dojo/hooks/useSqlQueries";
import { Toaster } from "@/components/ui/toaster";
import useUIStore from "@/hooks/useUIStore";
import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import NotFound from "@/containers/NotFound";

function App() {
  const { setGameData } = useUIStore();

  useGetTokensQuery();

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
            <Route
              path=":id"
              element={
                <ErrorBoundary
                  fallback={
                    <NotFound message="Something went wrong rendering the tournament" />
                  }
                >
                  <TournamentWrapper />
                </ErrorBoundary>
              }
            />
          </Route>
          <Route path="/create-tournament" element={<CreateTournament />} />
          <Route path="/register-token" element={<RegisterToken />} />
          <Route path="/play" element={<Play />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster />
      </div>
    </TooltipProvider>
  );
}

function TournamentWrapper() {
  const { id } = useParams();

  try {
    if (id) BigInt(id);
  } catch (error) {
    return <NotFound message={`Invalid tournament ID format: ${id}`} />;
  }

  return <Tournament />;
}

export default App;
