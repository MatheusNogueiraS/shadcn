import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowUpRightIcon, FolderCodeIcon, SearchIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { portrait } from "../../sandbox/art"
import { Opcao, Opcoes, pagina, vitrine } from "../componentes/Opcoes"

const midias = ["Nenhuma", "icon", "default"] as const
type Midia = (typeof midias)[number]
const fundos = { Nenhum: "", Borda: "border-sm", Muted: "bg-muted/50" } as const
type Fundo = keyof typeof fundos

type Controles = { midia: Midia; titulo: string; descricao: boolean; acoes: boolean; fundo: Fundo }

const vazio = ({ midia, titulo, descricao, acoes, fundo }: Controles) => (
  <Empty className={fundos[fundo] || undefined}>
    <EmptyHeader>
      {midia === "icon" && <EmptyMedia variant="icon"><FolderCodeIcon /></EmptyMedia>}
      {midia === "default" && <EmptyMedia><Avatar size="lg"><AvatarImage src={portrait("#462a71", "AS")} alt="Ana Souza" /><AvatarFallback>AS</AvatarFallback></Avatar></EmptyMedia>}
      <EmptyTitle>{titulo}</EmptyTitle>
      {descricao && <EmptyDescription>Você ainda não criou nenhum projeto. Comece criando o primeiro.</EmptyDescription>}
    </EmptyHeader>
    {acoes && (
      <EmptyContent>
        <div className="flex gap-(--gap-sm)"><Button>Criar projeto</Button><Button variant="outline">Importar</Button></div>
        <Button variant="link" size="sm" render={<a href="#saiba-mais" />} nativeButton={false}>Saiba mais <ArrowUpRightIcon data-icon="inline-end" /></Button>
      </EmptyContent>
    )}
  </Empty>
)

const base: Controles = { midia: "icon", titulo: "Nenhum projeto ainda", descricao: true, acoes: true, fundo: "Nenhum" }

const meta = {
  title: "Em construção/Empty",
  render: vazio,
  parameters: pagina("Tela vazia: explica por que não há nada e sugere o próximo passo. Preenche o pai e centraliza o conteúdo.", "/fotos/ana.png"),
  argTypes: {
    midia: { name: "Mídia", control: "inline-radio", options: midias, description: "`EmptyMedia` acima do título. No código, `variant=\"icon\"` põe o ícone num quadrado de fundo `muted`; `default` mostra a imagem como ela é, como um Avatar.", table: { category: "Conteúdo" } },
    titulo: { name: "Título", control: "text", description: "`EmptyTitle`.", table: { category: "Conteúdo" } },
    descricao: { name: "Descrição", control: "boolean", description: "`EmptyDescription`. Um link dentro dela ganha sublinhado.", table: { category: "Conteúdo" } },
    acoes: { name: "Ações", control: "boolean", description: "`EmptyContent`, abaixo do texto, para botões ou um campo.", table: { category: "Conteúdo" } },
    fundo: { name: "Fundo", control: "inline-radio", options: Object.keys(fundos), description: "O Empty já traz a borda tracejada sem largura: `border-sm` a mostra. `bg-muted/50` dá um fundo. São classes, não variantes.", table: { category: "Aparência" } },
  },
  args: base,
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia) => <div className="w-96"><Historia /></div>],
}

export const Midias: Story = {
  name: "Mídia",
  parameters: vitrine("No código, `variant` do `EmptyMedia`. Sem a propriedade, ele é `default`."),
  render: () => <Opcoes larga>{midias.map((m) => <Opcao key={m} nome={m}>{vazio({ ...base, midia: m, acoes: false })}</Opcao>)}</Opcoes>,
}

export const Fundos: Story = {
  name: "Fundo",
  parameters: vitrine("Os exemplos Outline e Background do shadcn, por classes."),
  render: () => <Opcoes larga>{(Object.keys(fundos) as Fundo[]).map((f) => <Opcao key={f} nome={f}>{vazio({ ...base, fundo: f, acoes: false })}</Opcao>)}</Opcoes>,
}

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("Os exemplos do shadcn: um grupo de avatares como mídia e a página não encontrada, com um campo de busca no `EmptyContent`."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="AvatarGroup">
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <AvatarGroup>
                <Avatar><AvatarImage src={portrait("#fa6300", "AS")} alt="Ana Souza" /><AvatarFallback>AS</AvatarFallback></Avatar>
                <Avatar><AvatarImage src={portrait("#462a71", "BL")} alt="Bruno Lima" /><AvatarFallback>BL</AvatarFallback></Avatar>
                <Avatar><AvatarFallback>CM</AvatarFallback></Avatar>
              </AvatarGroup>
            </EmptyMedia>
            <EmptyTitle>Nenhum membro</EmptyTitle>
            <EmptyDescription>Convide a equipe para trabalhar junto.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent><Button size="sm">Convidar</Button></EmptyContent>
        </Empty>
      </Opcao>
      <Opcao nome="Com InputGroup">
        <Empty>
          <EmptyHeader><EmptyTitle>404</EmptyTitle><EmptyDescription>A página que você procura não existe. Tente buscar.</EmptyDescription></EmptyHeader>
          <EmptyContent>
            <InputGroup className="w-3/4">
              <InputGroupInput placeholder="Buscar páginas" aria-label="Buscar páginas" />
              <InputGroupAddon><SearchIcon /></InputGroupAddon>
              <InputGroupAddon align="inline-end"><Kbd>/</Kbd></InputGroupAddon>
            </InputGroup>
            <EmptyDescription>Precisa de ajuda? <a href="#suporte">Fale com o suporte</a></EmptyDescription>
          </EmptyContent>
        </Empty>
      </Opcao>
    </Opcoes>
  ),
}
