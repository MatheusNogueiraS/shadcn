import * as React from "react"
import { Bar, BarChart, XAxis } from "recharts"
import { CircleCheckIcon, CopyIcon, FileTextIcon, ImageIcon, InboxIcon, MailIcon, PaperclipIcon, PlusIcon, RotateCcwIcon, WifiOffIcon, XIcon } from "lucide-react"

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle, AttachmentTrigger } from "@/components/ui/attachment"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { ContextMenu, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuTrigger } from "@/components/ui/context-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarTrigger } from "@/components/ui/menubar"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { banner } from "../art"

// Listras na área de padding, como no inspetor do navegador: a camada lisa de cima cobre só o conteúdo.
const listras = "repeating-linear-gradient(45deg, color-mix(in oklab, var(--bg-brand) 45%, transparent) 0 2px, transparent 2px 6px)"
const pad = (fundo = "var(--bg-page)"): React.CSSProperties => ({ background: `linear-gradient(${fundo} 0 0) content-box, ${listras} padding-box ${fundo}` })

const Realce = React.createContext(true)
const useRealce = (fundo?: string) => (React.useContext(Realce) ? pad(fundo) : undefined)

const decisoes = [
  ["38 px", "Recuo dos itens de menu", "Fica: é resultado de padding-lg 12 + ícone 16 + gap-md 10, não vira token.", "Mantido"],
  ["Margens", "17 componentes", "Tokens de gap, como -mx-(--gap-xs). No carrossel, o token do padding que ela desfaz.", "Aplicado"],
  ["Raio 2 px", "Gráfico e seta do tooltip", "--radius-xs (unit-2), rounded-xs.", "Aplicado"],
  ["Padding 48 px", "Empty", "--padding-5xl (unit-48).", "Aplicado"],
  ["72 px", "Alert com ação", "Valor fixo em rem, sem token: pr-[4.5rem].", "Aplicado"],
  ["1, 3 e 18 px", "ScrollBar, MenubarTrigger, NavigationMenuTrigger", "Viraram 2 px, 4 px e 16 px.", "Aplicado"],
  ["Gap 28 px", "FieldGroup", "Virou 24 px (gap-3xl).", "Aplicado"],
  ["Card", "card.tsx", "--card-spacing saiu: padding-3xl e gap-3xl (2xl no tamanho sm).", "Aplicado"],
  ["Espessura", "Bordas, anéis e contornos", "Escala stroke (sm 1, md 1,5, lg 2, xl 3, 2xl 4 px): border-sm, ring-xl, outline-sm.", "Aplicado"],
  ["Size", "Ícones, avatares, checkbox, botões só com ícone", "Escala size (3xs 8 a 5xl 64 px): size-(--size-md).", "Aplicado"],
  ["Alturas e larguras", "h-9, min-w-32…", "Ficam com a escala do Tailwind, como o shadcn escreveu.", "Mantido"],
  ["Peso da fonte", "font-normal, font-medium, font-bold em 8 componentes", "O estilo com o peso: text-body-sm, text-label-sm, text-body-sm-bold.", "Aplicado"],
  ["Texto 12,8 px", "Dias da semana e número da semana do Calendar", "text-body-xs (12 px).", "Aplicado"],
  ["Altura de linha e espaçamento entre letras", "leading-* e tracking-* em 12 componentes", "line-height-12 e 14 nas fundações e 6 estilos: label-sm-compact, label-xs-compact, label-xs-wide, body-xs-compact, heading-sm-compact, heading-md-tight. Field, Item, Attachment, o dia do Calendar e a descrição do Empty usam o estilo base.", "Aplicado"],
  ["Família", "font-heading e font-mono ao lado do estilo em 8 componentes", "O estilo é uma classe só, com a família dentro. Tabela e valor do gráfico ganharam o grupo mono: mono-sm, mono-sm-bold, mono-xs-compact.", "Aplicado"],
  ["Texto sem estilo", "Conteúdo de menus, janelas, Sidebar, Calendar, Command, Empty, KbdGroup e Toast", "Cada superfície que recebe texto tem estilo (quase sempre body-sm) e as partes de dentro herdam dela; SidebarInset usa body-md, como o body.", "Aplicado"],
  ["Sombras", "Menus, janelas, Card, Sidebar, Switch, Slider, Drawer", "Escala shadow-sm (fraca) a shadow-xl (forte), mais shadow-xl-up no Drawer empilhado, com a cor shadow-color (preto, opacity-10). As outras sombras do Tailwind saíram.", "Aplicado"],
  ["Opacidade 60 a 90", "Tabs, Sidebar, Calendar, Attachment, Alert, Checkbox, Radio, Switch, Slider, Combobox", "opacity-60, 70, 80 e 90 nas fundações. bg-muted/50 e opacity-50 leem a escala.", "Aplicado"],
  ["Contorno do Slider", "slider.tsx", "ring-black/10 virou ring-(--shadow-color), mesmo valor.", "Aplicado"],
]

