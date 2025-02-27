import * as React from "react";
import BorderImage from "@/components/icons/BorderImage";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, adjustColorOpacity } from "@/lib/utils";

const cardVariants = cva(
  "inline-flex flex-col gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors [border-style:solid] [border-image-slice:4] [border-image-width:4px] relative",
  {
    variants: {
      variant: {
        default: "bg-retro-green text-black border-2",
        destructive: "bg-red-500 text-neutral-50",
        outline: `bg-black text-retro-green border-2 border-retro-green`,
      },
      size: {
        default: "h-48 p-2 sm:p-4",
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

const interactiveVariants = {
  default: "hover:bg-retro-green/90 hover:cursor-pointer",
  destructive: "hover:bg-red-500/90 hover:cursor-pointer",
  outline: "hover:bg-retro-green/10 hover:cursor-pointer",
} as const;

const disabledVariants = {
  default: "opacity-50 cursor-not-allowed",
  destructive: "opacity-50 cursor-not-allowed",
  outline: "opacity-50 cursor-not-allowed",
} as const;

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  borderColor?: string;
  interactive?: boolean;
  disabled?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      size,
      borderColor = "rgba(0, 140, 105, 1)",
      interactive = false,
      disabled = false,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      onClick?.(e);
    };

    // Generate the border image dynamically
    const borderImage = `url("data:image/svg+xml,${BorderImage({
      color:
        interactive && isHovered
          ? adjustColorOpacity(borderColor, 0.9)
          : borderColor,
    })}")`;

    return (
      <div
        className={cn(
          cardVariants({ variant, size, className }),
          interactive && variant ? interactiveVariants[variant] : "",
          disabled && variant ? disabledVariants[variant] : ""
        )}
        ref={ref}
        style={{
          borderImageSource: `${borderImage}`,
        }}
        onMouseEnter={() => interactive && setIsHovered(true)}
        onMouseLeave={() => interactive && setIsHovered(false)}
        onClick={handleClick}
        {...(disabled ? { "aria-disabled": true } : {})}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export { Card, cardVariants };
