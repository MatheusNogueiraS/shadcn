import * as React from "react"
import { CircleAlertIcon, InboxIcon, PlusIcon, ReceiptIcon, UploadIcon, WifiOffIcon } from "lucide-react"

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  toast,
  useToastManager,
} from "@/components/ui/toast"
import { portrait } from "../art"

// Segundo gerenciador: mostra como montar um toast próprio com as peças de baixo nível, à esquerda da tela.
const receipts = createToastManager()

function ReceiptToasts() {
  const { toasts } = useToastManager()
  return toasts.map((item) => (
    <Toast key={item.id} toast={item}>
      <ToastContent>
        <ReceiptIcon className="size-4 shrink-0 text-brand" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col gap-(--gap-2xs)">
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  ))
}

export function StatusView() {
  return (
    <ToastProvider toastManager={receipts}>
      <div className="grid items-start gap-(--gap-2xl) md:grid-cols-2 lg:grid-cols-3">
        <ToastsCard />
        <UploadCard />
        <AlertsCard />
        <SpinnersCard />
        <SkeletonCard />
        <PresenceCard />
        <Card className="md:col-span-2 lg:col-span-3"><CardContent><EmptyState /></CardContent></Card>
      </div>
      <ToastPortal>
        <ToastViewport className="sm:right-auto sm:left-4"><ReceiptToasts /></ToastViewport>
      </ToastPortal>
    </ToastProvider>
  )
}

function ToastsCard() {
  const types = [
    { type: "success", label: "Sucesso", title: "Pagamento aprovado" },
    { type: "info", label: "Informação", title: "Nova fatura disponível" },
    { type: "warning", label: "Atenção", title: "Limite quase no fim" },
    { type: "error", label: "Erro", title: "Falha na cobrança" },
    { type: "loading", label: "Carregando", title: "Processando…" },
  ]
  const disparar = (t: (typeof types)[number]) => {
    const id = toast.add({ type: t.type, title: t.title, description: "Exemplo de toast." })
    // Toast de carregamento não fecha sozinho: quem o abriu avisa quando o trabalho termina.
    if (t.type === "loading") setTimeout(() => toast.update(id, { type: "success", title: "Processado", description: "Exemplo de toast." }), 3000)
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Toasts</CardTitle>
        <CardDescription>Tipos, ação e toast personalizado</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-(--gap-sm)">
        {types.map((t) => (
          <Button key={t.type} variant="outline" size="sm" onClick={() => disparar(t)}>{t.label}</Button>
        ))}
        <Button variant="outline" size="sm" onClick={() => toast.add({ title: "Conversa arquivada", actionProps: { children: "Desfazer", onClick: () => toast.add({ type: "info", title: "Arquivamento desfeito" }) } })}>Com ação</Button>
        <Button variant="secondary" size="sm" onClick={() => receipts.add({ title: "Comprovante pronto", description: "Pix de R$ 1.250,00", actionProps: { children: "Abrir" } })}><ReceiptIcon /> Personalizado</Button>
      </CardContent>
    </Card>
  )
}

function UploadCard() {
  const [value, setValue] = React.useState(0)
  const [running, setRunning] = React.useState(false)
  const done = value >= 100
  React.useEffect(() => {
    if (!running || done) return
    const t = setInterval(() => setValue((v) => Math.min(100, v + 10)), 300)
    return () => clearInterval(t)
  }, [running, done])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Envio de arquivo</CardTitle>
        <CardDescription>Progress com rótulo e valor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-(--gap-2xl)">
        <Progress value={value}>
          <ProgressLabel>{done ? "Concluído" : "extrato.pdf"}</ProgressLabel>
          <ProgressValue />
        </Progress>
        <Button
          size="sm"
          variant="outline"
          disabled={running && !done}
          onClick={() => { setValue(0); setRunning(true) }}
        >
          {running && !done ? <Spinner /> : <UploadIcon />} {done ? "Enviar de novo" : "Enviar"}
        </Button>
      </CardContent>
    </Card>
  )
}

function AlertsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas</CardTitle>
        <CardDescription>Com ação</CardDescription>
      </CardHeader>
      <CardContent className="space-y-(--gap-lg)">
        <Alert>
          <WifiOffIcon />
          <AlertTitle>Sem conexão</AlertTitle>
          <AlertDescription>Mostrando dados de 09:42.</AlertDescription>
          <AlertAction><Button size="xs" variant="outline" onClick={() => toast.add({ title: "Tentando de novo…" })}>Tentar</Button></AlertAction>
        </Alert>
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>Cartão bloqueado</AlertTitle>
          <AlertDescription>Três senhas incorretas.</AlertDescription>
          <AlertAction><Button size="xs" variant="destructive">Desbloquear</Button></AlertAction>
        </Alert>
      </CardContent>
    </Card>
  )
}

function SpinnersCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spinners</CardTitle>
        <CardDescription>Sozinho, em botão e em badge</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-(--gap-lg)">
        <Spinner />
        <Spinner className="size-6 text-brand" />
        <Button disabled><Spinner /> Salvando</Button>
        <Badge variant="secondary"><Spinner /> Sincronizando</Badge>
      </CardContent>
    </Card>
  )
}

function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skeleton</CardTitle>
        <CardDescription>Lista carregando</CardDescription>
      </CardHeader>
      <CardContent className="space-y-(--gap-lg)">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-(--gap-lg)">
            <Skeleton className="size-9 rounded-full" />
            <div className="flex-1 space-y-(--gap-sm)">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function PresenceCard() {
  const team = [
    { i: "AS", c: "#fa6300" },
    { i: "BL", c: "#462a71" },
    { i: "CD", c: "#a43f04" },
  ]
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quem está online</CardTitle>
        <CardDescription>Avatar com imagem, reserva e selo</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-(--gap-2xl)">
        <AvatarGroup>
          {team.map((t) => (
            <Avatar key={t.i}>
              <AvatarImage src={portrait(t.c, t.i)} alt={t.i} />
              <AvatarFallback>{t.i}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>+5</AvatarGroupCount>
        </AvatarGroup>
        <Avatar size="lg">
          {/* Sem src: mostra a reserva com as iniciais. */}
          <AvatarFallback>EU</AvatarFallback>
          <AvatarBadge />
        </Avatar>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon"><InboxIcon /></EmptyMedia>
        <EmptyTitle>Nenhum pagamento agendado</EmptyTitle>
        <EmptyDescription>Agende contas para não perder o vencimento. <a href="#pagamentos">Saiba mais</a></EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-(--gap-sm)">
          <Button render={<a href="#pagamentos" />} nativeButton={false}><PlusIcon /> Agendar</Button>
          <Button variant="outline" onClick={() => toast.add({ title: "Lista atualizada" })}>Atualizar</Button>
        </div>
      </EmptyContent>
    </Empty>
  )
}
