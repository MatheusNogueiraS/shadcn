import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowRightIcon, ArrowUpRightIcon, CheckIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Opcao, Opcoes, Simula, pagina, simulaEstado, vitrine, type Interacao } from "./Opcoes"

const variantes = ["default", "secondary", "destructive", "outline", "ghost", "link"] as const
const interacoes: Interacao[] = ["Default", "Hover"]

type Controles = { variant: (typeof variantes)[number]; texto: string; estado: Interacao; invalido: boolean }

const meta = {
  title: "Componentes/Badge",
  render: ({ variant, texto, invalido }) => (
    <Badge variant={variant === "default" ? undefined : variant} aria-invalid={invalido || undefined}>{texto}</Badge>
  ),
  parameters: pagina("Etiqueta curta para uma situação ou categoria, como \"Pago\" ou \"Novo\"."),
  argTypes: {
    variant: { name: "Type", control: "select", options: variantes, description: "No código, a propriedade `variant`.", table: { category: "Aparência" } },
    texto: { name: "Texto", control: "text", table: { category: "Conteúdo" } },
    estado: { name: "State", control: "inline-radio", options: interacoes, description: "Simulado: só `ghost` e `link` têm hover. Nos outros tipos, o hover e o foco só existem quando o Badge vira link.", table: { category: "Estado" } },
    invalido: { name: "Invalid", control: "boolean", description: "`aria-invalid`: borda de erro.", table: { category: "Estado" } },
  },
  args: { variant: "default", texto: "Novo", estado: "Default", invalido: false },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [simulaEstado],
}

export const Tipos: Story = {
  name: "Type",
  parameters: vitrine("No código, `variant`. Sem a propriedade, o Badge é `default`."),
  render: () => <Opcoes>{variantes.map((v) => <Opcao key={v} nome={v}><Badge variant={v}>Badge</Badge></Opcao>)}</Opcoes>,
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Hover simulado, no `ghost`. O foco só existe quando o Badge vira link, por isso não aparece."),
  render: () => (
    <Opcoes>
      <Opcao nome="Default"><Badge variant="ghost">Badge</Badge></Opcao>
      <Opcao nome="Hover"><Simula estado="Hover"><Badge variant="ghost">Badge</Badge></Simula></Opcao>
      <Opcao nome="Invalid"><Badge aria-invalid>Badge</Badge></Opcao>
    </Opcoes>
  ),
}

export const ComIcone: Story = {
  name: "Com ícone",
  parameters: vitrine("O atributo `data-icon` reduz o padding do lado do ícone."),
  render: () => (
    <Opcoes>
      <Opcao nome="inline-start"><Badge><CheckIcon data-icon="inline-start" /> Pago</Badge></Opcao>
      <Opcao nome="inline-end"><Badge>Ver <ArrowRightIcon data-icon="inline-end" /></Badge></Opcao>
    </Opcoes>
  ),
}

// O exemplo de cores do shadcn usa a paleta; aqui, os fundos suaves e os textos dos tokens. O vermelho é o tipo destructive.
const cores = [["Info", "bg-info-subtle text-info"], ["Sucesso", "bg-success-subtle text-success"], ["Aviso", "bg-warning-subtle text-warning"]] as const

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("Os exemplos do shadcn: cores pelo `className`, o Badge como link (com `render`, quando ganha hover e foco) e com Spinner."),
  render: () => (
    <Opcoes>
      <Opcao nome="Cores"><div className="flex flex-wrap justify-center gap-(--gap-sm)">{cores.map(([nome, classe]) => <Badge key={nome} className={classe}>{nome}</Badge>)}</div></Opcao>
      <Opcao nome="Como link"><Badge render={<a href="#badge" />}>Abrir <ArrowUpRightIcon data-icon="inline-end" /></Badge></Opcao>
      <Opcao nome="Como link · Hover"><Simula estado="Hover"><Badge render={<a href="#badge" />}>Abrir <ArrowUpRightIcon data-icon="inline-end" /></Badge></Simula></Opcao>
      <Opcao nome="Com Spinner"><div className="flex flex-wrap justify-center gap-(--gap-sm)"><Badge variant="destructive"><Spinner data-icon="inline-start" />Excluindo</Badge><Badge variant="secondary">Gerando<Spinner data-icon="inline-end" /></Badge></div></Opcao>
    </Opcoes>
  ),
}
