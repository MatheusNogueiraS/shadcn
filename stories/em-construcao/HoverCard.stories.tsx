import type { Meta, StoryObj } from "@storybook/react-vite"
import { CalendarIcon } from "lucide-react"
import { useArgs } from "storybook/preview-api"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { portrait } from "../../sandbox/art"
import { pagina, vitrine } from "../componentes/Opcoes"

const lados = ["bottom", "top", "right", "left"] as const
type Lado = (typeof lados)[number]

const alinhamentos = ["center", "start", "end"] as const
type Alinhamento = (typeof alinhamentos)[number]

type Controles = { aberto: boolean; side: Lado; align: Alinhamento }

const gatilho = <HoverCardTrigger render={<Button variant="link" />}>@anasouza</HoverCardTrigger>

// O exemplo do shadcn: o perfil de quem está no link.
const perfil = (side: Lado, align: Alinhamento = "center") => (
  <HoverCardContent side={side === "bottom" ? undefined : side} align={align === "center" ? undefined : align}>
    <div className="flex gap-(--gap-lg)">
      <Avatar><AvatarImage src={portrait("#fa6300", "AS")} alt="Ana Souza" /><AvatarFallback>AS</AvatarFallback></Avatar>
      <div className="flex flex-col gap-(--gap-2xs)">
        <span className="text-label-sm">@anasouza</span>
        <span>Designer de produto. Cuida dos pagamentos por Pix.</span>
        <span className="flex items-center gap-(--gap-xs) pt-(--padding-xs) text-body-xs text-muted"><CalendarIcon className="size-(--size-sm)" />Entrou em março de 2024</span>
      </div>
    </div>
  </HoverCardContent>
)

const meta = {
  title: "Em construção/HoverCard",
  // Abrir e fechar na amostra atualiza o controle Open.
  render: function Amostra({ aberto, side, align }) {
    const [, atualizar] = useArgs<Controles>()
    return <HoverCard open={aberto} onOpenChange={(o) => atualizar({ aberto: o })}>{gatilho}{perfil(side, align)}</HoverCard>
  },
  parameters: pagina("Prévia que abre ao passar o mouse sobre um link, como o perfil de quem foi citado. É só para ver: quem usa teclado ou toque não depende dela. Tem o visual do Popover, com 288 px de largura. Na amostra, passe o mouse no link ou use o controle **Open**; as opções embaixo rodam cada uma no próprio quadro, já abertas.", "/fotos/ana.png"),
  argTypes: {
    aberto: { name: "Open", control: "boolean", description: "No código, `open` no `HoverCard` (ou `defaultOpen`). No uso, quem abre é o mouse: o atraso se ajusta com `delay` e `closeDelay` no `HoverCardTrigger`.", table: { category: "Estado" } },
    side: { name: "Side", control: "inline-radio", options: lados, description: "No código, `side` no `HoverCardContent`.", table: { category: "Aparência" } },
    align: { name: "Align", control: "inline-radio", options: alinhamentos, description: "No código, `align`: a prévia alinhada ao começo, ao centro ou ao fim do link.", table: { category: "Aparência" } },
  },
  args: { aberto: false, side: "bottom", align: "center" },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

const porLado = (side: Lado, descricao: string): Story => ({
  name: `Side · ${side}`,
  parameters: { ...vitrine(descricao, 300), layout: "centered" },
  render: () => <HoverCard defaultOpen>{gatilho}{perfil(side)}</HoverCard>,
})

export const Baixo = porLado("bottom", "Um quadro por lado. Sem a propriedade, a prévia abre embaixo (`bottom`).")
export const Cima = porLado("top", "")
export const Direita = porLado("right", "")
export const Esquerda = porLado("left", "")
