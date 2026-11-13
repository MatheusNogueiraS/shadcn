import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowRightIcon, BadgeCheckIcon, ChevronRightIcon, ShieldAlertIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle } from "@/components/ui/item"
import { banner, portrait } from "../../sandbox/art"
import { Opcao, Opcoes, Simula, pagina, vitrine, type Interacao } from "../componentes/Opcoes"

const variantes = ["default", "outline", "muted"] as const
type Variante = (typeof variantes)[number]
const tamanhos = ["default", "sm", "xs"] as const
type Tamanho = (typeof tamanhos)[number]
const midias = ["Nenhuma", "icon", "image", "Avatar"] as const
type Midia = (typeof midias)[number]
const descricoes = ["Nenhuma", "Embaixo", "Ao lado"] as const
type Descricao = (typeof descricoes)[number]
const acoes = ["Nenhuma", "Ícone", "Texto", "Texto e ícone", "Seta (link)"] as const
type Acao = (typeof acoes)[number]
const selecoes = ["Nenhuma", "Checkbox", "Radio"] as const
type Selecao = (typeof selecoes)[number]
const interacoes: Interacao[] = ["Default", "Hover", "Focus"]

type Controles = { variant: Variante; size: Tamanho; midia: Midia; titulo: string; descricao: Descricao; acao: Acao; selecao: Selecao; marcado: boolean; comoLink: boolean; estado: Interacao }

