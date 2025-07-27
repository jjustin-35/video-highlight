import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { combineClass } from "@/helpers/combineClass"
import { badgeVariants } from "./styled"

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = ({ className, variant, ...props }: BadgeProps) => {
  return (
    <div className={combineClass(badgeVariants({ variant }), className)} {...props} />
  )
}

export default Badge;
