import * as React from "react"
import {
  ArchiveIcon,
  CopyIcon,
  FileTextIcon,
  ImageIcon,
  MailIcon,
  PaperclipIcon,
  RotateCcwIcon,
  SendIcon,
  TableIcon,
  TagIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Kbd } from "@/components/ui/kbd"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"
import { banner, portrait } from "../art"
import { copiar } from "../copiar"

type Conversation = { id: number; name: string; subject: string; preview: string; time: string; color: string; unread: boolean; tag: string }

const people = ["Ana Souza", "Bruno Lima", "Carla Dias", "Diego Rocha", "Elisa Prado", "Fábio Nunes", "Gabi Alves", "Hugo Reis", "Iris Matos", "João Pires"]
const subjects = ["Cartão bloqueado", "Limite do Pix", "Contestação de compra", "Segunda via de boleto", "Troca de titularidade"]
const tags = ["Cartões", "Pix", "Fraude", "Boletos", "Cadastro"]
const colors = ["#fa6300", "#462a71", "#a43f04", "#674c96"]
const conversations: Conversation[] = people.map((name, i) => ({
  id: i,
  name,
  subject: subjects[i % 5],
  preview: "Olá, preciso de ajuda com a minha conta. Podem verificar?",
  time: `${9 + i}:${String((i * 7) % 60).padStart(2, "0")}`,
  color: colors[i % 4],
  unread: i < 4,
  tag: tags[i % 5],
}))
const initials = (n: string) => n.split(" ").map((p) => p[0]).join("")

export function InboxView() {
  const [selected, setSelected] = React.useState(0)
  const current = conversations[selected]
  // No celular as colunas ficariam espremidas, então os painéis empilham.
  const orientation = useIsMobile() ? "vertical" : "horizontal"
  return (
    <Card className="h-[calc(100svh-7rem)] min-h-[1100px] overflow-hidden p-0 md:min-h-[640px]">
      <ResizablePanelGroup key={orientation} orientation={orientation}>
        <ResizablePanel defaultSize="32%" minSize="240px">
          <ConversationList selected={selected} onSelect={setSelected} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="68%" minSize="320px">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize="70%" minSize="200px"><Thread conversation={current} /></ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="30%" minSize="150px"><Composer /></ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Card>
  )
}

function ConversationList({ selected, onSelect }: { selected: number; onSelect: (i: number) => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4">
        <h2 className="font-medium">Conversas</h2>
        <Badge variant="secondary">4 novas</Badge>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <ItemGroup className="gap-1 p-2">
          {conversations.map((c, i) => (
            <React.Fragment key={c.id}>
              <RowMenu conversation={c}>
                <Item
                  size="sm"
                  variant={i === selected ? "muted" : "default"}
                  render={<button type="button" onClick={() => onSelect(i)} className="text-left" />}
                >
                  <ItemMedia variant="image"><img src={portrait(c.color, initials(c.name))} alt="" /></ItemMedia>
                  <ItemContent>
                    <ItemTitle>{c.name}</ItemTitle>
                    <ItemDescription className="line-clamp-1">{c.subject}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <span className="text-xs text-muted-foreground tabular-nums">{c.time}</span>
                    {c.unread && <span className="size-2 rounded-full bg-primary" aria-label="Não lida" />}
                  </ItemActions>
                </Item>
              </RowMenu>
              {i === 3 && <ItemSeparator />}
            </React.Fragment>
          ))}
        </ItemGroup>
      </ScrollArea>
      <div className="border-t p-3 text-xs text-muted-foreground">Clique com o botão direito em uma conversa</div>
    </div>
  )
}

