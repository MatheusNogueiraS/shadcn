import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowRightIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

const variantes = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const
const tamanhos = ["xs", "sm", "default", "lg"] as const

const meta = {
  title: "Componentes/Button",
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          "Dispara uma ação. Use `default` para a ação principal da tela, uma por contexto, e `secondary` para a ação de apoio. O formato arredondado é o padrão da marca. Para navegar, use a história Como link: o Base UI usa `render`, não `asChild`.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: variantes, description: "Peso visual da ação." },
    size: { control: "select", options: [...tamanhos, "icon-xs", "icon-sm", "icon", "icon-lg"], description: "Altura do botão. Os tamanhos `icon` são para botões só com ícone." },
    disabled: { control: "boolean", description: "Impede a ação e deixa o botão esmaecido." },
    render: { control: false, description: "Troca o elemento renderizado, como um `<a>`." },
    nativeButton: { control: false, description: "Informe `false` quando `render` não for um `<button>`." },
  },
  args: { children: "Confirmar", variant: "default", size: "default" },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {variantes.map((v) => <Button key={v} {...args} variant={v}>{v}</Button>)}
    </div>
  ),
}

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {tamanhos.map((s) => <Button key={s} {...args} size={s}>{s}</Button>)}
    </div>
  ),
}

export const ComIcone: Story = {
  name: "Com ícone",
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args}><PlusIcon data-icon="inline-start" /> Adicionar</Button>
      <Button {...args} variant="secondary">Continuar <ArrowRightIcon data-icon="inline-end" /></Button>
    </div>
  ),
}

export const SoIcone: Story = {
  name: "Só ícone",
  parameters: {
    docs: { description: { story: "Sem texto visível, o `aria-label` é obrigatório: é o que o leitor de tela anuncia." } },
  },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="icon-sm" variant="outline" aria-label="Adicionar"><PlusIcon /></Button>
      <Button {...args} size="icon" aria-label="Adicionar"><PlusIcon /></Button>
    </div>
  ),
}

export const Carregando: Story = {
  args: { disabled: true },
  render: (args) => <Button {...args}><Spinner /> Salvando</Button>,
}

export const Desabilitado: Story = { args: { disabled: true } }

export const ComoLink: Story = {
  name: "Como link",
  parameters: {
    docs: { description: { story: "Quando o elemento não é um `<button>`, informe `nativeButton={false}` junto com `render`." } },
  },
  render: (args) => <Button {...args} nativeButton={false} render={<a href="#exemplo" />}>Ver detalhes</Button>,
}
