import { getGames } from "@/assets/games";
import { Button } from "@/components/ui/button";
import useUIStore from "@/hooks/useUIStore";
import TokenGameIcon from "@/components/icons/TokenGameIcon";

const GameFilters = () => {
  const { gameFilters, setGameFilters, gameData } = useUIStore();
  return (
    <div className="flex flex-col gap-4 w-1/5">
      {Object.entries(getGames()).map(([key, game]) => {
        const isDisabled = !gameData.find(
          (game) => game.contract_address === key
        );
        return (
          <div key={key} className="relative w-full">
            <Button
              size={"xl"}
              variant="outline"
              borderColor="rgba(0, 218, 163, 1)"
              className={`text-2xl font-astronaut w-full ${
                gameFilters.includes(key) ? "bg-retro-green/25" : ""
              }`}
              onClick={() => {
                if (gameFilters.includes(key)) {
                  // Remove the key if it exists
                  setGameFilters(
                    gameFilters.filter((filter) => filter !== key)
                  );
                } else {
                  // Add the key if it doesn't exist
                  setGameFilters([...gameFilters, key]);
                }
              }}
              disabled={isDisabled}
            >
              <TokenGameIcon game={key} />
              {game.name}
            </Button>
            {isDisabled && (
              <div className="absolute top-1 right-2 flex items-center justify-center rounded-md">
                <span className="text-sm font-astronaut uppercase">
                  Coming Soon
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GameFilters;
