import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // EcoTrack custom variants
        eco: "border-transparent bg-eco-100 text-eco-800 dark:bg-eco-900 dark:text-eco-100",
        success: "border-transparent bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-100",
        warning: "border-transparent bg-warning-100 text-warning-600 dark:bg-warning-900 dark:text-warning-100",
        error: "border-transparent bg-error-100 text-error-600 dark:bg-error-900 dark:text-error-100",
        gradient: "border-transparent bg-eco-gradient text-white",
        glass: "glass text-foreground border-white/20",
        "eco-outline": "border-eco-500 text-eco-500 hover:bg-eco-50 dark:hover:bg-eco-900/20",
      },
      size: {
        default: "text-xs",
        sm: "text-xs px-2 py-0.5",
        lg: "text-sm px-3 py-1",
      },
      animation: {
        none: "",
        pulse: "animate-pulse-eco",
        bounce: "animate-bounce-eco",
        glow: "animate-glow",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

function Badge({ className, variant, size, animation, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, animation }), className)} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </div>
  )
}

export { Badge, badgeVariants } 