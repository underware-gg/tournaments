import * as React from "react";
import PressableBorderImage from "@/components/icons/PressableBorderImage";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, adjustColorOpacity } from "@/lib/utils";

const cardVariants = cva(
  "inline-flex flex-col gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors [border-style:solid] [border-image-slice:4] [border-image-width:4px] relative hover:cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-retro-green text-black hover:bg-retro-green/90 border-2",
        destructive: "bg-red-500 text-neutral-50 hover:bg-red-500/90",
        outline: `bg-black text-retro-green hover:bg-retro-green/10 border-2 border-retro-green`,
      },
      size: {
        default: "h-48 p-4",
        sm: "p-3",
        lg: "p-8",
        xl: "p-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  borderColor?: string;
  isClickable?: boolean; // Add this to make the press effect optional
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      size,
      borderColor = "rgba(0, 140, 105, 1)",
      children,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);

    // Generate the border image dynamically
    const borderImage = `url("data:image/svg+xml,${PressableBorderImage({
      color: isHovered ? adjustColorOpacity(borderColor, 0.9) : borderColor,
      isPressed: false,
    })}")`;

    return (
      <div
        className={cn(cardVariants({ variant, size, className }))}
        ref={ref}
        style={{
          borderImageSource: `${borderImage}`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export { Card, cardVariants };
