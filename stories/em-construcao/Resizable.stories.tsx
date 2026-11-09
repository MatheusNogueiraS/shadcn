import type { Meta, StoryObj } from "@storybook/react-vite"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Opcao, Opcoes, Simula, pagina, vitrine, type Interacao } from "../componentes/Opcoes"

const orientacoes = ["horizontal", "vertical"] as const
type Orientacao = (typeof orientacoes)[number]
const interacoes: Interacao[] = ["Default", "Focus"]

type Controles = { orientacao: Orientacao; alca: boolean; estado: Interacao }

const painel = (nome: string) => <div className="flex h-full items-center justify-center p-(--padding-2xl) text-label-sm">{nome}</div>

const grupo = ({ orientacao, alca }: Omit<Controles, "estado">) => (
  <ResizablePanelGroup key={orientacao} orientation={orientacao === "horizontal" ? undefined : orientacao} className="min-h-48 rounded-3xl border-sm">
    <ResizablePanel defaultSize="50">{painel("Um")}</ResizablePanel>
    <ResizableHandle withHandle={alca || undefined} />
    <ResizablePanel defaultSize="50">{painel("Dois")}</ResizablePanel>
  </ResizablePanelGroup>
)

const meta = {
  title: "Em construção/Resizable",
  render: (args) => grupo(args),
  parameters: pagina("Painéis lado a lado com uma divisória que se arrasta para mudar o tamanho de cada um. Pelo teclado, a divisória focada anda com as setas. O tamanho inicial de cada painel é `defaultSize`, em porcentagem quando é um texto sem unidade."),
  argTypes: {
    orientacao: { name: "Orientation", control: "inline-radio", options: orientacoes, description: "No código, `orientation` no `ResizablePanelGroup`. `vertical` empilha os painéis.", table: { category: "Aparência" } },
    alca: { name: "Alça", control: "boolean", description: "`withHandle` no `ResizableHandle`: um traço no meio da divisória, para mostrar que ela se arrasta.", table: { category: "Conteúdo" } },
    estado: { name: "State", control: "inline-radio", options: interacoes, description: "Simulado. Focada, a divisória ganha a linha de foco.", table: { category: "Estado" } },
  },
  args: { orientacao: "horizontal", alca: true, estado: "Default" },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia, { args }) => <div className="w-80"><Simula estado={args.estado} so="[data-slot=resizable-handle]"><Historia /></Simula></div>],
}

export const Orientacoes: Story = {
  name: "Orientation",
  parameters: vitrine("No código, `orientation`. Sem a propriedade, os painéis ficam lado a lado (`horizontal`)."),
  render: () => <Opcoes larga>{orientacoes.map((o) => <Opcao key={o} nome={o}><div className="w-full">{grupo({ orientacao: o, alca: true })}</div></Opcao>)}</Opcoes>,
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Com e sem alça, e o Focus simulado."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="Sem alça"><div className="w-full">{grupo({ orientacao: "horizontal", alca: false })}</div></Opcao>
      <Opcao nome="Com alça"><div className="w-full">{grupo({ orientacao: "horizontal", alca: true })}</div></Opcao>
      <Opcao nome="Focus"><div className="w-full"><Simula estado="Focus" so="[data-slot=resizable-handle]">{grupo({ orientacao: "horizontal", alca: true })}</Simula></div></Opcao>
    </Opcoes>
  ),
}

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("O exemplo do shadcn: um grupo dentro do outro, com uma barra lateral e o conteúdo dividido em cima e embaixo."),
  render: () => (
    <ResizablePanelGroup className="min-h-56 w-md rounded-3xl border-sm">
      <ResizablePanel defaultSize="40">{painel("Barra lateral")}</ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="60">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize="40">{painel("Topo")}</ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="60">{painel("Conteúdo")}</ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}
