import * as React from "react"
import { cn } from "cn"
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  CopyIcon,
  DownloadIcon,
  FileTextIcon,
  FolderIcon,
  InfoIcon,
  ItalicIcon,
  MinusIcon,
  MoreHorizontalIcon,
  PlusIcon,
  PrinterIcon,
  ShareIcon,
  UnderlineIcon,
} from "lucide-react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants } from "@/components/ui/button-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { toast } from "@/components/ui/toast"
import { Toggle, toggleVariants } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { banner } from "../art"

const pages = [
  { label: "Capa", from: "#fa6300", to: "#a43f04" },
  { label: "Resumo", from: "#462a71", to: "#2d194b" },
  { label: "Extrato", from: "#674c96", to: "#462a71" },
  { label: "Tarifas", from: "#ca5008", to: "#462a71" },
]

const tree = [
  { folder: "Contratos", files: ["abertura-de-conta.pdf", "cartao-de-credito.pdf"] },
  { folder: "Extratos 2026", files: ["outubro.pdf", "setembro.pdf", "agosto.pdf"] },
  { folder: "Impostos", files: ["informe-2025.pdf"] },
]

export function DocumentsView() {
  return (
    <div className="space-y-4">
      <EditorMenu />
      <PathBar />
      <Toolbar />
      <div className="grid items-start gap-4 lg:grid-cols-3">
        <FileTree />
        <Preview />
      </div>
    </div>
  )
}

function EditorMenu() {
  const [ruler, setRuler] = React.useState(true)
  const [margins, setMargins] = React.useState(false)
  const [zoom, setZoom] = React.useState("100")
  return (
    <Menubar className="w-fit">
      <MenubarMenu>
        <MenubarTrigger>Arquivo</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>Documento</MenubarLabel>
            <MenubarItem onClick={() => toast.add({ title: "Novo documento" })}>Novo <MenubarShortcut>Ctrl+N</MenubarShortcut></MenubarItem>
            <MenubarItem>Abrir <MenubarShortcut>Ctrl+O</MenubarShortcut></MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Exportar como</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>PDF</MenubarItem>
              <MenubarItem>CSV</MenubarItem>
              <MenubarItem>OFX</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem variant="destructive">Excluir</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Exibir</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked={ruler} onCheckedChange={setRuler}>Régua</MenubarCheckboxItem>
          <MenubarCheckboxItem checked={margins} onCheckedChange={setMargins}>Margens</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarLabel>Zoom</MenubarLabel>
            <MenubarRadioGroup value={zoom} onValueChange={setZoom}>
              <MenubarRadioItem value="75">75%</MenubarRadioItem>
              <MenubarRadioItem value="100">100%</MenubarRadioItem>
              <MenubarRadioItem value="150">150%</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

function PathBar() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem><BreadcrumbLink href="#documentos">Documentos</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" aria-label="Mostrar caminho" />}><BreadcrumbEllipsis /></DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Pessoa física</DropdownMenuItem>
              <DropdownMenuItem>Conta corrente</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbLink href="#documentos">Extratos 2026</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbPage>outubro.pdf</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function Toolbar() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex gap-1" role="group" aria-label="Estilo do texto">
        <Toggle aria-label="Negrito" defaultPressed><BoldIcon /></Toggle>
        <Toggle aria-label="Itálico"><ItalicIcon /></Toggle>
        <Toggle aria-label="Sublinhado" variant="outline"><UnderlineIcon /></Toggle>
      </div>

      <ToggleGroup defaultValue={["left"]} variant="outline" aria-label="Alinhamento">
        <ToggleGroupItem value="left" aria-label="Esquerda"><AlignLeftIcon /></ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Centro"><AlignCenterIcon /></ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Direita"><AlignRightIcon /></ToggleGroupItem>
      </ToggleGroup>

      <ButtonGroup>
        <ButtonGroupText>Página</ButtonGroupText>
        <Input aria-label="Número da página" defaultValue="1" className="w-14 text-center" />
        <ButtonGroupText>de 4</ButtonGroupText>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="secondary" onClick={() => toast.add({ title: "Download iniciado" })}><DownloadIcon /> Baixar</Button>
        <ButtonGroupSeparator />
        <ActionsMenu />
      </ButtonGroup>

      <ButtonGroup orientation="vertical" aria-label="Zoom">
        <Button variant="outline" size="icon-xs" aria-label="Aumentar zoom"><PlusIcon /></Button>
        <Button variant="outline" size="icon-xs" aria-label="Diminuir zoom"><MinusIcon /></Button>
      </ButtonGroup>

      {/* As funções de variantes dão a aparência do componente a outro elemento, como um link. */}
      <nav aria-label="Versões" className={cn(buttonGroupVariants())}>
        <a href="#documentos" data-slot="button" className={cn(toggleVariants({ variant: "outline", size: "sm" }))}>Atual</a>
        <a href="#documentos" data-slot="button" className={cn(toggleVariants({ variant: "outline", size: "sm" }))}>Anterior</a>
      </nav>

      <div className="ml-auto flex gap-2">
        <DetailsSheet />
        <ShareDrawer />
      </div>
    </div>
  )
}

