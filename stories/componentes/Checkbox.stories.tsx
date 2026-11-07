import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs } from "storybook/preview-api"

import { Checkbox } from "@/components/ui/checkbox"
import { Opcao, Opcoes, Simula, pagina, simulaEstado, vitrine, type Interacao } from "./Opcoes"

const interacoes: Interacao[] = ["Default", "Focus"]

type Controles = { checked: boolean; estado: Interacao; disabled: boolean; invalido: boolean }

const meta = {
  title: "Componentes/Checkbox",
  // O clique na amostra atualiza o controle Checked, e o controle atualiza a amostra.
  render: function Amostra({ checked, disabled, invalido }) {
    const [, atualizar] = useArgs<Controles>()
    return (
      <Checkbox checked={checked} onCheckedChange={(marcado) => atualizar({ checked: marcado })} disabled={disabled || undefined} aria-invalid={invalido || undefined} aria-label="Aceito os termos" />
    )
  },
  parameters: pagina("Marca ou desmarca uma opção independente das outras."),
  argTypes: {
    checked: { name: "Checked", control: "boolean", description: "No código, `checked` (ou `defaultChecked`, quando o próprio Checkbox guarda o valor).", table: { category: "Estado" } },
    estado: { name: "State", control: "inline-radio", options: interacoes, description: "Simulado. O Checkbox não tem hover no código.", table: { category: "Estado" } },
    disabled: { name: "Disabled", control: "boolean", description: "`disabled`: impede a mudança e esmaece.", table: { category: "Estado" } },
    invalido: { name: "Invalid", control: "boolean", description: "`aria-invalid`: borda de erro.", table: { category: "Estado" } },
  },
  args: { checked: true, estado: "Default", disabled: false, invalido: false },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [simulaEstado],
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Focus simulado. Não há estado \"meio marcado\" (`indeterminate`) desenhado no nosso Checkbox."),
  render: () => (
    <Opcoes>
      <Opcao nome="Unchecked"><Checkbox aria-label="Opção" /></Opcao>
      <Opcao nome="Checked"><Checkbox defaultChecked aria-label="Opção" /></Opcao>
      <Opcao nome="Focus"><Simula estado="Focus"><Checkbox aria-label="Opção" /></Simula></Opcao>
      <Opcao nome="Disabled"><Checkbox disabled aria-label="Opção" /></Opcao>
      <Opcao nome="Invalid"><Checkbox aria-invalid aria-label="Opção" /></Opcao>
    </Opcoes>
  ),
}
