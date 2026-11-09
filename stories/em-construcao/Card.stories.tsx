import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { banner } from "../../sandbox/art"
import { Opcao, Opcoes, pagina, vitrine } from "../componentes/Opcoes"

const tamanhos = ["default", "sm"] as const
type Tamanho = (typeof tamanhos)[number]
const capa = banner("#fa6300", "#462a71", "Plano Pro")

type Controles = { size: Tamanho; imagem: boolean; titulo: string; descricao: boolean; acao: boolean; conteudo: boolean; rodape: boolean; divisorias: boolean }

const cartao = ({ size, imagem, titulo, descricao, acao, conteudo, rodape, divisorias }: Controles) => (
  <Card size={size === "default" ? undefined : size}>
    {imagem && <img src={capa} alt="Capa do plano" className="aspect-video w-full object-cover" />}
    <CardHeader className={cn(divisorias && "border-b") || undefined}>
      <CardTitle>{titulo}</CardTitle>
      {descricao && <CardDescription>Cobrança mensal, cancele quando quiser.</CardDescription>}
      {acao && <CardAction><Button variant="link" size="sm">Ver detalhes</Button></CardAction>}
    </CardHeader>
    {conteudo && <CardContent>Pix sem limite, 5 cartões virtuais e suporte por chat.</CardContent>}
    {rodape && <CardFooter className={cn("gap-(--gap-sm)", divisorias && "border-t")}><Button variant="outline" className="flex-1">Agora não</Button><Button className="flex-1">Assinar</Button></CardFooter>}
  </Card>
)

const base: Controles = { size: "default", imagem: false, titulo: "Plano Pro", descricao: true, acao: false, conteudo: true, rodape: true, divisorias: false }

const meta = {
  title: "Em construção/Card",
  render: cartao,
  parameters: pagina("Superfície que agrupa um assunto: título, conteúdo e ações. A largura vem do pai. Cada parte que entra (`CardHeader`, `CardContent`, `CardFooter`) tem o mesmo recuo lateral.", "/fotos/capa.png"),
  argTypes: {
    size: { name: "Size", control: "inline-radio", options: tamanhos, description: "No código, `size`. `sm` diminui o recuo e o espaço entre as partes.", table: { category: "Aparência" } },
    imagem: { name: "Imagem", control: "boolean", description: "Uma `img` como primeiro filho ocupa o topo sem recuo e com os cantos arredondados.", table: { category: "Conteúdo" } },
    titulo: { name: "Título", control: "text", description: "`CardTitle`.", table: { category: "Conteúdo" } },
    descricao: { name: "Descrição", control: "boolean", description: "`CardDescription`, abaixo do título.", table: { category: "Conteúdo" } },
    acao: { name: "Ação", control: "boolean", description: "`CardAction`, no canto de cima à direita do cabeçalho.", table: { category: "Conteúdo" } },
    conteudo: { name: "Conteúdo", control: "boolean", description: "`CardContent`.", table: { category: "Conteúdo" } },
    rodape: { name: "Rodapé", control: "boolean", description: "`CardFooter`, com as ações.", table: { category: "Conteúdo" } },
    divisorias: { name: "Divisórias", control: "boolean", description: "A classe `border-b` no cabeçalho e `border-t` no rodapé: o Card reconhece essas classes e dá o recuo do outro lado da linha.", table: { category: "Aparência" } },
  },
  args: base,
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia) => <div className="w-80"><Historia /></div>],
}

export const Tamanhos: Story = {
  name: "Size",
  parameters: vitrine("No código, `size`. Sem a propriedade, o Card é `default`."),
  render: () => <Opcoes larga>{tamanhos.map((s) => <Opcao key={s} nome={s}><div className="w-full">{cartao({ ...base, size: s })}</div></Opcao>)}</Opcoes>,
}

export const Conteudo: Story = {
  name: "Conteúdo",
  parameters: vitrine("Cada parte que entra muda o desenho: a ação divide o cabeçalho em duas colunas, a imagem ocupa o topo sem recuo e as divisórias separam cabeçalho e rodapé."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="Só cabeçalho"><div className="w-full">{cartao({ ...base, conteudo: false, rodape: false })}</div></Opcao>
      <Opcao nome="Com ação"><div className="w-full">{cartao({ ...base, acao: true, rodape: false })}</div></Opcao>
      <Opcao nome="Com imagem"><div className="w-full">{cartao({ ...base, imagem: true })}</div></Opcao>
      <Opcao nome="Com divisórias"><div className="w-full">{cartao({ ...base, divisorias: true })}</div></Opcao>
    </Opcoes>
  ),
}

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("O exemplo do shadcn de entrar na conta: formulário com `Field` no conteúdo, link de cadastro na ação e botões que preenchem o rodapé."),
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Entre na sua conta</CardTitle>
        <CardDescription>Use o e-mail do cadastro.</CardDescription>
        <CardAction><Button variant="link" size="sm">Criar conta</Button></CardAction>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field><FieldLabel htmlFor="card-email">E-mail</FieldLabel><Input id="card-email" type="email" placeholder="voce@exemplo.com" /></Field>
          <Field><FieldLabel htmlFor="card-senha">Senha</FieldLabel><Input id="card-senha" type="password" /></Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex-col gap-(--gap-sm)"><Button className="w-full">Entrar</Button><Button variant="outline" className="w-full">Entrar com Google</Button></CardFooter>
    </Card>
  ),
}
