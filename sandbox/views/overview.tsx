import * as React from "react"
import {
  ArrowUpDownIcon,
  CheckCircle2Icon,
  CreditCardIcon,
  DownloadIcon,
  InboxIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { copiar } from "../copiar"

/* ---------- dados ---------- */

const revenue = [
  { m: "Mai", v: 18200 }, { m: "Jun", v: 21400 }, { m: "Jul", v: 20100 },
  { m: "Ago", v: 26800 }, { m: "Set", v: 31500 }, { m: "Out", v: 38900 },
]
const signups = [
  { m: "Mai", free: 120, pro: 34 }, { m: "Jun", free: 150, pro: 41 },
  { m: "Jul", free: 138, pro: 52 }, { m: "Ago", free: 190, pro: 60 },
  { m: "Set", free: 210, pro: 77 }, { m: "Out", free: 245, pro: 91 },
]
const revenueCfg = { v: { label: "Receita", color: "var(--data-1)" } } satisfies ChartConfig
const signupCfg = {
  free: { label: "Free", color: "var(--data-1)" },
  pro: { label: "Pro", color: "var(--data-2)" },
} satisfies ChartConfig

type Status = "Ativo" | "Trial" | "Inadimplente" | "Cancelado"
type Customer = { id: number; name: string; email: string; plan: string; status: Status; mrr: number }

const names = ["Ana Souza", "Bruno Lima", "Carla Dias", "Diego Rocha", "Elisa Prado", "Fábio Nunes", "Gabi Alves", "Hugo Reis", "Iris Matos", "João Pires", "Karen Melo", "Lucas Faria", "Marta Cruz", "Nico Barros", "Olga Tavares", "Paulo Vieira", "Quésia Lobo", "Rafa Neves", "Sara Pinto", "Tiago Assis", "Ugo Ramos", "Vera Costa", "Wagner Dantas", "Yara Leal"]
const plans = ["Starter", "Pro", "Business", "Enterprise"]
const statuses: Status[] = ["Ativo", "Ativo", "Trial", "Ativo", "Inadimplente", "Cancelado"]
const customers: Customer[] = names.map((name, i) => ({
  id: i + 1,
  name,
  email: `${name.split(" ")[0].toLowerCase()}@empresa${i + 1}.com`,
  plan: plans[(i * 7) % 4],
  status: statuses[(i * 5) % 6],
  mrr: [0, 49, 149, 399][(i * 7) % 4] + (i % 5) * 10,
}))

const statusVariant: Record<Status, "default" | "secondary" | "destructive" | "outline"> = {
  Ativo: "default", Trial: "secondary", Inadimplente: "destructive", Cancelado: "outline",
}
const countries = { br: "Brasil", pt: "Portugal", us: "Estados Unidos" }
const statusFilters = { todos: "Todos os status", Ativo: "Ativo", Trial: "Trial", Inadimplente: "Inadimplente", Cancelado: "Cancelado" }
const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
const initials = (n: string) => n.split(" ").map((p) => p[0]).join("")

/* ---------- página ---------- */

export function OverviewView() {
  return (
    <div className="space-y-16 py-(--padding-3xl)">
        <section className="mx-auto max-w-3xl space-y-(--gap-2xl) text-center">
          <Badge variant="outline">54 componentes em 6 visões</Badge>
          <h1 className="text-display-md text-balance sm:text-display-lg">
            Construa o seu produto com um design system que você é dono
          </h1>
          <p className="text-muted text-balance">
            Cards de comportamentos reais e uma tabela de SaaS, todos usando os componentes da pasta ui.
          </p>
          <div className="flex justify-center gap-(--gap-sm)">
            <Button size="lg" onClick={() => document.getElementById("tabela")?.scrollIntoView({ behavior: "smooth" })}>Ver tabela</Button>
            <Button size="lg" variant="secondary" onClick={() => document.getElementById("cards")?.scrollIntoView({ behavior: "smooth" })}>Ver cards</Button>
          </div>
        </section>

        <section id="cards" className="grid gap-(--gap-2xl) md:grid-cols-2 lg:grid-cols-3">
          <MetricCards />
          <RevenueCard />
          <SignupsCard />
          <LoginCard />
          <SettingsCard />
          <PaymentCard />
          <TeamCard />
          <ProgressCard />
          <ShareCard />
          <TabsCard />
          <AlertsCard />
          <FaqCard />
          <ToolbarCard />
          <DialogCard />
          <LoadingCard />
          <EmptyCard />
        </section>

        <section id="tabela"><CustomersTable /></section>
    </div>
  )
}

/* ---------- cards ---------- */

function MetricCards() {
  const items = [
    { t: "Receita mensal", v: "R$ 38.900", d: "+23,4%" },
    { t: "Clientes ativos", v: "1.284", d: "+8,1%" },
    { t: "Churn", v: "2,3%", d: "-0,4%" },
  ]
  return (
    <>
      {items.map((m) => (
        <Card key={m.t}>
          <CardHeader>
            <CardDescription>{m.t}</CardDescription>
            <CardTitle className="text-heading-xl tabular-nums">{m.v}</CardTitle>
            <CardAction><Badge variant="outline">{m.d}</Badge></CardAction>
          </CardHeader>
          <CardFooter className="text-body-sm text-muted">Comparado ao mês anterior</CardFooter>
        </Card>
      ))}
    </>
  )
}

function RevenueCard() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Receita</CardTitle>
        <CardDescription>Últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueCfg} className="h-56 w-full">
          <AreaChart data={revenue} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="m" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area dataKey="v" type="monotone" fill="var(--color-v)" fillOpacity={0.2} stroke="var(--color-v)" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function SignupsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastros</CardTitle>
        <CardDescription>Free vs Pro</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={signupCfg} className="h-56 w-full">
          <BarChart data={signups}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="m" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="free" fill="var(--color-free)" radius={4} />
            <Bar dataKey="pro" fill="var(--color-pro)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function LoginCard() {
  const [email, setEmail] = React.useState("")
  const [error, setError] = React.useState("")
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Informe um e-mail válido")
    setError("")
    toast.add({ title: "Link enviado", description: email })
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Validação de formulário</CardDescription>
      </CardHeader>
      <form onSubmit={submit}>
        <CardContent className="space-y-(--gap-2xl)">
          <Field data-invalid={!!error}>
            <FieldLabel htmlFor="login-email">E-mail</FieldLabel>
            <Input id="login-email" value={email} aria-invalid={!!error} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com" />
            {error ? <FieldError>{error}</FieldError> : <FieldDescription>Enviaremos um link mágico.</FieldDescription>}
          </Field>
          <div className="flex items-center gap-(--gap-sm)">
            <Checkbox id="remember" defaultChecked />
            <Label htmlFor="remember">Lembrar de mim</Label>
          </div>
        </CardContent>
        <CardFooter className="mt-4"><Button type="submit" className="w-full">Continuar</Button></CardFooter>
      </form>
    </Card>
  )
}

