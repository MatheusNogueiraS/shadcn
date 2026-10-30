import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-(--gap-2xs) overflow-hidden rounded-4xl border border-transparent px-(--padding-sm) py-(--padding-3xs) text-label-xs whitespace-nowrap transition-all focus-visible:border-focus focus-visible:ring-[3px] focus-visible:ring-focus/50 has-data-[icon=inline-end]:pr-(--padding-xs) has-data-[icon=inline-start]:pl-(--padding-xs) aria-invalid:border-danger aria-invalid:ring-danger-subtle [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-brand text-on-brand [a]:hover:bg-brand-hover",
        secondary:
          "bg-brand-secondary text-on-brand [a]:hover:bg-brand-secondary-hover",
        destructive:
          "bg-danger-subtle text-danger focus-visible:ring-danger-subtle [a]:hover:bg-danger/20",
        outline:
          "border-default text-default [a]:hover:bg-muted [a]:hover:text-muted",
        ghost:
          "hover:bg-muted hover:text-muted dark:hover:bg-muted/50",
        link: "text-brand underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
