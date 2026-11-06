import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cn } from "@/lib/utils"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-(--gap-lg)", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-(--size-md) shrink-0 rounded-full border-sm border-transparent bg-control/90 outline-none group-has-[:focus-visible]/field-label:border-transparent group-has-[:focus-visible]/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-focus focus-visible:ring-xl focus-visible:ring-focus-subtle data-disabled:cursor-not-allowed data-disabled:opacity-50 aria-invalid:border-invalid aria-invalid:ring-xl aria-invalid:ring-danger-subtle data-checked:bg-brand data-checked:text-on-brand dark:data-checked:bg-brand",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-(--size-md) items-center justify-center"
      >
        <span className="absolute top-1/2 left-1/2 size-(--size-3xs) -translate-x-1/2 -translate-y-1/2 rounded-full bg-on-brand dark:size-(--size-2xs)" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
