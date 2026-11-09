import type { Meta, StoryObj } from "@storybook/react-vite"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, XAxis } from "recharts"

import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Opcao, Opcoes, pagina, vitrine } from "../componentes/Opcoes"

const tipos = ["Bar", "Line", "Area", "Pie"] as const
type Tipo = (typeof tipos)[number]
const indicadores = ["dot", "line", "dashed"] as const
type Indicador = (typeof indicadores)[number]

const dados = [
  { mes: "Jun", pix: 186, boleto: 80 },
  { mes: "Jul", pix: 305, boleto: 200 },
  { mes: "Ago", pix: 237, boleto: 120 },
  { mes: "Set", pix: 173, boleto: 190 },
  { mes: "Out", pix: 209, boleto: 130 },
  { mes: "Nov", pix: 214, boleto: 140 },
]
const fatias = [
  { forma: "pix", valor: 275, fill: "var(--color-pix)" },
  { forma: "boleto", valor: 200, fill: "var(--color-boleto)" },
  { forma: "cartao", valor: 187, fill: "var(--color-cartao)" },
]
// As cores vêm dos tokens de dados (--data-1 a --data-5); o ChartContainer as expõe como --color-<chave>.
const config = {
  pix: { label: "Pix", color: "var(--data-1)" },
  boleto: { label: "Boleto", color: "var(--data-2)" },
  cartao: { label: "Cartão", color: "var(--data-3)" },
  valor: { label: "Valor" },
} satisfies ChartConfig

type Controles = { tipo: Tipo; grade: boolean; legenda: boolean; legendaEmCima: boolean; indicator: Indicador; hideLabel: boolean; hideIndicator: boolean; tooltipAberto: boolean }

const grafico = ({ tipo, grade, legenda, legendaEmCima, indicator, hideLabel, hideIndicator, tooltipAberto }: Controles) => {
  // `defaultIndex` deixa o tooltip aberto no terceiro mês, para ele aparecer sem o mouse.
  const tooltip = <ChartTooltip defaultIndex={tooltipAberto ? 2 : undefined} content={<ChartTooltipContent indicator={indicator === "dot" ? undefined : indicator} hideLabel={hideLabel || undefined} hideIndicator={hideIndicator || undefined} />} />
  const eixo = <XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={8} />
  const rodape = legenda && <ChartLegend verticalAlign={legendaEmCima ? "top" : undefined} content={<ChartLegendContent />} />
  if (tipo === "Pie") {
    return (
      <ChartContainer config={config} className="aspect-square h-56">
        <PieChart>
          <ChartTooltip defaultIndex={tooltipAberto ? 0 : undefined} content={<ChartTooltipContent nameKey="forma" hideLabel indicator={indicator === "dot" ? undefined : indicator} hideIndicator={hideIndicator || undefined} />} />
          <Pie data={fatias} dataKey="valor" nameKey="forma" innerRadius={50} />
          {legenda && <ChartLegend verticalAlign={legendaEmCima ? "top" : undefined} content={<ChartLegendContent nameKey="forma" />} />}
        </PieChart>
      </ChartContainer>
    )
  }
  const Grafico = { Bar: BarChart, Line: LineChart, Area: AreaChart }[tipo]
  return (
    <ChartContainer config={config} className="h-56 w-full">
      <Grafico data={dados} margin={{ left: 12, right: 12 }}>
        {grade && <CartesianGrid vertical={false} />}
        {eixo}
        {tooltip}
        {tipo === "Bar" && <><Bar dataKey="pix" fill="var(--color-pix)" radius={8} /><Bar dataKey="boleto" fill="var(--color-boleto)" radius={8} /></>}
        {tipo === "Line" && <><Line dataKey="pix" type="monotone" stroke="var(--color-pix)" strokeWidth={2} dot={false} /><Line dataKey="boleto" type="monotone" stroke="var(--color-boleto)" strokeWidth={2} dot={false} /></>}
        {tipo === "Area" && <><Area dataKey="boleto" type="natural" fill="var(--color-boleto)" fillOpacity={0.3} stroke="var(--color-boleto)" stackId="a" /><Area dataKey="pix" type="natural" fill="var(--color-pix)" fillOpacity={0.3} stroke="var(--color-pix)" stackId="a" /></>}
        {rodape}
      </Grafico>
    </ChartContainer>
  )
}

