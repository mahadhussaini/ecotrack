import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'eco' | 'glass'
  inputSize?: 'default' | 'sm' | 'lg'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', inputSize = 'default', leftIcon, rightIcon, error, ...props }, ref) => {
    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
            variant === 'eco' && "border-eco-200 focus-visible:ring-eco-500 focus-visible:border-eco-500",
            variant === 'glass' && "glass border-white/20 focus-visible:border-white/40",
            inputSize === 'sm' && "h-8 px-2 text-xs",
            inputSize === 'lg' && "h-12 px-4 text-base",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-error-500 focus-visible:ring-error-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input } 