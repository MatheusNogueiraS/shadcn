import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

const attachmentVariants = cva(
  "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-4xl border-sm bg-surface text-default transition-colors focus-within:ring-sm focus-within:ring-focus-subtle has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-danger/30 data-[state=success]:border-success/30 data-[state=idle]:border-dashed",
  {
    variants: {
      size: {
        default:
          "gap-(--gap-sm) rounded-5xl p-(--padding-lg) text-body-sm data-[orientation=horizontal]:has-data-[slot=attachment-content]:px-(--padding-2xl)",
        sm: "gap-(--gap-md) p-(--padding-md) text-body-xs data-[orientation=horizontal]:has-data-[slot=attachment-content]:px-(--padding-lg)",
        xs: "gap-(--gap-xs) rounded-3xl p-(--padding-xs) text-body-xs data-[orientation=horizontal]:has-data-[slot=attachment-content]:px-(--padding-sm)",
      },
      orientation: {
        horizontal: "min-w-40 items-center",
        vertical: "w-24 flex-col has-data-[slot=attachment-content]:w-30",
      },
    },
  }
)

function Attachment({
  className,
  state = "ready",
  size = "default",
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof attachmentVariants> & {
    state?: "idle" | "uploading" | "processing" | "error" | "ready" | "success"
  }) {
  return (
    <div
      data-slot="attachment"
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      className={cn(attachmentVariants({ size, orientation }), className)}
      {...props}
    />
  )
}

const attachmentMediaVariants = cva(
  "relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-muted text-default group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-2xl group-data-[state=error]/attachment:bg-danger/10 group-data-[state=error]/attachment:text-danger group-data-[state=success]/attachment:bg-success/10 group-data-[state=success]/attachment:text-success group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-(--size-xl)! [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-(--size-md) group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-(--size-xl) group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-(--size-sm)",
  {
    variants: {
      variant: {
        icon: "",
        image:
          "opacity-60 group-data-[state=ready]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 group-data-[state=success]/attachment:opacity-100 *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  }
)

function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof attachmentMediaVariants>) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(attachmentMediaVariants({ variant }), className)}
      {...props}
    />
  )
}

function AttachmentContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-content"
      className={cn(
        "max-w-full min-w-0 flex-1 group-data-[orientation=vertical]/attachment:px-(--padding-xs)",
        className
      )}
      {...props}
    />
  )
}

function AttachmentTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-title"
      className={cn(
        "block max-w-full min-w-0 truncate text-label-sm group-data-[size=sm]/attachment:text-label-xs group-data-[size=xs]/attachment:text-label-xs group-data-[state=processing]/attachment:shimmer group-data-[state=uploading]/attachment:shimmer",
        className
      )}
      {...props}
    />
  )
}

function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-description"
      className={cn(
        "mt-(--gap-3xs) block min-w-0 truncate text-body-xs text-muted group-data-[state=error]/attachment:text-danger/80",
        "max-w-full",
        className
      )}
      {...props}
    />
  )
}

function AttachmentActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-actions"
      className={cn(
        "relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:right-3 group-data-[orientation=vertical]/attachment:gap-(--gap-2xs)",
        className
      )}
      {...props}
    />
  )
}

function AttachmentAction({
  className,
  variant,
  size = "icon-xs",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="attachment-action"
      variant={variant ?? "ghost"}
      size={size}
      className={cn(className)}
      {...props}
    />
  )
}

function AttachmentTrigger({
  className,
  render,
  type,
  ...props
}: useRender.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: render ? type : (type ?? "button"),
        className: cn("absolute inset-0 z-10 outline-none", className),
      },
      props
    ),
    render,
    state: {
      slot: "attachment-trigger",
    },
  })
}

function AttachmentGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-group"
      className={cn(
        "flex min-w-0 scroll-fade-x snap-x snap-mandatory scroll-px-1 scrollbar-none gap-(--gap-lg) overflow-x-auto overscroll-x-contain py-(--padding-2xs) *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start",
        className
      )}
      {...props}
    />
  )
}

export {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
}
