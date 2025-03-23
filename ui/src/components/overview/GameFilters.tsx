import { getGames } from "@/assets/games";
import useUIStore from "@/hooks/useUIStore";
import {
  useGetGameNamespaces,
  useGetGamesMetadata,
} from "@/dojo/hooks/useSqlQueries";
import { useEffect, useState, useMemo, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { processGameMetadataFromSql } from "@/lib/utils/formatting";
import { GameButton } from "@/components/overview/gameFilters/GameButton";

const GameFilters = () => {
  const { gameFilters, setGameFilters, setGameData } = useUIStore();
  const [loading, setLoading] = useState(true);

  const { data: gameNamespaces } = useGetGameNamespaces();

  const formattedGameNamespaces = gameNamespaces?.map(
    (namespace) => namespace.namespace
  );

  const { data: gamesMetadata, loading: isGamesMetadataLoading } =
    useGetGamesMetadata({
      gameNamespaces: formattedGameNamespaces || [],
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
            "0x0320f977f47f0885e376b781d9e244d9f59f10154ce844ae1815c919f0374726"
            ? "https://darkshuffle.io/favicon.svg"
            : metadata?.image
          : whitelisted?.image,
        // Add flags
        isWhitelisted: !!whitelisted,
        existsInMetadata: !!metadata,
      };
    });
  }, [formattedGamesMetadata, whitelistedGames]);

  // Use a ref to track the previous metadata loading state
  const prevLoadingRef = useRef(isGamesMetadataLoading);
  // Use a ref to track if we've already set the game data
  const hasSetGameDataRef = useRef(false);

  useEffect(() => {
    // Only update when loading state changes from true to false
    const loadingJustFinished =
      prevLoadingRef.current && !isGamesMetadataLoading;
    prevLoadingRef.current = isGamesMetadataLoading;

    // If metadata just finished loading and we haven't set game data yet
    if (loadingJustFinished && !hasSetGameDataRef.current && allGames) {
      setGameData(allGames);
      setLoading(false);
      hasSetGameDataRef.current = true;
    }
  }, [isGamesMetadataLoading, allGames, setGameData]);

  return (
    <div className="hidden sm:flex flex-col gap-4 w-1/5">
      {!loading ? (
        allGames.map((game) => (
          <GameButton
            key={game.contract_address}
            game={game}
            gameFilters={gameFilters}
            setGameFilters={setGameFilters}
          />
        ))
      ) : (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 })?.map((_, index) => (
            <Skeleton key={index} className="h-12 3xl:h-20 w-full" />
          ))}
        </div>
      )}
    </div>
  );
};

export default GameFilters;
