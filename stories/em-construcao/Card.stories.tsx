import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { banner } from "../../sandbox/art"
import { Opcao, Opcoes, pagina, Slot, vitrine } from "../componentes/Opcoes"

const tamanhos = ["default", "sm"] as const
type Tamanho = (typeof tamanhos)[number]
const capa = banner("#fa6300", "#462a71", "Plano Pro")

type Controles = { size: Tamanho; imagem: boolean; titulo: string; descricao: boolean; acao: boolean; conteudo: boolean; slot: boolean; rodape: boolean; divisorias: boolean }

const cartao = ({ size, imagem, titulo, descricao, acao, conteudo, slot, rodape, divisorias }: Controles) => (
  <Card size={size === "default" ? undefined : size}>
    {imagem && <img src={capa} alt="Capa do plano" className="aspect-video w-full object-cover" />}
    <CardHeader className={cn(divisorias && "border-b") || undefined}>
      <CardTitle>{titulo}</CardTitle>
      {descricao && <CardDescription>Cobrança mensal, cancele quando quiser.</CardDescription>}
      {acao && <CardAction><Button variant="link" size="sm">Ver detalhes</Button></CardAction>}
    </CardHeader>
    {conteudo && <CardContent>Pix sem limite, 5 cartões virtuais e suporte por chat.</CardContent>}
    {slot && <CardContent><Slot /></CardContent>}
    {rodape && <CardFooter className={cn("gap-(--gap-sm)", divisorias && "border-t")}><Button variant="outline" className="flex-1">Agora não</Button><Button className="flex-1">Assinar</Button></CardFooter>}
  </Card>
)

const base: Controles = { size: "default", imagem: false, titulo: "Plano Pro", descricao: true, acao: false, conteudo: true, slot: false, rodape: true, divisorias: false }

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
    slot: { name: "Slot", control: "boolean", description: "Componentes deste tipo aceitam outros componentes dentro. Ligue para ver a região onde eles entram: um `CardContent` a mais, no fim do conteúdo; no Figma, é o slot.", table: { category: "Conteúdo" } },
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
  parameters: vitrine("Cada parte que entra muda o desenho: a ação divide o cabeçalho em duas colunas, a imagem ocupa o topo sem recuo, as divisórias separam cabeçalho e rodapé e o slot marca onde entram outros componentes."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="Só cabeçalho"><div className="w-full">{cartao({ ...base, conteudo: false, rodape: false })}</div></Opcao>
      <Opcao nome="Com ação"><div className="w-full">{cartao({ ...base, acao: true, rodape: false })}</div></Opcao>
      <Opcao nome="Com imagem"><div className="w-full">{cartao({ ...base, imagem: true })}</div></Opcao>
      <Opcao nome="Com divisórias"><div className="w-full">{cartao({ ...base, divisorias: true })}</div></Opcao>
      <Opcao nome="Com slot"><div className="w-full">{cartao({ ...base, slot: true })}</div></Opcao>
    </Opcoes>
  ),
}

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("Os exemplos do shadcn, cada um com outro componente no lugar do slot. **Login**: formulário com `Field` no conteúdo, link na ação e botões que preenchem o rodapé. **Pequeno**: `size=\"sm\"` com uma lista. **Imagem**: capa no topo e um `Badge` na ação. **Borda a borda**: o texto rola numa faixa que desfaz o recuo lateral, com `-mx-(--padding-3xl)`, o recuo do size `default` (no `sm`, `-mx-(--padding-2xl)`)."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="Login">
        <Card className="w-full">
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
      </Opcao>
      <Opcao nome="Pequeno">
        <Card size="sm" className="w-full">
          <CardHeader><CardTitle>Relatórios agendados</CardTitle><CardDescription>Um resumo por semana, sem exportar à mão.</CardDescription></CardHeader>
          <CardContent>
            <ul className="grid gap-(--gap-sm) py-(--padding-sm)">
              {["Escolha a frequência: diária ou semanal.", "Envie para canais ou pessoas do time.", "Inclua gráficos, tabelas e indicadores."].map((t) => (
                <li key={t} className="flex gap-(--gap-sm)"><ChevronRightIcon className="mt-(--gap-3xs) size-(--size-md) shrink-0 text-muted" />{t}</li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex-col gap-(--gap-sm)"><Button size="sm" className="w-full">Agendar relatórios</Button><Button size="sm" variant="outline" className="w-full">Ver novidades</Button></CardFooter>
        </Card>
      </Opcao>
      <Opcao nome="Imagem">
        <Card className="w-full">
          <img src={capa} alt="Capa do evento" className="aspect-video w-full object-cover" />
          <CardHeader>
            <CardTitle>Encontro de design systems</CardTitle>
            <CardDescription>APIs de componentes, acessibilidade e entregas mais rápidas.</CardDescription>
            <CardAction><Badge variant="secondary">Destaque</Badge></CardAction>
          </CardHeader>
          <CardFooter><Button className="w-full">Ver evento</Button></CardFooter>
        </Card>
      </Opcao>
      <Opcao nome="Borda a borda">
        <Card className="w-full">
          <CardHeader><CardTitle>Termos de uso</CardTitle><CardDescription>Leia os termos antes de aceitar.</CardDescription></CardHeader>
          <CardContent>
            <div tabIndex={0} className="no-scrollbar -mx-(--padding-3xl) flex max-h-48 flex-col gap-(--gap-2xl) overflow-y-auto border-t-sm bg-muted/50 px-(--padding-3xl) py-(--padding-2xl)">
              <p>Estes termos valem para o uso do espaço de trabalho, incluindo documentos, arquivos e ferramentas compartilhadas.</p>
              <p>Você responde pelo que envia e por dar ao time as permissões certas para ver ou editar.</p>
              <p>Recursos e limites podem mudar. Quando a mudança afetar o seu trabalho, avisamos quem administra a conta.</p>
              <p>Ao continuar, você mantém a sua senha segura e segue as regras de uso da sua empresa.</p>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-(--gap-sm)"><Button variant="outline">Recusar</Button><Button>Aceitar</Button></CardFooter>
        </Card>
      </Opcao>
    </Opcoes>
  ),
}
