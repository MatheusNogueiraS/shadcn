import type { Meta, StoryObj } from "@storybook/react-vite"
import { useEffect, useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { Opcao, Opcoes, pagina, vitrine } from "../componentes/Opcoes"

const orientacoes = ["horizontal", "vertical"] as const
type Orientacao = (typeof orientacoes)[number]
// A largura de cada slide vem da classe `basis-*` no CarouselItem, como no exemplo Sizes do shadcn.
const larguras = { "1 por vez": "", "2 por vez": "basis-1/2", "3 por vez": "basis-1/3" } as const
type Largura = keyof typeof larguras

type Controles = { orientation: Orientacao; largura: Largura; loop: boolean; justo: boolean; setas: boolean }

const slide = (n: number) => (
  <Card size="sm" className="shadow-none">
    <CardContent className="flex aspect-square items-center justify-center text-display-md">{n}</CardContent>
  </Card>
)

const carrossel = ({ orientation, largura, loop, justo, setas }: Controles, setApi?: (api: CarouselApi) => void) => (
  <Carousel
    orientation={orientation === "horizontal" ? undefined : orientation}
    opts={loop || largura !== "1 por vez" ? { loop: loop || undefined, align: largura === "1 por vez" ? undefined : "start" } : undefined}
    setApi={setApi}
    className={orientation === "vertical" ? "w-48" : "w-64"}
  >
    <CarouselContent className={[orientation === "vertical" && "h-64", justo && (orientation === "vertical" ? "-mt-(--padding-xs)" : "-ml-(--padding-xs)")].filter(Boolean).join(" ") || undefined}>
      {[1, 2, 3, 4, 5].map((n) => (
        <CarouselItem key={n} className={[larguras[largura], justo && (orientation === "vertical" ? "pt-(--padding-xs)" : "pl-(--padding-xs)")].filter(Boolean).join(" ") || undefined}>{slide(n)}</CarouselItem>
      ))}
    </CarouselContent>
    {setas && <><CarouselPrevious /><CarouselNext /></>}
  </Carousel>
)

const base: Controles = { orientation: "horizontal", largura: "1 por vez", loop: false, justo: false, setas: true }

// O exemplo API do shadcn: o `setApi` dá acesso ao carrossel, aqui para contar os slides.
function ComContagem() {
  const [api, setApi] = useState<CarouselApi>()
  const [atual, setAtual] = useState(1)
  const total = api?.scrollSnapList().length ?? 0
  useEffect(() => {
    if (!api) return
    const mudar = () => setAtual(api.selectedScrollSnap() + 1)
    api.on("select", mudar)
    return () => { api.off("select", mudar) }
  }, [api])
  return (
    <div className="flex flex-col items-center gap-(--gap-sm)">
      {carrossel(base, setApi)}
      <span className="text-body-xs text-muted">Slide {atual} de {total}</span>
    </div>
  )
}

const meta = {
  title: "Em construção/Carousel",
  render: (args) => carrossel(args),
  parameters: pagina("Fila de slides que se passa com as setas, arrastando ou pelo teclado. Usa o Embla Carousel; as opções dele entram em `opts`. As setas são `Button` redondos, fora da área dos slides, e aceitam o `variant` e o `size` do Button (o padrão é `outline` e `icon-sm`)."),
  argTypes: {
    orientation: { name: "Orientation", control: "inline-radio", options: orientacoes, description: "No código, `orientation`. `vertical` passa os slides para cima e para baixo; a altura vem da classe no `CarouselContent`.", table: { category: "Aparência" } },
    largura: { name: "Slides por vez", control: "inline-radio", options: Object.keys(larguras), description: "Classe `basis-1/2` ou `basis-1/3` no `CarouselItem`, com `opts={{ align: \"start\" }}`.", table: { category: "Aparência" } },
    justo: { name: "Espaço menor", control: "boolean", description: "O exemplo Spacing do shadcn: o espaço entre os slides é o recuo do `CarouselItem` (`pl-*`), desfeito por uma margem negativa igual no `CarouselContent` (`-ml-*`).", table: { category: "Aparência" } },
    loop: { name: "Loop", control: "boolean", description: "`opts={{ loop: true }}`: depois do último, volta ao primeiro, e as setas nunca desligam.", table: { category: "Comportamento" } },
    setas: { name: "Setas", control: "boolean", description: "`CarouselPrevious` e `CarouselNext`. No começo e no fim, a seta do lado sem slide fica desabilitada.", table: { category: "Conteúdo" } },
  },
  args: base,
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia) => <div className="px-(--padding-5xl) py-(--padding-5xl)"><Historia /></div>],
}

export const Orientacoes: Story = {
  name: "Orientation",
  parameters: vitrine("No código, `orientation`. Sem a propriedade, o Carousel é `horizontal`."),
  render: () => <Opcoes larga>{orientacoes.map((o) => <Opcao key={o} nome={o}><div className="p-(--padding-5xl)">{carrossel({ ...base, orientation: o })}</div></Opcao>)}</Opcoes>,
}

export const Larguras: Story = {
  name: "Slides por vez",
  parameters: vitrine("O exemplo Sizes do shadcn, com `basis-*` no `CarouselItem`, e o Spacing, com o espaço menor."),
  render: () => (
    <Opcoes larga>
      {(Object.keys(larguras) as Largura[]).map((l) => <Opcao key={l} nome={l}><div className="px-(--padding-5xl)">{carrossel({ ...base, largura: l })}</div></Opcao>)}
      <Opcao nome="3 por vez · espaço menor"><div className="px-(--padding-5xl)">{carrossel({ ...base, largura: "3 por vez", justo: true })}</div></Opcao>
    </Opcoes>
  ),
}

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("O exemplo API do shadcn: o `setApi` dá acesso ao carrossel, para mostrar em que slide se está. O exemplo Plugin (troca automática) pede o pacote `embla-carousel-autoplay`, que o projeto não tem."),
  render: () => <div className="px-(--padding-5xl)"><ComContagem /></div>,
}
