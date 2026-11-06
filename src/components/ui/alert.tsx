import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "group/alert relative grid w-full gap-(--gap-3xs) rounded-3xl border-sm px-(--padding-2xl) py-(--padding-lg) text-left text-body-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-[4.5rem] has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-(--gap-md) *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-(--size-md)",
  {
    variants: {
      variant: {
        default: "bg-surface text-default",
        destructive:
          "bg-surface text-danger *:data-[slot=alert-description]:text-danger/90 *:[svg]:text-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "text-label-sm group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-default",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-body-sm text-balance text-muted md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-default [&_p:not(:last-child)]:mb-(--gap-2xl)",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2.5 right-3", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
