import * as React from "react"
import { cn } from "@/utils"

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-xs font-medium text-slate-700 block mb-1.5",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