// Linha com seleção: duas áreas de toque sem um controle dentro do outro. O <label> do título se estica pela linha
// (after:absolute after:inset-0 sobre o Item relative) e marca o controle; a ação fica acima dessa camada (relative).
// O hover no label pinta a linha, para mostrar que ela toda é clicável.
const linhaSelecionavel = "relative has-[label:hover]:bg-muted"
const rotulo = (id: string, texto: string) => <label htmlFor={id} className="cursor-pointer after:absolute after:inset-0">{texto}</label>
// A seta é um <a> comum com o visual do Button: com render, o Base UI põe role="button" e o leitor de tela anunciaria um botão.
const seta = (nome: string) => <a href="#detalhe" aria-label={`Abrir ${nome}`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-auto self-stretch")}><ChevronRightIcon /></a>

const item = ({ variant, size, midia, titulo, descricao, acao, selecao, marcado, comoLink }: Omit<Controles, "estado">, id = "item-amostra") => {
  const seleciona = selecao !== "Nenhuma"
  const link = comoLink && !seleciona
  // O id da descrição só existe com seleção, para o controle apontar para ela; sem isso, as amostras repetiriam o mesmo id.
  const descreve = seleciona && descricao === "Embaixo" ? `${id}-descricao` : undefined
  const linha = (
    <Item variant={variant === "default" ? undefined : variant} size={size === "default" ? undefined : size} className={seleciona ? linhaSelecionavel : undefined} {...(link ? { render: <a href="#item" /> } : {})}>
      {selecao === "Checkbox" && <ItemMedia><Checkbox key={String(marcado)} id={id} defaultChecked={marcado} aria-describedby={descreve} /></ItemMedia>}
      {selecao === "Radio" && <ItemMedia><RadioGroupItem value={id} id={id} aria-describedby={descreve} /></ItemMedia>}
      {!seleciona && midia === "icon" && <ItemMedia variant="icon"><ShieldAlertIcon /></ItemMedia>}
      {!seleciona && midia === "image" && <ItemMedia variant="image"><img src={banner("#fa6300", "#462a71", "")} alt="Capa" /></ItemMedia>}
      {!seleciona && midia === "Avatar" && <ItemMedia><Avatar><AvatarImage src={portrait("#462a71", "AS")} alt="Ana Souza" /><AvatarFallback>AS</AvatarFallback></Avatar></ItemMedia>}
      <ItemContent>
        <ItemTitle>{seleciona ? rotulo(id, titulo) : titulo}</ItemTitle>
        {descricao === "Embaixo" && <ItemDescription id={descreve}>Um aparelho novo entrou na sua conta.</ItemDescription>}
      </ItemContent>
      {/* Ao lado: um segundo ItemContent, que não cresce. Um texto apagado, e não ItemDescription, que faria a mídia subir para o topo. */}
      {descricao === "Ao lado" && <ItemContent className="text-right"><span className="text-body-sm text-muted">Hoje, 14:32</span></ItemContent>}
      {acao !== "Nenhuma" && (
        <ItemActions className={acao === "Seta (link)" && !link ? "relative self-stretch" : seleciona ? "relative" : undefined}>
          {link ? <ChevronRightIcon className="size-(--size-md)" />
            : acao === "Seta (link)" ? seta(titulo)
            : acao === "Ícone" ? <Button variant="outline" size="icon-sm" aria-label="Revisar"><ArrowRightIcon /></Button>
            : <Button variant="outline" size="sm">Revisar{acao === "Texto e ícone" && <ArrowRightIcon data-icon="inline-end" />}</Button>}
        </ItemActions>
      )}
    </Item>
  )
  // Um Radio só existe dentro de um RadioGroup.
  return selecao === "Radio" ? <RadioGroup key={String(marcado)} defaultValue={marcado ? id : undefined} aria-label={titulo}>{linha}</RadioGroup> : linha
}

const base = { variant: "outline" as Variante, size: "default" as Tamanho, midia: "icon" as Midia, titulo: "Alerta de segurança", descricao: "Embaixo" as Descricao, acao: "Texto" as Acao, selecao: "Nenhuma" as Selecao, marcado: false, comoLink: false }

const meta = {
  title: "Em construção/Item",
  render: (args) => item(args),
  parameters: pagina("Linha de lista com mídia, título, descrição e ações, como um aviso, um contato ou um arquivo. A largura preenche o pai. `ItemGroup` empilha vários; `ItemSeparator` os separa.", "/fotos/capa.png"),
  argTypes: {
    variant: { name: "Type", control: "inline-radio", options: variantes, description: "No código, `variant`: sem borda, com borda (`outline`) ou com fundo (`muted`).", table: { category: "Aparência" } },
    size: { name: "Size", control: "inline-radio", options: tamanhos, description: "No código, `size`: diminui o recuo, o espaço e a imagem.", table: { category: "Aparência" } },
    midia: { name: "Mídia", control: "inline-radio", options: midias, if: { arg: "selecao", eq: "Nenhuma" }, description: "`ItemMedia`. `variant=\"icon\"` ajusta o ícone a 16 px; `image` recorta a imagem num quadrado que acompanha o Size; sem variante, a mídia fica como é, como um Avatar.", table: { category: "Conteúdo" } },
    titulo: { name: "Título", control: "text", description: "`ItemTitle`.", table: { category: "Conteúdo" } },
    descricao: { name: "Descrição", control: "inline-radio", options: descricoes, description: "`ItemDescription`. Embaixo: no mesmo `ItemContent` do título, até duas linhas, e a mídia sobe para o topo. Ao lado: num segundo `ItemContent` com `className=\"text-right\"` (o segundo já não cresce), para um valor curto como uma data ou um preço; aqui num texto apagado (`text-body-sm text-muted`), porque um `ItemDescription` em qualquer lugar da linha faz a mídia subir para o topo.", table: { category: "Conteúdo" } },
    acao: { name: "Ação", control: "inline-radio", options: acoes, description: "`ItemActions`, no fim da linha. Aceita qualquer coisa; aqui, um `Button` `outline`: só ícone (`size=\"icon-sm\"`, com `aria-label`), só texto (`size=\"sm\"`) ou texto com ícone (`data-icon=\"inline-end\"`). Seta (link): um `<a>` com `buttonVariants` (`ghost`, `icon`), na altura da linha, que leva a outra tela. Com o Item como link, a ação vira só o ícone de seta, e este controle some.", if: { arg: "comoLink", truthy: false }, table: { category: "Conteúdo" } },
    selecao: { name: "Seleção", control: "inline-radio", options: selecoes, description: "Um `Checkbox` (vários) ou um `RadioGroupItem` (um só, dentro de um `RadioGroup`) no lugar da mídia. A linha ganha duas áreas de toque: o `<label>` do título, com `after:absolute after:inset-0` e `cursor-pointer`, se estica pelo Item (`relative`) e marca, e o Item pinta o fundo no hover (`has-[label:hover]:bg-muted`); a ação fica acima (`relative`). Com a Ação Seta (link), tocar na seta abre o detalhe sem marcar.", table: { category: "Conteúdo" } },
    marcado: { name: "Marcado", control: "boolean", description: "`defaultChecked` no Checkbox; `defaultValue` no RadioGroup.", if: { arg: "selecao", neq: "Nenhuma" }, table: { category: "Estado" } },
    comoLink: { name: "Como link", control: "boolean", if: { arg: "selecao", eq: "Nenhuma" }, description: "Renderiza um `<a>`, com `render`: o Item inteiro vira o link e ganha hover.", table: { category: "Elemento" } },
    estado: { name: "State", control: "inline-radio", options: interacoes, description: "Simulado. O hover só existe com **Como link**.", table: { category: "Estado" } },
  },
  args: { ...base, estado: "Default" },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia, { args }) => <div className="w-md"><Simula estado={args.estado}><Historia /></Simula></div>],
}

