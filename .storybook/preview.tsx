import { withThemeByClassName } from "@storybook/addon-themes"
import type { Preview } from "@storybook/react-vite"
import { create } from "storybook/theming/create"

import "../src/index.css"
import { TooltipProvider } from "../src/components/ui/tooltip"

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    // Mostra as violações sem reprovar: branco sobre laranja é uma exceção da marca.
    a11y: { test: "todo" },
    docs: {
      theme: create({
        base: "light",
        fontBase: '"Poppins", sans-serif',
        colorPrimary: "#fa6300",
        colorSecondary: "#462a71",
      }),
    },
    options: {
      storySort: { order: ["Fundamentos", ["Cores", "Tipografia"], "Componentes"] },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: { Claro: "light", Escuro: "dark" },
      defaultTheme: "Claro",
    }),
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
}

export default preview
