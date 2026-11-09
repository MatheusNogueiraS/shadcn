import type { Meta, StoryObj } from "@storybook/react-vite"
import { FileTextIcon, TriangleAlertIcon, UploadIcon, XIcon } from "lucide-react"

import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentGroup, AttachmentMedia, AttachmentTitle, AttachmentTrigger } from "@/components/ui/attachment"
import { Spinner } from "@/components/ui/spinner"
import { banner } from "../../sandbox/art"
import { Opcao, Opcoes, Simula, pagina, vitrine, type Interacao } from "../componentes/Opcoes"

const tamanhos = ["default", "sm", "xs"] as const
type Tamanho = (typeof tamanhos)[number]
const orientacoes = ["horizontal", "vertical"] as const
type Orientacao = (typeof orientacoes)[number]
const estados = ["idle", "uploading", "processing", "error", "done"] as const
type Estado = (typeof estados)[number]
const descricoes: Record<Estado, string> = { idle: "Solte o arquivo aqui", uploading: "Enviando... 45%", processing: "Lendo o arquivo...", error: "Arquivo grande demais", done: "PDF · 2 MB" }

type Controles = { size: Tamanho; orientation: Orientacao; state: Estado; imagem: boolean; conteudo: boolean; remover: boolean; gatilho: boolean; interacao?: Interacao }

const anexo = ({ size, orientation, state, imagem, conteudo, remover, gatilho }: Controles) => {
  const carregando = state === "uploading" || state === "processing"
  const Icone = state === "error" ? TriangleAlertIcon : state === "idle" ? UploadIcon : FileTextIcon
  return (
    <Attachment size={size === "default" ? undefined : size} orientation={orientation === "horizontal" ? undefined : orientation} state={state === "done" ? undefined : state}>
      {gatilho && <AttachmentTrigger aria-label="Abrir o arquivo" />}
      <AttachmentMedia variant={imagem ? "image" : undefined}>
        {imagem ? <img src={banner("#fa6300", "#462a71", "")} alt="" /> : carregando ? <Spinner /> : <Icone />}
      </AttachmentMedia>
      {conteudo && (
        <AttachmentContent>
          <AttachmentTitle>{state === "idle" ? "Anexar arquivo" : "contrato.pdf"}</AttachmentTitle>
          <AttachmentDescription>{descricoes[state]}</AttachmentDescription>
        </AttachmentContent>
      )}
      {remover && <AttachmentActions><AttachmentAction aria-label="Remover"><XIcon /></AttachmentAction></AttachmentActions>}
    </Attachment>
  )
}

const base: Controles = { size: "default", orientation: "horizontal", state: "done", imagem: false, conteudo: true, remover: true, gatilho: false }

const meta = {
  title: "Em construção/Attachment",
  render: (args) => anexo(args),
  parameters: pagina("Arquivo anexado, como num e-mail ou num chat: mídia, nome, detalhes e a ação de remover. Mostra cada etapa do envio pelo `state`. `AttachmentGroup` põe vários numa fila que rola para o lado.", "/fotos/capa.png"),
  argTypes: {
    size: { name: "Size", control: "inline-radio", options: tamanhos, description: "No código, `size`: diminui o recuo, a mídia e o texto.", table: { category: "Aparência" } },
    orientation: { name: "Orientation", control: "inline-radio", options: orientacoes, description: "No código, `orientation`. `vertical` põe a mídia em cima, ocupando a largura, e a ação no canto.", table: { category: "Aparência" } },
    state: { name: "State", control: "inline-radio", options: estados, description: "No código, `state`. `idle` tracejado, à espera do arquivo; `uploading` e `processing` brilham o nome e esmaecem a imagem; `error` pinta a borda, a mídia e a descrição de vermelho; `done` é o padrão.", table: { category: "Estado" } },
    imagem: { name: "Imagem", control: "boolean", description: "`variant=\"image\"` no `AttachmentMedia`, para uma miniatura no lugar do ícone. Durante o envio, o Spinner fica no lugar do ícone.", table: { category: "Conteúdo" } },
    conteudo: { name: "Nome e detalhes", control: "boolean", description: "`AttachmentContent` com `AttachmentTitle` e `AttachmentDescription`. Sem ele, sobra só a mídia.", table: { category: "Conteúdo" } },
    remover: { name: "Remover", control: "boolean", description: "`AttachmentActions` com um `AttachmentAction`: um `Button` `ghost` `icon-xs`.", table: { category: "Conteúdo" } },
    gatilho: { name: "Clicável", control: "boolean", description: "`AttachmentTrigger`: um botão que cobre o anexo inteiro, para abrir o arquivo. Com ele, o anexo ganha hover.", table: { category: "Elemento" } },
    interacao: { name: "Interação", control: "inline-radio", options: ["Default", "Hover"], description: "Simulado. O hover pinta o fundo de `muted/50`; o foco do teclado no gatilho ganha o anel.", if: { arg: "gatilho" }, table: { category: "Elemento" } },
  },
  args: { ...base, interacao: "Default" },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia, { args }) => <Simula estado={(args.gatilho && args.interacao) || "Default"} so="[data-slot=attachment]"><Historia /></Simula>],
}

export const Tamanhos: Story = {
  name: "Size",
  parameters: vitrine("No código, `size`. Sem a propriedade, o Attachment é `default`."),
  render: () => <Opcoes larga>{tamanhos.map((s) => <Opcao key={s} nome={s}>{anexo({ ...base, size: s })}</Opcao>)}</Opcoes>,
}

export const Orientacoes: Story = {
  name: "Orientation",
  parameters: vitrine("No código, `orientation`. Sem a propriedade, o Attachment é `horizontal`. No vertical, o Spinner do envio sobe para 24 px."),
  render: () => (
    <Opcoes larga>
      {orientacoes.map((o) => <Opcao key={o} nome={o}>{anexo({ ...base, orientation: o, imagem: true })}</Opcao>)}
      <Opcao nome="vertical · uploading">{anexo({ ...base, orientation: "vertical", state: "uploading" })}</Opcao>
    </Opcoes>
  ),
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("No código, `state`. Sem a propriedade, o Attachment é `done`. No fim, o hover simulado de um anexo clicável (`AttachmentTrigger`)."),
  render: () => (
    <Opcoes larga>
      {estados.map((e) => <Opcao key={e} nome={e}>{anexo({ ...base, state: e, remover: e !== "idle" })}</Opcao>)}
      <Opcao nome="Clicável · Hover"><Simula estado="Hover" so="[data-slot=attachment]">{anexo({ ...base, gatilho: true })}</Simula></Opcao>
    </Opcoes>
  ),
}

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("Vários anexos num `AttachmentGroup`, que rola para o lado quando não cabem, como numa caixa de mensagem."),
  render: () => (
    <div className="w-md">
      <AttachmentGroup>
        {anexo({ ...base, size: "sm", orientation: "vertical", imagem: true })}
        {anexo({ ...base, size: "sm", orientation: "vertical", state: "uploading" })}
        {anexo({ ...base, size: "sm", orientation: "vertical" })}
        {anexo({ ...base, size: "sm", orientation: "vertical", state: "error" })}
        {anexo({ ...base, size: "sm", orientation: "vertical", imagem: true })}
      </AttachmentGroup>
    </div>
  ),
}
