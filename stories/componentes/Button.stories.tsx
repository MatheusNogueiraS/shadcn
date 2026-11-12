import type { Meta, StoryObj } from "@storybook/react-vite"
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
import { Opcao, Opcoes, Simula, estadoDe, interacoes, pagina, vitrine, type Interacao } from "./Opcoes"

const variantes = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const
const tamanhos = ["xs", "sm", "default", "lg"] as const
const tamanhosIcone = { xs: "icon-xs", sm: "icon-sm", default: "icon", lg: "icon-lg" } as const
// Altura de cada tamanho em button.tsx (h-6, h-8, h-9, h-10); no Só ícone, a mesma medida vira largura.
const alturas = { xs: 24, sm: 32, default: 36, lg: 40 } as const

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
// Nome que o leitor de tela anuncia no Só ícone: a ação que o ícone representa.
const NOMES: Record<keyof typeof ICONES, string> = { Plus: "Adicionar", ArrowRight: "Avançar", Send: "Enviar", Download: "Baixar", Check: "Confirmar", Search: "Buscar", Mail: "E-mail", Settings: "Configurações", ChevronDown: "Abrir opções", Trash2: "Excluir", X: "Fechar" }
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
  estado: Interacao
  disabled: boolean
  carregando: boolean
  invalido: boolean
  expandido: boolean
}

