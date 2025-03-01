import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import PressableBorderImage from "@/components/icons/PressableBorderImage";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 [border-style:solid] [border-image-slice:4] [border-image-width:4px] relative active:top-[2px] active:left-[2px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-black hover:bg-primary/90 border-2",
        destructive: "bg-destructive text-neutral-50 hover:opacity-90 border-2",
        outline:
          "bg-black text-primary hover:bg-primary/10 border-2 border-primary",
        tab: "[border-image-width:4px_4px_0_4px]",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-5 min-w-5 p-1 rounded-md [&_svg]:size-3 [border-image-width:2px] text-xs",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        xl: "h-14 px-5 [&_svg]:size-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const [isPressed, setIsPressed] = React.useState(false);

    // Generate the border image dynamically
    const borderImage = `url("data:image/svg+xml,${PressableBorderImage({
      isPressed: isPressed,
      variant: variant,
    })}")`;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={{
          borderImageSource: borderImage,
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
