import type { Meta, StoryObj } from "@storybook/react-vite"
import { BoldIcon } from "lucide-react"
import { useArgs } from "storybook/preview-api"

import { Toggle } from "@/components/ui/toggle"
import { Opcao, Opcoes, Simula, pagina, simulaEstado, vitrine, type Interacao } from "./Opcoes"

const variantes = ["default", "outline"] as const
const tamanhos = ["sm", "default", "lg"] as const
// Altura de cada tamanho em toggle.tsx (h-8, h-9, h-10).
const alturas = { sm: 32, default: 36, lg: 40 } as const
const interacoes: Interacao[] = ["Default", "Hover", "Focus"]

type Controles = {
  variant: (typeof variantes)[number]
  size: (typeof tamanhos)[number]
  texto: string
  soIcone: boolean
  selecionado: boolean
  estado: Interacao
  disabled: boolean
  invalido: boolean
}

const meta = {
  title: "Componentes/Toggle",
  // O clique na amostra atualiza o controle Selected, e o controle atualiza a amostra.
  render: function Amostra({ variant, size, texto, soIcone, selecionado, disabled, invalido }) {
    const [, atualizar] = useArgs<Controles>()
    return (
      <Toggle
        variant={variant === "default" ? undefined : variant}
        size={size === "default" ? undefined : size}
        pressed={selecionado}
        onPressedChange={(pressionado) => atualizar({ selecionado: pressionado })}
        disabled={disabled || undefined}
        aria-invalid={invalido || undefined}
        aria-label={soIcone ? "Negrito" : undefined}
      >
        <BoldIcon data-icon={soIcone ? undefined : "inline-start"} />
        {!soIcone && texto}
      </Toggle>
    )
  },
  parameters: pagina("Botão que fica ligado ou desligado, como o negrito de um editor."),
  argTypes: {
    variant: { name: "Type", control: "inline-radio", options: variantes, description: "No código, a propriedade `variant`.", table: { category: "Aparência" } },
    size: { name: "Size", control: "inline-radio", options: tamanhos, description: "No código, a propriedade `size`.", table: { category: "Aparência" } },
    texto: { name: "Texto", control: "text", description: "Some com **Só ícone**.", if: { arg: "soIcone", truthy: false }, table: { category: "Conteúdo" } },
    soIcone: { name: "Só ícone", control: "boolean", description: "Esconde o texto.", table: { category: "Conteúdo" } },
    selecionado: { name: "Selected", control: "boolean", description: "No código, `pressed` (ou `defaultPressed`, quando o próprio Toggle guarda o valor).", table: { category: "Estado" } },
    estado: { name: "State", control: "inline-radio", options: interacoes, description: "Simulado: quem aplica é o navegador. O Toggle não muda ao ser clicado (Pressed), só ao ficar selecionado.", table: { category: "Estado" } },
    disabled: { name: "Disabled", control: "boolean", description: "`disabled`: impede a ação e esmaece.", table: { category: "Estado" } },
    invalido: { name: "Invalid", control: "boolean", description: "`aria-invalid`: borda de erro.", table: { category: "Estado" } },
  },
  args: { variant: "default", size: "default", texto: "Negrito", soIcone: false, selecionado: false, estado: "Default", disabled: false, invalido: false },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [simulaEstado],
}

export const Tipos: Story = {
  name: "Type",
  parameters: vitrine("No código, `variant`. Sem a propriedade, o Toggle é `default`."),
  render: () => <Opcoes>{variantes.map((v) => <Opcao key={v} nome={v}><Toggle variant={v}><BoldIcon data-icon="inline-start" /> Toggle</Toggle></Opcao>)}</Opcoes>,
}

export const Tamanhos: Story = {
  name: "Size",
  parameters: vitrine("No código, `size`. A etiqueta traz a altura."),
  render: () => <Opcoes>{tamanhos.map((s) => <Opcao key={s} nome={`${s} · ${alturas[s]} px`}><Toggle size={s} variant="outline"><BoldIcon data-icon="inline-start" /> Toggle</Toggle></Opcao>)}</Opcoes>,
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Hover e Focus simulados. Selected é o \"selecionado\": no código, `pressed`."),
  render: () => (
    <Opcoes>
      {interacoes.map((e) => <Opcao key={e} nome={e}><Simula estado={e}><Toggle variant="outline"><BoldIcon data-icon="inline-start" /> Toggle</Toggle></Simula></Opcao>)}
      <Opcao nome="Selected"><Toggle variant="outline" defaultPressed><BoldIcon data-icon="inline-start" /> Toggle</Toggle></Opcao>
      <Opcao nome="Disabled"><Toggle variant="outline" disabled><BoldIcon data-icon="inline-start" /> Toggle</Toggle></Opcao>
      <Opcao nome="Invalid"><Toggle variant="outline" aria-invalid><BoldIcon data-icon="inline-start" /> Toggle</Toggle></Opcao>
    </Opcoes>
  ),
}

export const Conteudo: Story = {
  name: "Conteúdo",
  parameters: vitrine("Sem texto visível, o `aria-label` é obrigatório."),
  render: () => (
    <Opcoes>
      <Opcao nome="Ícone e texto"><Toggle variant="outline"><BoldIcon data-icon="inline-start" /> Negrito</Toggle></Opcao>
      <Opcao nome="Só ícone"><Toggle variant="outline" aria-label="Negrito"><BoldIcon /></Toggle></Opcao>
      <Opcao nome="Só texto"><Toggle variant="outline">Negrito</Toggle></Opcao>
    </Opcoes>
  ),
}
