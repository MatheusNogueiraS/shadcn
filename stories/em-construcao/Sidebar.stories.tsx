import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronsUpDownIcon, HomeIcon, InboxIcon, MoreHorizontalIcon, PlusIcon, SettingsIcon, WalletIcon } from "lucide-react"
import type { ReactNode } from "react"
import { useArgs } from "storybook/preview-api"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Opcao, Opcoes, Simula, pagina, vitrine } from "../componentes/Opcoes"

const lados = ["left", "right"] as const
type Lado = (typeof lados)[number]
const variantes = ["sidebar", "floating", "inset"] as const
type Variante = (typeof variantes)[number]
const recolhimentos = ["offcanvas", "icon", "none"] as const
type Recolhimento = (typeof recolhimentos)[number]
const tamanhos = ["default", "sm", "lg"] as const
type Tamanho = (typeof tamanhos)[number]

type Controles = { aberto: boolean; side: Lado; variant: Variante; collapsible: Recolhimento; size: Tamanho; outline: boolean; busca: boolean; extras: boolean; rail: boolean; carregando: boolean }

const paginas = [["Início", HomeIcon], ["Caixa de entrada", InboxIcon], ["Pagamentos", WalletIcon], ["Configurações", SettingsIcon]] as const

// O conteúdo da barra: cabeçalho, busca, um grupo de páginas e o rodapé com a conta.
const conteudo = ({ size, outline, busca, extras, carregando, rail }: Pick<Controles, "size" | "outline" | "busca" | "extras" | "carregando" | "rail">) => (
  <>
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <span className="flex size-(--size-2xl) items-center justify-center rounded-2xl bg-brand text-on-brand"><WalletIcon /></span>
            <span className="flex flex-col"><span className="text-label-sm">Conta PJ</span><span className="text-body-xs text-muted">Plano Pro</span></span>
            <ChevronsUpDownIcon className="ml-auto" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      {busca && <SidebarInput placeholder="Buscar" aria-label="Buscar" />}
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Páginas</SidebarGroupLabel>
        {extras && <SidebarGroupAction title="Nova página"><PlusIcon /></SidebarGroupAction>}
        <SidebarGroupContent>
          <SidebarMenu>
            {carregando
              ? Array.from({ length: 4 }, (_, i) => <SidebarMenuItem key={i}><SidebarMenuSkeleton showIcon /></SidebarMenuItem>)
              : paginas.map(([nome, Icone], i) => (
                  <SidebarMenuItem key={nome}>
                    <SidebarMenuButton size={size === "default" ? undefined : size} variant={outline ? "outline" : undefined} isActive={i === 0} tooltip={nome}><Icone /><span>{nome}</span></SidebarMenuButton>
                    {extras && i === 1 && <SidebarMenuBadge>12</SidebarMenuBadge>}
                    {extras && i === 2 && <SidebarMenuAction showOnHover aria-label="Mais opções"><MoreHorizontalIcon /></SidebarMenuAction>}
                    {extras && i === 2 && (
                      <SidebarMenuSub>
                        <SidebarMenuSubItem><SidebarMenuSubButton href="#pix" isActive>Pix</SidebarMenuSubButton></SidebarMenuSubItem>
                        <SidebarMenuSubItem><SidebarMenuSubButton href="#boleto">Boleto</SidebarMenuSubButton></SidebarMenuSubItem>
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarSeparator />
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Ana Souza"><Avatar size="sm"><AvatarFallback>AS</AvatarFallback></Avatar><span>Ana Souza</span></SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
    {rail && <SidebarRail />}
  </>
)

// Na página, a barra fica presa a uma moldura: `absolute` e `h-full` trocam o `fixed` e o `h-svh` de quando ela ocupa a tela.
const layout = (args: Omit<Controles, "aberto">, provedor: { open?: boolean; defaultOpen?: boolean; onOpenChange?: (o: boolean) => void }, altura = "h-96") => (
  <SidebarProvider {...provedor} className={`relative ${altura} min-h-0 overflow-hidden rounded-3xl border-sm`}>
    <Sidebar side={args.side === "left" ? undefined : args.side} variant={args.variant === "sidebar" ? undefined : args.variant} collapsible={args.collapsible === "offcanvas" ? undefined : args.collapsible} className={args.collapsible === "none" ? undefined : "absolute h-full"}>
      {conteudo(args)}
    </Sidebar>
    <SidebarInset>
      <header className="flex h-12 items-center gap-(--gap-sm) border-b-sm px-(--padding-lg)">
        {args.collapsible !== "none" && <SidebarTrigger />}
        <span className="text-label-sm">Início</span>
      </header>
      <div className="flex flex-1 flex-col gap-(--gap-lg) p-(--padding-lg)">
        <div className="h-16 rounded-2xl bg-muted/50" />
        <div className="flex-1 rounded-2xl bg-muted/50" />
      </div>
    </SidebarInset>
  </SidebarProvider>
)

const base = { side: "left" as Lado, variant: "sidebar" as Variante, collapsible: "offcanvas" as Recolhimento, size: "default" as Tamanho, outline: false, busca: false, extras: true, rail: true, carregando: false }

const meta = {
  title: "Em construção/Sidebar",
  // Abrir e fechar pela amostra (botão ou ⌘B) atualiza o controle Open.
  render: function Amostra({ aberto, ...args }) {
    const [, atualizar] = useArgs<Controles>()
    return layout(args, { open: aberto, onOpenChange: (o) => atualizar({ aberto: o }) })
  },
  parameters: pagina("Barra lateral de navegação de um app, com cabeçalho, grupos de links e rodapé. No uso, ela ocupa a altura da tela, presa à borda; nesta página fica dentro de uma moldura. No celular, vira um Sheet. O `SidebarProvider` guarda se ela está aberta, e o `SidebarTrigger` (ou ⌘B) abre e fecha."),
  argTypes: {
    aberto: { name: "Open", control: "boolean", description: "No código, `open` no `SidebarProvider` (ou `defaultOpen`). Fechada, ela some (`offcanvas`) ou vira uma coluna de ícones (`icon`).", table: { category: "Estado" } },
    side: { name: "Side", control: "inline-radio", options: lados, description: "No código, `side` na `Sidebar`.", table: { category: "Aparência" } },
    variant: { name: "Type", control: "inline-radio", options: variantes, description: "No código, `variant` na `Sidebar`: colada na borda (`sidebar`), solta e flutuante (`floating`) ou com o conteúdo num cartão ao lado (`inset`, junto com o `SidebarInset`).", table: { category: "Aparência" } },
    collapsible: { name: "Collapsible", control: "inline-radio", options: recolhimentos, description: "No código, `collapsible`: como ela fecha. `none` não fecha e fica no fluxo da página.", table: { category: "Comportamento" } },
    size: { name: "Size dos itens", control: "inline-radio", options: tamanhos, description: "`size` no `SidebarMenuButton`: 36 px (`default`), 32 px (`sm`) ou 56 px (`lg`, como o do cabeçalho).", table: { category: "Itens" } },
    outline: { name: "Itens outline", control: "boolean", description: "`variant=\"outline\"` no `SidebarMenuButton`: fundo da página e contorno.", table: { category: "Itens" } },
    extras: { name: "Extras", control: "boolean", description: "`SidebarGroupAction` (o + do grupo), `SidebarMenuBadge` (o 12), `SidebarMenuAction` com `showOnHover` (os ... que aparecem no hover) e `SidebarMenuSub` (Pix e Boleto).", table: { category: "Itens" } },
    busca: { name: "Busca", control: "boolean", description: "`SidebarInput` no cabeçalho.", table: { category: "Conteúdo" } },
    rail: { name: "Rail", control: "boolean", description: "`SidebarRail`: uma faixa fina na borda que abre e fecha a barra ao clicar.", table: { category: "Conteúdo" } },
    carregando: { name: "Loading", control: "boolean", description: "`SidebarMenuSkeleton` no lugar dos itens, com `showIcon`.", table: { category: "Estado" } },
  },
  args: { aberto: true, ...base },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia) => <div className="w-2xl"><Historia /></div>],
}

// As vitrines rodam em quadros: cada SidebarProvider escuta o ⌘B, e na mesma página todas abririam e fechariam juntas.
const rotulo = (nome: string, filho: ReactNode) => <div key={nome} className="flex flex-col gap-(--gap-sm)"><span className="text-label-xs">{nome}</span>{filho}</div>

export const Tipos: Story = {
  name: "Type",
  parameters: vitrine("No código, `variant`. Sem a propriedade, a Sidebar é `sidebar`.", 1040),
  render: () => <div className="flex w-full flex-col gap-(--gap-3xl)">{variantes.map((v) => rotulo(v, layout({ ...base, variant: v }, {}, "h-72")))}</div>,
}

export const Recolhida: Story = {
  name: "Collapsible",
  parameters: vitrine("Fechada: `icon` vira uma coluna de ícones (o nome aparece num Tooltip ao passar o mouse, pela propriedade `tooltip`), e `offcanvas` some por inteiro. `none` não fecha.", 1040),
  render: () => (
    <div className="flex w-full flex-col gap-(--gap-3xl)">
      {rotulo("icon · fechada", layout({ ...base, collapsible: "icon" }, { defaultOpen: false }, "h-72"))}
      {rotulo("offcanvas · fechada", layout(base, { defaultOpen: false }, "h-72"))}
      {rotulo("none", layout({ ...base, collapsible: "none" }, {}, "h-72"))}
    </div>
  ),
}

const menu = (args: Partial<typeof base>, estado?: "Hover" | "Focus") => (
  <SidebarProvider className="min-h-0">
    <Sidebar collapsible="none" className="h-auto rounded-3xl border-sm">
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {paginas.slice(0, 3).map(([nome, Icone], i) => (
              <SidebarMenuItem key={nome}>
                {estado && i === 1
                  ? <Simula estado={estado}><SidebarMenuButton size={args.size === "default" ? undefined : args.size} variant={args.outline ? "outline" : undefined}><Icone /><span>{nome}</span></SidebarMenuButton></Simula>
                  : <SidebarMenuButton size={args.size === "default" ? undefined : args.size} variant={args.outline ? "outline" : undefined} isActive={i === 0}><Icone /><span>{nome}</span></SidebarMenuButton>}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  </SidebarProvider>
)

export const Itens: Story = {
  name: "Itens",
  parameters: vitrine("O `SidebarMenuButton`: o primeiro de cada lista está ativo (`isActive`), com fundo `muted` e texto mais forte. Hover e Focus simulados no segundo.", 640),
  render: () => (
    <Opcoes larga>
      {tamanhos.map((s) => <Opcao key={s} nome={`size ${s}`}>{menu({ size: s })}</Opcao>)}
      <Opcao nome="outline">{menu({ size: "default", outline: true })}</Opcao>
      <Opcao nome="Hover">{menu({ size: "default" }, "Hover")}</Opcao>
      <Opcao nome="Focus">{menu({ size: "default" }, "Focus")}</Opcao>
    </Opcoes>
  ),
}

export const Carregando: Story = {
  name: "Loading",
  parameters: vitrine("`SidebarMenuSkeleton` enquanto os itens carregam; com `showIcon`, o quadrado do ícone entra junto.", 260),
  render: () => (
    <SidebarProvider className="min-h-0">
      <Sidebar collapsible="none" className="h-auto rounded-3xl border-sm">
        <SidebarContent><SidebarGroup><SidebarMenu>{[true, true, false, false].map((icone, i) => <SidebarMenuItem key={i}><SidebarMenuSkeleton showIcon={icone} /></SidebarMenuItem>)}</SidebarMenu></SidebarGroup></SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
}
