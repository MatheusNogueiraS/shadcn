import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import { cn } from "@/lib/utils"

function Avatar({
  className,
  size = "default",
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: "default" | "sm" | "lg"
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-(--size-2xl) shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border-sm after:border-default after:mix-blend-darken data-[size=lg]:size-(--size-4xl) data-[size=sm]:size-(--size-xl) dark:after:mix-blend-lighten",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className
      )}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-body-sm text-muted group-data-[size=sm]/avatar:text-body-xs",
        className
      )}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-brand text-on-brand bg-blend-color ring-lg ring-page select-none",
        "group-data-[size=sm]/avatar:size-(--size-3xs) group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-(--size-2xs) group-data-[size=default]/avatar:[&>svg]:size-(--size-3xs)",
        "group-data-[size=lg]/avatar:size-(--size-xs) group-data-[size=lg]/avatar:[&>svg]:size-(--size-3xs)",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-lg *:data-[slot=avatar]:ring-page",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-(--size-2xl) shrink-0 items-center justify-center rounded-full bg-muted text-body-sm text-muted ring-lg ring-page group-has-data-[size=lg]/avatar-group:size-(--size-4xl) group-has-data-[size=sm]/avatar-group:size-(--size-xl) [&>svg]:size-(--size-md) group-has-data-[size=lg]/avatar-group:[&>svg]:size-(--size-lg) group-has-data-[size=sm]/avatar-group:[&>svg]:size-(--size-xs)",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
}
