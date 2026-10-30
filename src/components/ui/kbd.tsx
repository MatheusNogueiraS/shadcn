import { cn } from "@/lib/utils"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5.5 w-fit min-w-5.5 items-center justify-center gap-(--gap-2xs) rounded-lg bg-muted px-(--padding-xs) font-sans text-label-xs text-muted select-none in-data-[slot=input-group]:bg-control in-data-[slot=tooltip-content]:bg-page/20 in-data-[slot=tooltip-content]:text-inverse dark:in-data-[slot=tooltip-content]:bg-page/10 [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-(--gap-2xs)", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
