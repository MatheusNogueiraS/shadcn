import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowUpIcon, CopyIcon, EyeOffIcon, InfoIcon, PlusIcon, SearchIcon } from "lucide-react"

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Opcao, Opcoes, Simula, estadoDe, pagina, vitrine, type Interacao } from "../componentes/Opcoes"

const posicoes = ["inline-start", "inline-end", "block-start", "block-end"] as const
type Posicao = (typeof posicoes)[number]
const conteudos = ["Ícone", "Texto", "Botão", "Kbd", "Spinner"] as const
type Conteudo = (typeof conteudos)[number]
const tamanhosBotao = ["xs", "sm", "icon-xs", "icon-sm"] as const
type TamanhoBotao = (typeof tamanhosBotao)[number]
const interacoes: Interacao[] = ["Default", "Focus"]
const controle = "[data-slot=input-group-control]"

type Controles = { campo: "Input" | "Textarea"; align: Posicao; conteudo: Conteudo; tamanhoBotao: TamanhoBotao; estado: Interacao; disabled: boolean; invalido: boolean }

// O Storybook não passa o Size do botão quando o addon não é um botão, por isso o padrão aqui.
const addon = (conteudo: Conteudo, tamanhoBotao: TamanhoBotao = "xs") => {
  if (conteudo === "Botão") return tamanhoBotao.startsWith("icon") ? <InputGroupButton size={tamanhoBotao} aria-label="Copiar"><CopyIcon /></InputGroupButton> : <InputGroupButton size={tamanhoBotao === "xs" ? undefined : tamanhoBotao}>Buscar</InputGroupButton>
  return { Ícone: <SearchIcon />, Texto: <InputGroupText>https://</InputGroupText>, Kbd: <Kbd>⌘K</Kbd>, Spinner: <Spinner /> }[conteudo]
}

const grupo = ({ campo, align, conteudo, tamanhoBotao, disabled, invalido }: Omit<Controles, "estado">) => (
  <InputGroup data-disabled={disabled || undefined}>
    {campo === "Input"
      ? <InputGroupInput placeholder="Buscar..." aria-label="Buscar" disabled={disabled || undefined} aria-invalid={invalido || undefined} />
      : <InputGroupTextarea placeholder="Escreva uma mensagem" aria-label="Mensagem" disabled={disabled || undefined} aria-invalid={invalido || undefined} />}
    <InputGroupAddon align={align === "inline-start" ? undefined : align}>{addon(conteudo, tamanhoBotao)}</InputGroupAddon>
  </InputGroup>
)

const base = { campo: "Input" as const, align: "inline-start" as Posicao, conteudo: "Ícone" as Conteudo, tamanhoBotao: "xs" as TamanhoBotao, disabled: false, invalido: false }

const meta = {
  title: "Em construção/InputGroup",
  render: (args) => grupo(args),
  parameters: pagina("Campo com peças coladas dentro dele, como um ícone de busca, um prefixo ou um botão. O fundo, a borda e o foco passam a ser do grupo inteiro. A largura preenche o pai."),
  argTypes: {
    campo: { name: "Campo", control: "inline-radio", options: ["Input", "Textarea"], description: "`InputGroupInput` ou `InputGroupTextarea`. Com o Textarea, o grupo cresce em altura.", table: { category: "Conteúdo" } },
    align: { name: "Align do addon", control: "inline-radio", options: posicoes, description: "No código, `align` no `InputGroupAddon`. `inline-start` e `inline-end` ficam nos lados; `block-start` e `block-end`, numa linha em cima ou embaixo.", table: { category: "Aparência" } },
    conteudo: { name: "Addon", control: "inline-radio", options: conteudos, description: "O que vai dentro do `InputGroupAddon`: um ícone, `InputGroupText`, `InputGroupButton`, um `Kbd` (ganha fundo translúcido) ou um `Spinner`.", table: { category: "Conteúdo" } },
    tamanhoBotao: { name: "Size do botão", control: "inline-radio", options: tamanhosBotao, description: "No código, `size` no `InputGroupButton`: `xs` (o padrão) e `sm` com texto; `icon-xs` e `icon-sm` só com ícone.", if: { arg: "conteudo", eq: "Botão" }, table: { category: "Aparência" } },
    estado: { name: "State", control: "inline-radio", options: interacoes, description: "Simulado. Com o campo focado, o grupo inteiro ganha a borda e o anel.", table: { category: "Estado" } },
    disabled: { name: "Disabled", control: "boolean", description: "`disabled` no campo e `data-disabled` no grupo, que esmaece os addons.", table: { category: "Estado" } },
    invalido: { name: "Invalid", control: "boolean", description: "`aria-invalid` no campo: o grupo ganha a borda de erro.", table: { category: "Estado" } },
  },
  args: { ...base, estado: "Default" },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia, { args }) => <div className="w-72"><Simula estado={estadoDe(args)} so={controle}><Historia /></Simula></div>],
}

