import type { Meta, StoryObj } from "@storybook/react-vite"
import { CalculatorIcon, CalendarIcon, CreditCardIcon, SettingsIcon, SmileIcon, UserIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useArgs } from "storybook/preview-api"

import { Button } from "@/components/ui/button"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"
import { Opcao, Opcoes, pagina, vitrine } from "../componentes/Opcoes"

type Controles = { busca: string; icones: boolean; atalhos: boolean; grupos: boolean; desabilitado: boolean; marcado: boolean }

const itens = ({ icones, atalhos, grupos, desabilitado, marcado }: Omit<Controles, "busca">) => {
  const sugestoes = (
    <CommandGroup heading={grupos ? "Sugestões" : undefined}>
      <CommandItem>{icones && <CalendarIcon />}Agenda</CommandItem>
      <CommandItem>{icones && <SmileIcon />}Buscar emoji</CommandItem>
      <CommandItem disabled={desabilitado || undefined} data-checked={marcado || undefined}>{icones && <CalculatorIcon />}Calculadora</CommandItem>
    </CommandGroup>
  )
  const ajustes = (
    <CommandGroup heading={grupos ? "Ajustes" : undefined}>
      <CommandItem>{icones && <UserIcon />}Perfil{atalhos && <CommandShortcut>⌘P</CommandShortcut>}</CommandItem>
      <CommandItem>{icones && <CreditCardIcon />}Cobrança{atalhos && <CommandShortcut>⌘B</CommandShortcut>}</CommandItem>
      <CommandItem>{icones && <SettingsIcon />}Configurações{atalhos && <CommandShortcut>⌘S</CommandShortcut>}</CommandItem>
    </CommandGroup>
  )
  return <>{sugestoes}{grupos && <CommandSeparator />}{ajustes}</>
}

// A busca é controlada: o cmdk só filtra pelo `value` que recebe com `onValueChange`.
const paleta = (args: Omit<Controles, "busca">, busca: string, aoMudar: (v: string) => void) => (
  <Command className="rounded-4xl border-sm">
    <CommandInput placeholder="Digite um comando ou busque..." value={busca} onValueChange={aoMudar} />
    <CommandList>
      <CommandEmpty>Nada encontrado.</CommandEmpty>
      {itens(args)}
    </CommandList>
  </Command>
)

// Nas vitrines, cada paleta guarda a própria busca.
function Paleta({ inicial = "", ...args }: Omit<Controles, "busca"> & { inicial?: string }) {
  const [busca, setBusca] = useState(inicial)
  return paleta(args, busca, setBusca)
}

// O exemplo do shadcn: ⌘J ou Ctrl+J abre e fecha a paleta.
function PaletaEmJanela() {
  const [aberta, setAberta] = useState(true)
  useEffect(() => {
    const atalho = (e: KeyboardEvent) => { if (e.key === "j" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setAberta((a) => !a) } }
    document.addEventListener("keydown", atalho)
    return () => document.removeEventListener("keydown", atalho)
  }, [])
  return (
    <div className="flex items-center gap-(--gap-sm) text-body-sm text-muted">
      Aperte <Kbd>⌘J</Kbd> ou
      <Button variant="outline" size="sm" onClick={() => setAberta(true)}>abra a paleta</Button>
      <CommandDialog open={aberta} onOpenChange={setAberta} title="Paleta de comandos" description="Busque um comando para rodar.">
        <Command>
          <CommandInput placeholder="Digite um comando ou busque..." />
          <CommandList><CommandEmpty>Nada encontrado.</CommandEmpty>{itens(base)}</CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}

const base = { icones: true, atalhos: true, grupos: true, desabilitado: false, marcado: false }

const meta = {
  title: "Em construção/Command",
  // O que se digita na amostra atualiza o controle Busca.
  render: function Amostra({ busca, ...args }) {
    const [, atualizar] = useArgs<Controles>()
    return paleta(args, busca, (v) => atualizar({ busca: v }))
  },
  parameters: pagina("Lista de comandos com busca, que filtra enquanto se digita e se navega pelas setas. Fica na página, como aqui, ou dentro de uma janela (`CommandDialog`), a paleta de comandos aberta por um atalho. A largura preenche o pai."),
  argTypes: {
    busca: { name: "Busca", control: "text", description: "O texto do `CommandInput`. O que não combina some; sem nada, aparece o `CommandEmpty`.", table: { category: "Conteúdo" } },
    icones: { name: "Ícones", control: "boolean", description: "Um ícone antes do texto do `CommandItem`.", table: { category: "Conteúdo" } },
    atalhos: { name: "Atalhos", control: "boolean", description: "`CommandShortcut`, no fim do item.", table: { category: "Conteúdo" } },
    grupos: { name: "Grupos", control: "boolean", description: "`heading` no `CommandGroup`: o título do grupo. Entre os grupos, `CommandSeparator`.", table: { category: "Conteúdo" } },
    desabilitado: { name: "Item desabilitado", control: "boolean", description: "`disabled` em Calculadora: esmaece e é pulado pelas setas.", table: { category: "Estado" } },
    marcado: { name: "Item marcado", control: "boolean", description: "`data-checked` em Calculadora: mostra o ✓ no fim (some quando o item tem atalho).", table: { category: "Estado" } },
  },
  args: { busca: "", ...base },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia) => <div className="w-96"><Historia /></div>],
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("O primeiro item que combina com a busca fica selecionado (fundo `muted`); as setas e o mouse mudam a seleção. Sem resultado, aparece o `CommandEmpty`."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="Selected"><div className="w-full"><Paleta {...base} grupos={false} /></div></Opcao>
      <Opcao nome="Disabled e marcado"><div className="w-full"><Paleta {...base} grupos={false} desabilitado marcado atalhos={false} /></div></Opcao>
      <Opcao nome="Busca"><div className="w-full"><Paleta {...base} inicial="co" /></div></Opcao>
      <Opcao nome="Empty"><div className="w-full"><Paleta {...base} inicial="xyz" /></div></Opcao>
    </Opcoes>
  ),
}

export const Janela: Story = {
  name: "CommandDialog",
  parameters: vitrine("O exemplo do shadcn: a paleta dentro de uma janela, que costuma abrir com um atalho como ⌘J. Dentro do `CommandDialog` vai um `Command` com a busca e a lista. O título e a descrição da janela ficam só para o leitor de tela (`title` e `description`). Sem X por padrão: `showCloseButton` o acrescenta.", 460),
  render: () => <PaletaEmJanela />,
}
