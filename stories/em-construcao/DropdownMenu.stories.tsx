import type { Meta, StoryObj } from "@storybook/react-vite"
import { CreditCardIcon, LogOutIcon, SettingsIcon, Trash2Icon, UserIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useArgs } from "storybook/preview-api"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { portrait } from "../../sandbox/art"
import { pagina, vitrine } from "../componentes/Opcoes"

const lados = ["bottom", "top", "right", "left"] as const
type Lado = (typeof lados)[number]
const alinhamentos = ["start", "center", "end"] as const
type Alinhamento = (typeof alinhamentos)[number]

type Controles = { aberto: boolean; side: Lado; align: Alinhamento; rotulo: boolean; icones: boolean; atalhos: boolean; submenu: boolean; destrutivo: boolean; desabilitado: boolean }

const itens = ({ rotulo, icones, atalhos, submenu, destrutivo, desabilitado }: Omit<Controles, "aberto" | "side" | "align">) => (
  <>
    <DropdownMenuGroup>
      {rotulo && <DropdownMenuLabel>Minha conta</DropdownMenuLabel>}
      <DropdownMenuItem>{icones && <UserIcon />}Perfil{atalhos && <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>}</DropdownMenuItem>
      <DropdownMenuItem>{icones && <CreditCardIcon />}Cobrança{atalhos && <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>}</DropdownMenuItem>
      <DropdownMenuItem disabled={desabilitado || undefined}>{icones && <SettingsIcon />}Configurações{atalhos && <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>}</DropdownMenuItem>
    </DropdownMenuGroup>
    {submenu && (
      <>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Convidar</DropdownMenuSubTrigger>
          <DropdownMenuSubContent><DropdownMenuItem>Por e-mail</DropdownMenuItem><DropdownMenuItem>Por link</DropdownMenuItem></DropdownMenuSubContent>
        </DropdownMenuSub>
      </>
    )}
    <DropdownMenuSeparator />
    <DropdownMenuItem variant={destrutivo ? "destructive" : undefined}>{icones && (destrutivo ? <Trash2Icon /> : <LogOutIcon />)}{destrutivo ? "Excluir conta" : "Sair"}</DropdownMenuItem>
  </>
)

const base = { side: "bottom" as Lado, align: "start" as Alinhamento, rotulo: true, icones: true, atalhos: true, submenu: true, destrutivo: false, desabilitado: false }
const gatilho = <DropdownMenuTrigger render={<Button variant="outline" />}>Abrir menu</DropdownMenuTrigger>

// Foca um item depois que o menu abre, para mostrar o destaque que o mouse ou o teclado dão.
function FocaItem({ indice }: { indice: number }) {
  useEffect(() => {
    const t = setTimeout(() => document.querySelectorAll<HTMLElement>("[role^=menuitem]")[indice]?.focus(), 1000)
    return () => clearTimeout(t)
  }, [indice])
  return null
}