// Devolve o próprio Button, e não um componente intermediário: é isso que faz o Show code mostrar o código real.
function botao({ variant, size, texto, iconeEsquerda, iconeDireita, soIcone, largura, alinhamento, disabled, carregando, invalido, expandido }: Controles) {
  const preenche = largura === "Preenche"
  const Esquerda = iconeEsquerda === "Nenhum" ? null : ICONES[iconeEsquerda]
  const Direita = iconeDireita === "Nenhum" ? null : ICONES[iconeDireita]
  // Só ícone usa o primeiro ícone escolhido; sem nenhum, usa Plus para o botão não ficar vazio.
  const sozinho = [iconeEsquerda, iconeDireita].find((n) => n !== "Nenhum") ?? "Plus"
  const Sozinho = ICONES[sozinho]
  return (
    <Button
      variant={variant === "default" ? undefined : variant}
      size={soIcone ? tamanhosIcone[size] : size === "default" ? undefined : size}
      className={cn(preenche && "w-full", preenche && JUSTIFICAR[alinhamento]) || undefined}
      disabled={disabled || carregando || undefined}
      aria-invalid={invalido || undefined}
      aria-expanded={expandido || undefined}
      aria-label={soIcone ? NOMES[sozinho] : undefined}
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
  parameters: pagina("Dispara uma ação. A amostra abaixo fica fixa: use os controles para transformá-la em qualquer botão desta página. Em **Show code** aparece o código real, com as propriedades que o `Button` recebe. O modelo Rounded do shadcn é o formato de sempre daqui: o botão já é arredondado."),
  argTypes: {
    variant: { name: "Type", control: "select", options: variantes, description: "Peso visual da ação. No código, a propriedade `variant`.", table: { category: "Aparência" } },
    size: { name: "Size", control: "inline-radio", options: tamanhos, description: "Altura do botão. No código, a propriedade `size`. Com **Só ícone**, vira `icon-xs`, `icon-sm`, `icon` ou `icon-lg`.", table: { category: "Aparência" } },
    texto: { name: "Texto", control: "text", description: "Texto do botão. Some com **Só ícone**.", if: { arg: "soIcone", truthy: false }, table: { category: "Conteúdo" } },
    iconeEsquerda: { name: "Ícone à esquerda", control: "select", options: opcoesIcone, description: "Fica antes do texto, com `data-icon=\"inline-start\"`, que ajusta o padding.", table: { category: "Conteúdo" } },
    iconeDireita: { name: "Ícone à direita", control: "select", options: opcoesIcone, description: "Fica depois do texto, com `data-icon=\"inline-end\"`, que ajusta o padding.", table: { category: "Conteúdo" } },
    soIcone: { name: "Só ícone", control: "boolean", description: "Esconde o texto e deixa o botão quadrado. Usa o ícone escolhido à esquerda ou, sem ele, o da direita.", table: { category: "Conteúdo" } },
    largura: { name: "Largura", control: "inline-radio", options: ["Conteúdo", "Preenche"], description: "`Conteúdo` acompanha o que está dentro. `Preenche` ocupa todo o espaço do pai com `className=\"w-full\"`. Não é uma variante do botão.", table: { category: "Largura" } },
    alinhamento: { name: "Alinhamento", control: "inline-radio", options: Object.keys(JUSTIFICAR), description: "Posição do conteúdo quando o botão preenche: `justify-start` ou `justify-end`.", if: { arg: "largura", eq: "Preenche" }, table: { category: "Largura" } },
    estado: { name: "State", control: "inline-radio", options: interacoes, description: "Hover, Focus e Pressed não são propriedades: quem aplica é o navegador, quando o mouse passa, o teclado foca ou o clique aperta. Aqui a amostra só simula, e o Show code não muda.", table: { category: "Estado" } },
    disabled: { name: "Disabled", control: "boolean", description: "`disabled`: impede a ação e deixa o botão esmaecido.", table: { category: "Estado" } },
    carregando: { name: "Loading", control: "boolean", description: "Mostra o `Spinner` no lugar do ícone e desabilita o botão.", table: { category: "Estado" } },
    invalido: { name: "Invalid", control: "boolean", description: "`aria-invalid`: borda de erro, para botões que abrem um campo, como um seletor de data.", table: { category: "Estado" } },
    expandido: { name: "Expanded", control: "boolean", description: "`aria-expanded`: o menu ou painel que o botão abre está aberto. Muda o fundo em `outline` e `ghost`. É o mais perto de um \"selected\" no Button; o selecionado de verdade é o `Toggle`.", table: { category: "Estado" } },
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
    estado: "Default",
    disabled: false,
    carregando: false,
    invalido: false,
    expandido: false,
  },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  parameters: { docs: { source: { type: "dynamic" } } },
  // A moldura representa o pai: sem um pai com largura definida, não há o que preencher.
  decorators: [
    (Historia, { args }) => {
      const amostra = <Simula estado={estadoDe(args)}><Historia /></Simula>
      return args.largura === "Preenche" ? <div className="w-80 rounded-3xl border-sm border-dashed p-(--padding-2xl)">{amostra}</div> : amostra
    },
  ],
}

export const Tipos: Story = {
  name: "Type",
  parameters: vitrine("No código, `variant`. Sem a propriedade, o botão é `default`."),
  render: () => <Opcoes>{variantes.map((v) => <Opcao key={v} nome={v}><Button variant={v}>Button</Button></Opcao>)}</Opcoes>,
}

export const Tamanhos: Story = {
  name: "Size",
  parameters: vitrine("No código, `size`. A etiqueta traz a altura."),
  render: () => <Opcoes>{tamanhos.map((s) => <Opcao key={s} nome={`${s} · ${alturas[s]} px`}><Button size={s}>Button</Button></Opcao>)}</Opcoes>,
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Hover, Focus e Pressed aparecem simulados; Pressed desce o botão 1 px. Para vê-los em outro Type, use o controle **State** na amostra do topo. Invalid e Expanded aparecem em `outline`, onde mudam o visual."),
  render: () => (
    <Opcoes>
      {interacoes.map((e) => <Opcao key={e} nome={e}><Simula estado={e}><Button>Button</Button></Simula></Opcao>)}
      <Opcao nome="Disabled"><Button disabled>Button</Button></Opcao>
      <Opcao nome="Loading"><Button disabled><Spinner data-icon="inline-start" /> Button</Button></Opcao>
      <Opcao nome="Loading · inline-end"><Button disabled>Button <Spinner data-icon="inline-end" /></Button></Opcao>
      <Opcao nome="Invalid"><Button variant="outline" aria-invalid>Button</Button></Opcao>
      <Opcao nome="Expanded"><Button variant="outline" aria-expanded>Button</Button></Opcao>
    </Opcoes>
  ),
}

export const ComIcone: Story = {
  name: "Com ícone",
  parameters: vitrine("O atributo `data-icon` reduz o padding do lado do ícone, para o conjunto ficar visualmente centrado."),
  render: () => (
    <Opcoes>
      <Opcao nome="inline-start"><Button><PlusIcon data-icon="inline-start" /> Button</Button></Opcao>
      <Opcao nome="inline-end"><Button>Button <ArrowRightIcon data-icon="inline-end" /></Button></Opcao>
      <Opcao nome="Os dois"><Button><MailIcon data-icon="inline-start" /> Button <ChevronDownIcon data-icon="inline-end" /></Button></Opcao>
    </Opcoes>
  ),
}

export const SoIcone: Story = {
  name: "Só ícone",
  parameters: vitrine("Sem texto visível, o `aria-label` é obrigatório: é o que o leitor de tela anuncia."),
  render: () => (
    <Opcoes>
      {tamanhos.map((s) => <Opcao key={s} nome={`${tamanhosIcone[s]} · ${alturas[s]} px`}><Button size={tamanhosIcone[s]} aria-label="Adicionar"><PlusIcon /></Button></Opcao>)}
    </Opcoes>
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
