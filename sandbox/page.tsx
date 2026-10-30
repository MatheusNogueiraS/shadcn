import * as React from "react"
import {
  BellIcon,
  BuildingIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  FileTextIcon,
  HeadsetIcon,
  LandmarkIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MoonIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
  ShieldCheckIcon,
  StarIcon,
  SunIcon,
  UserIcon,
  type LucideIcon,
} from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"
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
  useSidebar,
} from "@/components/ui/sidebar"
import { toast } from "@/components/ui/toast"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { portrait } from "./art"
import { DocumentsView } from "./views/documents"
import { InboxView } from "./views/inbox"
import { OverviewView } from "./views/overview"
import { PaymentsView } from "./views/payments"
import { SiteView } from "./views/site"
import { StatusView } from "./views/status"

type View = { id: string; title: string; icon: LucideIcon; badge?: string; render: () => React.ReactNode }

const views: View[] = [
  { id: "visao-geral", title: "Visão geral", icon: LayoutDashboardIcon, render: () => <OverviewView /> },
  { id: "pagamentos", title: "Pagamentos", icon: SendIcon, render: () => <PaymentsView /> },
  { id: "atendimento", title: "Atendimento", icon: HeadsetIcon, badge: "4", render: () => <InboxView /> },
  { id: "documentos", title: "Documentos", icon: FileTextIcon, render: () => <DocumentsView /> },
  { id: "institucional", title: "Institucional", icon: BuildingIcon, render: () => <SiteView /> },
  { id: "status", title: "Status e feedback", icon: BellIcon, render: () => <StatusView /> },
]

const subscribeHash = (cb: () => void) => {
  window.addEventListener("hashchange", cb)
  return () => window.removeEventListener("hashchange", cb)
}

// A visão fica na URL para poder ser linkada e sobreviver ao recarregar.
function useCurrentView() {
  const hash = React.useSyncExternalStore(subscribeHash, () => window.location.hash.slice(1))
  return views.find((v) => v.id === hash) ?? views[0]
}

export function Page() {
  const view = useCurrentView()
  const [searchOpen, setSearchOpen] = React.useState(false)

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar current={view.id} />
      <SidebarInset>
        <AppHeader title={view.title} onSearch={() => setSearchOpen(true)} />
        <div className="mx-auto w-full max-w-7xl flex-1 p-6">{view.render()}</div>
      </SidebarInset>
      <CommandMenu open={searchOpen} onOpenChange={setSearchOpen} />
    </SidebarProvider>
  )
}

/* ---------- navegação lateral ---------- */

