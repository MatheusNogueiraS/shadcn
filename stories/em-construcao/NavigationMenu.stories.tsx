import type { Meta, StoryObj } from "@storybook/react-vite"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react"
import { useArgs } from "storybook/preview-api"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Simula, pagina, vitrine, type Interacao } from "../componentes/Opcoes"

const abertos = ["Nenhum", "inicio", "produtos", "status"] as const
type Aberto = (typeof abertos)[number]
const alinhamentos = ["start", "center", "end"] as const
type Alinhamento = (typeof alinhamentos)[number]
const interacoes: Interacao[] = ["Default", "Hover", "Focus"]

type Controles = { aberto: Aberto; align: Alinhamento; estado: Interacao }

const produtos = [
  ["Pix", "Pagamentos na hora, a qualquer hora."],
  ["Boleto", "Cobranças que compensam em até 3 dias."],
  ["Cartão", "Crédito em até 12 vezes."],
  ["Link de pagamento", "Um link para cobrar por mensagem."],
] as const

const link = (titulo: string, texto: string) => (
  <li key={titulo}>
    <NavigationMenuLink href={`#${titulo}`} className="flex-col items-start gap-(--gap-2xs)">
      <span className="text-label-sm">{titulo}</span>
      <span className="line-clamp-2 text-muted">{texto}</span>
    </NavigationMenuLink>
  </li>
)

// O exemplo do shadcn: um destaque com lista, uma grade de links, uma lista com ícones e um link solto.
const menu = ({ align }: Pick<Controles, "align">, valor?: { aberto: Aberto; aoMudar?: (v: Aberto) => void }) => (
  <NavigationMenu
    align={align === "start" ? undefined : align}
    value={valor?.aoMudar ? (valor.aberto === "Nenhum" ? null : valor.aberto) : undefined}
    defaultValue={valor && !valor.aoMudar && valor.aberto !== "Nenhum" ? valor.aberto : undefined}
    onValueChange={valor?.aoMudar ? (v) => valor.aoMudar?.((v as Aberto | null) ?? "Nenhum") : undefined}
  >
    <NavigationMenuList>
      <NavigationMenuItem value="inicio">
        <NavigationMenuTrigger>Início</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-96 grid-cols-[.75fr_1fr] gap-(--gap-xs)">
            <li className="row-span-3">
              <NavigationMenuLink href="#inicio" className="h-full flex-col items-start justify-end bg-muted/50 p-(--padding-2xl)">
                <span className="text-heading-sm">Conta PJ</span>
                <span className="text-muted">Tudo para receber e pagar num lugar só.</span>
              </NavigationMenuLink>
            </li>
            {link("Abrir conta", "Leva 5 minutos, pelo celular.")}
            {link("Tarifas", "O que é grátis e o que é cobrado.")}
            {link("Segurança", "Como protegemos seu dinheiro.")}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem value="produtos">
        <NavigationMenuTrigger>Produtos</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-md grid-cols-2 gap-(--gap-xs)">{produtos.map(([t, x]) => link(t, x))}</ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem value="status">
        <NavigationMenuTrigger>Status</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-48 gap-(--gap-xs)">
            <li><NavigationMenuLink href="#pendente"><CircleHelpIcon />Pendente</NavigationMenuLink></li>
            <li><NavigationMenuLink href="#agendado"><CircleIcon />Agendado</NavigationMenuLink></li>
            <li><NavigationMenuLink href="#pago"><CircleCheckIcon />Pago</NavigationMenuLink></li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#ajuda" className={navigationMenuTriggerStyle()}>Ajuda</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
)

const meta = {
  title: "Em construção/NavigationMenu",
  // Abrir e fechar um item na amostra atualiza o controle Aberto.
  render: function Amostra({ aberto, align }) {
    const [, atualizar] = useArgs<Controles>()
    return menu({ align }, { aberto, aoMudar: (v) => atualizar({ aberto: v }) })
  },
  parameters: pagina("Menu de navegação de um site, com itens que abrem painéis de links ao passar o mouse ou clicar. Um item pode ser só um link, com o mesmo visual dos gatilhos (`navigationMenuTriggerStyle`). O `active` do link ainda não muda o visual: o estilo procura `data-active=\"true\"`, e o Base UI marca só `data-active`. Na amostra, passe o mouse nos itens ou use o controle **Aberto**; as opções embaixo rodam cada uma no próprio quadro, já abertas."),
  argTypes: {
    aberto: { name: "Aberto", control: "inline-radio", options: abertos, description: "No código, `value` no `NavigationMenu`: o `value` do `NavigationMenuItem` aberto (ou `defaultValue`).", table: { category: "Estado" } },
    align: { name: "Align", control: "inline-radio", options: alinhamentos, description: "No código, `align` no `NavigationMenu`: o painel alinha ao começo, ao centro ou ao fim do item.", table: { category: "Aparência" } },
    estado: { name: "State", control: "inline-radio", options: interacoes, description: "Simulado, no primeiro gatilho.", table: { category: "Estado" } },
  },
  args: { aberto: "Nenhum", align: "start", estado: "Default" },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia, { args }) => <Simula estado={args.estado} so="[data-slot=navigation-menu-trigger]"><Historia /></Simula>],
}

const porItem = (aberto: Aberto, nome: string, descricao: string, altura: number): Story => ({
  name: nome,
  parameters: vitrine(descricao, altura),
  render: () => menu({ align: "start" }, { aberto }),
})

export const Inicio = porItem("inicio", "Painel com destaque", "Um link maior de destaque ao lado de uma lista. Aberto, o gatilho fica com fundo `muted/50` e a seta vira para cima.", 420)
export const Produtos = porItem("produtos", "Painel em grade", "Uma grade de links com título e descrição.", 280)
export const Status = porItem("status", "Painel com ícones", "Links com um ícone antes do texto.", 260)

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Hover e Focus simulados nos gatilhos."),
  render: () => (
    <div className="flex flex-col items-start gap-(--gap-2xl)">
      {interacoes.map((e) => <div key={e} className="flex items-center gap-(--gap-lg)"><span className="w-16 text-label-xs">{e}</span><Simula estado={e} so="[data-slot=navigation-menu-trigger]">{menu({ align: "start" })}</Simula></div>)}
    </div>
  ),
}
