import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowLeftIcon, ArrowRightIcon, RotateCwIcon, Trash2Icon } from "lucide-react"
import { useEffect, useRef } from "react"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { pagina, vitrine } from "../componentes/Opcoes"

type Controles = { icones: boolean; atalhos: boolean; submenu: boolean; marcaveis: boolean; destrutivo: boolean; desabilitado: boolean }

const area = "flex h-36 w-72 items-center justify-center rounded-3xl border-sm border-dashed text-body-sm text-muted"

const itens = ({ icones, atalhos, submenu, marcaveis, destrutivo, desabilitado }: Controles) => (
  <>
    <ContextMenuItem>{icones && <ArrowLeftIcon />}Voltar{atalhos && <ContextMenuShortcut>⌘[</ContextMenuShortcut>}</ContextMenuItem>
    <ContextMenuItem disabled={desabilitado || undefined}>{icones && <ArrowRightIcon />}Avançar{atalhos && <ContextMenuShortcut>⌘]</ContextMenuShortcut>}</ContextMenuItem>
    <ContextMenuItem>{icones && <RotateCwIcon />}Recarregar{atalhos && <ContextMenuShortcut>⌘R</ContextMenuShortcut>}</ContextMenuItem>
    {submenu && (
      <ContextMenuSub>
        <ContextMenuSubTrigger inset={icones || undefined}>Mais ferramentas</ContextMenuSubTrigger>
        <ContextMenuSubContent><ContextMenuItem>Salvar página</ContextMenuItem><ContextMenuItem>Criar atalho</ContextMenuItem></ContextMenuSubContent>
      </ContextMenuSub>
    )}
    {marcaveis && (
      <>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem defaultChecked>Mostrar favoritos</ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Mostrar endereço completo</ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel>Pessoas</ContextMenuLabel>
          <ContextMenuRadioGroup defaultValue="ana">
            <ContextMenuRadioItem value="ana">Ana Souza</ContextMenuRadioItem>
            <ContextMenuRadioItem value="bruno">Bruno Lima</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
      </>
    )}
    <ContextMenuSeparator />
    <ContextMenuItem variant={destrutivo ? "destructive" : undefined}>{icones && <Trash2Icon />}{destrutivo ? "Excluir" : "Imprimir"}</ContextMenuItem>
  </>
)

const base: Controles = { icones: false, atalhos: true, submenu: true, marcaveis: true, destrutivo: false, desabilitado: false }

// Nas vitrines, abre o menu com um clique direito no centro da área.
function Aberto(props: Controles) {
  const alvo = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const t = setTimeout(() => {
      const r = alvo.current?.getBoundingClientRect()
      if (r) alvo.current?.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: r.left + r.width / 2, clientY: r.top + 24, button: 2 }))
    }, 600)
    return () => clearTimeout(t)
  }, [])
  return <ContextMenu><ContextMenuTrigger ref={alvo} className={area}>Clique com o botão direito</ContextMenuTrigger><ContextMenuContent>{itens(props)}</ContextMenuContent></ContextMenu>
}

const meta = {
  title: "Em construção/ContextMenu",
  render: (args) => <ContextMenu><ContextMenuTrigger className={area}>Clique com o botão direito</ContextMenuTrigger><ContextMenuContent>{itens(args)}</ContextMenuContent></ContextMenu>,
  parameters: pagina("Menu que abre no lugar do clique com o botão direito (ou de um toque longo) sobre uma área. Os itens têm o mesmo visual do DropdownMenu. Não tem controle Open: quem dá a posição é o clique. Por padrão, o menu abre à direita do ponteiro (`side=\"right\"`, `align=\"start\"` no `ContextMenuContent`) e vai para o outro lado se faltar espaço. Na amostra, clique com o botão direito na área; as opções embaixo rodam cada uma no próprio quadro, já abertas."),
  argTypes: {
    icones: { name: "Ícones", control: "boolean", description: "Um ícone como primeiro filho do `ContextMenuItem`. O item sem ícone pode receber `inset` para alinhar o texto com os outros.", table: { category: "Conteúdo" } },
    atalhos: { name: "Atalhos", control: "boolean", description: "`ContextMenuShortcut`, no fim do item.", table: { category: "Conteúdo" } },
    submenu: { name: "Submenu", control: "boolean", description: "`ContextMenuSub`, com `ContextMenuSubTrigger` e `ContextMenuSubContent`.", table: { category: "Conteúdo" } },
    marcaveis: { name: "Checkbox e Radio", control: "boolean", description: "`ContextMenuCheckboxItem` e `ContextMenuRadioItem` (dentro de `ContextMenuRadioGroup`), com o ✓ à direita.", table: { category: "Conteúdo" } },
    destrutivo: { name: "Item destrutivo", control: "boolean", description: "`variant=\"destructive\"` no último item.", table: { category: "Conteúdo" } },
    desabilitado: { name: "Item desabilitado", control: "boolean", description: "`disabled` em Avançar.", table: { category: "Estado" } },
  },
  args: base,
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Completo: Story = {
  name: "Conteúdo",
  parameters: vitrine("O exemplo do shadcn: atalhos, submenu, itens de marcar e um grupo com rótulo.", 440),
  render: () => <Aberto {...base} />,
}

export const ComIcones: Story = {
  name: "Ícones e destrutivo",
  parameters: vitrine("Com ícones, um item desabilitado e o último item destrutivo.", 360),
  render: () => <Aberto {...base} icones marcaveis={false} destrutivo desabilitado />,
}