export const Tipos: Story = {
  name: "Type",
  parameters: vitrine("No código, `variant`. Sem a propriedade, o Item é `default`, sem borda."),
  render: () => <Opcoes larga>{variantes.map((v) => <Opcao key={v} nome={v}>{item({ ...base, variant: v })}</Opcao>)}</Opcoes>,
}

export const Tamanhos: Story = {
  name: "Size",
  parameters: vitrine("No código, `size`. Sem a propriedade, o Item é `default`."),
  render: () => <Opcoes larga>{tamanhos.map((s) => <Opcao key={s} nome={s}>{item({ ...base, size: s, midia: "image" })}</Opcao>)}</Opcoes>,
}

export const Midias: Story = {
  name: "Mídia",
  parameters: vitrine("No código, `variant` do `ItemMedia`."),
  render: () => <Opcoes larga>{midias.map((m) => <Opcao key={m} nome={m}>{item({ ...base, midia: m })}</Opcao>)}</Opcoes>,
}

export const Descricoes: Story = {
  name: "Descrição",
  parameters: vitrine("Embaixo, a descrição fica no mesmo `ItemContent` do título. Ao lado, ela vai num segundo `ItemContent`, alinhado à direita, para um valor curto."),
  render: () => <Opcoes larga>{descricoes.map((d) => <Opcao key={d} nome={d}>{item({ ...base, descricao: d })}</Opcao>)}</Opcoes>,
}

export const Acoes: Story = {
  name: "Ação",
  parameters: vitrine("O `ItemActions` aceita qualquer coisa; estes são os botões mais comuns."),
  render: () => <Opcoes larga>{acoes.map((a) => <Opcao key={a} nome={a}>{item({ ...base, acao: a })}</Opcao>)}</Opcoes>,
}

export const Selecoes: Story = {
  name: "Seleção",
  parameters: vitrine("Checkbox ou Radio no lugar da mídia, com a Ação Seta (link). Tocar em qualquer ponto da linha marca; tocar na seta abre o detalhe."),
  render: () => (
    <Opcoes larga>
      {(["Checkbox", "Radio"] as const).flatMap((sel) => [false, true].map((m) => (
        <Opcao key={sel + m} nome={`${sel}${m ? " marcado" : ""}`}>{item({ ...base, selecao: sel, marcado: m, acao: "Seta (link)" }, `item-${sel}-${m}`)}</Opcao>
      )))}
    </Opcoes>
  ),
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Hover e Focus simulados, com o Item como link."),
  render: () => <Opcoes larga>{interacoes.map((e) => <Opcao key={e} nome={e}><Simula estado={e}>{item({ ...base, comoLink: true })}</Simula></Opcao>)}</Opcoes>,
}

const transacoes = [["tx-pix", "Pix para Ana Souza", "R$ 1.250,00 · hoje"], ["tx-boleto", "Boleto da luz", "R$ 184,90 · ontem"]] as const
const contas = [["ct-corrente", "Conta corrente ·1192", "Saldo de R$ 12.480,00"], ["ct-poupanca", "Poupança ·3349", "Saldo de R$ 3.210,00"]] as const

