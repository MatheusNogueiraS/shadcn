import type { Meta, StoryObj } from "@storybook/react-vite"
import { MinusIcon, PlusIcon } from "lucide-react"
import { useState } from "react"
import { useArgs } from "storybook/preview-api"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useIsMobile } from "@/hooks/use-mobile"
import { pagina, Slot, vitrine } from "../componentes/Opcoes"

const direcoes = ["down", "up", "left", "right"] as const
type Direcao = (typeof direcoes)[number]

type Controles = { aberto: boolean; swipeDirection: Direcao; alca: boolean; modal: boolean; titulo: string; descricao: boolean; contador: boolean; slot: boolean; rodape: boolean }

// Um valor que sobe e desce de R$ 100 em R$ 100, como o contador do exemplo do shadcn.
function Contador() {
  const [valor, setValor] = useState(1000)
  return (
    <div className="flex items-center justify-center gap-(--gap-lg)">
      <Button variant="outline" size="icon" aria-label="Diminuir" disabled={valor <= 0} onClick={() => setValor((v) => Math.max(0, v - 100))}><MinusIcon /></Button>
      <div className="text-center"><div className="text-display-md">{valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div><div className="text-body-xs text-muted">por dia no Pix</div></div>
      <Button variant="outline" size="icon" aria-label="Aumentar" disabled={valor >= 5000} onClick={() => setValor((v) => Math.min(5000, v + 100))}><PlusIcon /></Button>
    </div>
  )
}

const conteudo = ({ titulo, descricao, contador, slot, rodape }: Pick<Controles, "titulo" | "descricao" | "contador" | "slot" | "rodape">) => (
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>{titulo}</DrawerTitle>
      {descricao && <DrawerDescription>Ajuste quanto pode sair por Pix em um dia.</DrawerDescription>}
    </DrawerHeader>
    <div className="flex flex-1 flex-col gap-(--gap-2xl) p-(--padding-2xl)">
      {contador && <Contador />}
      {slot && <Slot className="flex-1" />}
    </div>
    {rodape && <DrawerFooter><Button>Salvar</Button><DrawerClose render={<Button variant="outline" />}>Cancelar</DrawerClose></DrawerFooter>}
  </DrawerContent>
)

const base = { swipeDirection: "down" as Direcao, alca: true, modal: true, titulo: "Limite do Pix", descricao: true, contador: true, slot: false, rodape: true }
const aberto = ({ swipeDirection, alca, modal, ...resto }: Omit<Controles, "aberto">, extra?: { snapPoints?: (number | string)[] }) => (
  <Drawer defaultOpen swipeDirection={swipeDirection === "down" ? undefined : swipeDirection} showSwipeHandle={alca || undefined} modal={modal ? undefined : false} {...extra}>
    <DrawerTrigger render={<Button variant="outline" />}>Abrir</DrawerTrigger>
    {conteudo(resto)}
  </Drawer>
)

const meta = {
  title: "Em construção/Drawer",
  // Abrir e fechar na amostra atualiza o controle Open.
  render: function Amostra({ aberto: open, swipeDirection, alca, modal, ...resto }) {
    const [, atualizar] = useArgs<Controles>()
    return (
      <Drawer open={open} onOpenChange={(o) => atualizar({ aberto: o })} swipeDirection={swipeDirection === "down" ? undefined : swipeDirection} showSwipeHandle={alca || undefined} modal={modal ? undefined : false}>
        <DrawerTrigger render={<Button variant="outline" />}>Limite do Pix</DrawerTrigger>
        {conteudo(resto)}
      </Drawer>
    )
  },
  parameters: pagina("Gaveta que sobe de uma borda e fecha arrastando, pensada para o celular. Parece o Sheet, mas responde ao gesto de arrastar e pode parar em alturas intermediárias. Na amostra, o botão ou o controle **Open** abre a gaveta por cima desta página; as opções embaixo rodam cada uma no próprio quadro."),
  argTypes: {
    aberto: { name: "Open", control: "boolean", description: "No código, `open` no `Drawer` (ou `defaultOpen`).", table: { category: "Estado" } },
    swipeDirection: { name: "Swipe direction", control: "inline-radio", options: direcoes, description: "No código, `swipeDirection`: para onde se arrasta para fechar. A gaveta sai da borda do lado oposto: `down` sai de baixo.", table: { category: "Aparência" } },
    alca: { name: "Alça", control: "boolean", description: "`showSwipeHandle`: o traço que mostra que a gaveta se arrasta.", table: { category: "Conteúdo" } },
    modal: { name: "Modal", control: "boolean", description: "`modal`. Com `false`, a página atrás não escurece e continua usável.", table: { category: "Comportamento" } },
    titulo: { name: "Título", control: "text", description: "`DrawerTitle`. Na gaveta de baixo ou de cima, centralizado.", table: { category: "Conteúdo" } },
    descricao: { name: "Descrição", control: "boolean", description: "`DrawerDescription`.", table: { category: "Conteúdo" } },
    contador: { name: "Contador", control: "boolean", description: "O conteúdo do exemplo: um valor que sobe e desce com os botões de menos e mais.", table: { category: "Conteúdo" } },
    slot: { name: "Slot", control: "boolean", description: "Componentes deste tipo aceitam outros componentes dentro, entre o cabeçalho e o rodapé. Ligue para ver a região onde eles entram, no fim do conteúdo; no Figma, é o slot. Na gaveta de lado, ela ocupa a altura que sobra.", table: { category: "Conteúdo" } },
    rodape: { name: "Rodapé", control: "boolean", description: "`DrawerFooter`, colado embaixo, com os botões empilhados.", table: { category: "Conteúdo" } },
  },
  args: { aberto: false, ...base },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

const porDirecao = (swipeDirection: Direcao, descricao: string, altura: number): Story => ({
  name: `Swipe direction · ${swipeDirection}`,
  parameters: vitrine(descricao, altura),
  render: () => aberto({ ...base, swipeDirection }),
})

export const Baixo = porDirecao("down", "O exemplo do shadcn com o contador, um quadro por direção. Sem a propriedade, a gaveta sai de baixo.", 440)
export const Cima = porDirecao("up", "", 440)
export const Esquerda = porDirecao("left", "", 440)
export const Direita = porDirecao("right", "", 440)

export const SemAlca: Story = {
  name: "Sem alça",
  parameters: vitrine("Sem `showSwipeHandle`, a gaveta continua arrastável, mas sem o traço.", 440),
  render: () => aberto({ ...base, alca: false }),
}

export const NaoModal: Story = {
  name: "Modal · false",
  parameters: vitrine("`modal={false}`: sem o fundo escuro, e a página atrás continua usável.", 440),
  render: () => aberto({ ...base, modal: false }),
}

export const PontosDeParada: Story = {
  name: "Snap points",
  parameters: vitrine("`snapPoints`: alturas em que a gaveta para ao ser arrastada, como 40% da tela e a tela toda. O fundo fica meio transparente até a gaveta abrir por inteiro.", 480),
  render: () => aberto(base, { snapPoints: [0.4, 1] }),
}

const opcoes = [
  { valor: "agora", nome: "Agora", texto: "Cai na hora, pelo Pix", selo: "Mais rápida" },
  { valor: "hoje", nome: "Hoje, 18:00", texto: "Depois do fechamento do caixa" },
  { valor: "amanha", nome: "Amanhã, 09:00", texto: "Na abertura do próximo dia útil" },
  { valor: "sexta", nome: "Sexta, 12:00", texto: "Junto com o pagamento dos fornecedores" },
  { valor: "dia-5", nome: "Dia 5 do próximo mês", texto: "A data mais escolhida · Dia do salário" },
]

function ListaDeEscolha() {
  const [open, setOpen] = useState(true)
  const [escolha, setEscolha] = useState("agora")
  const celular = useIsMobile()
  return (
    <Drawer open={open} onOpenChange={setOpen} showSwipeHandle={celular} swipeDirection={celular ? "down" : "right"}>
      <DrawerTrigger render={<Button variant="secondary" />}>Agendar transferência</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader><DrawerTitle>Quando transferir?</DrawerTitle><DrawerDescription>Escolha quando o dinheiro sai da sua conta.</DrawerDescription></DrawerHeader>
        <div className="no-scrollbar flex-1 scroll-fade overflow-y-auto p-(--padding-2xl)">
          <RadioGroup value={escolha} onValueChange={(v) => setEscolha(v as string)} className="gap-(--gap-sm)">
            {opcoes.map((h) => (
              <FieldLabel key={h.valor} htmlFor={`escolha-${h.valor}`}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle className="flex items-center gap-(--gap-sm)">{h.nome}{h.selo && <Badge variant="secondary">{h.selo}</Badge>}</FieldTitle>
                    <FieldDescription>{h.texto}</FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value={h.valor} id={`escolha-${h.valor}`} />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </div>
        <DrawerFooter>
          <Button onClick={() => setOpen(false)}>Confirmar</Button>
          <DrawerClose render={<Button variant="outline" />}>Cancelar</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export const Lista: Story = {
  name: "Lista de escolha",
  parameters: vitrine("O exemplo principal do shadcn: uma lista de `RadioGroup` com `Field` no corpo. A lista rola por dentro, com `scroll-fade`, que esmaece as bordas para mostrar que há mais itens. No celular, a gaveta sai de baixo com a alça; no computador, da direita.", 520),
  render: () => <ListaDeEscolha />,
}

const pilha = ["Gaveta", "Segunda gaveta", "Terceira gaveta"]

function Aninhada({ nivel = 0 }: { nivel?: number }) {
  const ultima = nivel === pilha.length - 1
  return (
    <Drawer defaultOpen={nivel === 0}>
      <DrawerTrigger render={<Button variant={nivel === 0 ? "secondary" : "outline"} />}>{nivel === 0 ? "Abrir" : `Abrir a ${pilha[nivel].toLowerCase()}`}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader><DrawerTitle>{pilha[nivel]}</DrawerTitle><DrawerDescription>{ultima ? "A da frente da pilha." : "Abra outra gaveta da mesma borda."}</DrawerDescription></DrawerHeader>
        <div className="flex flex-1 flex-col p-(--padding-2xl)"><Slot className="flex-1" /></div>
        <DrawerFooter>
          {!ultima && <Aninhada nivel={nivel + 1} />}
          <DrawerClose render={<Button variant="outline" />}>Fechar</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export const Aninhadas: Story = {
  name: "Gavetas aninhadas",
  parameters: vitrine("O exemplo Nested do shadcn: cada gaveta abre outra da mesma borda, e as de trás encolhem e escurecem um pouco. O corpo de cada uma é um slot, como os blocos cinza do exemplo original.", 480),
  render: () => <Aninhada />,
}

const perfil = (
  <form className="grid gap-(--gap-3xl)" onSubmit={(e) => e.preventDefault()}>
    <FieldGroup>
      <Field><FieldLabel htmlFor="perfil-email">E-mail</FieldLabel><Input id="perfil-email" type="email" defaultValue="ana@exemplo.com" /></Field>
      <Field><FieldLabel htmlFor="perfil-usuario">Usuário</FieldLabel><Input id="perfil-usuario" defaultValue="@anasouza" /></Field>
    </FieldGroup>
    <Button type="submit">Salvar</Button>
  </form>
)

function DialogOuDrawer() {
  const celular = useIsMobile()
  if (!celular) {
    return (
      <Dialog defaultOpen>
        <DialogTrigger render={<Button variant="outline" />}>Editar perfil</DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar perfil</DialogTitle><DialogDescription>Mude seus dados e salve no fim.</DialogDescription></DialogHeader>
          {perfil}
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer defaultOpen>
      <DrawerTrigger render={<Button variant="outline" />}>Editar perfil</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader><DrawerTitle>Editar perfil</DrawerTitle><DrawerDescription>Mude seus dados e salve no fim.</DrawerDescription></DrawerHeader>
        <div className="p-(--padding-2xl)">{perfil}</div>
      </DrawerContent>
    </Drawer>
  )
}

export const DialogNoComputador: Story = {
  name: "Dialog no computador, Drawer no celular",
  parameters: vitrine("O exemplo Responsive dialog do shadcn: com `useIsMobile`, a mesma tela abre um Dialog quando o quadro tem 768 px ou mais e um Drawer abaixo disso. Abra a história sozinha e estreite a janela para ver a gaveta.", 380),
  render: () => <DialogOuDrawer />,
}
