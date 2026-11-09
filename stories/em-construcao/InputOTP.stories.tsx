import type { Meta, StoryObj } from "@storybook/react-vite"
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { Fragment, useState } from "react"
import { useArgs } from "storybook/preview-api"

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { Opcao, Opcoes, pagina, vitrine } from "../componentes/Opcoes"

const divisoes = { "6": [6], "3 + 3": [3, 3], "2 + 2 + 2": [2, 2, 2], "4": [4] } as const
type Divisao = keyof typeof divisoes
const padroes = { "Só números": REGEXP_ONLY_DIGITS, "Números e letras": REGEXP_ONLY_DIGITS_AND_CHARS } as const
type Padrao = keyof typeof padroes

type Controles = { divisao: Divisao; padrao: Padrao; valor: string; disabled: boolean; invalido: boolean }

// Os quadrados de cada grupo, com um separador entre os grupos.
const casas = (grupos: readonly number[], invalido = false) => {
  let indice = 0
  return grupos.map((n, g) => (
    <Fragment key={g}>
      {g > 0 && <InputOTPSeparator />}
      <InputOTPGroup>{Array.from({ length: n }, () => indice++).map((i) => <InputOTPSlot key={i} index={i} aria-invalid={invalido || undefined} />)}</InputOTPGroup>
    </Fragment>
  ))
}
const total = (d: Divisao) => divisoes[d].reduce((a, b) => a + b, 0)

// O valor guardado pode ter vindo de outras Casas ou de outro Pattern: fica só o que cabe e o que o padrão aceita.
const limpo = (valor: string, divisao: Divisao, padrao: Padrao) => [...valor].filter((c) => new RegExp(padroes[padrao]).test(c)).join("").slice(0, total(divisao))

const codigo = ({ divisao, padrao, valor, disabled, invalido }: Controles, aoMudar: (v: string) => void) => (
  <InputOTP
    maxLength={total(divisao)}
    pattern={padroes[padrao]}
    value={limpo(valor, divisao, padrao)}
    onChange={aoMudar}
    disabled={disabled || undefined}
    aria-label="Código de verificação"
  >
    {casas(divisoes[divisao], invalido)}
  </InputOTP>
)

// Nas vitrines, cada campo guarda o próprio valor.
function Codigo(props: Controles) {
  const [valor, setValor] = useState(props.valor)
  return codigo({ ...props, valor }, setValor)
}

const base: Controles = { divisao: "3 + 3", padrao: "Só números", valor: "", disabled: false, invalido: false }

const meta = {
  title: "Em construção/InputOTP",
  // O que se digita na amostra atualiza o controle Valor.
  render: function Amostra(args) {
    const [, atualizar] = useArgs<Controles>()
    return codigo(args, (v) => atualizar({ valor: v }))
  },
  parameters: pagina("Campo para códigos de uso único, como o que chega por SMS: um quadrado por caractere. O quadrado da vez ganha o anel de foco e um cursor piscando. Cada `InputOTPSlot` precisa do `index` dele."),
  argTypes: {
    divisao: { name: "Casas", control: "inline-radio", options: Object.keys(divisoes), description: "Quantos `InputOTPSlot` e como se agrupam: cada `InputOTPGroup` é um bloco, e o `InputOTPSeparator` traça o hífen entre eles. `maxLength` é o total.", table: { category: "Conteúdo" } },
    padrao: { name: "Pattern", control: "inline-radio", options: Object.keys(padroes), description: "No código, `pattern`: os caracteres aceitos, como `REGEXP_ONLY_DIGITS_AND_CHARS`, do pacote `input-otp`.", table: { category: "Comportamento" } },
    valor: { name: "Valor", control: "text", description: "No código, `value`, com `onChange` para guardar o que se digita.", table: { category: "Conteúdo" } },
    disabled: { name: "Disabled", control: "boolean", description: "`disabled`: o conjunto esmaece.", table: { category: "Estado" } },
    invalido: { name: "Invalid", control: "boolean", description: "`aria-invalid` em cada `InputOTPSlot`: borda de erro.", table: { category: "Estado" } },
  },
  args: base,
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Casas: Story = {
  name: "Casas",
  parameters: vitrine("Os exemplos do shadcn: seis casas em dois ou três blocos, ou quatro casas."),
  render: () => <Opcoes larga>{(Object.keys(divisoes) as Divisao[]).map((d) => <Opcao key={d} nome={d}><Codigo {...base} divisao={d} /></Opcao>)}</Opcoes>,
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Filled com o código digitado; Disabled esmaece; Invalid pinta a borda de cada casa. O Focus aparece ao clicar: a casa da vez ganha o anel."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="Empty"><Codigo {...base} /></Opcao>
      <Opcao nome="Filled"><Codigo {...base} valor="123456" /></Opcao>
      <Opcao nome="Disabled"><Codigo {...base} valor="123" disabled /></Opcao>
      <Opcao nome="Invalid"><Codigo {...base} valor="123456" invalido /></Opcao>
    </Opcoes>
  ),
}

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("O exemplo do shadcn de formulário: o `Field` dá o nome e a descrição."),
  render: () => (
    <Field className="w-fit">
      <FieldLabel htmlFor="otp-codigo">Código de verificação</FieldLabel>
      <InputOTP id="otp-codigo" maxLength={6}>{casas([3, 3])}</InputOTP>
      <FieldDescription>Enviamos o código por SMS.</FieldDescription>
    </Field>
  ),
}
