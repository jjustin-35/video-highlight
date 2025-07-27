import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "./styled";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  buttonRef?: React.RefObject<HTMLButtonElement>;
}

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  buttonRef,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";
  const buttonStyles = buttonVariants({ variant, size, className });
  return (
    <Comp
      className={buttonStyles}
      ref={buttonRef}
      {...props}
    />
  );
};

export default Button;
