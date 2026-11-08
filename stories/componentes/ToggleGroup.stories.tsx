import type { Meta, StoryObj } from "@storybook/react-vite"
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"
import type { ComponentProps } from "react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Opcao, Opcoes, pagina, vitrine } from "./Opcoes"

const variantes = ["default", "outline"] as const
const tamanhos = ["sm", "default", "lg"] as const
// Altura de cada tamanho em toggle.tsx (h-8, h-9, h-10), de onde o grupo tira o estilo.
const alturas = { sm: 32, default: 36, lg: 40 } as const
const orientacoes = ["horizontal", "vertical"] as const

type Controles = { variant: (typeof variantes)[number]; size: (typeof tamanhos)[number]; spacing: number; orientation: (typeof orientacoes)[number]; multiple: boolean; disabled: boolean }

// A chave recria o grupo quando o Multiple muda, porque o defaultValue só vale na primeira vez.
const grupo = ({ chave, ...props }: ComponentProps<typeof ToggleGroup> & { chave?: string } = {}) => (
  <ToggleGroup key={chave} defaultValue={props.multiple ? ["negrito", "italico"] : ["negrito"]} aria-label="Formatação" {...props}>
    <ToggleGroupItem value="negrito" aria-label="Negrito"><BoldIcon /></ToggleGroupItem>
    <ToggleGroupItem value="italico" aria-label="Itálico"><ItalicIcon /></ToggleGroupItem>
    <ToggleGroupItem value="sublinhado" aria-label="Sublinhado"><UnderlineIcon /></ToggleGroupItem>
  </ToggleGroup>
)

const meta = {
  title: "Componentes/Toggle Group",
  render: ({ variant, size, spacing, orientation, multiple, disabled }) =>
    grupo({ chave: String(multiple), variant: variant === "default" ? undefined : variant, size: size === "default" ? undefined : size, spacing: spacing === 2 ? undefined : spacing, orientation: orientation === "horizontal" ? undefined : orientation, multiple: multiple || undefined, disabled: disabled || undefined }),
  parameters: pagina("Grupo de Toggles do mesmo assunto, como negrito, itálico e sublinhado. O grupo define Type e Size de todos os itens; o Hover e o Focus de cada item estão na página do Toggle."),
  argTypes: {
    variant: { name: "Type", control: "inline-radio", options: variantes, description: "No código, `variant` do `ToggleGroup`, que vale para todos os itens.", table: { category: "Aparência" } },
    size: { name: "Size", control: "inline-radio", options: tamanhos, description: "No código, `size` do `ToggleGroup`, que vale para todos os itens.", table: { category: "Aparência" } },
    spacing: { name: "Spacing", control: { type: "number", min: 0, max: 8, step: 1 }, description: "No código, `spacing`: o espaço entre os itens, em passos de 4 px. Com 0, os itens se juntam num bloco só.", table: { category: "Aparência" } },
    orientation: { name: "Orientation", control: "inline-radio", options: orientacoes, description: "No código, `orientation`. Na vertical, os itens ficam em coluna, todos da mesma largura.", table: { category: "Aparência" } },
    multiple: { name: "Multiple", control: "boolean", description: "`multiple`: vários itens selecionados ao mesmo tempo. Sem ele, selecionar um tira a seleção do outro.", table: { category: "Comportamento" } },
    disabled: { name: "Disabled", control: "boolean", description: "`disabled` no grupo: desabilita e esmaece todos os itens.", table: { category: "Estado" } },
  },
  args: { variant: "outline", size: "default", spacing: 2, orientation: "horizontal", multiple: false, disabled: false },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Tipos: Story = {
  name: "Type",
  parameters: vitrine("No código, `variant`. Sem a propriedade, o grupo é `default`."),
  render: () => <Opcoes>{variantes.map((v) => <Opcao key={v} nome={v}>{grupo({ variant: v })}</Opcao>)}</Opcoes>,
}

export const Tamanhos: Story = {
  name: "Size",
  parameters: vitrine("No código, `size`. A etiqueta traz a altura."),
  render: () => <Opcoes>{tamanhos.map((s) => <Opcao key={s} nome={`${s} · ${alturas[s]} px`}>{grupo({ variant: "outline", size: s })}</Opcao>)}</Opcoes>,
}

export const Espacos: Story = {
  name: "Spacing",
  parameters: vitrine("No código, `spacing`. Sem a propriedade, o espaço é 2 (8 px). Com 0, os itens se juntam e só as pontas ficam arredondadas."),
  render: () => <Opcoes>{[0, 2].map((n) => <Opcao key={n} nome={`${n} · ${n * 4} px`}>{grupo({ variant: "outline", spacing: n })}</Opcao>)}</Opcoes>,
}

export const Orientacoes: Story = {
  name: "Orientation",
  parameters: vitrine("No código, `orientation`. Sem a propriedade, o grupo é `horizontal`."),
  render: () => <Opcoes>{orientacoes.map((o) => <Opcao key={o} nome={o}>{grupo({ variant: "outline", orientation: o })}</Opcao>)}</Opcoes>,
}

export const Selecao: Story = {
  name: "Multiple e Disabled",
  parameters: vitrine("Com `multiple`, vários itens ficam selecionados. Com `disabled` no grupo, todos esmaecem."),
  render: () => (
    <Opcoes>
      <Opcao nome="Um por vez">{grupo({ variant: "outline" })}</Opcao>
      <Opcao nome="multiple">{grupo({ variant: "outline", multiple: true })}</Opcao>
      <Opcao nome="disabled">{grupo({ variant: "outline", disabled: true })}</Opcao>
    </Opcoes>
  ),
}
