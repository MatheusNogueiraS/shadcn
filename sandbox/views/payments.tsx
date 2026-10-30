import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  CalendarIcon,
  CircleDollarSignIcon,
  FileTextIcon,
  InfoIcon,
  LandmarkIcon,
  ShieldCheckIcon,
  WalletIcon,
  XIcon,
  ZapIcon,
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"

const payees = [
  { value: "Favoritos", items: ["Ana Souza", "Bruno Lima", "Carla Dias"] },
  { value: "Recentes", items: ["Diego Rocha", "Elisa Prado", "Fábio Nunes"] },
]
const notifyPeople = ["Ana Souza", "Bruno Lima", "Carla Dias", "Diego Rocha", "Elisa Prado"]

// Lista longa de propósito: em telas baixas, é ela que faz aparecerem as setas de rolagem do Select.
const mainBanks = ["Banco do Brasil", "Bradesco", "Caixa", "Itaú", "Santander"]
const otherBanks = ["Banrisul", "BRB", "BTG Pactual", "C6 Bank", "Inter", "Mercantil", "Nubank", "Original", "PagBank", "Safra", "Sicoob", "Sicredi", "Votorantim", "XP"]
const toKey = (name: string) => name.toLowerCase().replace(/\s+/g, "-")
const banks = Object.fromEntries([...mainBanks, ...otherBanks].map((b) => [toKey(b), b]))

const SALDO = 12480
// Formato brasileiro: 1250,50 ou 1.250,50.
const VALOR = /^(\d+|\d{1,3}(\.\d{3})+)(,\d{1,2})?$/
const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
const scheduled = [new Date(2026, 10, 5), new Date(2026, 10, 10), new Date(2026, 10, 20)]

export function PaymentsView() {
  const [amount, setAmount] = React.useState("1250,00")
  const [tipo, setTipo] = React.useState("pix")
  const valido = VALOR.test(amount.trim())
  const value = valido ? Number(amount.trim().replace(/\./g, "").replace(",", ".")) : 0
  const erro = value <= 0 ? "Informe um valor válido." : value > SALDO ? "O valor passa do saldo disponível." : ""
  return (
    <div className="grid items-start gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2"><TransferForm amount={amount} setAmount={setAmount} erro={erro} tipo={tipo} setTipo={setTipo} /></div>
      <div className="space-y-4">
        <SummaryCard value={value} invalid={Boolean(erro)} tipo={tipo} />
        <AgendaCard />
      </div>
    </div>
  )
}

