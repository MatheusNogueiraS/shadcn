import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs } from "storybook/preview-api"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { pagina, vitrine } from "../componentes/Opcoes"

const lados = ["right", "left", "top", "bottom"] as const
type Lado = (typeof lados)[number]

type Controles = { aberto: boolean; side: Lado; titulo: string; descricao: boolean; fechar: boolean; rodape: boolean }

const painel = ({ side, titulo, descricao, fechar, rodape }: Omit<Controles, "aberto">) => (
  <SheetContent side={side === "right" ? undefined : side} showCloseButton={fechar}>
    <SheetHeader>
      <SheetTitle>{titulo}</SheetTitle>
      {descricao && <SheetDescription>Mude seus dados e salve no fim.</SheetDescription>}
    </SheetHeader>
    <FieldGroup className="px-(--padding-3xl)">
      <Field><FieldLabel htmlFor={`sheet-nome-${side}`}>Nome</FieldLabel><Input id={`sheet-nome-${side}`} defaultValue="Ana Souza" /></Field>
    </FieldGroup>
    {rodape && <SheetFooter><Button>Salvar</Button><SheetClose render={<Button variant="outline" />}>Cancelar</SheetClose></SheetFooter>}
  </SheetContent>
)

const base = { side: "right" as Lado, titulo: "Editar perfil", descricao: true, fechar: true, rodape: true }
const aberto = (props: Omit<Controles, "aberto">) => <Sheet defaultOpen><SheetTrigger render={<Button variant="outline" />}>Abrir</SheetTrigger>{painel(props)}</Sheet>

const meta = {
  title: "Em construção/Sheet",
  // Abrir e fechar na amostra atualiza o controle Open.
  render: function Amostra({ aberto: open, ...props }) {
    const [, atualizar] = useArgs<Controles>()
    return (
      <Sheet open={open} onOpenChange={(o) => atualizar({ aberto: o })}>
        <SheetTrigger render={<Button variant="outline" />}>Editar perfil</SheetTrigger>
        {painel(props)}
      </Sheet>
    )
  },
  parameters: pagina("Painel que desliza de uma borda da tela, para tarefas que pedem mais espaço sem sair da página, como filtros ou um cadastro. O fundo escurece, como no Dialog. Na amostra, o botão ou o controle **Open** abre o painel por cima desta página; as opções embaixo rodam cada uma no próprio quadro."),
  argTypes: {
    aberto: { name: "Open", control: "boolean", description: "No código, `open` no `Sheet` (ou `defaultOpen`).", table: { category: "Estado" } },
    side: { name: "Side", control: "inline-radio", options: lados, description: "No código, `side` no `SheetContent`: a borda de onde o painel sai. Dos lados, ocupa 3/4 da largura até 384 px; em cima e embaixo, a largura toda.", table: { category: "Aparência" } },
    titulo: { name: "Título", control: "text", description: "`SheetTitle`.", table: { category: "Conteúdo" } },
    descricao: { name: "Descrição", control: "boolean", description: "`SheetDescription`, abaixo do título.", table: { category: "Conteúdo" } },
    fechar: { name: "Botão de fechar", control: "boolean", description: "`showCloseButton`: o X no canto de cima.", table: { category: "Conteúdo" } },
    rodape: { name: "Rodapé", control: "boolean", description: "`SheetFooter`: fica colado embaixo, com os botões empilhados.", table: { category: "Conteúdo" } },
  },
  args: { aberto: false, ...base },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

const porLado = (side: Lado, descricao: string, altura: number): Story => ({
  name: `Side · ${side}`,
  parameters: vitrine(descricao, altura),
  render: () => aberto({ ...base, side }),
})

export const Direita = porLado("right", "O exemplo Side do shadcn, um quadro por borda. Sem a propriedade, o painel sai da direita.", 420)
export const Esquerda = porLado("left", "", 420)
export const Topo = porLado("top", "", 320)
export const Baixo = porLado("bottom", "", 320)

export const SemFechar: Story = {
  name: "Sem botão de fechar",
  parameters: vitrine("O exemplo do shadcn sem o X: `showCloseButton={false}`. O painel fecha pelo Esc, pelo clique fora ou pelo Cancelar.", 420),
  render: () => aberto({ ...base, fechar: false }),
}
