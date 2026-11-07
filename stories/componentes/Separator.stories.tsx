import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ReactNode } from "react"

import { Separator } from "@/components/ui/separator"
import { Opcao, Opcoes, pagina, vitrine } from "./Opcoes"

const orientacoes = ["horizontal", "vertical"] as const
type Orientacao = (typeof orientacoes)[number]

// A borda tracejada é o pai: a linha vai de uma ponta à outra dele, no sentido da orientação.
const moldura = (orientacao: Orientacao, separador: ReactNode) =>
  orientacao === "vertical" ? (
    <div className="flex h-10 items-center gap-(--gap-sm) border-sm border-dashed px-(--padding-sm) text-body-sm">Pix{separador}Boleto</div>
  ) : (
    <div className="w-40 space-y-(--gap-sm) border-sm border-dashed py-(--padding-sm) text-body-sm">
      <p className="px-(--padding-sm)">Pix</p>{separador}<p className="px-(--padding-sm)">Boleto</p>
    </div>
  )

const meta = {
  title: "Componentes/Separator",
  render: ({ orientation }) => <Separator orientation={orientation === "horizontal" ? undefined : orientation} />,
  parameters: pagina("Linha que separa grupos de conteúdo, em menus, listas e formulários. Não tem Size: a espessura é sempre 1 px, e o comprimento preenche o pai."),
  argTypes: {
    orientation: {
      name: "Orientation",
      control: "inline-radio",
      options: orientacoes,
      description: "No código, `orientation`. Horizontal ocupa toda a largura do pai; vertical, toda a altura. Na amostra, o pai é a borda tracejada.",
      table: { category: "Aparência" },
    },
  },
  args: { orientation: "horizontal" },
} satisfies Meta<{ orientation: Orientacao }>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia, { args }) => moldura(args.orientation, <Historia />)],
}

export const Orientacoes: Story = {
  name: "Orientation",
  parameters: vitrine("A espessura é sempre 1 px. O comprimento preenche o pai, marcado pela borda tracejada."),
  render: () => <Opcoes>{orientacoes.map((o) => <Opcao key={o} nome={o}>{moldura(o, <Separator orientation={o} />)}</Opcao>)}</Opcoes>,
}
