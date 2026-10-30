import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-themes",
    "@storybook/addon-a11y",
  ],
  framework: "@storybook/react-vite",
  core: { disableTelemetry: true },
  // O padrão não entende os tipos gerados pelo cva e mostra variant e size como "unknown".
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: { tsconfigPath: "tsconfig.app.json" },
  },
}

export default config