function RowMenu({ conversation, children }: { conversation: Conversation; children: React.ReactElement }) {
  const [starred, setStarred] = React.useState(false)
  const [priority, setPriority] = React.useState("media")
  return (
    <ContextMenu>
      <ContextMenuTrigger render={children} />
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>{conversation.name}</ContextMenuLabel>
          <ContextMenuItem onClick={() => toast.add({ title: "Respondendo", description: conversation.subject })}><MailIcon /> Responder <ContextMenuShortcut>R</ContextMenuShortcut></ContextMenuItem>
          <ContextMenuItem onClick={() => void copiar(`2026${1000 + conversation.id}`, "Protocolo copiado")}><CopyIcon /> Copiar protocolo <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut></ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger className="gap-2.5"><TagIcon /> Mover para</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              {tags.map((t) => <ContextMenuItem key={t}>{t}</ContextMenuItem>)}
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked={starred} onCheckedChange={setStarred}>Marcar como importante</ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel>Prioridade</ContextMenuLabel>
          <ContextMenuRadioGroup value={priority} onValueChange={setPriority}>
            <ContextMenuRadioItem value="alta">Alta</ContextMenuRadioItem>
            <ContextMenuRadioItem value="media">Média</ContextMenuRadioItem>
            <ContextMenuRadioItem value="baixa">Baixa</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive"><Trash2Icon /> Excluir</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

function CustomerHoverCard({ conversation }: { conversation: Conversation }) {
  return (
    <HoverCard>
      <HoverCardTrigger render={<a href="#atendimento" className="font-medium underline-offset-4 hover:underline" />}>{conversation.name}</HoverCardTrigger>
      <HoverCardContent align="start" className="w-72">
        <div className="flex gap-3">
          <Avatar size="lg">
            <AvatarImage src={portrait(conversation.color, initials(conversation.name))} alt={conversation.name} />
            <AvatarFallback>{initials(conversation.name)}</AvatarFallback>
            <AvatarBadge />
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium">{conversation.name}</p>
            <p className="text-sm text-muted-foreground">Cliente desde 2019 · Conta corrente</p>
            <Badge variant="outline">{conversation.tag}</Badge>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

function Thread({ conversation }: { conversation: Conversation }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <Item className="p-0">
          <ItemHeader>
            <ItemTitle className="text-base">{conversation.subject}</ItemTitle>
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Arquivar" onClick={() => toast.add({ title: "Conversa arquivada" })} />}><ArchiveIcon /></TooltipTrigger>
                <TooltipContent>Arquivar</TooltipContent>
              </Tooltip>
            </div>
          </ItemHeader>
          <ItemFooter>
            <ItemDescription>Com <CustomerHoverCard conversation={conversation} /> · protocolo 2026{1000 + conversation.id}</ItemDescription>
            <Badge variant="secondary">{conversation.tag}</Badge>
          </ItemFooter>
        </Item>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 p-4 text-sm">
          <div className="flex gap-3">
            <Avatar size="sm"><AvatarFallback>{initials(conversation.name)}</AvatarFallback></Avatar>
            <div className="max-w-md space-y-3 rounded-2xl bg-muted p-3">
              <p>{conversation.preview}</p>
              <AttachmentGroup className="items-start">
                <Attachment orientation="vertical">
                  <AttachmentMedia variant="image"><img src={banner("#fa6300", "#462a71", "")} alt="Foto do cartão" /></AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>cartao.png</AttachmentTitle>
                    <AttachmentDescription>820 KB</AttachmentDescription>
                  </AttachmentContent>
                  <AttachmentTrigger aria-label="Abrir cartao.png" onClick={() => toast.add({ title: "Abrindo cartao.png" })} />
                </Attachment>
                <Attachment size="sm">
                  <AttachmentMedia><FileTextIcon /></AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>extrato.pdf</AttachmentTitle>
                    <AttachmentDescription>PDF · 1,4 MB</AttachmentDescription>
                  </AttachmentContent>
                </Attachment>
                <Attachment size="xs">
                  <AttachmentMedia><TableIcon /></AttachmentMedia>
                  <AttachmentContent><AttachmentTitle>gastos.csv</AttachmentTitle></AttachmentContent>
                </Attachment>
              </AttachmentGroup>
            </div>
          </div>
          <div className="flex flex-row-reverse gap-3">
            <Avatar size="sm"><AvatarFallback>EU</AvatarFallback></Avatar>
            <p className="max-w-md rounded-2xl bg-secondary p-3 text-secondary-foreground">Claro! Já estou analisando e retorno em instantes.</p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground"><Spinner /> {conversation.name.split(" ")[0]} está digitando…</div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

function Composer() {
  const [text, setText] = React.useState("")
  const send = () => {
    if (!text.trim()) return
    toast.add({ type: "success", title: "Mensagem enviada" })
    setText("")
  }
  return (
    <div className="flex h-full flex-col gap-3 overflow-auto p-4">
      <AttachmentGroup>
        <Attachment state="uploading" size="sm">
          <AttachmentMedia><Spinner /></AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>comprovante.pdf</AttachmentTitle>
            <AttachmentDescription>Enviando…</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions><AttachmentAction aria-label="Cancelar envio de comprovante.pdf"><XIcon /></AttachmentAction></AttachmentActions>
        </Attachment>
        <Attachment state="error" size="sm">
          <AttachmentMedia><ImageIcon /></AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>foto-documento.jpg</AttachmentTitle>
            <AttachmentDescription>Falha no envio</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions><AttachmentAction aria-label="Tentar enviar foto-documento.jpg de novo"><RotateCcwIcon /></AttachmentAction></AttachmentActions>
        </Attachment>
        <Attachment state="idle" size="sm">
          <AttachmentMedia><PaperclipIcon /></AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>Solte um arquivo</AttachmentTitle>
            <AttachmentDescription>Até 10 MB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      </AttachmentGroup>
      <InputGroup>
        <InputGroupTextarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }} placeholder="Escreva uma resposta…" aria-label="Resposta" />
        <InputGroupAddon align="block-end">
          <InputGroupButton size="icon-xs" aria-label="Anexar arquivo"><PaperclipIcon /></InputGroupButton>
          <span className="hidden text-xs font-normal sm:inline">Enviar com <Kbd>Enter</Kbd></span>
          <InputGroupButton variant="default" size="xs" className="ml-auto" onClick={send}><SendIcon /> Enviar</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