function SettingsCard() {
  const [vol, setVol] = React.useState<number | readonly number[]>(60)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências</CardTitle>
        <CardDescription>Switch, slider e radio</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between">
          <Label htmlFor="sw-email">Notificações por e-mail</Label>
          <Switch id="sw-email" defaultChecked />
        </div>
        <div className="space-y-(--gap-sm)">
          <div className="flex justify-between text-body-sm"><Label>Volume</Label><span className="text-muted tabular-nums">{String(vol)}%</span></div>
          <Slider value={vol} onValueChange={setVol} />
        </div>
        <RadioGroup defaultValue="mensal">
          {["mensal", "anual"].map((v) => (
            <div key={v} className="flex items-center gap-(--gap-sm)">
              <RadioGroupItem value={v} id={`r-${v}`} />
              <Label htmlFor={`r-${v}`} className="capitalize">Cobrança {v}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

function PaymentCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagamento</CardTitle>
        <CardDescription>Input groups e select</CardDescription>
      </CardHeader>
      <CardContent className="space-y-(--gap-lg)">
        <InputGroup>
          <InputGroupAddon><CreditCardIcon /></InputGroupAddon>
          <InputGroupInput placeholder="0000 0000 0000 0000" inputMode="numeric" />
        </InputGroup>
        <div className="grid grid-cols-2 gap-(--gap-lg)">
          <Input placeholder="MM/AA" />
          <Input placeholder="CVC" />
        </div>
        <Select defaultValue="br" items={countries}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(countries).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}

function TeamCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Time</CardTitle>
        <CardDescription>Avatares e tooltips</CardDescription>
      </CardHeader>
      <CardContent className="space-y-(--gap-2xl)">
        <AvatarGroup>
          {names.slice(0, 5).map((n) => (
            <Tooltip key={n}>
              <TooltipTrigger render={<Avatar />}><AvatarFallback>{initials(n)}</AvatarFallback></TooltipTrigger>
              <TooltipContent>{n}</TooltipContent>
            </Tooltip>
          ))}
          <AvatarGroupCount>+12</AvatarGroupCount>
        </AvatarGroup>
        <Separator />
        <div className="flex flex-wrap gap-(--gap-sm)">
          <Badge>Design</Badge><Badge variant="secondary">Eng</Badge><Badge variant="outline">Produto</Badge><Badge variant="destructive">Urgente</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

function ProgressCard() {
  const [v, setV] = React.useState(35)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Onboarding</CardTitle>
        <CardDescription>Progresso interativo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-(--gap-2xl)">
        <Progress value={v} />
        <p className="text-body-sm text-muted tabular-nums">{v}% concluído</p>
      </CardContent>
      <CardFooter className="gap-(--gap-sm)">
        <Button variant="outline" size="sm" onClick={() => setV(Math.max(0, v - 15))}>-15</Button>
        <Button size="sm" onClick={() => setV(Math.min(100, v + 15))}>+15</Button>
      </CardFooter>
    </Card>
  )
}

function ShareCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compartilhar</CardTitle>
        <CardDescription>Copiar link com feedback</CardDescription>
      </CardHeader>
      <CardContent>
        <InputGroup>
          <InputGroupInput readOnly value="https://app.exemplo.com/p/abc123" />
          <InputGroupAddon align="inline-end">
            <Button size="xs" onClick={() => void copiar("https://app.exemplo.com/p/abc123", "Link copiado")}>Copiar</Button>
          </InputGroupAddon>
        </InputGroup>
      </CardContent>
      <CardFooter className="gap-(--gap-2xs) text-body-sm text-muted">
        Atalho: <KbdGroup><Kbd>Ctrl</Kbd><Kbd>K</Kbd></KbdGroup>
      </CardFooter>
    </Card>
  )
}