export const Posicoes: Story = {
  name: "Align do addon",
  parameters: vitrine("No código, `align`. Sem a propriedade, o addon fica no começo (`inline-start`)."),
  render: () => <Opcoes larga>{posicoes.map((p) => <Opcao key={p} nome={p}><div className="w-full">{grupo({ ...base, align: p, conteudo: "Texto" })}</div></Opcao>)}</Opcoes>,
}

export const Addons: Story = {
  name: "Addon",
  parameters: vitrine("O que cabe num addon. O `Kbd` ganha fundo translúcido e cantos mais redondos dentro do grupo."),
  render: () => <Opcoes larga>{conteudos.map((c) => <Opcao key={c} nome={c}><div className="w-full">{grupo({ ...base, conteudo: c, align: c === "Ícone" ? "inline-start" : "inline-end" })}</div></Opcao>)}</Opcoes>,
}

export const TamanhosBotao: Story = {
  name: "Size do botão",
  parameters: vitrine("No código, `size` no `InputGroupButton`. Sem a propriedade, ele é `xs`."),
  render: () => <Opcoes larga>{tamanhosBotao.map((t) => <Opcao key={t} nome={t}><div className="w-full">{grupo({ ...base, conteudo: "Botão", tamanhoBotao: t, align: "inline-end" })}</div></Opcao>)}</Opcoes>,
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Focus simulado."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="Default"><div className="w-full">{grupo(base)}</div></Opcao>
      <Opcao nome="Focus"><div className="w-full"><Simula estado="Focus" so={controle}>{grupo(base)}</Simula></div></Opcao>
      <Opcao nome="Disabled"><div className="w-full">{grupo({ ...base, disabled: true })}</div></Opcao>
      <Opcao nome="Invalid"><div className="w-full">{grupo({ ...base, invalido: true })}</div></Opcao>
    </Opcoes>
  ),
}

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("Os exemplos do shadcn: preço com moeda dos dois lados, senha com botão de mostrar, busca com contagem, e uma caixa de mensagem com barra de ferramentas embaixo (`block-end`)."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="Preço">
        <InputGroup><InputGroupAddon><InputGroupText>R$</InputGroupText></InputGroupAddon><InputGroupInput placeholder="0,00" aria-label="Preço" /><InputGroupAddon align="inline-end"><InputGroupText>BRL</InputGroupText></InputGroupAddon></InputGroup>
      </Opcao>
      <Opcao nome="Senha">
        <InputGroup><InputGroupInput type="password" defaultValue="segredo123" aria-label="Senha" /><InputGroupAddon align="inline-end"><InputGroupButton size="icon-xs" aria-label="Mostrar senha"><EyeOffIcon /></InputGroupButton></InputGroupAddon></InputGroup>
      </Opcao>
      <Opcao nome="Busca com contagem">
        <InputGroup><InputGroupAddon><SearchIcon /></InputGroupAddon><InputGroupInput defaultValue="pix" aria-label="Buscar" /><InputGroupAddon align="inline-end">12 resultados</InputGroupAddon></InputGroup>
      </Opcao>
      <Opcao nome="Mensagem">
        <InputGroup>
          <InputGroupTextarea placeholder="Pergunte, pesquise ou converse..." aria-label="Mensagem" />
          <InputGroupAddon align="block-end">
            <InputGroupButton variant="outline" size="icon-xs" className="rounded-full" aria-label="Anexar"><PlusIcon /></InputGroupButton>
            <InputGroupText className="ml-auto">52% usado</InputGroupText>
            <Separator orientation="vertical" className="h-4" />
            <InputGroupButton variant="default" size="icon-xs" className="rounded-full" aria-label="Enviar"><ArrowUpIcon /></InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Opcao>
      <Opcao nome="Rótulo em cima">
        <InputGroup>
          <InputGroupInput id="ig-email" placeholder="voce@exemplo.com" />
          <InputGroupAddon align="block-start"><label htmlFor="ig-email" className="text-label-sm text-default">E-mail</label><InfoIcon className="ml-auto" /></InputGroupAddon>
        </InputGroup>
      </Opcao>
    </Opcoes>
  ),
}