const meta = {
  title: "Em construção/DropdownMenu",
  // Abrir e fechar na amostra atualiza o controle Open.
  render: function Amostra({ aberto, side, align, ...props }) {
    const [, atualizar] = useArgs<Controles>()
    return (
      <DropdownMenu open={aberto} onOpenChange={(o) => atualizar({ aberto: o })}>
        {gatilho}
        <DropdownMenuContent side={side === "bottom" ? undefined : side} align={align === "start" ? undefined : align}>{itens(props)}</DropdownMenuContent>
      </DropdownMenu>
    )
  },
  parameters: pagina("Menu de ações que abre por um botão. Os itens se navegam pelo teclado, e o item da vez ganha fundo `muted`. A largura acompanha o botão, com no mínimo 192 px. Na amostra, o botão ou o controle **Open** abre o menu, que bloqueia a página até fechar; as opções embaixo rodam cada uma no próprio quadro, já abertas.", "/fotos/ana.png"),
  argTypes: {
    aberto: { name: "Open", control: "boolean", description: "No código, `open` no `DropdownMenu` (ou `defaultOpen`).", table: { category: "Estado" } },
    side: { name: "Side", control: "inline-radio", options: lados, description: "No código, `side` no `DropdownMenuContent`.", table: { category: "Aparência" } },
    align: { name: "Align", control: "inline-radio", options: alinhamentos, description: "No código, `align`. Sem a propriedade, o menu alinha ao começo do botão (`start`).", table: { category: "Aparência" } },
    rotulo: { name: "Rótulo", control: "boolean", description: "`DropdownMenuLabel`: o título de um grupo, em texto pequeno e apagado.", table: { category: "Conteúdo" } },
    icones: { name: "Ícones", control: "boolean", description: "Um ícone como primeiro filho do `DropdownMenuItem`, em 16 px.", table: { category: "Conteúdo" } },
    atalhos: { name: "Atalhos", control: "boolean", description: "`DropdownMenuShortcut`, no fim do item.", table: { category: "Conteúdo" } },
    submenu: { name: "Submenu", control: "boolean", description: "`DropdownMenuSub` com `DropdownMenuSubTrigger` (ganha a seta) e `DropdownMenuSubContent`, que abre ao lado.", table: { category: "Conteúdo" } },
    destrutivo: { name: "Item destrutivo", control: "boolean", description: "`variant=\"destructive\"` no último `DropdownMenuItem`: texto e ícone vermelhos.", table: { category: "Conteúdo" } },
    desabilitado: { name: "Item desabilitado", control: "boolean", description: "`disabled` em Configurações: esmaece e não recebe o destaque.", table: { category: "Estado" } },
  },
  args: { aberto: false, ...base },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Completo: Story = {
  name: "Conteúdo",
  parameters: vitrine("O exemplo do shadcn: rótulo, grupo, ícones, atalhos, separadores e o submenu aberto ao lado.", 360),
  render: () => (
    <DropdownMenu defaultOpen>
      {gatilho}
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuItem><UserIcon />Perfil<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut></DropdownMenuItem>
          <DropdownMenuItem><CreditCardIcon />Cobrança<DropdownMenuShortcut>⌘B</DropdownMenuShortcut></DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub defaultOpen>
          <DropdownMenuSubTrigger>Convidar</DropdownMenuSubTrigger>
          <DropdownMenuSubContent><DropdownMenuItem>Por e-mail</DropdownMenuItem><DropdownMenuItem>Por link</DropdownMenuItem></DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem><LogOutIcon />Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("O destaque aparece no item focado pelo mouse ou pelo teclado (aqui, o segundo). Disabled esmaece; o destrutivo fica vermelho e, focado, ganha fundo `danger-subtle`.", 320),
  render: () => (
    <DropdownMenu defaultOpen>
      {gatilho}
      <DropdownMenuContent>
        <DropdownMenuItem>Default</DropdownMenuItem>
        <DropdownMenuItem>Focus</DropdownMenuItem>
        <DropdownMenuItem disabled>Disabled</DropdownMenuItem>
        <DropdownMenuItem variant="destructive"><Trash2Icon />Destructive</DropdownMenuItem>
        <DropdownMenuItem inset>Inset</DropdownMenuItem>
      </DropdownMenuContent>
      <FocaItem indice={1} />
    </DropdownMenu>
  ),
}

function Marcacoes() {
  const [barra, setBarra] = useState(true)
  const [painel, setPainel] = useState(false)
  const [posicao, setPosicao] = useState("bottom")
  return (
    <DropdownMenu defaultOpen>
      {gatilho}
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Aparência</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={barra} onCheckedChange={setBarra}>Barra de status</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={painel} onCheckedChange={setPainel}>Painel</DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Posição do painel</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={posicao} onValueChange={setPosicao}>
            <DropdownMenuRadioItem value="top">Em cima</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">Embaixo</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right">À direita</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const Marcaveis: Story = {
  name: "Checkbox e Radio",
  parameters: vitrine("Os exemplos do shadcn: `DropdownMenuCheckboxItem` marca e desmarca cada um; `DropdownMenuRadioItem`, dentro de um `DropdownMenuRadioGroup`, escolhe um só. O marcado ganha o ✓ à direita.", 380),
  render: () => <Marcacoes />,
}

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("O exemplo do shadcn com um Avatar no lugar do botão, como o menu de quem está conectado.", 300),
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full" aria-label="Minha conta" />}>
        <Avatar><AvatarImage src={portrait("#fa6300", "AS")} alt="Ana Souza" /><AvatarFallback>AS</AvatarFallback></Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>ana@exemplo.com</DropdownMenuLabel>
          <DropdownMenuItem><UserIcon />Perfil</DropdownMenuItem>
          <DropdownMenuItem><SettingsIcon />Configurações</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem><LogOutIcon />Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
