import type { Meta, StoryObj } from "@storybook/react-vite"

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Opcao, Opcoes, Simula, pagina, vitrine, type Interacao } from "../componentes/Opcoes"

const interacoes: Interacao[] = ["Default", "Hover", "Focus"]

// O `size` do PaginationLink é o do Button; os números usam os tamanhos só de ícone.
const tamanhos = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const
type Tamanho = (typeof tamanhos)[number]

type Controles = { atual: number; total: number; size: Tamanho; reticencias: boolean; setas: boolean; textoSetas: boolean; estado: Interacao }

// Mostra a página atual com uma vizinha de cada lado; com reticências, o resto vira "…".
const paginacao = ({ atual: pedida, total, size = "icon", reticencias, setas, textoSetas }: Omit<Controles, "estado" | "size"> & { size?: Tamanho }) => {
  // O controle de página vai até 10; a atual não passa do total.
  const atual = Math.min(pedida, total)
  const paginas = Array.from({ length: total }, (_, i) => i + 1)
  const visiveis = reticencias ? paginas.filter((p) => p === 1 || p === total || Math.abs(p - atual) <= 1) : paginas
  return (
    <Pagination>
      <PaginationContent>
        {setas && <PaginationItem><PaginationPrevious href="#anterior" text={textoSetas ? "Anterior" : ""} /></PaginationItem>}
        {visiveis.flatMap((p, i) => [
          i > 0 && p - visiveis[i - 1] > 1 && <PaginationItem key={`r${p}`}><PaginationEllipsis /></PaginationItem>,
          <PaginationItem key={p}><PaginationLink href={`#${p}`} isActive={p === atual || undefined} size={size === "icon" ? undefined : size}>{p}</PaginationLink></PaginationItem>,
        ])}
        {setas && <PaginationItem><PaginationNext href="#proxima" text={textoSetas ? "Próxima" : ""} /></PaginationItem>}
      </PaginationContent>
    </Pagination>
  )
}

const base = { atual: 2, total: 3, reticencias: false, setas: true, textoSetas: true }

const meta = {
  title: "Em construção/Pagination",
  render: (args) => paginacao(args),
  parameters: pagina("Navega entre páginas de uma lista longa. Cada número é um link com o visual do `Button`: `ghost`, e `outline` na página atual. Não tem Type."),
  argTypes: {
    atual: { name: "Página atual", control: { type: "range", min: 1, max: 10, step: 1 }, description: "`isActive` no `PaginationLink` da página atual: ele vira `outline` e ganha `aria-current=\"page\"`.", table: { category: "Conteúdo" } },
    total: { name: "Total de páginas", control: { type: "range", min: 1, max: 10, step: 1 }, table: { category: "Conteúdo" } },
    size: { name: "Size", control: "inline-radio", options: tamanhos, description: "No código, `size` no `PaginationLink`, o mesmo do Button: 24, 32, 36 (o padrão, `icon`) ou 40 px. As setas usam o `default` do Button.", table: { category: "Aparência" } },
    reticencias: { name: "Reticências", control: "boolean", description: "`PaginationEllipsis` no lugar das páginas longe da atual.", table: { category: "Conteúdo" } },
    setas: { name: "Anterior e próxima", control: "boolean", description: "`PaginationPrevious` e `PaginationNext`.", table: { category: "Conteúdo" } },
    textoSetas: { name: "Texto das setas", control: "boolean", description: "A propriedade `text` (em inglês, Previous e Next, se faltar). Na tela estreita, o texto some e fica só a seta.", if: { arg: "setas" }, table: { category: "Conteúdo" } },
    estado: { name: "State", control: "inline-radio", options: interacoes, description: "Simulado, no primeiro número.", table: { category: "Estado" } },
  },
  args: { ...base, size: "icon", estado: "Default" },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia, { args }) => <Simula estado={args.estado} so="[data-slot=pagination-link]:not([aria-label]):not([data-active=true])"><Historia /></Simula>],
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Hover e Focus simulados num número. Active é a página atual."),
  render: () => (
    <Opcoes larga>
      {interacoes.map((e) => <Opcao key={e} nome={e}><Simula estado={e} so="[data-slot=pagination-link]"><Pagination><PaginationContent><PaginationItem><PaginationLink href="#1">1</PaginationLink></PaginationItem></PaginationContent></Pagination></Simula></Opcao>)}
      <Opcao nome="Active"><Pagination><PaginationContent><PaginationItem><PaginationLink href="#1" isActive>1</PaginationLink></PaginationItem></PaginationContent></Pagination></Opcao>
    </Opcoes>
  ),
}

export const Tamanhos: Story = {
  name: "Size",
  parameters: vitrine("No código, `size` no `PaginationLink`. Sem a propriedade, o número é `icon` (36 px)."),
  render: () => <Opcoes larga>{tamanhos.map((s) => <Opcao key={s} nome={s}>{paginacao({ ...base, size: s, setas: false })}</Opcao>)}</Opcoes>,
}

export const Conteudo: Story = {
  name: "Conteúdo",
  parameters: vitrine("Os exemplos do shadcn: a paginação completa, com reticências, e a simples, só com as setas."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="Com reticências">{paginacao({ ...base, atual: 5, total: 10, reticencias: true })}</Opcao>
      <Opcao nome="Só setas">{paginacao({ ...base, total: 0, textoSetas: true })}</Opcao>
      <Opcao nome="Setas sem texto">{paginacao({ ...base, textoSetas: false })}</Opcao>
    </Opcoes>
  ),
}
