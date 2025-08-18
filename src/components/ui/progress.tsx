import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    variant?: 'default' | 'eco' | 'success' | 'warning' | 'error' | 'gradient'
    size?: 'default' | 'sm' | 'lg'
    animated?: boolean
  }
>(({ className, value, variant = 'default', size = 'default', animated = false, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
      size === 'sm' && "h-1",
      size === 'lg' && "h-3",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 transition-all duration-300 ease-out",
        variant === 'default' && "bg-primary",
        variant === 'eco' && "bg-eco-500",
        variant === 'success' && "bg-success-500",
        variant === 'warning' && "bg-warning-500",
        variant === 'error' && "bg-error-500",
        variant === 'gradient' && "bg-eco-gradient",
        animated && "animate-pulse-eco"
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress } 