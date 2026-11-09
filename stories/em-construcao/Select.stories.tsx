import type { Meta, StoryObj } from "@storybook/react-vite"
import { BanknoteIcon, CreditCardIcon, QrCodeIcon } from "lucide-react"
import { useArgs } from "storybook/preview-api"

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Opcao, Opcoes, Simula, estadoDe, pagina, vitrine, type Interacao } from "../componentes/Opcoes"

const tamanhos = ["sm", "default"] as const
type Tamanho = (typeof tamanhos)[number]
const interacoes: Interacao[] = ["Default", "Focus"]
const formas = { pix: "Pix", boleto: "Boleto", cartao: "Cartão de crédito" } as const
type Forma = keyof typeof formas
const icones = { pix: QrCodeIcon, boleto: BanknoteIcon, cartao: CreditCardIcon }

type Controles = { aberto: boolean; size: Tamanho; valor: Forma | "Nenhum"; grupos: boolean; icones: boolean; alinhar: boolean; side?: "bottom" | "top"; itemDesabilitado: boolean; estado: Interacao; disabled: boolean; invalido: boolean }

const opcoes = ({ grupos, icones: comIcone, itemDesabilitado }: Pick<Controles, "grupos" | "icones" | "itemDesabilitado">) => {
  const item = (f: Forma) => {
    const Icone = icones[f]
    return <SelectItem key={f} value={f} disabled={(itemDesabilitado && f === "boleto") || undefined}>{comIcone && <Icone />}{formas[f]}</SelectItem>
  }
  return grupos ? (
    <>
      <SelectGroup><SelectLabel>Na hora</SelectLabel>{item("pix")}{item("cartao")}</SelectGroup>
      <SelectSeparator />
      <SelectGroup><SelectLabel>Em até 3 dias</SelectLabel>{item("boleto")}</SelectGroup>
    </>
  ) : (
    <SelectGroup>{(Object.keys(formas) as Forma[]).map(item)}</SelectGroup>
  )
}

const selecao = (args: Omit<Controles, "aberto" | "estado">, extra?: { aberto?: boolean; aoAbrir?: (o: boolean) => void; aoMudar?: (v: Forma | null) => void; id?: string }) => (
  <Select
    items={formas}
    value={extra?.aoMudar ? (args.valor === "Nenhum" ? null : args.valor) : undefined}
    defaultValue={extra?.aoMudar ? undefined : args.valor === "Nenhum" ? undefined : args.valor}
    onValueChange={extra?.aoMudar}
    open={extra?.aoAbrir ? extra.aberto : undefined}
    defaultOpen={extra?.aoAbrir ? undefined : extra?.aberto}
    onOpenChange={extra?.aoAbrir}
    disabled={args.disabled || undefined}
  >
    <SelectTrigger id={extra?.id} size={args.size === "default" ? undefined : args.size} className="w-56" aria-invalid={args.invalido || undefined} aria-label={extra?.id ? undefined : "Forma de pagamento"}>
      <SelectValue placeholder="Escolha a forma" />
    </SelectTrigger>
    <SelectContent alignItemWithTrigger={args.alinhar ? undefined : false} side={args.alinhar || !args.side || args.side === "bottom" ? undefined : args.side}>{opcoes(args)}</SelectContent>
  </Select>
)

const base = { size: "default" as Tamanho, valor: "Nenhum" as const, grupos: false, icones: false, alinhar: true, itemDesabilitado: false, disabled: false, invalido: false }

