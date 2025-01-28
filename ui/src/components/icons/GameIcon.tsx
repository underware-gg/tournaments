import Games from "@/assets/games";

interface GameIconProps {
  game: keyof typeof Games;
  size?: number;
}

const GameIcon = ({ game, size = 6 }: GameIconProps) => {
  const Icon = Games[game].Icon;
  return Icon ? (
    <Icon style={{ height: `${size * 4}px`, width: "auto" }} />
  ) : null;
};

export default GameIcon;
