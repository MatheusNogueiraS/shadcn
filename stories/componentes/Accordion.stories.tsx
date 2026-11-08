import type { Meta, StoryObj } from "@storybook/react-vite"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Opcao, Opcoes, Simula, pagina, vitrine, type Interacao } from "./Opcoes"

const interacoes: Interacao[] = ["Default", "Hover"]
const gatilho = "[data-slot=accordion-trigger]"

type Controles = { multiple: boolean; disabled: boolean; estado: Interacao }

const perguntas = [
  ["pix", "Como pagar com Pix?", "Escaneie o QR Code no app do seu banco. O pagamento cai na hora."],
  ["boleto", "Quando o boleto compensa?", "Em até 3 dias úteis depois do pagamento."],
  ["cartao", "Posso parcelar no cartão?", "Sim, em até 12 vezes, com juros a partir da segunda parcela."],
] as const

const lista = ({ multiple = false, disabled = false, abertos = ["pix"] }: { multiple?: boolean; disabled?: boolean; abertos?: string[] } = {}) => (
  <Accordion key={String(multiple)} multiple={multiple || undefined} defaultValue={abertos}>
    {perguntas.map(([valor, pergunta, resposta], i) => (
      <AccordionItem key={valor} value={valor} disabled={(disabled && i === 1) || undefined}>
        <AccordionTrigger>{pergunta}</AccordionTrigger>
        <AccordionContent>{resposta}</AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
)

const meta = {
  title: "Componentes/Accordion",
  render: ({ multiple, disabled }) => lista({ multiple, disabled }),
  parameters: pagina("Lista de perguntas que abrem e fecham a resposta. Não tem Type nem Size: a largura preenche o pai. No estilo do projeto (luma), a borda já vem no Accordion, então o modelo Borders do shadcn é o próprio Basic daqui, e o modelo Card fica de fora: ele pede um Accordion sem borda dentro do Card, que o código não tem."),
  argTypes: {
    multiple: { name: "Multiple", control: "boolean", description: "`multiple`: várias perguntas abertas ao mesmo tempo. Sem ele, abrir uma fecha a outra.", table: { category: "Comportamento" } },
    disabled: { name: "Disabled", control: "boolean", description: "`disabled` na segunda pergunta: ela não abre e esmaece.", table: { category: "Estado" } },
    estado: { name: "State", control: "inline-radio", options: interacoes, description: "Simulado, na primeira pergunta. O foco do teclado não aparece no código.", table: { category: "Estado" } },
  },
  args: { multiple: false, disabled: false, estado: "Default" },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia, { args }) => <div className="w-96"><Simula estado={args.estado} so={gatilho}><Historia /></Simula></div>],
}

export const Modelos: Story = {
  name: "Modelo",
  parameters: vitrine("Os modelos do shadcn: Basic abre uma pergunta por vez; Multiple abre várias."),
  render: () => (
    <Opcoes>
      <Opcao nome="Basic">{lista()}</Opcao>
      <Opcao nome="Multiple">{lista({ multiple: true, abertos: ["pix", "boleto"] })}</Opcao>
    </Opcoes>
  ),
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Hover simulado. Aberto, o item ganha fundo e a seta vira para cima. Disabled está na segunda pergunta."),
  render: () => (
    <Opcoes>
      <Opcao nome="Closed">{lista({ abertos: [] })}</Opcao>
      <Opcao nome="Open">{lista()}</Opcao>
      <Opcao nome="Hover"><Simula estado="Hover" so={gatilho}>{lista({ abertos: [] })}</Simula></Opcao>
      <Opcao nome="Disabled">{lista({ disabled: true, abertos: [] })}</Opcao>
    </Opcoes>
  ),
}