const meta = {
  title: "Em construção/Select",
  // Abrir, fechar e escolher na amostra atualiza os controles Open e Valor.
  render: function Amostra({ aberto, ...args }) {
    const [, atualizar] = useArgs<Controles>()
    return selecao(args, { aberto, aoAbrir: (o) => atualizar({ aberto: o }), aoMudar: (v) => atualizar({ valor: v ?? "Nenhum" }) })
  },
  parameters: pagina("Escolhe uma opção numa lista que abre por um botão, como a forma de pagamento. Para listas longas com busca, use o Combobox. Na amostra, o botão ou o controle **Open** abre a lista, que bloqueia a página até fechar; as opções abertas embaixo rodam no próprio quadro."),
  argTypes: {
    aberto: { name: "Open", control: "boolean", description: "No código, `open` no `Select` (ou `defaultOpen`).", table: { category: "Estado" } },
    size: { name: "Size", control: "inline-radio", options: tamanhos, description: "No código, `size` no `SelectTrigger`: 32 px (`sm`) ou 36 px (`default`) de altura. A largura vem da classe, como `w-56`.", table: { category: "Aparência" } },
    valor: { name: "Valor", control: "select", options: ["Nenhum", ...Object.keys(formas)], description: "No código, `value` (ou `defaultValue`). Sem valor, o `SelectValue` mostra o `placeholder` em cor apagada. A propriedade `items` do `Select` liga cada valor ao texto que aparece no botão.", table: { category: "Conteúdo" } },
    grupos: { name: "Grupos", control: "boolean", description: "`SelectGroup` com `SelectLabel`, separados por `SelectSeparator`.", table: { category: "Conteúdo" } },
    icones: { name: "Ícones", control: "boolean", description: "Um ícone antes do texto do `SelectItem`. O botão mostra só o texto, que vem de `items`.", table: { category: "Conteúdo" } },
    alinhar: { name: "Alinhar ao botão", control: "boolean", description: "`alignItemWithTrigger` no `SelectContent`. Ligado, a lista abre com a opção escolhida em cima do botão; desligado, abre embaixo dele, como um menu.", table: { category: "Comportamento" } },
    side: { name: "Side", control: "inline-radio", options: ["bottom", "top"], description: "No código, `side` no `SelectContent`: embaixo ou em cima do botão. Só vale com **Alinhar ao botão** desligado.", if: { arg: "alinhar", truthy: false }, table: { category: "Comportamento" } },
    itemDesabilitado: { name: "Item desabilitado", control: "boolean", description: "`disabled` no `SelectItem` do Boleto.", table: { category: "Estado" } },
    estado: { name: "State", control: "inline-radio", options: interacoes, description: "Simulado. O Select não tem hover no código.", table: { category: "Estado" } },
    disabled: { name: "Disabled", control: "boolean", description: "`disabled` no `Select`: o botão esmaece e não abre.", table: { category: "Estado" } },
    invalido: { name: "Invalid", control: "boolean", description: "`aria-invalid` no `SelectTrigger`: borda de erro.", table: { category: "Estado" } },
  },
  args: { aberto: false, ...base, side: "bottom", estado: "Default" },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia, { args }) => <Simula estado={estadoDe(args)} so="[data-slot=select-trigger]"><Historia /></Simula>],
}

export const Tamanhos: Story = {
  name: "Size",
  parameters: vitrine("No código, `size`. Sem a propriedade, o Select é `default`."),
  render: () => <Opcoes>{tamanhos.map((s) => <Opcao key={s} nome={s}>{selecao({ ...base, size: s })}</Opcao>)}</Opcoes>,
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Focus simulado. Empty mostra o placeholder; Filled, a opção escolhida."),
  render: () => (
    <Opcoes>
      <Opcao nome="Empty">{selecao(base)}</Opcao>
      <Opcao nome="Filled">{selecao({ ...base, valor: "pix" })}</Opcao>
      <Opcao nome="Focus"><Simula estado="Focus" so="[data-slot=select-trigger]">{selecao(base)}</Simula></Opcao>
      <Opcao nome="Disabled">{selecao({ ...base, disabled: true })}</Opcao>
      <Opcao nome="Invalid">{selecao({ ...base, invalido: true })}</Opcao>
    </Opcoes>
  ),
}

export const Lista: Story = {
  name: "Lista aberta",
  parameters: vitrine("O exemplo do shadcn com grupos, rótulos e separador, e ícones nas opções. A escolhida ganha o ✓; a desabilitada esmaece.", 300),
  render: () => selecao({ ...base, valor: "pix", grupos: true, icones: true, itemDesabilitado: true }, { aberto: true }),
}

export const SemAlinhar: Story = {
  name: "Alinhar ao botão · false",
  parameters: vitrine("`alignItemWithTrigger={false}`: a lista abre embaixo do botão.", 260),
  render: () => selecao({ ...base, valor: "pix", alinhar: false }, { aberto: true }),
}

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("Os exemplos do shadcn com Field: nome, descrição e a mensagem de erro (`FieldError`), que pinta o nome junto com o botão quando o Field recebe `data-invalid`."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="Com Field">
        <Field className="w-56">
          <FieldLabel htmlFor="select-forma">Forma de pagamento</FieldLabel>
          {selecao(base, { id: "select-forma" })}
          <FieldDescription>Você pode mudar depois.</FieldDescription>
        </Field>
      </Opcao>
      <Opcao nome="Com erro">
        <Field className="w-56" data-invalid>
          <FieldLabel htmlFor="select-forma-erro">Forma de pagamento</FieldLabel>
          {selecao({ ...base, invalido: true }, { id: "select-forma-erro" })}
          <FieldError>Escolha uma forma.</FieldError>
        </Field>
      </Opcao>
    </Opcoes>
  ),
}
