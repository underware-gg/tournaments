import { getGames } from "@/assets/games";
import { Button } from "@/components/ui/button";
import useUIStore from "@/hooks/useUIStore";
import TokenGameIcon from "@/components/icons/TokenGameIcon";

const GameFilters = () => {
  const { gameFilters, setGameFilters, gameData } = useUIStore();
  return (
    <div className="flex flex-col gap-4 w-1/5">
      {Object.entries(getGames()).map(([key, game]) => (
        <Button
          key={key}
          size={"xl"}
          variant="outline"
          borderColor="rgba(0, 218, 163, 1)"
          className={`text-2xl font-astronaut ${
            gameFilters.includes(key) ? "bg-retro-green/25" : ""
          }`}
          onClick={() => {
            if (gameFilters.includes(key)) {
              // Remove the key if it exists
              setGameFilters(gameFilters.filter((filter) => filter !== key));
            } else {
              // Add the key if it doesn't exist
              setGameFilters([...gameFilters, key]);
            }
          }}
          disabled={!gameData.find((game) => game.contract_address === key)}
        >
          <TokenGameIcon game={key} />
          {game.name}
        </Button>
      ))}
    </div>
  );
};

export default GameFilters;
