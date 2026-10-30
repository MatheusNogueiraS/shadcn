import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-(--gap-2xs) rounded-4xl text-label-sm whitespace-nowrap transition-colors outline-none hover:bg-muted hover:text-default focus-visible:border-focus focus-visible:ring-[3px] focus-visible:ring-focus-subtle disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-danger-subtle aria-pressed:bg-muted [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-field bg-transparent hover:bg-muted",
      },
      size: {
        default:
          "h-9 min-w-9 px-(--padding-lg) has-data-[icon=inline-end]:pr-(--padding-md) has-data-[icon=inline-start]:pl-(--padding-md)",
        sm: "h-8 min-w-8 px-(--padding-lg) has-data-[icon=inline-end]:pr-(--padding-sm) has-data-[icon=inline-start]:pl-(--padding-sm)",
        lg: "h-10 min-w-10 px-(--padding-2xl) has-data-[icon=inline-end]:pr-(--padding-lg) has-data-[icon=inline-start]:pl-(--padding-lg)",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