export function RefinamentoView() {
  const [realce, setRealce] = React.useState(true)
  return (
    <div className="space-y-(--gap-3xl)">
      <div className="flex flex-wrap items-center justify-between gap-(--gap-lg)">
        <p className="max-w-2xl text-body-sm text-muted">Onde ficavam as medidas fora da escala, já com os valores novos. A área listrada é a medida em questão. Com o realce ligado, o hover dos itens some.</p>
        <div className="flex items-center gap-(--gap-sm)">
          <Switch id="realce" checked={realce} onCheckedChange={setRealce} />
          <Label htmlFor="realce">Realçar medidas</Label>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Decisões</CardTitle><CardDescription>Aplicadas nos componentes em 05/11/2026.</CardDescription></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Medida</TableHead><TableHead>Onde</TableHead><TableHead>Decisão</TableHead><TableHead>Situação</TableHead></TableRow></TableHeader>
            <TableBody>
              {decisoes.map(([medida, onde, decisao, situacao]) => (
                <TableRow key={medida}>
                  <TableCell>{medida}</TableCell>
                  <TableCell className="text-muted">{onde}</TableCell>
                  <TableCell className="whitespace-normal">{decisao}</TableCell>
                  <TableCell><Badge variant={situacao === "Aplicado" ? "default" : situacao === "Depois" ? "ghost" : "outline"}>{situacao}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Realce.Provider value={realce}>
        <div className="grid gap-(--gap-2xl) xl:grid-cols-2">
          <Exemplo titulo="Empty" onde="empty.tsx:9" rotulo="p-(--padding-5xl) · 48 px"><ExemploEmpty /></Exemplo>
          <Exemplo titulo="Alert" onde="alert.tsx:6" rotulo="pr-[4.5rem] · 72 px"><ExemploAlert /></Exemplo>
          <Exemplo titulo="NavigationMenuTrigger" onde="navigation-menu.tsx:58" rotulo="px-(--padding-2xl) · 16 px"><ExemploNav /></Exemplo>
          <Exemplo titulo="MenubarTrigger" onde="menubar.tsx:59" rotulo="py-(--padding-2xs) · 4 px"><ExemploMenubar /></Exemplo>
          <Exemplo titulo="FieldGroup" onde="field.tsx:44" rotulo="gap-(--gap-3xl) · 24 px"><ExemploCampos /></Exemplo>
          <Exemplo titulo="ScrollBar" onde="scroll-area.tsx:38" rotulo="p-(--padding-3xs) · 2 px"><ExemploScroll /></Exemplo>
          <Exemplo titulo="Raio 2 px" onde="chart.tsx:222 e 313, tooltip.tsx:58" rotulo="rounded-xs · passe o mouse"><ExemploRaio /></Exemplo>
          <Exemplo titulo="Menus · recuo de 38 px" onde="context-menu, dropdown-menu e menubar" rotulo="pl-9.5 · resultado · abra os menus"><ExemploMenus /></Exemplo>
        </div>
        <Exemplo titulo="Attachment · padding maior" onde="attachment.tsx:14-17 e 88 · tamanhos default, sm e xs" rotulo="Padding maior em todos os tamanhos. Só a imagem e na vertical, o padding é igual em volta: 12, 10 e 6. As listras são o padding de cada chip."><ExemploAttachment /></Exemplo>
      </Realce.Provider>
    </div>
  )
}

function Exemplo({ titulo, onde, rotulo, children }: { titulo: string; onde: string; rotulo: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader><CardTitle>{titulo}</CardTitle><CardDescription>{onde}</CardDescription></CardHeader>
      <CardContent className="space-y-(--gap-sm)">
        <p className="text-body-xs text-muted">{rotulo}</p>
        <div className="rounded-2xl border bg-page p-(--padding-2xl)">{children}</div>
      </CardContent>
    </Card>
  )
}

function ExemploEmpty() {
  return (
    <Empty style={useRealce()}>
      <EmptyHeader>
        <EmptyMedia variant="icon"><InboxIcon /></EmptyMedia>
        <EmptyTitle>Nada agendado</EmptyTitle>
        <EmptyDescription>Agende contas para não perder o vencimento.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent><Button size="sm"><PlusIcon /> Agendar</Button></EmptyContent>
    </Empty>
  )
}

function ExemploAlert() {
  return (
    <Alert style={useRealce("var(--bg-surface)")}>
      <WifiOffIcon />
      <AlertTitle>Sem conexão</AlertTitle>
      <AlertDescription>Mostrando os dados salvos às 09:42 até a conexão voltar.</AlertDescription>
      <AlertAction><Button size="xs" variant="outline">Tentar</Button></AlertAction>
    </Alert>
  )
}

function ExemploNav() {
  const estilo = useRealce()
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {["Produtos", "Recursos"].map((t) => (
          <NavigationMenuItem key={t}>
            <NavigationMenuTrigger style={estilo}>{t}</NavigationMenuTrigger>
            <NavigationMenuContent className="p-(--padding-xs)">
              <NavigationMenuLink href="#refinamento">Visão geral</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ExemploMenubar() {
  const estilo = useRealce()
  return (
    <Menubar className="w-fit">
      {["Arquivo", "Editar"].map((t) => (
        <MenubarMenu key={t}>
          <MenubarTrigger style={estilo}>{t}</MenubarTrigger>
          <MenubarContent><MenubarCheckboxItem>Régua</MenubarCheckboxItem></MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  )
}

function ExemploCampos() {
  const ligado = React.useContext(Realce)
  const id = React.useId()
  const campo = ligado ? { background: "var(--bg-page)" } : undefined
  return (
    // Gap não é padding: as listras ficam no grupo e cada campo cobre a sua parte.
    <FieldGroup style={ligado ? { background: listras } : undefined}>
      {["Nome", "E-mail"].map((t) => (
        <Field key={t} style={campo}>
          <FieldLabel htmlFor={id + t}>{t}</FieldLabel>
          <Input id={id + t} />
        </Field>
      ))}
    </FieldGroup>
  )
}

function ExemploScroll() {
  const trilho = React.useContext(Realce) ? "**:data-[slot=scroll-area-scrollbar]:bg-brand/30" : ""
  return (
    <ScrollArea className={`h-32 rounded-2xl border ${trilho}`}>
      <ul className="space-y-(--gap-sm) p-(--padding-lg) text-body-sm">
        {Array.from({ length: 12 }, (_, i) => <li key={i}>Lançamento {i + 1}</li>)}
      </ul>
    </ScrollArea>
  )
}

const grafico = [{ m: "Set", free: 210, pro: 77 }, { m: "Out", free: 245, pro: 91 }]
const graficoCfg = { free: { label: "Free", color: "var(--data-1)" }, pro: { label: "Pro", color: "var(--data-2)" } } satisfies ChartConfig

function ExemploRaio() {
  return (
    <div className="flex flex-wrap items-center gap-(--gap-2xl)">
      <ChartContainer config={graficoCfg} className="h-32 w-48">
        <BarChart data={grafico}>
          <XAxis dataKey="m" tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="free" fill="var(--color-free)" radius={4} />
          <Bar dataKey="pro" fill="var(--color-pro)" radius={4} />
        </BarChart>
      </ChartContainer>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="sm" />}>Seta do tooltip</TooltipTrigger>
        <TooltipContent>Cantos de 2 px</TooltipContent>
      </Tooltip>
    </div>
  )
}

function ExemploMenus() {
  const estilo = useRealce("var(--bg-surface)")
  return (
    <div className="space-y-(--gap-2xl)">
      {/* A soma que dá o recuo, desenhada com os próprios tokens. */}
      <div className="flex w-fit items-center rounded-3xl bg-surface py-(--padding-sm) pr-(--padding-lg) text-label-sm">
        <span className="h-4 w-(--padding-lg) bg-brand/30" title="padding-lg · 12" />
        <span className="size-4 bg-brand" title="ícone · 16" />
        <span className="h-4 w-(--gap-md) bg-brand/30" title="gap-md · 10" />
        Texto do item
      </div>
      <p className="text-body-xs text-muted">12 (padding-lg) + 16 (ícone) + 10 (gap-md) = 38</p>
      <div className="flex flex-wrap items-center gap-(--gap-lg)">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>DropdownMenu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel inset style={estilo}>Com inset</DropdownMenuLabel>
              <DropdownMenuItem><MailIcon /> Com ícone</DropdownMenuItem>
              <DropdownMenuItem inset style={estilo}>Sem ícone, alinhado</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <ContextMenu>
          <ContextMenuTrigger className="rounded-2xl border border-dashed px-(--padding-lg) py-(--padding-sm) text-label-sm text-muted">Clique com o botão direito</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuGroup>
              <ContextMenuLabel inset style={estilo}>Com inset</ContextMenuLabel>
              <ContextMenuItem><CopyIcon /> Com ícone</ContextMenuItem>
              <ContextMenuItem inset style={estilo}>Sem ícone, alinhado</ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuContent>
        </ContextMenu>
        <Menubar className="w-fit">
          <MenubarMenu>
            <MenubarTrigger>Menubar</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem defaultChecked style={estilo}>Régua</MenubarCheckboxItem>
              <MenubarRadioGroup defaultValue="100">
                <MenubarRadioItem value="100" style={estilo}>100%</MenubarRadioItem>
                <MenubarRadioItem value="150" style={estilo}>150%</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  )
}

// Medidas de cada tamanho em attachment.tsx; a altura é a do chip com título e descrição.
const tamanhos = [
  ["default", "padding 16 × 12 (era 8 × 8) · altura 66 (era 58) · espaço 8 · mídia 40 · raio 24 (era 20) · título 14 px"],
  ["sm", "padding 12 × 10 (era 6 × 6) · altura 56 (era 48) · espaço 10 · mídia 32 · raio 20 · título 12 px"],
  ["xs", "padding 8 × 6 (era 4 × 4) · altura 48 (era 44) · espaço 6 · mídia 28 · raio 18 · título 12 px"],
] as const

type Anexo = { state: React.ComponentProps<typeof Attachment>["state"]; midia: React.ReactNode; titulo: string; descricao: string; acao?: string; icone?: React.ReactNode }
const anexos: Anexo[] = [
  { state: "done", midia: <FileTextIcon />, titulo: "extrato.pdf", descricao: "PDF · 1,4 MB", acao: "Remover", icone: <XIcon /> },
  { state: "uploading", midia: <Spinner />, titulo: "comprovante.pdf", descricao: "Enviando…", acao: "Cancelar envio de", icone: <XIcon /> },
  { state: "processing", midia: <Spinner />, titulo: "gastos.csv", descricao: "Processando…" },
  { state: "error", midia: <ImageIcon />, titulo: "foto-documento.jpg", descricao: "Falha no envio", acao: "Tentar enviar de novo", icone: <RotateCcwIcon /> },
  { state: "success", midia: <CircleCheckIcon />, titulo: "rg-frente.jpg", descricao: "Documento aprovado" },
  { state: "idle", midia: <PaperclipIcon />, titulo: "Solte um arquivo", descricao: "Até 10 MB" },
]

const capa = banner("#fa6300", "#462a71", "")

function ExemploAttachment() {
  const estilo = useRealce("var(--bg-surface)")
  return (
    <div className="space-y-(--gap-3xl)">
      {tamanhos.map(([size, medidas]) => (
        <div key={size} className="space-y-(--gap-sm)">
          <p className="text-label-sm">{size} <span className="text-body-xs text-muted">· {medidas}</span></p>
          <div className="flex flex-wrap items-center gap-(--gap-lg)">
            {anexos.map((a) => (
              <Attachment key={a.state} size={size} state={a.state} style={estilo}>
                <AttachmentMedia>{a.midia}</AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{a.titulo}</AttachmentTitle>
                  <AttachmentDescription>{a.descricao}</AttachmentDescription>
                </AttachmentContent>
                {a.acao && <AttachmentActions><AttachmentAction aria-label={`${a.acao} ${a.titulo}`}>{a.icone}</AttachmentAction></AttachmentActions>}
              </Attachment>
            ))}
            <Attachment size={size} style={estilo}>
              <AttachmentMedia variant="image"><img src={capa} alt="" /></AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>cartao.png</AttachmentTitle>
                <AttachmentDescription>Imagem · 820 KB</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
            <Attachment size={size} style={estilo}>
              <AttachmentMedia variant="image"><img src={capa} alt="cartao.png" /></AttachmentMedia>
            </Attachment>
          </div>
        </div>
      ))}
      <div className="space-y-(--gap-sm)">
        <p className="text-label-sm">vertical <span className="text-body-xs text-muted">· nos três tamanhos, clicável e com ação</span></p>
        <div className="flex flex-wrap items-start gap-(--gap-lg)">
          {tamanhos.map(([size]) => (
            <Attachment key={size} size={size} orientation="vertical" style={estilo}>
              <AttachmentMedia variant="image"><img src={capa} alt="" /></AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>cartao.png</AttachmentTitle>
                <AttachmentDescription>{size}</AttachmentDescription>
              </AttachmentContent>
              <AttachmentTrigger aria-label={`Abrir cartao.png (${size})`} />
              <AttachmentActions><AttachmentAction aria-label={`Remover cartao.png (${size})`}><XIcon /></AttachmentAction></AttachmentActions>
            </Attachment>
          ))}
        </div>
      </div>
    </div>
  )
}
