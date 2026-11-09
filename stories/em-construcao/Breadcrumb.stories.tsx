import type { Meta, StoryObj } from "@storybook/react-vite"
import { Fragment } from "react"
import { ChevronDownIcon, SlashIcon } from "lucide-react"

import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Opcao, Opcoes, Simula, pagina, vitrine, type Interacao } from "../componentes/Opcoes"

const caminho = ["Início", "Pagamentos", "Pix", "Agendados", "Detalhes"]
const separadores = ["Chevron", "Barra"] as const
type Separador = (typeof separadores)[number]
const interacoes: Interacao[] = ["Default", "Hover"]

type Controles = { niveis: number; separador: Separador; reticencias: boolean; estado: Interacao }

// Com reticências, os níveis do meio somem e só ficam o primeiro e os dois últimos.
const trilha = ({ niveis, separador, reticencias }: Omit<Controles, "estado">) => {
  const nomes = caminho.slice(0, niveis)
  const visiveis = reticencias && nomes.length > 3 ? [nomes[0], null, ...nomes.slice(-2)] : nomes
  const sep = <BreadcrumbSeparator>{separador === "Barra" ? <SlashIcon /> : undefined}</BreadcrumbSeparator>
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {visiveis.map((nome, i) => {
          const ultimo = i === visiveis.length - 1
          return (
            <Fragment key={nome ?? "reticencias"}>
              <BreadcrumbItem>
                {nome === null ? <BreadcrumbEllipsis /> : ultimo ? <BreadcrumbPage>{nome}</BreadcrumbPage> : <BreadcrumbLink href={`#${nome}`}>{nome}</BreadcrumbLink>}
              </BreadcrumbItem>
              {!ultimo && sep}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

const base = { niveis: 3, separador: "Chevron" as Separador, reticencias: false }

const meta = {
  title: "Em construção/Breadcrumb",
  render: (args) => trilha(args),
  parameters: pagina("Mostra onde a página está dentro do site, do início até ela. Os níveis anteriores são links; o último é a página atual, sem link. Não tem Type nem Size."),
  argTypes: {
    niveis: { name: "Níveis", control: { type: "range", min: 2, max: 5, step: 1 }, description: "Quantos `BreadcrumbItem` a trilha tem.", table: { category: "Conteúdo" } },
    separador: { name: "Separador", control: "inline-radio", options: separadores, description: "Sem filhos, o `BreadcrumbSeparator` mostra o chevron. Qualquer ícone dentro dele o substitui, como a barra do exemplo do shadcn.", table: { category: "Conteúdo" } },
    reticencias: { name: "Reticências", control: "boolean", description: "`BreadcrumbEllipsis` no lugar dos níveis do meio, a partir de 4 níveis.", table: { category: "Conteúdo" } },
    estado: { name: "State", control: "inline-radio", options: interacoes, description: "Simulado, no primeiro link: o hover escurece o texto.", table: { category: "Estado" } },
  },
  args: { ...base, estado: "Default" },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia, { args }) => <Simula estado={args.estado} so="[data-slot=breadcrumb-link]"><Historia /></Simula>],
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Hover simulado no primeiro link. A página atual não tem hover: é um `BreadcrumbPage`, sem link."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="Default">{trilha(base)}</Opcao>
      <Opcao nome="Hover"><Simula estado="Hover" so="[data-slot=breadcrumb-link]">{trilha(base)}</Simula></Opcao>
    </Opcoes>
  ),
}

export const Conteudo: Story = {
  name: "Conteúdo",
  parameters: vitrine("Os exemplos do shadcn: separador personalizado e reticências no lugar dos níveis do meio."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="Barra">{trilha({ ...base, separador: "Barra" })}</Opcao>
      <Opcao nome="Reticências">{trilha({ ...base, niveis: 5, reticencias: true })}</Opcao>
    </Opcoes>
  ),
}

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("Os exemplos do shadcn com DropdownMenu: as reticências ou um nível abrem um menu com os outros caminhos. Clique para abrir."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="Reticências com menu">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="#inicio">Início</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger render={<button type="button" aria-label="Mais caminhos" className="flex items-center" />}><BreadcrumbEllipsis /></DropdownMenuTrigger>
                <DropdownMenuContent align="start"><DropdownMenuItem>Pagamentos</DropdownMenuItem><DropdownMenuItem>Pix</DropdownMenuItem></DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Agendados</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Opcao>
      <Opcao nome="Nível com menu">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="#inicio">Início</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger render={<button type="button" className="flex items-center gap-(--gap-2xs) hover:text-default" />}>Pagamentos <ChevronDownIcon className="size-(--size-sm)" /></DropdownMenuTrigger>
                <DropdownMenuContent align="start"><DropdownMenuItem>Pix</DropdownMenuItem><DropdownMenuItem>Boleto</DropdownMenuItem><DropdownMenuItem>Cartão</DropdownMenuItem></DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Pix</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Opcao>
    </Opcoes>
  ),
}
