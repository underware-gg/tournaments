import React, { useState } from "react";
import {
  getOptimizedImageUrl,
  generatePlaceholderUrl,
} from "@/lib/utils/imageOptimization";
import { cn } from "@/lib/utils";

interface OptimizedImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  quality?: number;
  usePlaceholder?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  quality = 80,
  usePlaceholder = true,
  objectFit = "cover",
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Get optimized image URL
  const optimizedSrc = getOptimizedImageUrl(src, width || 0, quality);

  // Get placeholder image for blur-up loading effect
  const placeholderSrc = usePlaceholder ? generatePlaceholderUrl(src, 10) : "";

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        width: width ? `${width}px` : "auto",
        height: height ? `${height}px` : "auto",
      }}
    >
      {usePlaceholder && !isLoaded && !hasError && (
        <img
          src={placeholderSrc}
          alt=""
          className="absolute inset-0 w-full h-full blur-sm transition-opacity"
          style={{ objectFit }}
          aria-hidden="true"
        />
      )}

      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full transition-opacity duration-300",
          !isLoaded && "opacity-0",
          isLoaded && "opacity-100"
        )}
        style={{ objectFit }}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