function AppSidebar({ current }: { current: string }) {
  const [filter, setFilter] = React.useState("")
  const shown = views.filter((v) => v.title.toLowerCase().includes(filter.trim().toLowerCase()))
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <AccountSwitcher />
        <SidebarInput value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filtrar menu…" aria-label="Filtrar menu" className="group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Produto</SidebarGroupLabel>
          <SidebarGroupAction title="Nova visão" onClick={() => toast.add({ title: "Nova visão", description: "Ação de grupo da sidebar." })}>
            <PlusIcon /><span className="sr-only">Nova visão</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {shown.map((v) => <NavItem key={v.id} view={v} active={v.id === current} />)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Contas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible" render={<SidebarMenuItem />}>
                <CollapsibleTrigger render={<SidebarMenuButton tooltip="Minhas contas" />}>
                  <LandmarkIcon />
                  <span>Minhas contas</span>
                  <ChevronRightIcon className="ml-auto transition-transform group-data-open/collapsible:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem><SidebarMenuSubButton isActive href="#pagamentos">Corrente ··1192</SidebarMenuSubButton></SidebarMenuSubItem>
                    <SidebarMenuSubItem><SidebarMenuSubButton href="#pagamentos">Poupança ··3349</SidebarMenuSubButton></SidebarMenuSubItem>
                    <SidebarMenuSubItem><SidebarMenuSubButton size="sm" href="#pagamentos">Investimentos</SidebarMenuSubButton></SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Carregando favoritos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem><SidebarMenuSkeleton showIcon /></SidebarMenuItem>
              <SidebarMenuItem><SidebarMenuSkeleton /></SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter><UserMenu /></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function NavItem({ view, active }: { view: View; active: boolean }) {
  const { isMobile, setOpenMobile } = useSidebar()
  const Icon = view.icon
  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={active} tooltip={view.title} render={<a href={`#${view.id}`} onClick={() => isMobile && setOpenMobile(false)} />}>
        <Icon /><span>{view.title}</span>
      </SidebarMenuButton>
      {view.badge && <SidebarMenuBadge>{view.badge}</SidebarMenuBadge>}
      {!view.badge && (
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuAction showOnHover aria-label={`Opções de ${view.title}`} />}><MoreHorizontalIcon /></DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? "bottom" : "right"} align="start">
            <DropdownMenuItem onClick={() => toast.add({ type: "success", title: "Adicionado aos favoritos", description: view.title })}><StarIcon /> Favoritar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </SidebarMenuItem>
  )
}

function AccountSwitcher() {
  const { isMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" tooltip="Trocar perfil" />}>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-brand text-on-brand"><LandmarkIcon className="size-4" /></div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Sandbox</span>
              <span className="truncate text-xs text-muted">Design system</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? "bottom" : "right"} align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Perfis</DropdownMenuLabel>
              <DropdownMenuItem><UserIcon /> Pessoa física</DropdownMenuItem>
              <DropdownMenuItem><BuildingIcon /> Pessoa jurídica</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function UserMenu() {
  const { isMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" tooltip="Conta" />}>
            <Avatar size="sm"><AvatarImage src={portrait("#fa6300", "AS")} alt="Ana Souza" /><AvatarFallback>AS</AvatarFallback></Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Ana Souza</span>
              <span className="truncate text-xs text-muted">ana@exemplo.com</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? "bottom" : "right"} align="end">
            <DropdownMenuItem><ShieldCheckIcon /> Segurança</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive"><LogOutIcon /> Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

/* ---------- topo e busca global ---------- */

function AppHeader({ title, onSearch }: { title: string; onSearch: () => void }) {
  const { theme, setTheme } = useTheme()
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-page/80 px-4 backdrop-blur">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mx-1 h-4 self-center!" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden sm:block"><BreadcrumbLink href="#visao-geral">Sandbox</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator className="hidden sm:block" />
          <BreadcrumbItem><BreadcrumbPage>{title}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onSearch} className="hidden sm:inline-flex">
          <SearchIcon /> Buscar <KbdGroup><Kbd>Ctrl</Kbd><Kbd>K</Kbd></KbdGroup>
        </Button>
        <Button variant="outline" size="icon-sm" onClick={onSearch} aria-label="Buscar" className="sm:hidden"><SearchIcon /></Button>
        <Button variant="outline" size="sm" onClick={() => toast.add({ title: "Tudo certo", description: "Toast disparado pelo topo." })}>
          <BellIcon /><span className="hidden sm:inline">Notificar</span>
        </Button>
        <Badge variant="secondary" className="hidden lg:inline-flex">design system</Badge>
        <Tooltip>
          <TooltipTrigger render={<Button variant="ghost" size="icon" onClick={() => setTheme(dark ? "light" : "dark")} aria-label="Alternar tema" />}>
            {dark ? <SunIcon /> : <MoonIcon />}
          </TooltipTrigger>
          <TooltipContent>Alternar tema</TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
}

function CommandMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const go = (id: string) => {
    window.location.assign(`#${id}`)
    onOpenChange(false)
  }
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Busca global" description="Encontre uma visão ou ação">
      <Command>
        <CommandInput placeholder="Buscar visão ou ação…" />
        <CommandList>
          <CommandEmpty>Nada encontrado.</CommandEmpty>
          <CommandGroup heading="Visões">
            {views.map((v) => {
              const Icon = v.icon
              return <CommandItem key={v.id} value={v.title} onSelect={() => go(v.id)}><Icon /> {v.title}</CommandItem>
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Ações">
            <CommandItem value="Nova transferência" onSelect={() => go("pagamentos")}><SendIcon /> Nova transferência <CommandShortcut>Ctrl+T</CommandShortcut></CommandItem>
            <CommandItem value="Abrir chamado" onSelect={() => go("atendimento")}><HeadsetIcon /> Abrir chamado <CommandShortcut>Ctrl+H</CommandShortcut></CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
