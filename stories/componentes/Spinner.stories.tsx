import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
import { Opcao, Opcoes, pagina, vitrine } from "./Opcoes"

// Tamanhos que o Spinner já tem nos componentes, do menor para o maior. Sem a propriedade size, vêm do className.
const tamanhos = ["12", "16", "24"] as const
const classes = { "12": "size-(--size-xs)", "16": undefined, "24": "size-(--size-xl)" }
const rotulos = { "12": "12 px", "16": "16 px", "24": "24 px" }
type Controles = { tamanho: (typeof tamanhos)[number] }

const spinner = ({ tamanho }: Controles) => <Spinner className={classes[tamanho]} />

const meta = {
  title: "Componentes/Spinner",
  render: spinner,
  parameters: pagina("Indica que algo está carregando. Não tem Type nem State."),
  argTypes: {
    tamanho: {
      name: "Size",
      control: { type: "inline-radio", labels: rotulos },
      options: tamanhos,
      description: "O Spinner não tem a propriedade `size`: o tamanho vem do `className`, com o token de tamanho. Sem ele, tem 16 px.",
      table: { category: "Aparência" },
    },
  },
  args: { tamanho: "16" },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Tamanhos: Story = {
  name: "Size",
  parameters: vitrine("Do menor para o maior."),
  render: () => <Opcoes>{tamanhos.map((t) => <Opcao key={t} nome={rotulos[t]}>{spinner({ tamanho: t })}</Opcao>)}</Opcoes>,
}

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("Os exemplos do shadcn: o Spinner dentro de outros componentes, que definem o tamanho e a cor dele."),
  render: () => (
    <Opcoes>
      <Opcao nome="Em Badge"><Badge><Spinner data-icon="inline-start" />Sincronizando</Badge></Opcao>
      <Opcao nome="Em Button"><Button size="sm" disabled><Spinner data-icon="inline-start" />Carregando</Button></Opcao>
      <Opcao nome="Em InputGroup"><InputGroup><InputGroupInput placeholder="Enviar mensagem" disabled aria-label="Mensagem" /><InputGroupAddon align="inline-end"><Spinner /></InputGroupAddon></InputGroup></Opcao>
      <Opcao nome="Em Item">
        <Item variant="muted" className="w-full">
          <ItemMedia><Spinner /></ItemMedia>
          <ItemContent><ItemTitle>Pagando</ItemTitle></ItemContent>
          <ItemContent className="flex-none">R$ 100</ItemContent>
        </Item>
      </Opcao>
      <Opcao nome="Em Empty">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><Spinner /></EmptyMedia>
            <EmptyTitle>Processando o pedido</EmptyTitle>
            <EmptyDescription>Não atualize a página.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent><Button variant="outline" size="sm">Cancelar</Button></EmptyContent>
        </Empty>
      </Opcao>
    </Opcoes>
  ),
}
