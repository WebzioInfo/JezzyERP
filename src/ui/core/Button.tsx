import * as React from "react"
import { cn } from "@/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success"
    size?: "sm" | "md" | "lg" | "icon"
    loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
        const variants = {
            primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-xs",
            secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-xs",
            outline: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-xs",
            ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            danger: "bg-red-500 text-white hover:bg-red-600 shadow-xs",
            success: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-xs",
        }

        const sizes = {
            sm: "h-8 px-3 text-xs gap-1.5 rounded-md font-medium",
            md: "h-9 px-4 text-sm gap-2 rounded-md font-medium",
            lg: "h-10 px-5 text-sm gap-2 rounded-md font-medium",
            icon: "h-9 w-9 p-0 rounded-md",
        }

        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
              >
                {loading ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : null}
                <span className="relative z-10 flex items-center justify-center gap-[inherit]">{children}</span>
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button }