function TabsCard() {
  return (
    <Card>
      <CardHeader><CardTitle>Conta</CardTitle><CardDescription>Tabs</CardDescription></CardHeader>
      <CardContent>
        <Tabs defaultValue="perfil">
          <TabsList>
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="bio">Bio</TabsTrigger>
          </TabsList>
          <TabsContent value="perfil" className="space-y-(--gap-sm) pt-(--padding-sm)"><Input defaultValue="Matheus" /></TabsContent>
          <TabsContent value="bio" className="pt-(--padding-sm)"><Textarea placeholder="Conte sobre você" /></TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function AlertsCard() {
  return (
    <Card>
      <CardHeader><CardTitle>Alertas</CardTitle><CardDescription>Variantes</CardDescription></CardHeader>
      <CardContent className="space-y-(--gap-lg)">
        <Alert><CheckCircle2Icon /><AlertTitle>Deploy concluído</AlertTitle><AlertDescription>Versão 2.4 no ar.</AlertDescription></Alert>
        <Alert variant="destructive"><TriangleAlertIcon /><AlertTitle>Falha na cobrança</AlertTitle><AlertDescription>Cartão recusado.</AlertDescription></Alert>
      </CardContent>
    </Card>
  )
}

function FaqCard() {
  return (
    <Card>
      <CardHeader><CardTitle>FAQ</CardTitle><CardDescription>Accordion</CardDescription></CardHeader>
      <CardContent>
        <Accordion>
          <AccordionItem value="a"><AccordionTrigger>Posso cancelar quando quiser?</AccordionTrigger><AccordionContent>Sim, sem multa.</AccordionContent></AccordionItem>
          <AccordionItem value="b"><AccordionTrigger>Há plano gratuito?</AccordionTrigger><AccordionContent>Sim, o Starter.</AccordionContent></AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

function ToolbarCard() {
  return (
    <Card>
      <CardHeader><CardTitle>Visualização</CardTitle><CardDescription>Toggle group e menu</CardDescription></CardHeader>
      <CardContent className="flex flex-wrap items-center gap-(--gap-lg)">
        <ToggleGroup defaultValue={["lista"]} variant="outline">
          <ToggleGroupItem value="lista">Lista</ToggleGroupItem>
          <ToggleGroupItem value="grade">Grade</ToggleGroupItem>
        </ToggleGroup>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>Ações <MoreHorizontalIcon /></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Projeto</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => toast.add({ title: "Duplicado" })}>Duplicar</DropdownMenuItem>
              <DropdownMenuItem>Arquivar</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  )
}

function DialogCard() {
  return (
    <Card>
      <CardHeader><CardTitle>Convidar</CardTitle><CardDescription>Dialog modal</CardDescription></CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger render={<Button />}><PlusIcon /> Convidar membro</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar membro</DialogTitle>
              <DialogDescription>Enviaremos um convite por e-mail.</DialogDescription>
            </DialogHeader>
            <Input placeholder="email@empresa.com" />
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
              <DialogClose render={<Button onClick={() => toast.add({ title: "Convite enviado" })} />}>Enviar</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

function LoadingCard() {
  const [loading, setLoading] = React.useState(true)
  React.useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(t)
  }, [loading])
  return (
    <Card>
      <CardHeader><CardTitle>Carregamento</CardTitle><CardDescription>Skeleton</CardDescription></CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-(--gap-lg)">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 space-y-(--gap-sm)"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>
          </div>
        ) : (
          <div className="flex items-center gap-(--gap-lg)">
            <Avatar><AvatarFallback>AS</AvatarFallback></Avatar>
            <div><p className="text-label-sm">Ana Souza</p><p className="text-body-sm text-muted">ana@empresa.com</p></div>
          </div>
        )}
      </CardContent>
      <CardFooter><Button variant="outline" size="sm" onClick={() => setLoading(true)}>Recarregar</Button></CardFooter>
    </Card>
  )
}

function EmptyCard() {
  return (
    <Card>
      <CardContent>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><InboxIcon /></EmptyMedia>
            <EmptyTitle>Sem mensagens</EmptyTitle>
            <EmptyDescription>Quando chegar algo, aparece aqui.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  )
}

/* ---------- tabela SaaS ---------- */

const PAGE = 5

// Mantém a página na mesma visão: o href existe só para o link ser focável.
const stay = (go: () => void) => (e: React.MouseEvent) => {
  e.preventDefault()
  go()
}

function CustomersTable() {
  const [q, setQ] = React.useState("")
  const [status, setStatus] = React.useState<string>("todos")
  const [asc, setAsc] = React.useState(false)
  const [page, setPage] = React.useState(0)
  const [sel, setSel] = React.useState<Set<number>>(new Set())

  const rows = React.useMemo(() => {
    const t = q.trim().toLowerCase()
    return customers
      .filter((c) => (status === "todos" || c.status === status) && (!t || c.name.toLowerCase().includes(t) || c.email.includes(t)))
      .sort((a, b) => (asc ? a.mrr - b.mrr : b.mrr - a.mrr))
  }, [q, status, asc])

  const pages = Math.max(1, Math.ceil(rows.length / PAGE))
  const cur = Math.min(page, pages - 1)
  const visible = rows.slice(cur * PAGE, cur * PAGE + PAGE)
  const allSel = visible.length > 0 && visible.every((r) => sel.has(r.id))
  const toggle = (id: number, on: boolean) => setSel((s) => { const n = new Set(s); if (on) n.add(id); else n.delete(id); return n })
  const toggleAll = (on: boolean) => setSel((s) => { const n = new Set(s); visible.forEach((r) => (on ? n.add(r.id) : n.delete(r.id))); return n })
  const total = rows.reduce((a, r) => a + (r.status === "Ativo" ? r.mrr : 0), 0)
  const pageTotal = visible.reduce((a, r) => a + r.mrr, 0)
  const shown = Array.from({ length: pages }, (_, i) => i).filter((i) => i === 0 || i === pages - 1 || Math.abs(i - cur) <= 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes</CardTitle>
        <CardDescription>{rows.length} resultados · MRR ativo {brl(total)}</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" onClick={() => toast.add({ title: "Exportação iniciada", description: `${rows.length} linhas` })}><DownloadIcon /> Exportar</Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-(--gap-2xl)">
        <div className="flex flex-wrap gap-(--gap-sm)">
          <InputGroup className="max-w-xs">
            <InputGroupAddon><SearchIcon /></InputGroupAddon>
            <InputGroupInput placeholder="Buscar cliente…" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); setSel(new Set()) }} />
          </InputGroup>
          <Select value={status} items={statusFilters} onValueChange={(v) => { setStatus(v ?? "todos"); setPage(0); setSel(new Set()) }}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(statusFilters).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>
          {sel.size > 0 && (
            <Button variant="destructive" size="sm" className="self-center" onClick={() => { toast.add({ title: `${sel.size} cliente(s) arquivado(s)` }); setSel(new Set()) }}>Arquivar {sel.size}</Button>
          )}
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableCaption className="pb-(--padding-lg)">Assinaturas ordenadas por MRR.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={allSel} onCheckedChange={(c) => toggleAll(!!c)} aria-label="Selecionar todos" /></TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" className="font-bold" onClick={() => setAsc(!asc)}>MRR <ArrowUpDownIcon /></Button>
                </TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.length === 0 && (
                <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted">Nenhum cliente encontrado.</TableCell></TableRow>
              )}
              {visible.map((c) => (
                <TableRow key={c.id} data-state={sel.has(c.id) ? "selected" : undefined}>
                  <TableCell><Checkbox checked={sel.has(c.id)} onCheckedChange={(v) => toggle(c.id, !!v)} aria-label={`Selecionar ${c.name}`} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-(--gap-lg)">
                      <Avatar size="sm"><AvatarFallback>{initials(c.name)}</AvatarFallback></Avatar>
                      <div><p className="font-bold">{c.name}</p><p className="text-body-xs text-muted">{c.email}</p></div>
                    </div>
                  </TableCell>
                  <TableCell>{c.plan}</TableCell>
                  <TableCell><Badge variant={statusVariant[c.status]}>{c.status}</Badge></TableCell>
                  <TableCell className="text-right">{brl(c.mrr)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Ações" />}><MoreHorizontalIcon /></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.add({ title: "Abrindo perfil", description: c.name })}>Ver perfil</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => void copiar(c.email, "E-mail copiado")}>Copiar e-mail</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">Cancelar assinatura</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Total da página</TableCell>
                <TableCell className="text-right">{brl(pageTotal)}</TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <div className="flex items-center justify-between text-body-sm text-muted">
          <span>{sel.size} de {rows.length} selecionado(s)</span>
          <Pagination aria-label="Paginação" className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious text="Anterior" aria-label="Página anterior" href="#visao-geral" aria-disabled={cur === 0} tabIndex={cur === 0 ? -1 : undefined} className={cur === 0 ? "pointer-events-none opacity-50" : undefined} onClick={stay(() => setPage(Math.max(0, cur - 1)))} />
              </PaginationItem>
              {shown.map((i, n) => (
                <React.Fragment key={i}>
                  {n > 0 && i - shown[n - 1] > 1 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                  <PaginationItem>
                    <PaginationLink href="#visao-geral" isActive={i === cur} aria-label={`Página ${i + 1}`} onClick={stay(() => setPage(i))}>{i + 1}</PaginationLink>
                  </PaginationItem>
                </React.Fragment>
              ))}
              <PaginationItem>
                <PaginationNext text="Próxima" aria-label="Próxima página" href="#visao-geral" aria-disabled={cur >= pages - 1} tabIndex={cur >= pages - 1 ? -1 : undefined} className={cur >= pages - 1 ? "pointer-events-none opacity-50" : undefined} onClick={stay(() => setPage(Math.min(pages - 1, cur + 1)))} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  )
}
