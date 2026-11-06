import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ReactNode } from "react"
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  DownloadIcon,
  MailIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
  SettingsIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { PaginaComponente } from "./PaginaComponente"

const variantes = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const
const tamanhos = ["xs", "sm", "default", "lg"] as const
const tamanhosIcone = { xs: "icon-xs", sm: "icon-sm", default: "icon", lg: "icon-lg" } as const

const ICONES = {
  Plus: PlusIcon,
  ArrowRight: ArrowRightIcon,
  Send: SendIcon,
  Download: DownloadIcon,
  Check: CheckIcon,
  Search: SearchIcon,
  Mail: MailIcon,
  Settings: SettingsIcon,
  ChevronDown: ChevronDownIcon,
  Trash2: Trash2Icon,
  X: XIcon,
}
type NomeIcone = keyof typeof ICONES | "Nenhum"
const opcoesIcone = ["Nenhum", ...Object.keys(ICONES)]

const JUSTIFICAR = { Centro: "", Esquerda: "justify-start", Direita: "justify-end" }

type Controles = {
  variant: (typeof variantes)[number]
  size: (typeof tamanhos)[number]
  texto: string
  iconeEsquerda: NomeIcone
  iconeDireita: NomeIcone
  soIcone: boolean
  largura: "Conteúdo" | "Preenche"
  alinhamento: keyof typeof JUSTIFICAR
  disabled: boolean
  carregando: boolean
  invalido: boolean
  expandido: boolean
  comoLink: boolean
}

// Devolve o próprio Button, e não um componente intermediário: é isso que faz o Show code mostrar o código real.
function botao({ variant, size, texto, iconeEsquerda, iconeDireita, soIcone, largura, alinhamento, disabled, carregando, invalido, expandido, comoLink }: Controles) {
  const preenche = largura === "Preenche"
  const Esquerda = iconeEsquerda === "Nenhum" ? null : ICONES[iconeEsquerda]
  const Direita = iconeDireita === "Nenhum" ? null : ICONES[iconeDireita]
  // Só ícone usa o primeiro ícone escolhido; sem nenhum, usa Plus para o botão não ficar vazio.
  const Sozinho = Esquerda ?? Direita ?? PlusIcon
  return (
    <Button
      variant={variant === "default" ? undefined : variant}
      size={soIcone ? tamanhosIcone[size] : size === "default" ? undefined : size}
      className={cn(preenche && "w-full", preenche && JUSTIFICAR[alinhamento]) || undefined}
      disabled={disabled || carregando || undefined}
      aria-invalid={invalido || undefined}
      aria-expanded={expandido || undefined}
      aria-label={soIcone ? texto : undefined}
      {...(comoLink ? { render: <a href="#exemplo" />, nativeButton: false } : {})}
    >
      {soIcone && (carregando ? <Spinner /> : <Sozinho />)}
      {!soIcone && (carregando ? <Spinner data-icon="inline-start" /> : Esquerda && <Esquerda data-icon="inline-start" />)}
      {!soIcone && texto}
      {!soIcone && Direita && <Direita data-icon="inline-end" />}
    </Button>
  )
}

