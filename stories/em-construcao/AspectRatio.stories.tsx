import type { Meta, StoryObj } from "@storybook/react-vite"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { banner } from "../../sandbox/art"
import { Opcao, Opcoes, pagina, vitrine } from "../componentes/Opcoes"

// As proporções dos exemplos do shadcn: paisagem, quadrado e retrato. No código, `ratio` aceita qualquer número.
const proporcoes = { "16 / 9": 16 / 9, "4 / 3": 4 / 3, "1 / 1": 1, "9 / 16": 9 / 16 } as const
type Proporcao = keyof typeof proporcoes
const imagem = banner("#fa6300", "#462a71", "")

const quadro = (ratio: number) => (
  <AspectRatio ratio={ratio} className="overflow-hidden rounded-3xl bg-muted">
    <img src={imagem} alt="Capa" className="size-full object-cover" />
  </AspectRatio>
)

type Controles = { proporcao: Proporcao }

const meta = {
  title: "Em construção/AspectRatio",
  render: ({ proporcao }) => quadro(proporcoes[proporcao]),
  parameters: pagina("Caixa que mantém a proporção entre largura e altura, como 16 / 9, para imagens e vídeos. A largura vem do pai; a altura sai da proporção.", "/fotos/capa.png"),
  argTypes: {
    proporcao: { name: "Ratio", control: "inline-radio", options: Object.keys(proporcoes), description: "No código, `ratio`, um número: `16 / 9`, `1` ou `9 / 16`.", table: { category: "Aparência" } },
  },
  args: { proporcao: "16 / 9" },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia) => <div className="w-64"><Historia /></div>],
}

export const Proporcoes: Story = {
  name: "Ratio",
  parameters: vitrine("Os exemplos do shadcn: paisagem, quadrado e retrato. A largura é a mesma; muda a altura."),
  render: () => <Opcoes>{(Object.keys(proporcoes) as Proporcao[]).map((p) => <Opcao key={p} nome={p}><div className="w-32">{quadro(proporcoes[p])}</div></Opcao>)}</Opcoes>,
}
