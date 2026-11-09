import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArchiveIcon, ArrowLeftIcon, ChevronDownIcon, MinusIcon, PlusIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Opcao, Opcoes, pagina, vitrine } from "../componentes/Opcoes"

const orientacoes = ["horizontal", "vertical"] as const
type Orientacao = (typeof orientacoes)[number]
const variantes = ["outline", "secondary", "default", "ghost"] as const
type Variante = (typeof variantes)[number]
const tamanhos = ["sm", "default", "lg"] as const
type Tamanho = (typeof tamanhos)[number]

type Controles = { orientation: Orientacao; variant: Variante; size: Tamanho; quantidade: number; separador: boolean; texto: boolean }

const grupo = ({ orientation, variant, size, quantidade, separador, texto }: Controles) => {
  const nomes = ["Arquivar", "Adiar", "Responder", "Encaminhar"].slice(0, quantidade)
  return (
    <ButtonGroup orientation={orientation === "horizontal" ? undefined : orientation}>
      {texto && <ButtonGroupText>Caixa</ButtonGroupText>}
      {nomes.flatMap((n, i) => [
        separador && i > 0 && <ButtonGroupSeparator key={`s${n}`} orientation={orientation === "vertical" ? "horizontal" : undefined} />,
        <Button key={n} variant={variant} size={size === "default" ? undefined : size}>{n}</Button>,
      ])}
    </ButtonGroup>
  )
}

const base: Controles = { orientation: "horizontal", variant: "outline", size: "default", quantidade: 3, separador: false, texto: false }

const meta = {
  title: "Em construção/ButtonGroup",
  render: grupo,
  parameters: pagina("Junta botões e campos relacionados numa peça só: os cantos de dentro ficam retos e as bordas do meio somem. O visual dos botões continua sendo do `Button`; o grupo só os encosta."),
  argTypes: {
    orientation: { name: "Orientation", control: "inline-radio", options: orientacoes, description: "No código, `orientation`. `vertical` empilha os botões.", table: { category: "Aparência" } },
    variant: { name: "Type dos botões", control: "select", options: variantes, description: "`variant` de cada `Button`, não do grupo. Com `outline`, as bordas se juntam; nos outros, use o separador.", table: { category: "Aparência" } },
    size: { name: "Size dos botões", control: "inline-radio", options: tamanhos, description: "`size` de cada `Button`. O grupo acompanha.", table: { category: "Aparência" } },
    quantidade: { name: "Botões", control: { type: "range", min: 2, max: 4, step: 1 }, table: { category: "Conteúdo" } },
    separador: { name: "Separador", control: "boolean", description: "`ButtonGroupSeparator` entre os botões: a linha que os separa quando eles não têm borda, como `secondary`.", table: { category: "Conteúdo" } },
    texto: { name: "Texto", control: "boolean", description: "`ButtonGroupText` no começo: um rótulo com fundo `muted` colado no grupo.", table: { category: "Conteúdo" } },
  },
  args: base,
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Orientacoes: Story = {
  name: "Orientation",
  parameters: vitrine("No código, `orientation`. Sem a propriedade, o grupo é `horizontal`."),
  render: () => <Opcoes larga>{orientacoes.map((o) => <Opcao key={o} nome={o}>{grupo({ ...base, orientation: o })}</Opcao>)}</Opcoes>,
}

export const Tamanhos: Story = {
  name: "Size",
  parameters: vitrine("O exemplo do shadcn: o grupo acompanha o `size` dos botões."),
  render: () => <Opcoes larga>{tamanhos.map((s) => <Opcao key={s} nome={s}>{grupo({ ...base, size: s })}</Opcao>)}</Opcoes>,
}

export const Separadores: Story = {
  name: "Separador",
  parameters: vitrine("Os exemplos Separator e Split do shadcn: sem borda, os botões precisam do `ButtonGroupSeparator` para não virarem uma peça só."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="secondary sem separador">{grupo({ ...base, variant: "secondary" })}</Opcao>
      <Opcao nome="secondary com separador">{grupo({ ...base, variant: "secondary", separador: true })}</Opcao>
      <Opcao nome="Split">
        <ButtonGroup><Button variant="secondary">Seguir</Button><ButtonGroupSeparator /><Button variant="secondary" size="icon" aria-label="Mais"><PlusIcon /></Button></ButtonGroup>
      </Opcao>
    </Opcoes>
  ),
}

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("Os exemplos do shadcn com outros componentes: grupos dentro de um grupo (que ganham espaço entre si), Input, InputGroup, ButtonGroupText com Label e um contador."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="Grupos aninhados">
        <ButtonGroup>
          <ButtonGroup><Button variant="outline" size="icon" aria-label="Voltar"><ArrowLeftIcon /></Button></ButtonGroup>
          <ButtonGroup><Button variant="outline">Arquivar</Button><Button variant="outline">Spam</Button></ButtonGroup>
          <ButtonGroup><Button variant="outline" size="icon" aria-label="Mais opções"><ChevronDownIcon /></Button></ButtonGroup>
        </ButtonGroup>
      </Opcao>
      <Opcao nome="Com Input"><ButtonGroup><Input placeholder="Buscar..." aria-label="Buscar" /><Button variant="outline" size="icon" aria-label="Buscar"><SearchIcon /></Button></ButtonGroup></Opcao>
      <Opcao nome="Com InputGroup">
        <ButtonGroup>
          <Button variant="outline" size="icon" aria-label="Arquivar"><ArchiveIcon /></Button>
          <InputGroup><InputGroupInput placeholder="Mensagem" aria-label="Mensagem" /><InputGroupAddon align="inline-end">0/280</InputGroupAddon></InputGroup>
        </ButtonGroup>
      </Opcao>
      <Opcao nome="Texto com Label">
        <ButtonGroup><ButtonGroupText render={<Label htmlFor="grupo-url" />}>https://</ButtonGroupText><Input id="grupo-url" placeholder="exemplo.com" /></ButtonGroup>
      </Opcao>
      <Opcao nome="Contador">
        <ButtonGroup><Button variant="outline" size="icon-sm" aria-label="Menos"><MinusIcon /></Button><ButtonGroupText>2</ButtonGroupText><Button variant="outline" size="icon-sm" aria-label="Mais"><PlusIcon /></Button></ButtonGroup>
      </Opcao>
    </Opcoes>
  ),
}