const base: Controles = { tipo: "Bar", grade: true, legenda: true, legendaEmCima: false, indicator: "dot", hideLabel: false, hideIndicator: false, tooltipAberto: true }

const meta = {
  title: "Em construção/Chart",
  render: (args) => grafico(args),
  parameters: pagina("Gráficos feitos com o Recharts dentro do `ChartContainer`, que aplica as cores, a fonte e o tamanho. O `config` dá o nome e a cor de cada série; as cores são os tokens `--data-1` a `--data-5`. O que muda no visual daqui é o tooltip e a legenda; o resto é do Recharts."),
  argTypes: {
    tipo: { name: "Gráfico", control: "inline-radio", options: tipos, description: "Os gráficos do Recharts que os exemplos do shadcn mais usam: barras, linhas, área e pizza.", table: { category: "Conteúdo" } },
    grade: { name: "Grade", control: "boolean", description: "`CartesianGrid`: as linhas de fundo, na cor `divider`.", table: { category: "Conteúdo" } },
    legenda: { name: "Legenda", control: "boolean", description: "`ChartLegend` com `ChartLegendContent`: o nome e a cor de cada série, vindos do `config`. Se o `config` der um `icon` à série, ele entra no lugar do quadradinho de cor; `hideIcon` o esconde.", table: { category: "Conteúdo" } },
    legendaEmCima: { name: "Legenda em cima", control: "boolean", description: "`verticalAlign=\"top\"` no `ChartLegend`: a legenda sobe para cima do gráfico, com o espaço do outro lado.", if: { arg: "legenda" }, table: { category: "Conteúdo" } },
    tooltipAberto: { name: "Tooltip aberto", control: "boolean", description: "`defaultIndex` no `ChartTooltip`: o tooltip fica aberto num ponto. No uso, ele aparece ao passar o mouse.", table: { category: "Estado" } },
    indicator: { name: "Indicator", control: "inline-radio", options: indicadores, description: "No código, `indicator` no `ChartTooltipContent`: a marca de cor de cada série, em ponto, linha ou tracejado.", table: { category: "Tooltip" } },
    hideLabel: { name: "Hide label", control: "boolean", description: "`hideLabel`: tira o título do tooltip (o mês).", table: { category: "Tooltip" } },
    hideIndicator: { name: "Hide indicator", control: "boolean", description: "`hideIndicator`: tira a marca de cor.", table: { category: "Tooltip" } },
  },
  args: base,
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia) => <div className="w-md"><Historia /></div>],
}

export const Tipos: Story = {
  name: "Gráfico",
  parameters: vitrine("Barras, linhas, área empilhada e pizza com furo, como nos exemplos do shadcn."),
  render: () => <Opcoes larga>{tipos.map((t) => <Opcao key={t} nome={t}>{grafico({ ...base, tipo: t, tooltipAberto: false })}</Opcao>)}</Opcoes>,
}

export const Indicadores: Story = {
  name: "Indicator",
  parameters: vitrine("No código, `indicator`. Sem a propriedade, o tooltip usa `dot`."),
  render: () => <Opcoes larga>{indicadores.map((i) => <Opcao key={i} nome={i}>{grafico({ ...base, indicator: i, legenda: false })}</Opcao>)}</Opcoes>,
}

export const Tooltip: Story = {
  name: "Tooltip",
  parameters: vitrine("Sem o título (`hideLabel`) e sem a marca de cor (`hideIndicator`)."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="hideLabel">{grafico({ ...base, hideLabel: true, legenda: false })}</Opcao>
      <Opcao nome="hideIndicator">{grafico({ ...base, hideIndicator: true, legenda: false })}</Opcao>
    </Opcoes>
  ),
}
