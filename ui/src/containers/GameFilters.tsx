import Games from "@/assets/games";
import { Button } from "@/components/ui/button";
import { TOKEN } from "@/components/Icons";

const GameFilters = () => {
  return (
    <div className="flex flex-col gap-4 w-1/5">
      {Object.entries(Games).map(([key, game]) => (
        <Button
          key={key}
          size={"xl"}
          variant="outline"
          className="text-2xl font-astronaut"
        >
          <span className="relative inline-flex items-center justify-center h-5 w-auto">
            <span className="text-retro-green">
              <TOKEN />
            </span>
            <span className="absolute inset-0 flex items-center justify-center">
              <game.Icon className="h-4 w-auto" />
            </span>
          </span>
          {game.name}
        </Button>
      ))}
    </div>
  );
};

export default GameFilters;
