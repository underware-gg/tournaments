import { TOKEN, QUESTION } from "@/components/Icons";

interface TokenGameIconProps {
  image: string;
  size?: "xs" | "sm" | "md" | "lg";
  tokenColor?: string;
}

const TokenGameIcon = ({
  image,
  size = "sm",
  tokenColor = "text-brand/25",
}: TokenGameIconProps) => {
  const tokenSizeClasses = {
    xs: "size-5 3xl:size-6",
    sm: "size-8 3xl:size-10",
    md: "size-10 3xl:size-12",
    lg: "size-16 3xl:size-20",
  };
  const gameSizeClasses = {
    xs: "size-4 3xl:size-5",
    sm: "size-6 3xl:size-8",
    md: "size-8 3xl:size-10",
    lg: "size-12 3xl:size-16",
  };
  return (
    <span className="relative inline-flex items-center justify-center">
      <span className={`${tokenColor} ${tokenSizeClasses[size]}`}>
        <TOKEN />
      </span>
      <span className="absolute inset-0 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt="game-logo"
            className={`${gameSizeClasses[size]}`}
          />
        ) : (
          <span className="w-full h-full">
            <QUESTION />
          </span>
        )}
      </span>
    </span>
  );
};

export default TokenGameIcon;
