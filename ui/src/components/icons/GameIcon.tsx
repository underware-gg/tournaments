import { getOptimizedImageUrl } from "@/lib/utils/imageOptimization";

interface GameIconProps {
  image: string;
  size?: number;
  alt?: string;
}

const GameIcon = ({ image, size = 6, alt = "Game icon" }: GameIconProps) => {
  const pixelSize = size * 4;
  const optimizedImageUrl = getOptimizedImageUrl(image, pixelSize);

  return image ? (
    <img
      src={optimizedImageUrl}
      alt={alt}
      loading="lazy"
      height={pixelSize}
      width={pixelSize}
      style={{ height: `${pixelSize}px`, width: "auto" }}
    />
  ) : null;
};

export default GameIcon;
