import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-4xl border border-transparent bg-control/50 px-(--padding-lg) py-(--padding-2xs) text-body-md transition-[color,box-shadow,background-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-label-sm file:text-default placeholder:text-muted focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus-subtle disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-invalid aria-invalid:ring-3 aria-invalid:ring-danger-subtle md:text-body-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
