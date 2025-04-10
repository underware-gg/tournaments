import Header from "@/components/Header";
import MobileFooter from "@/components/MobileFooter";
import Overview from "@/containers/Overview";
import Tournament from "@/containers/Tournament";
import CreateTournament from "@/containers/CreateTournament";
import RegisterToken from "@/containers/RegisterToken";
import Play from "@/containers/Play";
import {
  Routes,
  Route,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useGetTokensQuery } from "@/dojo/hooks/useSdkQueries";
import { Toaster } from "@/components/ui/toaster";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useNetwork } from "@starknet-react/core";
import { useDojo } from "@/context/dojo";
import useUIStore from "./hooks/useUIStore";
import {
  useGetgameNamespaces,
  useGetGamesMetadata,
} from "./dojo/hooks/useSqlQueries";
import { processGameMetadataFromSql } from "./lib/utils/formatting";
import { getGames } from "./assets/games";

const NotFound = React.lazy(() => import("@/containers/NotFound"));

function App() {
  const { namespace } = useDojo();
  const { chain } = useNetwork();
  const navigate = useNavigate();
  const location = useLocation();
  const previousChainRef = useRef<string | undefined>(chain?.id.toString());
  const { setGameData, setGameDataLoading } = useUIStore();

  useGetTokensQuery(namespace);

  useEffect(() => {
    if (chain) {
      // Check if chain has changed
      const currentChainId = chain.id.toString();
      if (
        previousChainRef.current &&
        previousChainRef.current !== currentChainId
      ) {
        // Chain has changed, redirect to overview page
        // Only redirect if not already on the overview page
        if (location.pathname !== "/") {
          navigate("/", { replace: true });
        }
      }

      // Update the previous chain ref
      previousChainRef.current = currentChainId;
    }
  }, [chain, navigate, location.pathname]);

  const { data: gameNamespaces } = useGetgameNamespaces();

  const formattedgameNamespaces = gameNamespaces?.map(
    (namespace) => namespace.namespace
  );

  const { data: gamesMetadata, loading: isGamesMetadataLoading } =
    useGetGamesMetadata({
      gameNamespaces: formattedgameNamespaces || [],
    });

  const formattedGamesMetadata = useMemo(
    () => gamesMetadata?.map((game) => processGameMetadataFromSql(game)),
    [gamesMetadata]
  );

  const whitelistedGames = getGames();

  // Create a unified array of all games with flags
  const allGames = useMemo(() => {
    if (!formattedGamesMetadata) return [];

    // Create maps for faster lookups
    const metadataMap = new Map();
    formattedGamesMetadata.forEach((game) => {
      metadataMap.set(game.contract_address, game);
    });

    const whitelistedMap = new Map();
    whitelistedGames.forEach((game) => {
      whitelistedMap.set(game.contract_address, game);
    });

    // Collect all unique contract addresses
    const allAddresses = new Set([
      ...metadataMap.keys(),
      ...whitelistedMap.keys(),
    ]);

    // Create the unified array
    return Array.from(allAddresses).map((address) => {
      const metadata = metadataMap.get(address);
      const whitelisted = whitelistedMap.get(address);

      return {
        ...whitelisted,
        ...metadata,
        // TODO: Remove this once we have a proper image for the dark shuffle game
        image: metadata?.image
          ? metadata?.contract_address ===
            "0x0444834e7b71749832f0db8c64f17ed1c3af8462c1682c10dcd6068b1c57494b"
            ? "https://darkshuffle.io/favicon.svg"
            : metadata?.image
          : whitelisted?.image,
        // Add flags
        isWhitelisted: !!whitelisted,
        existsInMetadata: !!metadata,
      };
    });
  }, [formattedGamesMetadata, whitelistedGames]);

  // Store the stringified version of allGames to detect actual changes
  const allGamesStringified = useMemo(() => {
    try {
      return JSON.stringify(allGames);
    } catch (e) {
      return "";
    }
  }, [allGames]);

  // Store the previous stringified version to compare
  const prevAllGamesStringifiedRef = useRef("");

  // // Use a separate effect for loading state
  useEffect(() => {
    setGameDataLoading(isGamesMetadataLoading);
  }, [isGamesMetadataLoading, setGameDataLoading]);

  // Use a separate effect for setting game data
  useEffect(() => {
    // Only update if allGames has changed (by comparing stringified versions)
    if (
      allGames.length > 0 &&
      allGamesStringified !== prevAllGamesStringifiedRef.current
    ) {
      prevAllGamesStringifiedRef.current = allGamesStringified;
      setGameData(allGames);
    }
  }, [allGamesStringified, allGames, setGameData]);

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen h-screen overflow-hidden">
        <Header />
        <main className="flex-1 px-4 pt-4 xl:px-10 xl:pt-10 2xl:px-20 2xl:pt-20 overflow-hidden">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/tournament">
              <Route
                path=":id"
                element={
                  <ErrorBoundary
                    fallback={
                      <React.Suspense>
                        <NotFound message="Something went wrong rendering the tournament" />
                      </React.Suspense>
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
            <Route
              path="*"
              element={
                <React.Suspense>
                  <NotFound />
                </React.Suspense>
              }
            />
          </Routes>
        </main>
        <MobileFooter />
        <Toaster />
      </div>
    </TooltipProvider>
  );
}

function TournamentWrapper() {
  const { id } = useParams();
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    try {
      if (id) BigInt(id);
    } catch (error) {
      setHasError(true);
      setErrorMessage(`Invalid tournament ID format: ${id}`);
    }
  }, [id]);

  if (hasError) {
    return (
      <React.Suspense fallback={<div>Loading error page...</div>}>
        <NotFound message={errorMessage} />
      </React.Suspense>
    );
  }

  return <Tournament />;
}
export default App;
