import { getGames } from "@/assets/games";

interface GameIconProps {
  game: keyof ReturnType<typeof getGames>;
  size?: number;
}

const GameIcon = ({ game, size = 6 }: GameIconProps) => {
  const Icon = getGames()[game].Icon;
  return Icon ? (
    <Icon style={{ height: `${size * 4}px`, width: "auto" }} />
  ) : null;
};

export default GameIcon;