function TransferForm({ amount, setAmount, erro, tipo, setTipo }: { amount: string; setAmount: (v: string) => void; erro: string; tipo: string; setTipo: (v: string) => void }) {
  const invalid = Boolean(erro)
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 10, 5))
  const [note, setNote] = React.useState("")
  const anchor = useComboboxAnchor()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova transferência</CardTitle>
        <CardDescription>Formulário completo com a família Field</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Destino</FieldLegend>
            <FieldDescription>Para quem o dinheiro vai.</FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="payee">Favorecido</FieldLabel>
                <Combobox items={payees} defaultValue="Ana Souza">
                  <ComboboxInput id="payee" placeholder="Buscar favorecido" showClear />
                  <ComboboxContent>
                    <ComboboxEmpty>Nenhum favorecido encontrado.</ComboboxEmpty>
                    <ComboboxList>
                      {(group: (typeof payees)[number], index: number) => (
                        <ComboboxGroup key={group.value} items={group.items}>
                          <ComboboxLabel>{group.value}</ComboboxLabel>
                          <ComboboxCollection>
                            {(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
                          </ComboboxCollection>
                          {index < payees.length - 1 && <ComboboxSeparator />}
                        </ComboboxGroup>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>
              <div className="grid gap-7 md:grid-cols-2">
                <Field>
                  <FieldLabel>Banco</FieldLabel>
                  <Select defaultValue={toKey("Itaú")} items={banks}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Principais</SelectLabel>
                        {mainBanks.map((b) => <SelectItem key={b} value={toKey(b)}>{b}</SelectItem>)}
                      </SelectGroup>
                      <SelectSeparator />
                      <SelectGroup>
                        <SelectLabel>Outros</SelectLabel>
                        {otherBanks.map((b) => <SelectItem key={b} value={toKey(b)}>{b}</SelectItem>)}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="account">Conta</FieldLabel>
                  <Input id="account" placeholder="0000-0" inputMode="numeric" />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">Valores</FieldSeparator>

          <FieldSet>
            <FieldLegend>Pagamento</FieldLegend>
            <FieldGroup>
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor="amount">Valor</FieldLabel>
                <InputGroup>
                  <InputGroupAddon><InputGroupText>R$</InputGroupText></InputGroupAddon>
                  <InputGroupInput id="amount" value={amount} aria-invalid={invalid} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton onClick={() => setAmount("12.480,00")}>Máximo</InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {invalid ? <FieldError>{erro}</FieldError> : <FieldDescription>Saldo disponível: {brl(SALDO)}.</FieldDescription>}
              </Field>

              <Field>
                <FieldLabel>Data</FieldLabel>
                <Popover>
                  <PopoverTrigger render={<Button variant="outline" data-empty={!date} className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground" />}>
                    <CalendarIcon />
                    {date ? format(date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" locale={ptBR} selected={date} onSelect={setDate} defaultMonth={date} />
                  </PopoverContent>
                </Popover>
              </Field>

              <RadioGroup value={tipo} onValueChange={(v) => setTipo(String(v))}>
                <FieldLabel htmlFor="tipo-pix">
                  <Field orientation="horizontal">
                    <RadioGroupItem value="pix" id="tipo-pix" />
                    <FieldContent>
                      <FieldTitle><ZapIcon className="size-4" /> Pix <Badge variant="secondary">Grátis</Badge></FieldTitle>
                      <FieldDescription>Cai na hora, a qualquer momento.</FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="tipo-ted">
                  <Field orientation="horizontal">
                    <RadioGroupItem value="ted" id="tipo-ted" />
                    <FieldContent>
                      <FieldTitle><LandmarkIcon className="size-4" /> TED</FieldTitle>
                      <FieldDescription>Até 17h em dias úteis.</FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              </RadioGroup>

              <Field>
                <FieldLabel htmlFor="note">Descrição</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea id="note" value={note} maxLength={120} onChange={(e) => setNote(e.target.value)} placeholder="Aparece no comprovante" />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="ml-auto tabular-nums">{note.length}/120</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <FieldLegend variant="label">Avisos</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel>Notificar também</FieldLabel>
                <Combobox multiple autoHighlight items={notifyPeople} defaultValue={[notifyPeople[1]]}>
                  <ComboboxChips ref={anchor}>
                    <ComboboxValue>
                      {(values: string[]) => (
                        <React.Fragment>
                          {values.map((v) => <ComboboxChip key={v}>{v}</ComboboxChip>)}
                          <ComboboxChipsInput placeholder="Adicionar pessoa" />
                        </React.Fragment>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>Ninguém encontrado.</ComboboxEmpty>
                    <ComboboxList>
                      {(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>
              <Field orientation="horizontal">
                <Switch id="save-payee" defaultChecked />
                <FieldLabel htmlFor="save-payee">Salvar favorecido</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="repeat" />
                <FieldContent>
                  <FieldLabel htmlFor="repeat">Repetir todo mês</FieldLabel>
                  <FieldDescription>Você pode cancelar a qualquer momento.</FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" onClick={() => toast.add({ title: "Rascunho salvo" })}>Salvar rascunho</Button>
        <ConfirmDialog disabled={invalid} />
      </CardFooter>
    </Card>
  )
}

function ConfirmDialog({ disabled }: { disabled: boolean }) {
  const [code, setCode] = React.useState("")
  const [sending, setSending] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => () => clearTimeout(timer.current), [])

  const confirm = (e: React.MouseEvent) => {
    // Mantém o dialog aberto durante o envio; ele fecha quando o envio termina.
    e.preventDefault()
    setSending(true)
    timer.current = setTimeout(() => {
      setSending(false)
      setOpen(false)
      setCode("")
      toast.add({ type: "success", title: "Transferência concluída", description: "O comprovante já está disponível." })
    }, 1200)
  }

  return (
    <AlertDialog open={open} onOpenChange={(proximo) => { if (sending) return; setOpen(proximo); if (!proximo) setCode("") }}>
      <AlertDialogTrigger render={<Button disabled={disabled} />}>Continuar</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia><ShieldCheckIcon /></AlertDialogMedia>
          <AlertDialogTitle>Confirme com o código</AlertDialogTitle>
          <AlertDialogDescription>Digite os 6 números enviados ao seu celular.</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode} aria-label="Código de confirmação">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={sending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction disabled={code.length < 6 || sending} onClick={confirm}>
            {sending && <Spinner />} Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function SummaryCard({ value, invalid, tipo }: { value: number; invalid: boolean; tipo: string }) {
  const lines = [
    { icon: CircleDollarSignIcon, title: "Valor", text: brl(value) },
    { icon: WalletIcon, title: "Tarifa", text: brl(0) },
    { icon: ZapIcon, title: "Chegada", text: tipo === "pix" ? "Na hora" : "Até 17h em dias úteis" },
  ]
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo</CardTitle>
        <CardDescription>
          Atualiza enquanto você digita{" "}
          <Popover>
            <PopoverTrigger render={<Button variant="ghost" size="icon-xs" aria-label="Como funciona" />}><InfoIcon /></PopoverTrigger>
            <PopoverContent align="start">
              <PopoverHeader>
                <PopoverTitle>Limite por transação</PopoverTitle>
                <PopoverDescription>O limite é o seu saldo disponível. Acima dele, o botão de continuar fica bloqueado.</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ItemGroup>
          {lines.map((l) => (
            <Item key={l.title} size="xs" variant="muted">
              <ItemMedia variant="icon"><l.icon /></ItemMedia>
              <ItemContent><ItemTitle>{l.title}</ItemTitle></ItemContent>
              <ItemContent className="flex-none text-right"><ItemDescription className={invalid && l.title === "Valor" ? "text-destructive" : "text-foreground"}>{l.text}</ItemDescription></ItemContent>
            </Item>
          ))}
        </ItemGroup>
        <Attachment className="w-full">
          <AttachmentMedia><FileTextIcon /></AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>boleto-novembro.pdf</AttachmentTitle>
            <AttachmentDescription>PDF · 84 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remover boleto-novembro.pdf"><XIcon /></AttachmentAction>
          </AttachmentActions>
        </Attachment>
      </CardContent>
    </Card>
  )
}

function DiaAgendado({ children, modifiers, day, ...props }: React.ComponentProps<typeof CalendarDayButton>) {
  return (
    <CalendarDayButton day={day} modifiers={modifiers} {...props}>
      {children}
      {modifiers.selected && <span className="sr-only">com pagamento agendado</span>}
    </CalendarDayButton>
  )
}

function AgendaCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agendamentos</CardTitle>
        <CardDescription>Calendário com dia personalizado</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="multiple"
          locale={ptBR}
          selected={scheduled}
          defaultMonth={new Date(2026, 10, 1)}
          components={{ DayButton: DiaAgendado }}
        />
      </CardContent>
      <CardFooter className="justify-between text-sm text-muted-foreground">3 pagamentos no mês <MonthPicker /></CardFooter>
    </Card>
  )
}

// Combobox com gatilho próprio em vez de campo: o ComboboxTrigger abre a lista a partir de um botão.
function MonthPicker() {
  return (
    <Combobox items={["Novembro", "Dezembro", "Janeiro"]} defaultValue="Novembro">
      <ComboboxTrigger render={<Button variant="ghost" size="xs" />}>
        <ComboboxValue />
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxList>
          {(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
