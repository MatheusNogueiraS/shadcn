import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs } from "storybook/preview-api"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"
import { pagina, vitrine } from "../componentes/Opcoes"

const lados = ["bottom", "top", "right", "left"] as const
type Lado = (typeof lados)[number]
const alinhamentos = ["center", "start", "end"] as const
type Alinhamento = (typeof alinhamentos)[number]

type Controles = { aberto: boolean; side: Lado; align: Alinhamento; cabecalho: boolean; formulario: boolean }

const conteudo = ({ side, align, cabecalho, formulario }: Omit<Controles, "aberto">, className?: string) => (
  <PopoverContent side={side === "bottom" ? undefined : side} align={align === "center" ? undefined : align} className={className}>
    {cabecalho && <PopoverHeader><PopoverTitle>Dimensões</PopoverTitle><PopoverDescription>Ajuste o tamanho da camada.</PopoverDescription></PopoverHeader>}
    {formulario && (
      <FieldGroup className="gap-(--gap-md)">
        <Field orientation="horizontal"><FieldLabel htmlFor={`pop-largura-${side}-${align}`} className="w-20">Largura</FieldLabel><Input id={`pop-largura-${side}-${align}`} defaultValue="100%" /></Field>
        <Field orientation="horizontal"><FieldLabel htmlFor={`pop-altura-${side}-${align}`} className="w-20">Altura</FieldLabel><Input id={`pop-altura-${side}-${align}`} defaultValue="25px" /></Field>
      </FieldGroup>
    )}
  </PopoverContent>
)

const base = { side: "bottom" as Lado, align: "center" as Alinhamento, cabecalho: true, formulario: true }
const aberto = (props: Omit<Controles, "aberto">, nome = "Abrir", className?: string) => (
  <Popover defaultOpen><PopoverTrigger render={<Button variant="outline" />}>{nome}</PopoverTrigger>{conteudo(props, className)}</Popover>
)

const meta = {
  title: "Em construção/Popover",
  // Abrir e fechar na amostra atualiza o controle Open.
  render: function Amostra({ aberto: open, ...props }) {
    const [, atualizar] = useArgs<Controles>()
    return (
      <Popover open={open} onOpenChange={(o) => atualizar({ aberto: o })}>
        <PopoverTrigger render={<Button variant="outline" />}>Dimensões</PopoverTrigger>
        {conteudo(props)}
      </Popover>
    )
  },
  parameters: pagina("Caixa que abre presa a um botão, com conteúdo que se pode usar, como um pequeno formulário. Fecha com o clique fora ou com o Esc, e não escurece a página. A largura é 288 px. Na amostra, o botão ou o controle **Open** abre a caixa; as opções embaixo rodam cada uma no próprio quadro, já abertas."),
  argTypes: {
    aberto: { name: "Open", control: "boolean", description: "No código, `open` no `Popover` (ou `defaultOpen`).", table: { category: "Estado" } },
    side: { name: "Side", control: "inline-radio", options: lados, description: "No código, `side` no `PopoverContent`: o lado do botão em que a caixa abre. Sem espaço, ela vai para o lado oposto.", table: { category: "Aparência" } },
    align: { name: "Align", control: "inline-radio", options: alinhamentos, description: "No código, `align`: a caixa alinhada ao começo, ao centro ou ao fim do botão.", table: { category: "Aparência" } },
    cabecalho: { name: "Cabeçalho", control: "boolean", description: "`PopoverHeader` com `PopoverTitle` e `PopoverDescription`.", table: { category: "Conteúdo" } },
    formulario: { name: "Formulário", control: "boolean", description: "Qualquer conteúdo entra no `PopoverContent`, como os campos do exemplo do shadcn.", table: { category: "Conteúdo" } },
  },
  args: { aberto: false, ...base },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

const porLado = (side: Lado, descricao: string): Story => ({
  name: `Side · ${side}`,
  parameters: { ...vitrine(descricao, 360), layout: "centered" },
  render: () => aberto({ ...base, side }),
})

export const Baixo = porLado("bottom", "Um quadro por lado. Sem a propriedade, a caixa abre embaixo (`bottom`).")
export const Cima = porLado("top", "")
export const Direita = porLado("right", "")
export const Esquerda = porLado("left", "")

export const Alinhamentos: Story = {
  name: "Align",
  parameters: vitrine("No código, `align`. Sem a propriedade, a caixa fica centralizada (`center`). Aqui, com `className=\"w-56\"` para as três caberem lado a lado.", 300),
  render: () => (
    <div className="grid grid-cols-3 place-items-center pt-(--padding-2xl)">
      {alinhamentos.map((a) => <div key={a}>{aberto({ ...base, align: a, formulario: false }, a, "w-56")}</div>)}
    </div>
  ),
}
