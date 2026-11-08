import type { Meta, StoryObj } from "@storybook/react-vite"

import { Field, FieldContent, FieldDescription, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field"
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

const prazos = [["pix", "Pix", "Cai na hora."], ["boleto", "Boleto", "Até 3 dias úteis."], ["cartao", "Cartão", "Até 12 vezes."]] as const

// Grupo com legenda e descrição; com `invalido`, cada opção ganha `aria-invalid` e o Field, `data-invalid`.
const grupoComLegenda = (descricao: string, invalido = false) => (
  <FieldSet className="w-full">
    <FieldLegend variant="label">Forma de pagamento</FieldLegend>
    <FieldDescription>{descricao}</FieldDescription>
    <RadioGroup defaultValue="pix">
      {prazos.map(([valor, nome]) => (
        <Field key={valor} orientation="horizontal" data-invalid={invalido || undefined}>
          <RadioGroupItem value={valor} id={`rd-${invalido ? "invalido" : "grupo"}-${valor}`} aria-invalid={invalido || undefined} />
          <FieldLabel htmlFor={`rd-${invalido ? "invalido" : "grupo"}-${valor}`} className="text-body-sm">{nome}</FieldLabel>
        </Field>
      ))}
    </RadioGroup>
  </FieldSet>
)

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("Os exemplos do shadcn com o `Field`: descrição em cada opção, uma opção desabilitada, grupo com legenda, erro em todas as opções e cartão de escolha. Com `data-disabled` ou `data-invalid` no Field, o nome acompanha a opção."),
  render: () => (
    <Opcoes>
      <Opcao nome="Com descrição">
        <RadioGroup defaultValue="pix" className="w-fit">
          {prazos.map(([valor, nome, prazo]) => (
            <Field key={valor} orientation="horizontal">
              <RadioGroupItem value={valor} id={`rd-descricao-${valor}`} />
              <FieldContent><FieldLabel htmlFor={`rd-descricao-${valor}`}>{nome}</FieldLabel><FieldDescription>{prazo}</FieldDescription></FieldContent>
            </Field>
          ))}
        </RadioGroup>
      </Opcao>
      <Opcao nome="Uma opção desabilitada">
        <RadioGroup defaultValue="boleto" className="w-fit">
          {prazos.map(([valor, nome], i) => (
            <Field key={valor} orientation="horizontal" data-disabled={i === 0 || undefined}>
              <RadioGroupItem value={valor} id={`rd-desabilitado-${valor}`} disabled={i === 0 || undefined} />
              <FieldLabel htmlFor={`rd-desabilitado-${valor}`} className="text-body-sm">{nome}</FieldLabel>
            </Field>
          ))}
        </RadioGroup>
      </Opcao>
      <Opcao nome="Grupo com legenda">{grupoComLegenda("O Pix cai na hora.")}</Opcao>
      <Opcao nome="Invalid no Field">{grupoComLegenda("Escolha outra forma para continuar.", true)}</Opcao>
      <Opcao nome="Cartão de escolha">
        <RadioGroup defaultValue="pix" className="w-full">
          {prazos.map(([valor, nome, prazo]) => (
            <FieldLabel key={valor} htmlFor={`rd-cartao-${valor}`}>
              <Field orientation="horizontal">
                <FieldContent><FieldTitle>{nome}</FieldTitle><FieldDescription>{prazo}</FieldDescription></FieldContent>
                <RadioGroupItem value={valor} id={`rd-cartao-${valor}`} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </Opcao>
    </Opcoes>
  ),
}
