import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs } from "storybook/preview-api"

import { Switch } from "@/components/ui/switch"
import { Opcao, Opcoes, Simula, pagina, simulaEstado, vitrine, type Interacao } from "./Opcoes"

const tamanhos = ["sm", "default"] as const
// Altura de cada tamanho em switch.tsx (h-4 e h-5).
const alturas = { sm: 16, default: 20 } as const
const interacoes: Interacao[] = ["Default", "Focus"]

type Controles = { size: (typeof tamanhos)[number]; checked: boolean; estado: Interacao; disabled: boolean; invalido: boolean }

const meta = {
  title: "Componentes/Switch",
  // O clique na amostra atualiza o controle Checked, e o controle atualiza a amostra.
  render: function Amostra({ size, checked, disabled, invalido }) {
    const [, atualizar] = useArgs<Controles>()
    return (
      <Switch size={size === "default" ? undefined : size} checked={checked} onCheckedChange={(ligado) => atualizar({ checked: ligado })} disabled={disabled || undefined} aria-invalid={invalido || undefined} aria-label="Notificações" />
    )
  },
  parameters: pagina("Liga ou desliga algo na hora, como uma preferência."),
  argTypes: {
    size: { name: "Size", control: "inline-radio", options: tamanhos, description: "No código, a propriedade `size`.", table: { category: "Aparência" } },
    checked: { name: "Checked", control: "boolean", description: "No código, `checked` (ou `defaultChecked`, quando o próprio Switch guarda o valor).", table: { category: "Estado" } },
    estado: { name: "State", control: "inline-radio", options: interacoes, description: "Simulado. O Switch não tem hover no código.", table: { category: "Estado" } },
    disabled: { name: "Disabled", control: "boolean", description: "`disabled`: impede a mudança e esmaece.", table: { category: "Estado" } },
    invalido: { name: "Invalid", control: "boolean", description: "`aria-invalid`: borda de erro.", table: { category: "Estado" } },
  },
  args: { size: "default", checked: true, estado: "Default", disabled: false, invalido: false },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [simulaEstado],
}

export const Tamanhos: Story = {
  name: "Size",
  parameters: vitrine("No código, `size`. A etiqueta traz a altura."),
  render: () => <Opcoes>{tamanhos.map((s) => <Opcao key={s} nome={`${s} · ${alturas[s]} px`}><Switch size={s} defaultChecked aria-label="Opção" /></Opcao>)}</Opcoes>,
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Focus simulado."),
  render: () => (
    <Opcoes>
      <Opcao nome="Unchecked"><Switch aria-label="Opção" /></Opcao>
      <Opcao nome="Checked"><Switch defaultChecked aria-label="Opção" /></Opcao>
      <Opcao nome="Focus"><Simula estado="Focus"><Switch aria-label="Opção" /></Simula></Opcao>
      <Opcao nome="Disabled"><Switch disabled aria-label="Opção" /></Opcao>
      <Opcao nome="Invalid"><Switch aria-invalid aria-label="Opção" /></Opcao>
    </Opcoes>
  ),
}
