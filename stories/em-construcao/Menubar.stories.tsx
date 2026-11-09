import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Simula, pagina, vitrine, type Interacao } from "../componentes/Opcoes"

const interacoes: Interacao[] = ["Default", "Hover"]

type Controles = { atalhos: boolean; submenu: boolean; marcaveis: boolean; destrutivo: boolean; desabilitado: boolean; estado: Interacao }

// O exemplo do shadcn: Arquivo, Editar, Exibir e Perfis. `aberto` abre um dos menus nas vitrines.
const barra = ({ atalhos, submenu, marcaveis, destrutivo, desabilitado }: Omit<Controles, "estado">, aberto?: "arquivo" | "exibir" | "perfis") => (
  <Menubar>
    <MenubarMenu defaultOpen={aberto === "arquivo" || undefined}>
      <MenubarTrigger>Arquivo</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>Nova aba{atalhos && <MenubarShortcut>⌘T</MenubarShortcut>}</MenubarItem>
        <MenubarItem>Nova janela{atalhos && <MenubarShortcut>⌘N</MenubarShortcut>}</MenubarItem>
        <MenubarItem disabled={desabilitado || undefined}>Janela anônima</MenubarItem>
        {submenu && (
          <>
            <MenubarSeparator />
            <MenubarSub defaultOpen={aberto === "arquivo" || undefined}>
              <MenubarSubTrigger>Compartilhar</MenubarSubTrigger>
              <MenubarSubContent><MenubarItem>Por e-mail</MenubarItem><MenubarItem>Por mensagem</MenubarItem></MenubarSubContent>
            </MenubarSub>
          </>
        )}
        <MenubarSeparator />
        <MenubarItem variant={destrutivo ? "destructive" : undefined}>{destrutivo ? "Fechar tudo" : "Imprimir"}{atalhos && <MenubarShortcut>⌘P</MenubarShortcut>}</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>Editar</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>Desfazer{atalhos && <MenubarShortcut>⌘Z</MenubarShortcut>}</MenubarItem>
        <MenubarItem>Refazer{atalhos && <MenubarShortcut>⇧⌘Z</MenubarShortcut>}</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    {marcaveis && (
      <>
        <MenubarMenu defaultOpen={aberto === "exibir" || undefined}>
          <MenubarTrigger>Exibir</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem defaultChecked>Barra de favoritos</MenubarCheckboxItem>
            <MenubarCheckboxItem>Endereço completo</MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem inset>Recarregar</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu defaultOpen={aberto === "perfis" || undefined}>
          <MenubarTrigger>Perfis</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarLabel>Quem está usando</MenubarLabel>
              <MenubarRadioGroup defaultValue="ana">
                <MenubarRadioItem value="ana">Ana Souza</MenubarRadioItem>
                <MenubarRadioItem value="bruno">Bruno Lima</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </>
    )}
  </Menubar>
)

const base = { atalhos: true, submenu: true, marcaveis: true, destrutivo: false, desabilitado: false }

const meta = {
  title: "Em construção/Menubar",
  render: (args) => barra(args),
  parameters: pagina("Barra de menus fixa, como a de um programa de computador: cada nome abre um menu, e as setas passam de um para o outro. Os menus têm o visual do DropdownMenu e abrem alinhados ao começo do nome (`align=\"start\"` no `MenubarContent`). Na amostra, clique num nome para abrir; as opções embaixo rodam cada uma no próprio quadro, já abertas."),
  argTypes: {
    atalhos: { name: "Atalhos", control: "boolean", description: "`MenubarShortcut`, no fim do item.", table: { category: "Conteúdo" } },
    submenu: { name: "Submenu", control: "boolean", description: "`MenubarSub`, com `MenubarSubTrigger` e `MenubarSubContent`.", table: { category: "Conteúdo" } },
    marcaveis: { name: "Checkbox e Radio", control: "boolean", description: "Os menus Exibir, com `MenubarCheckboxItem`, e Perfis, com `MenubarRadioItem`. Nos dois, a marca fica à esquerda, e o item normal pode receber `inset` para alinhar.", table: { category: "Conteúdo" } },
    destrutivo: { name: "Item destrutivo", control: "boolean", description: "`variant=\"destructive\"` no último item de Arquivo.", table: { category: "Conteúdo" } },
    desabilitado: { name: "Item desabilitado", control: "boolean", description: "`disabled` em Janela anônima.", table: { category: "Estado" } },
    estado: { name: "State", control: "inline-radio", options: interacoes, description: "Simulado, no primeiro nome. Com o menu aberto, o nome fica com o mesmo fundo do hover.", table: { category: "Estado" } },
  },
  args: { ...base, estado: "Default" },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia, { args }) => <Simula estado={args.estado} so="[data-slot=menubar-trigger]"><Historia /></Simula>],
}

export const Arquivo: Story = {
  name: "Conteúdo",
  parameters: vitrine("O menu Arquivo aberto, com atalhos, um item desabilitado e o submenu ao lado.", 320),
  render: () => barra({ ...base, desabilitado: true }, "arquivo"),
}

export const Exibir: Story = {
  name: "Checkbox",
  parameters: vitrine("`MenubarCheckboxItem`: cada um marca e desmarca. O item normal com `inset` alinha com eles.", 260),
  render: () => barra(base, "exibir"),
}

export const Perfis: Story = {
  name: "Radio",
  parameters: vitrine("`MenubarRadioItem` dentro de `MenubarRadioGroup`: escolhe um só.", 240),
  render: () => barra(base, "perfis"),
}