const meta = {
  title: "Componentes/Button",
  render: botao,
  parameters: {
    controls: { sort: "none", expanded: true },
    docs: {
      page: PaginaComponente,
      description: {
        component:
          "Dispara uma ação. A amostra abaixo fica fixa: use os controles para transformá-la em qualquer botão desta página. Em **Show code** aparece o código real, com as propriedades que o `Button` recebe.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: variantes, description: "Peso visual da ação.", table: { category: "Aparência" } },
    size: { control: "inline-radio", options: tamanhos, description: "Altura do botão. Com **Só ícone**, vira `icon-xs`, `icon-sm`, `icon` ou `icon-lg`.", table: { category: "Aparência" } },
    texto: { name: "Texto", control: "text", description: "Texto do botão. Com **Só ícone**, vira o `aria-label`, obrigatório para leitores de tela.", table: { category: "Conteúdo" } },
    iconeEsquerda: { name: "Ícone à esquerda", control: "select", options: opcoesIcone, description: "Fica antes do texto, com `data-icon=\"inline-start\"`, que ajusta o padding.", table: { category: "Conteúdo" } },
    iconeDireita: { name: "Ícone à direita", control: "select", options: opcoesIcone, description: "Fica depois do texto, com `data-icon=\"inline-end\"`, que ajusta o padding.", table: { category: "Conteúdo" } },
    soIcone: { name: "Só ícone", control: "boolean", description: "Esconde o texto e deixa o botão quadrado. Usa o ícone escolhido à esquerda ou, sem ele, o da direita.", table: { category: "Conteúdo" } },
    largura: { name: "Largura", control: "inline-radio", options: ["Conteúdo", "Preenche"], description: "`Conteúdo` acompanha o que está dentro. `Preenche` ocupa todo o espaço do pai com `className=\"w-full\"`. Não é uma variante do botão.", table: { category: "Largura" } },
    alinhamento: { name: "Alinhamento", control: "inline-radio", options: Object.keys(JUSTIFICAR), description: "Posição do conteúdo quando o botão preenche: `justify-start` ou `justify-end`.", if: { arg: "largura", eq: "Preenche" }, table: { category: "Largura" } },
    disabled: { control: "boolean", description: "Impede a ação e deixa o botão esmaecido.", table: { category: "Estado" } },
    carregando: { name: "Carregando", control: "boolean", description: "Mostra o `Spinner` no lugar do ícone e desabilita o botão.", table: { category: "Estado" } },
    invalido: { name: "Inválido", control: "boolean", description: "`aria-invalid`: borda de erro, para botões que abrem um campo, como um seletor de data.", table: { category: "Estado" } },
    expandido: { name: "Expandido", control: "boolean", description: "`aria-expanded`: o menu ou painel que o botão abre está aberto. Muda o fundo em `outline` e `ghost`.", table: { category: "Estado" } },
    comoLink: { name: "Como link", control: "boolean", description: "Renderiza um `<a>`, com `render` e `nativeButton={false}`.", table: { category: "Elemento" } },
  },
  args: {
    variant: "default",
    size: "default",
    texto: "Confirmar",
    iconeEsquerda: "Nenhum",
    iconeDireita: "Nenhum",
    soIcone: false,
    largura: "Conteúdo",
    alinhamento: "Centro",
    disabled: false,
    carregando: false,
    invalido: false,
    expandido: false,
    comoLink: false,
  },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

// As histórias abaixo são vitrines fixas: quem muda é a amostra do topo.
const vitrine = (descricao?: string) => ({
  controls: { disable: true },
  ...(descricao ? { docs: { description: { story: descricao } } } : {}),
})

function Linha({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-(--gap-lg)">{children}</div>
}

export const Padrao: Story = {
  name: "Padrão",
  parameters: { docs: { source: { type: "dynamic" } } },
  // A moldura representa o pai: sem um pai com largura definida, não há o que preencher.
  decorators: [
    (Historia, { args }) =>
      args.largura === "Preenche" ? (
        <div className="w-80 rounded-3xl border border-dashed p-(--padding-2xl)"><Historia /></div>
      ) : (
        <Historia />
      ),
  ],
}

export const Variantes: Story = {
  parameters: vitrine(),
  render: () => <Linha>{variantes.map((v) => <Button key={v} variant={v}>{v}</Button>)}</Linha>,
}

export const Tamanhos: Story = {
  parameters: vitrine(),
  render: () => <Linha>{tamanhos.map((s) => <Button key={s} size={s}>{s}</Button>)}</Linha>,
}

export const VariantesETamanhos: Story = {
  name: "Variantes e tamanhos",
  parameters: vitrine(),
  render: () => (
    <div className="flex flex-col gap-(--gap-lg)">
      {variantes.map((v) => <Linha key={v}>{tamanhos.map((s) => <Button key={s} variant={v} size={s}>{v} {s}</Button>)}</Linha>)}
    </div>
  ),
}

export const ComIcone: Story = {
  name: "Com ícone",
  parameters: vitrine("O atributo `data-icon` reduz o padding do lado do ícone, para o conjunto ficar visualmente centrado."),
  render: () => (
    <Linha>
      <Button><PlusIcon data-icon="inline-start" /> À esquerda</Button>
      <Button variant="secondary">À direita <ArrowRightIcon data-icon="inline-end" /></Button>
      <Button variant="outline"><MailIcon data-icon="inline-start" /> Dos dois lados <ChevronDownIcon data-icon="inline-end" /></Button>
    </Linha>
  ),
}

export const SoIcone: Story = {
  name: "Só ícone",
  parameters: vitrine("Sem texto visível, o `aria-label` é obrigatório: é o que o leitor de tela anuncia."),
  render: () => (
    <Linha>
      {(["icon-xs", "icon-sm", "icon", "icon-lg"] as const).map((s) => <Button key={s} size={s} aria-label="Adicionar"><PlusIcon /></Button>)}
      {variantes.map((v) => <Button key={v} size="icon" variant={v} aria-label="Adicionar"><PlusIcon /></Button>)}
    </Linha>
  ),
}

export const Estados: Story = {
  parameters: vitrine("Mouse em cima e foco não têm controle: passe o mouse ou use a tecla Tab na amostra."),
  render: () => (
    <Linha>
      <Button disabled>Desabilitado</Button>
      <Button disabled><Spinner data-icon="inline-start" /> Carregando</Button>
      <Button variant="outline" aria-invalid>Inválido</Button>
      <Button variant="outline" aria-expanded>Expandido</Button>
    </Linha>
  ),
}

export const Largura: Story = {
  parameters: vitrine("Quem decide a largura é o lugar onde o botão está, e não o botão: por isso é uma classe, e não uma variante."),
  render: () => (
    <Card className="w-80">
      <CardHeader><CardTitle>Dentro de um card</CardTitle></CardHeader>
      <CardContent className="flex flex-col items-start gap-(--gap-lg)">
        <Button variant="outline">Acompanha o conteúdo</Button>
        <Button variant="outline" className="w-full">Preenche, com w-full</Button>
        <Button variant="outline" className="w-full justify-start"><SearchIcon data-icon="inline-start" /> Preenche, à esquerda</Button>
      </CardContent>
      <CardFooter className="gap-(--gap-sm)">
        <Button variant="outline" className="flex-1">Divide</Button>
        <Button className="flex-1">O espaço</Button>
      </CardFooter>
    </Card>
  ),
}

export const ComoLink: Story = {
  name: "Como link",
  parameters: vitrine("Quando o elemento não é um `<button>`, informe `nativeButton={false}` junto com `render`."),
  render: () => <Button nativeButton={false} render={<a href="#exemplo" />}>Ver detalhes</Button>,
}
