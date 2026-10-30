# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
pnpm dlx shadcn@latest add button
```

This project uses the `base-luma` style. UI components are placed in
`src/components/ui`.

The Data Table guide builds on the Table component and `@tanstack/react-table`.
Date Picker is composed from Calendar and Popover. The Typography documentation
now covers Typeset, which is configured separately rather than added as a UI
component.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```
