import type { Meta, StoryObj } from "@storybook/react-vite"
import { BadgeCheckIcon, ChevronRightIcon, ShieldAlertIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle } from "@/components/ui/item"
import { banner, portrait } from "../../sandbox/art"
import { Opcao, Opcoes, Simula, pagina, vitrine, type Interacao } from "../componentes/Opcoes"

const variantes = ["default", "outline", "muted"] as const
type Variante = (typeof variantes)[number]
const tamanhos = ["default", "sm", "xs"] as const
type Tamanho = (typeof tamanhos)[number]
const midias = ["Nenhuma", "icon", "image", "Avatar"] as const
type Midia = (typeof midias)[number]
const interacoes: Interacao[] = ["Default", "Hover", "Focus"]

type Controles = { variant: Variante; size: Tamanho; midia: Midia; titulo: string; descricao: boolean; acoes: boolean; comoLink: boolean; estado: Interacao }

const item = ({ variant, size, midia, titulo, descricao, acoes, comoLink }: Omit<Controles, "estado">) => (
  <Item variant={variant === "default" ? undefined : variant} size={size === "default" ? undefined : size} {...(comoLink ? { render: <a href="#item" /> } : {})}>
    {midia === "icon" && <ItemMedia variant="icon"><ShieldAlertIcon /></ItemMedia>}
    {midia === "image" && <ItemMedia variant="image"><img src={banner("#fa6300", "#462a71", "")} alt="Capa" /></ItemMedia>}
    {midia === "Avatar" && <ItemMedia><Avatar><AvatarImage src={portrait("#462a71", "AS")} alt="Ana Souza" /><AvatarFallback>AS</AvatarFallback></Avatar></ItemMedia>}
    <ItemContent>
      <ItemTitle>{titulo}</ItemTitle>
      {descricao && <ItemDescription>Um aparelho novo entrou na sua conta.</ItemDescription>}
    </ItemContent>
    {acoes && <ItemActions>{comoLink ? <ChevronRightIcon className="size-(--size-md)" /> : <Button variant="outline" size="sm">Revisar</Button>}</ItemActions>}
  </Item>
)

const base = { variant: "outline" as Variante, size: "default" as Tamanho, midia: "icon" as Midia, titulo: "Alerta de segurança", descricao: true, acoes: true, comoLink: false }

const meta = {
  title: "Em construção/Item",
  render: (args) => item(args),
  parameters: pagina("Linha de lista com mídia, título, descrição e ações, como um aviso, um contato ou um arquivo. A largura preenche o pai. `ItemGroup` empilha vários; `ItemSeparator` os separa.", "/fotos/capa.png"),
  argTypes: {
    variant: { name: "Type", control: "inline-radio", options: variantes, description: "No código, `variant`: sem borda, com borda (`outline`) ou com fundo (`muted`).", table: { category: "Aparência" } },
    size: { name: "Size", control: "inline-radio", options: tamanhos, description: "No código, `size`: diminui o recuo, o espaço e a imagem.", table: { category: "Aparência" } },
    midia: { name: "Mídia", control: "inline-radio", options: midias, description: "`ItemMedia`. `variant=\"icon\"` ajusta o ícone a 16 px; `image` recorta a imagem num quadrado que acompanha o Size; sem variante, a mídia fica como é, como um Avatar.", table: { category: "Conteúdo" } },
    titulo: { name: "Título", control: "text", description: "`ItemTitle`.", table: { category: "Conteúdo" } },
    descricao: { name: "Descrição", control: "boolean", description: "`ItemDescription`, até duas linhas. Com ela, a mídia sobe para o topo.", table: { category: "Conteúdo" } },
    acoes: { name: "Ações", control: "boolean", description: "`ItemActions`, no fim da linha.", table: { category: "Conteúdo" } },
    comoLink: { name: "Como link", control: "boolean", description: "Renderiza um `<a>`, com `render`: o Item inteiro vira o link e ganha hover.", table: { category: "Elemento" } },
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

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Hover e Focus simulados, com o Item como link."),
  render: () => <Opcoes larga>{interacoes.map((e) => <Opcao key={e} nome={e}><Simula estado={e}>{item({ ...base, comoLink: true })}</Simula></Opcao>)}</Opcoes>,
}

const pessoas = [["Ana Souza", "ana@exemplo.com", "#fa6300"], ["Bruno Lima", "bruno@exemplo.com", "#462a71"], ["Carla Dias", "carla@exemplo.com", "#0f766e"]] as const

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("Os exemplos do shadcn: um grupo de contatos com separadores, um link curto com ícone, e um cartão com `ItemHeader` (imagem) e `ItemFooter`."),
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
