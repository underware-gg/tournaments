import { getGames } from "@/assets/games";
import { TOKEN } from "@/components/Icons";

interface TokenGameIconProps {
  game: keyof ReturnType<typeof getGames>;
  size?: "xs" | "sm" | "md" | "lg";
  tokenColor?: string;
}

const TokenGameIcon = ({
  game,
  size = "sm",
  tokenColor = "text-retro-green/25",
}: TokenGameIconProps) => {
  const games = getGames();
  const Icon = games[game].Icon;
  const sizeClasses = {
    xs: "size-5",
    sm: "size-8",
    md: "size-10",
    lg: "size-16",
  };
  return (
    <span className="relative inline-flex items-center justify-center">
      <span className={`${tokenColor} ${sizeClasses[size]}`}>
        <TOKEN />
      </span>
      <span className="absolute inset-0 flex items-center justify-center">
        {Icon && <Icon className={`h-[50%] w-auto`} />}
      </span>
    </span>
  );
};

export default TokenGameIcon;
