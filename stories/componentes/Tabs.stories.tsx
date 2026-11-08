import type { Meta, StoryObj } from "@storybook/react-vite"
import { BarcodeIcon, QrCodeIcon } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Opcao, Opcoes, Simula, estadoDe, pagina, vitrine, type Interacao } from "./Opcoes"

const variantes = ["default", "line"] as const
const orientacoes = ["horizontal", "vertical"] as const
const interacoes: Interacao[] = ["Default", "Hover", "Focus"]
// Os estados aparecem na segunda aba: a primeira é a ativa.
const inativa = "[data-slot=tabs-trigger]:not([data-active])"

type Controles = { variant: (typeof variantes)[number]; orientation: (typeof orientacoes)[number]; icone: boolean; estado: Interacao; disabled: boolean }

const abas = ({ variant, orientation, disabled }: Partial<Controles> = {}) => (
  <Tabs defaultValue="pix" orientation={orientation}>
    <TabsList variant={variant}>
      <TabsTrigger value="pix">Pix</TabsTrigger>
      <TabsTrigger value="boleto" disabled={disabled}>Boleto</TabsTrigger>
    </TabsList>
  </Tabs>
)

const meta = {
  title: "Componentes/Tabs",
  render: ({ variant, orientation, icone, disabled }) => (
    <Tabs defaultValue="pix" orientation={orientation === "horizontal" ? undefined : orientation}>
      <TabsList variant={variant === "default" ? undefined : variant}>
        <TabsTrigger value="pix">{icone && <QrCodeIcon data-icon="inline-start" />}Pix</TabsTrigger>
        <TabsTrigger value="boleto" disabled={disabled || undefined}>{icone && <BarcodeIcon data-icon="inline-start" />}Boleto</TabsTrigger>
      </TabsList>
      <TabsContent value="pix">Aprovado na hora.</TabsContent>
      <TabsContent value="boleto">Aprovado em até 3 dias úteis.</TabsContent>
    </Tabs>
  ),
  parameters: pagina("Abas que trocam o conteúdo mostrado no mesmo lugar, uma de cada vez. Não tem Size: a lista tem 36 px de altura."),
  argTypes: {
    variant: { name: "Type", control: "inline-radio", options: variantes, description: "No código, `variant` do `TabsList`.", table: { category: "Aparência" } },
    orientation: { name: "Orientation", control: "inline-radio", options: orientacoes, description: "No código, `orientation` do `Tabs`. Na vertical, as abas ficam em coluna, ao lado do conteúdo.", table: { category: "Aparência" } },
    icone: { name: "Ícone", control: "boolean", description: "O atributo `data-icon` reduz o padding do lado do ícone.", table: { category: "Conteúdo" } },
    estado: { name: "State", control: "inline-radio", options: interacoes, description: "Simulado, na aba Boleto. Hover só muda a aba que não está ativa.", table: { category: "Estado" } },
    disabled: { name: "Disabled", control: "boolean", description: "`disabled` na aba Boleto: impede a troca e esmaece.", table: { category: "Estado" } },
  },
  args: { variant: "default", orientation: "horizontal", icone: false, estado: "Default", disabled: false },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  // Largura fixa: sem ela, a amostra se recentraliza a cada troca de aba, porque os textos têm larguras diferentes.
  decorators: [(Historia, { args }) => <div className="w-80"><Simula estado={estadoDe(args)} so={inativa}><Historia /></Simula></div>],
}

export const Tipos: Story = {
  name: "Type",
  parameters: vitrine("No código, `variant`. Sem a propriedade, o TabsList é `default`. No `line`, a aba ativa ganha um traço embaixo."),
  render: () => <Opcoes>{variantes.map((v) => <Opcao key={v} nome={v}>{abas({ variant: v })}</Opcao>)}</Opcoes>,
}

export const Orientacoes: Story = {
  name: "Orientation",
  parameters: vitrine("No código, `orientation`. Sem a propriedade, o Tabs é `horizontal`."),
  render: () => <Opcoes>{orientacoes.map((o) => <Opcao key={o} nome={o}>{abas({ orientation: o })}</Opcao>)}</Opcoes>,
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Hover e Focus simulados, na aba Boleto. A aba Pix mostra a ativa."),
  render: () => (
    <Opcoes>
      {interacoes.map((e) => <Opcao key={e} nome={e}><Simula estado={e} so={inativa}>{abas()}</Simula></Opcao>)}
      <Opcao nome="Disabled">{abas({ disabled: true })}</Opcao>
    </Opcoes>
  ),
}

export const ComIcone: Story = {
  name: "Com ícone",
  parameters: vitrine("O atributo `data-icon` reduz o padding do lado do ícone."),
  render: () => (
    <Opcoes>
      <Opcao nome="inline-start"><Tabs defaultValue="pix"><TabsList><TabsTrigger value="pix"><QrCodeIcon data-icon="inline-start" />Pix</TabsTrigger></TabsList></Tabs></Opcao>
      <Opcao nome="inline-end"><Tabs defaultValue="pix"><TabsList><TabsTrigger value="pix">Pix<QrCodeIcon data-icon="inline-end" /></TabsTrigger></TabsList></Tabs></Opcao>
    </Opcoes>
  ),
}