// A mesma linha selecionável da amostra, numa lista de verdade: o controle se chama pelo título, e a seta, "Abrir …".
const linhaComSeta = (id: string, nome: string, detalhe: string, controle: ReactNode) => (
  <Item key={id} variant="outline" size="sm" className={linhaSelecionavel}>
    <ItemMedia>{controle}</ItemMedia>
    <ItemContent>
      <ItemTitle>{rotulo(id, nome)}</ItemTitle>
      <ItemDescription id={`${id}-detalhe`}>{detalhe}</ItemDescription>
    </ItemContent>
    <ItemActions className="relative self-stretch">{seta(nome)}</ItemActions>
  </Item>
)

const pessoas = [["Ana Souza", "ana@exemplo.com", "#fa6300"], ["Bruno Lima", "bruno@exemplo.com", "#462a71"], ["Carla Dias", "carla@exemplo.com", "#0f766e"]] as const

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("Os exemplos do shadcn: um grupo de contatos com separadores, um link curto com ícone, e um cartão com `ItemHeader` (imagem) e `ItemFooter`. Por último, listas em modo de seleção, com duas áreas de toque: o Checkbox ou o Radio no lugar do ícone, e a seta no fim. Tocar em qualquer ponto da linha marca; tocar na seta abre o detalhe sem marcar. Os dois são controles irmãos, sem um dentro do outro: o `<label>` do título ganha `after:absolute after:inset-0` e se estica pelo Item (`relative`), que pinta o fundo no hover, e o `ItemActions` fica acima dessa camada (`relative`). Assim o controle é anunciado só pelo título, e a seta, como o link \"Abrir …\". A seta é um `<a>` com `buttonVariants`, e não um `Button` com `render`: assim ela continua sendo link para o leitor de tela. No Radio, um `RadioGroup` envolve as linhas. Quando a linha só seleciona, sem link, use o cartão de escolha do Field, nas páginas do Checkbox e do Radio Group."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="ItemGroup">
        <ItemGroup>
          {pessoas.map(([nome, email, cor], i) => (
            <div key={nome} className="contents">
              {i > 0 && <ItemSeparator />}
              <Item size="sm">
                <ItemMedia><Avatar><AvatarImage src={portrait(cor, nome.split(" ").map((p) => p[0]).join(""))} alt={nome} /><AvatarFallback>{nome[0]}</AvatarFallback></Avatar></ItemMedia>
                <ItemContent><ItemTitle>{nome}</ItemTitle><ItemDescription>{email}</ItemDescription></ItemContent>
                <ItemActions><Button variant="ghost" size="sm">Convidar</Button></ItemActions>
              </Item>
            </div>
          ))}
        </ItemGroup>
      </Opcao>
      <Opcao nome="Link curto">
        <Item variant="outline" size="sm" render={<a href="#perfil" />}>
          <ItemMedia><BadgeCheckIcon className="size-(--size-lg)" /></ItemMedia>
          <ItemContent><ItemTitle>Seu perfil foi verificado.</ItemTitle></ItemContent>
          <ItemActions><ChevronRightIcon className="size-(--size-md)" /></ItemActions>
        </Item>
      </Opcao>
      <Opcao nome="Checkbox e seta">
        <ItemGroup>
          {transacoes.map(([id, nome, detalhe], i) => linhaComSeta(id, nome, detalhe, <Checkbox id={id} defaultChecked={i === 0} aria-describedby={`${id}-detalhe`} />))}
        </ItemGroup>
      </Opcao>
      <Opcao nome="Radio e seta">
        <RadioGroup defaultValue="ct-corrente" aria-label="Conta de origem">
          {contas.map(([id, nome, detalhe]) => linhaComSeta(id, nome, detalhe, <RadioGroupItem value={id} id={id} aria-describedby={`${id}-detalhe`} />))}
        </RadioGroup>
      </Opcao>
      <Opcao nome="Header e Footer">
        <Item variant="outline">
          <ItemHeader><img src={banner("#462a71", "#fa6300", "")} alt="Capa" className="aspect-video w-full rounded-2xl object-cover" /></ItemHeader>
          <ItemContent><ItemTitle>Relatório de outubro</ItemTitle><ItemDescription>Entradas e saídas do mês.</ItemDescription></ItemContent>
          <ItemFooter><span className="text-body-xs text-muted">PDF · 2 MB</span><Button variant="outline" size="sm">Baixar</Button></ItemFooter>
        </Item>
      </Opcao>
    </Opcoes>
  ),
}
