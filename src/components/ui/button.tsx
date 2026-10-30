import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-5xl border border-transparent bg-clip-padding text-label-sm whitespace-nowrap transition-all outline-none select-none focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus-subtle active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-invalid aria-invalid:ring-3 aria-invalid:ring-danger-subtle [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-brand text-on-brand hover:bg-brand-hover",
        outline:
          "border-default bg-page hover:bg-muted hover:text-default aria-expanded:bg-muted aria-expanded:text-default dark:bg-transparent dark:hover:bg-control/30",
        secondary:
          "bg-brand-secondary text-on-brand hover:bg-brand-secondary-hover aria-expanded:bg-brand-secondary aria-expanded:text-on-brand",
        ghost:
          "hover:bg-muted hover:text-default aria-expanded:bg-muted aria-expanded:text-default dark:hover:bg-muted/50",
        destructive:
          "bg-danger-subtle text-danger hover:bg-danger/20 focus-visible:border-danger/40 focus-visible:ring-danger-subtle dark:hover:bg-danger/30",
        link: "text-brand underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-(--gap-xs) px-(--padding-lg) has-data-[icon=inline-end]:pr-(--padding-md) has-data-[icon=inline-start]:pl-(--padding-md)",
        xs: "h-6 gap-(--gap-2xs) px-(--padding-md) text-label-xs has-data-[icon=inline-end]:pr-(--padding-sm) has-data-[icon=inline-start]:pl-(--padding-sm) [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-(--gap-2xs) px-(--padding-lg) has-data-[icon=inline-end]:pr-(--padding-sm) has-data-[icon=inline-start]:pl-(--padding-sm)",
        lg: "h-10 gap-(--gap-xs) px-(--padding-2xl) has-data-[icon=inline-end]:pr-(--padding-lg) has-data-[icon=inline-start]:pl-(--padding-lg)",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
