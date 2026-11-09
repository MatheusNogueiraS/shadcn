import type { Meta, StoryObj } from "@storybook/react-vite"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { banner } from "../../sandbox/art"
import { Opcao, Opcoes, Simula, pagina, vitrine, type Interacao } from "../componentes/Opcoes"

const orientacoes = ["vertical", "horizontal"] as const
type Orientacao = (typeof orientacoes)[number]
const interacoes: Interacao[] = ["Default", "Focus"]
const versoes = Array.from({ length: 30 }, (_, i) => `v1.${30 - i}.0`)
const capas = [["#fa6300", "#462a71", "Verão"], ["#462a71", "#fa6300", "Inverno"], ["#0f766e", "#462a71", "Outono"], ["#fa6300", "#0f766e", "Primavera"]] as const

type Controles = { orientacao: Orientacao; estado: Interacao }

const lista = (
  <ScrollArea className="h-56 w-48 rounded-3xl border-sm">
    <div className="p-(--padding-lg)">
      <p className="mb-(--gap-lg) text-label-sm">Versões</p>
      {versoes.map((v) => <div key={v}><div className="text-body-sm">{v}</div><Separator className="my-(--gap-sm)" /></div>)}
    </div>
  </ScrollArea>
)

const galeria = (
  <ScrollArea className="w-64 rounded-3xl border-sm whitespace-nowrap">
    <div className="flex w-max gap-(--gap-lg) p-(--padding-lg)">
      {capas.map(([de, para, nome]) => (
        <figure key={nome} className="shrink-0">
          <img src={banner(de, para, "")} alt={nome} className="aspect-3/4 w-28 rounded-2xl object-cover" />
          <figcaption className="pt-(--padding-xs) text-body-xs text-muted">{nome}</figcaption>
        </figure>
      ))}
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
)

const meta = {
  title: "Em construção/ScrollArea",
  render: ({ orientacao }) => (orientacao === "vertical" ? lista : galeria),
  parameters: pagina("Área com rolagem própria e uma barra fina no lugar da barra do navegador. A altura ou a largura vem da classe: o que passar dela rola.", "/fotos/capa.png"),
  argTypes: {
    orientacao: { name: "Orientation", control: "inline-radio", options: orientacoes, description: "A barra vertical já vem no ScrollArea. Para rolar para o lado, acrescente `<ScrollBar orientation=\"horizontal\" />`.", table: { category: "Aparência" } },
    estado: { name: "State", control: "inline-radio", options: interacoes, description: "Simulado. Focada pelo teclado, a área ganha o anel de foco e rola pelas setas.", table: { category: "Estado" } },
  },
  args: { orientacao: "vertical", estado: "Default" },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia, { args }) => <Simula estado={args.estado} so="[data-slot=scroll-area-viewport]"><Historia /></Simula>],
}

export const Orientacoes: Story = {
  name: "Orientation",
  parameters: vitrine("Os exemplos do shadcn: uma lista que rola para baixo e uma galeria que rola para o lado."),
  render: () => (
    <Opcoes>
      <Opcao nome="vertical">{lista}</Opcao>
      <Opcao nome="horizontal">{galeria}</Opcao>
    </Opcoes>
  ),
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Focus simulado: o anel aparece por dentro da borda."),
  render: () => (
    <Opcoes>
      {interacoes.map((e) => <Opcao key={e} nome={e}><Simula estado={e} so="[data-slot=scroll-area-viewport]">{lista}</Simula></Opcao>)}
    </Opcoes>
  ),
}
