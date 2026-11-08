import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ReactNode } from "react"

import { Slider } from "@/components/ui/slider"
import { Opcao, Opcoes, Simula, estadoDe, pagina, vitrine, type Interacao } from "./Opcoes"

const orientacoes = ["horizontal", "vertical"] as const
type Orientacao = (typeof orientacoes)[number]
const interacoes: Interacao[] = ["Default", "Hover"]
const pino = "[data-slot=slider-thumb]"
// Um número por pino: o Slider desenha um pino para cada valor.
const valores = { 1: [50], 2: [25, 75], 3: [10, 40, 70] } as const
type Pinos = keyof typeof valores

type Controles = { orientation: Orientacao; pinos: Pinos; estado: Interacao; disabled: boolean }

// O Slider preenche o pai no sentido da orientação: a moldura dá esse tamanho.
const moldura = (orientacao: Orientacao, slider: ReactNode) => <div className={orientacao === "vertical" ? "h-40" : "w-full min-w-48"}>{slider}</div>

const meta = {
  title: "Componentes/Slider",
  render: ({ orientation, pinos, disabled }) => (
    <Slider key={pinos} defaultValue={[...valores[pinos]]} orientation={orientation === "horizontal" ? undefined : orientation} disabled={disabled || undefined} aria-label="Volume" />
  ),
  parameters: pagina("Escolhe um número, ou uma faixa entre números, arrastando um pino. Não tem Size: a trilha tem 8 px de espessura e o comprimento preenche o pai."),
  argTypes: {
    orientation: { name: "Orientation", control: "inline-radio", options: orientacoes, description: "No código, `orientation`.", table: { category: "Aparência" } },
    pinos: { name: "Pinos", control: "inline-radio", options: [1, 2, 3], description: "Quantos números o `value` (ou `defaultValue`) recebe, como `[25, 75]`. A trilha pinta do primeiro ao último pino.", table: { category: "Conteúdo" } },
    estado: { name: "State", control: "inline-radio", options: interacoes, description: "Simulado, no primeiro pino. O foco do teclado não aparece no código.", table: { category: "Estado" } },
    disabled: { name: "Disabled", control: "boolean", description: "`disabled`: impede a mudança e esmaece.", table: { category: "Estado" } },
  },
  args: { orientation: "horizontal", pinos: 1, estado: "Default", disabled: false },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia, { args }) => moldura(args.orientation, <Simula estado={estadoDe(args)} so={pino}><Historia /></Simula>)],
}

export const Orientacoes: Story = {
  name: "Orientation",
  parameters: vitrine("No código, `orientation`. Sem a propriedade, o Slider é `horizontal`."),
  render: () => <Opcoes>{orientacoes.map((o) => <Opcao key={o} nome={o}>{moldura(o, <Slider defaultValue={[50]} orientation={o} aria-label="Volume" />)}</Opcao>)}</Opcoes>,
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Hover simulado."),
  render: () => (
    <Opcoes>
      {interacoes.map((e) => <Opcao key={e} nome={e}>{moldura("horizontal", <Simula estado={e} so={pino}><Slider defaultValue={[50]} aria-label="Volume" /></Simula>)}</Opcao>)}
      <Opcao nome="Disabled">{moldura("horizontal", <Slider defaultValue={[50]} disabled aria-label="Volume" />)}</Opcao>
    </Opcoes>
  ),
}

export const Valores: Story = {
  name: "Pinos",
  parameters: vitrine("Um pino escolhe um número; dois, uma faixa; três ou mais, várias faixas."),
  render: () => <Opcoes>{([1, 2, 3] as const).map((n) => <Opcao key={n} nome={`${n} ${n === 1 ? "pino" : "pinos"}`}>{moldura("horizontal", <Slider defaultValue={[...valores[n]]} aria-label="Faixa" />)}</Opcao>)}</Opcoes>,
}
