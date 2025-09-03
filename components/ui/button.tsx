import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const buttonVariants = {
  variant: {
    default:
      "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
    destructive:
      "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
    outline:
      "border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
    secondary:
      "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
    ghost:
      "text-gray-700 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 dark:text-gray-300 dark:hover:bg-gray-800",
    link: "text-indigo-600 underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:text-indigo-400",
  },
  size: {
    default: "h-9 px-4 py-2",
    sm: "h-8 px-3 py-1.5 text-sm",
    lg: "h-11 px-6 py-2.5",
    icon: "h-9 w-9 p-0",
  },
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant
  size?: keyof typeof buttonVariants.size
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    const baseClasses =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none"
    const variantClasses = buttonVariants.variant[variant]
    const sizeClasses = buttonVariants.size[size]

    return (
      <Comp
        className={cn(baseClasses, variantClasses, sizeClasses, className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
