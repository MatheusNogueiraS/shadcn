import type { Meta, StoryObj } from "@storybook/react-vite"

import { Skeleton } from "@/components/ui/skeleton"
import { pagina } from "./Opcoes"

const meta = {
  title: "Componentes/Skeleton",
  render: () => <Skeleton className="h-4 w-48" />,
  parameters: pagina("Ocupa o lugar de um conteúdo que ainda está carregando, dentro de qualquer componente. Não tem Type, Size nem State: a forma vem do `className`, com a altura e a largura do que ele substitui."),
} satisfies Meta

export default meta

export const Padrao: StoryObj<typeof meta> = { name: "Padrão" }
