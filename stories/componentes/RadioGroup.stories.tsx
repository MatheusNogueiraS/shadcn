import type { Meta, StoryObj } from "@storybook/react-vite"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Opcao, Opcoes, Simula, estadoDe, pagina, vitrine, type Interacao } from "./Opcoes"

const interacoes: Interacao[] = ["Default", "Focus"]
const formas = [["pix", "Pix"], ["boleto", "Boleto"]] as const

type Controles = { estado: Interacao; disabled: boolean; invalido: boolean }

const meta = {
  title: "Componentes/Radio Group",
  render: ({ disabled, invalido }) => (
    <RadioGroup defaultValue="pix" disabled={disabled || undefined} className="w-fit">
      {formas.map(([valor, nome]) => (
        <div key={valor} className="flex items-center gap-(--gap-sm)">
          <RadioGroupItem value={valor} id={`radio-${valor}`} aria-invalid={invalido || undefined} />
          <Label htmlFor={`radio-${valor}`}>{nome}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
  parameters: pagina("Escolhe uma opção entre várias: marcar uma desmarca as outras. `RadioGroup` é o grupo e `RadioGroupItem` é cada opção."),
  argTypes: {
    estado: { name: "State", control: "inline-radio", options: interacoes, description: "Simulado. O Radio não tem hover no código.", table: { category: "Estado" } },
    disabled: { name: "Disabled", control: "boolean", description: "`disabled` no `RadioGroup` desabilita todas as opções; em um `RadioGroupItem`, só aquela.", table: { category: "Estado" } },
    invalido: { name: "Invalid", control: "boolean", description: "`aria-invalid` em cada `RadioGroupItem`: borda de erro.", table: { category: "Estado" } },
  },
  args: { estado: "Default", disabled: false, invalido: false },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia, { args }) => <Simula estado={estadoDe(args)} so="[data-slot=radio-group-item]"><Historia /></Simula>],
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Focus simulado."),
  render: () => (
    <Opcoes>
      <Opcao nome="Unchecked"><RadioGroup className="w-fit"><RadioGroupItem value="a" aria-label="Opção" /></RadioGroup></Opcao>
      <Opcao nome="Checked"><RadioGroup defaultValue="a" className="w-fit"><RadioGroupItem value="a" aria-label="Opção" /></RadioGroup></Opcao>
      <Opcao nome="Focus"><Simula estado="Focus"><RadioGroup className="w-fit"><RadioGroupItem value="a" aria-label="Opção" /></RadioGroup></Simula></Opcao>
      <Opcao nome="Disabled"><RadioGroup disabled className="w-fit"><RadioGroupItem value="a" aria-label="Opção" /></RadioGroup></Opcao>
      <Opcao nome="Invalid"><RadioGroup className="w-fit"><RadioGroupItem value="a" aria-invalid aria-label="Opção" /></RadioGroup></Opcao>
    </Opcoes>
  ),
}