function ActionsMenu() {
  const [showHidden, setShowHidden] = React.useState(false)
  const [notify, setNotify] = React.useState(true)
  const [sort, setSort] = React.useState("data")
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="secondary" size="icon" aria-label="Mais ações" />}><MoreHorizontalIcon /></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem><CopyIcon /> Duplicar <DropdownMenuShortcut>Ctrl+D</DropdownMenuShortcut></DropdownMenuItem>
          <DropdownMenuItem><PrinterIcon /> Imprimir <DropdownMenuShortcut>Ctrl+P</DropdownMenuShortcut></DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger><ShareIcon /> Enviar para</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>E-mail</DropdownMenuItem>
              <DropdownMenuItem>Contador</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Exibição</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={showHidden} onCheckedChange={setShowHidden}>Arquivos ocultos</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={notify} onCheckedChange={setNotify}>Avisar alterações</DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenuRadioItem value="data">Data</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="nome">Nome</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DetailsSheet() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}><InfoIcon /> Detalhes</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>outubro.pdf</SheetTitle>
          <SheetDescription>Extrato da conta corrente, gerado em 01/11/2026.</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 content-start gap-3 px-6">
          <Label htmlFor="doc-name">Nome</Label>
          <Input id="doc-name" defaultValue="outubro.pdf" />
          <div className="flex gap-2"><Badge variant="secondary">Extrato</Badge><Badge variant="outline">1,4 MB</Badge></div>
        </div>
        <SheetFooter>
          <SheetClose render={<Button onClick={() => toast.add({ title: "Alterações salvas" })} />}>Salvar</SheetClose>
          <SheetClose render={<Button variant="outline" />}>Cancelar</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function ShareDrawer() {
  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger render={<Button />}><ShareIcon /> Compartilhar</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Compartilhar documento</DrawerTitle>
            <DrawerDescription>Arraste para baixo para fechar.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4"><Input readOnly aria-label="Link do documento" value="https://exemplo.com/d/outubro" /></div>
          <DrawerFooter>
            <DrawerClose render={<Button onClick={() => toast.add({ title: "Link copiado" })} />}>Copiar link</DrawerClose>
            <DrawerClose render={<Button variant="outline" />}>Fechar</DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function FileTree() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pastas</CardTitle>
        <CardDescription>Collapsible</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {tree.map((t, i) => (
          <Collapsible key={t.folder} defaultOpen={i === 1}>
            <CollapsibleTrigger render={<Button variant="ghost" className="group/folder w-full justify-start" />}>
              <ChevronRightIcon className="transition-transform group-data-panel-open/folder:rotate-90" />
              <FolderIcon /> {t.folder}
              <ChevronsUpDownIcon className="ml-auto opacity-40" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="ml-6 space-y-1 border-l py-1 pl-3 text-sm">
                {t.files.map((f) => <li key={f} className="flex items-center gap-2 py-1 text-muted-foreground"><FileTextIcon className="size-4" /> {f}</li>)}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  )
}

function PageCounter() {
  const { api, scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel()
  const subscribe = React.useCallback((cb: () => void) => {
    api?.on("select", cb)
    api?.on("reInit", cb)
    return () => { api?.off("select", cb); api?.off("reInit", cb) }
  }, [api])
  const current = React.useSyncExternalStore(subscribe, () => (api?.selectedScrollSnap() ?? 0) + 1)
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
      <Button variant="ghost" size="xs" disabled={!canScrollPrev} onClick={scrollPrev}>Anterior</Button>
      <span className="tabular-nums">Página {current} de {pages.length}</span>
      <Button variant="ghost" size="xs" disabled={!canScrollNext} onClick={scrollNext}>Próxima</Button>
    </div>
  )
}

function Preview() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Pré-visualização</CardTitle>
        <CardDescription>Carousel com AspectRatio</CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel className="mx-12">
          <CarouselContent>
            {pages.map((p) => (
              <CarouselItem key={p.label}>
                <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-2xl bg-muted">
                  <img src={banner(p.from, p.to, p.label)} alt={`Página ${p.label}`} className="size-full object-cover" />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious aria-label="Página anterior" />
          <CarouselNext aria-label="Próxima página" />
          <PageCounter />
        </Carousel>
      </CardContent>
    </Card>
  )
}
