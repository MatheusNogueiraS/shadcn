import type { Meta, StoryObj } from "@storybook/react-vite"
import { MoreHorizontalIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Opcao, Opcoes, Simula, pagina, vitrine, type Interacao } from "../componentes/Opcoes"

const faturas = [
  ["FAT-001", "Pago", "Pix", "R$ 250,00"],
  ["FAT-002", "Pendente", "Boleto", "R$ 150,00"],
  ["FAT-003", "Pago", "Cartão", "R$ 350,00"],
  ["FAT-004", "Atrasado", "Boleto", "R$ 450,00"],
] as const
const interacoes: Interacao[] = ["Default", "Hover"]

type Controles = { linhas: number; legenda: boolean; rodape: boolean; selecionada: boolean; estado: Interacao }

const tabela = ({ linhas, legenda, rodape, selecionada }: Omit<Controles, "estado">) => (
  <Table>
    {legenda && <TableCaption>Faturas recentes.</TableCaption>}
    <TableHeader>
      <TableRow><TableHead>Fatura</TableHead><TableHead>Status</TableHead><TableHead>Forma</TableHead><TableHead className="text-right">Valor</TableHead></TableRow>
    </TableHeader>
    <TableBody>
      {faturas.slice(0, linhas).map(([id, status, forma, valor], i) => (
        <TableRow key={id} data-state={selecionada && i === 1 ? "selected" : undefined}>
          <TableCell>{id}</TableCell><TableCell>{status}</TableCell><TableCell>{forma}</TableCell><TableCell className="text-right">{valor}</TableCell>
        </TableRow>
      ))}
    </TableBody>
    {rodape && <TableFooter><TableRow><TableCell colSpan={3}>Total</TableCell><TableCell className="text-right">R$ 1.200,00</TableCell></TableRow></TableFooter>}
  </Table>
)

const base = { linhas: 3, legenda: true, rodape: true, selecionada: false }

const meta = {
  title: "Em construção/Table",
  render: (args) => tabela(args),
  parameters: pagina("Tabela de dados em linhas e colunas. O texto é monoespaçado (`text-mono-sm`), para os números alinharem; os títulos e o rodapé vão em negrito. A largura preenche o pai e, se faltar espaço, a tabela rola para o lado."),
  argTypes: {
    linhas: { name: "Linhas", control: { type: "range", min: 1, max: 4, step: 1 }, table: { category: "Conteúdo" } },
    legenda: { name: "Legenda", control: "boolean", description: "`TableCaption`, embaixo da tabela.", table: { category: "Conteúdo" } },
    rodape: { name: "Rodapé", control: "boolean", description: "`TableFooter`, com fundo `muted` e negrito, para totais.", table: { category: "Conteúdo" } },
    selecionada: { name: "Selected", control: "boolean", description: "`data-state=\"selected\"` na segunda linha: fundo `muted`. É o que a linha recebe quando a caixa de seleção dela é marcada.", table: { category: "Estado" } },
    estado: { name: "State", control: "inline-radio", options: interacoes, description: "Simulado, na primeira linha: o hover dá um fundo `muted/50`.", table: { category: "Estado" } },
  },
  args: { ...base, estado: "Default" },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia, { args }) => <div className="w-md"><Simula estado={args.estado} so="tbody [data-slot=table-row]"><Historia /></Simula></div>],
}

const linha = (props: { selecionada?: boolean; expandida?: boolean }) => (
  <Table>
    <TableBody>
      <TableRow data-state={props.selecionada ? "selected" : undefined}>
        <TableCell>FAT-001</TableCell><TableCell>R$ 250,00</TableCell>
        <TableCell className="text-right"><Button variant="ghost" size="icon-xs" aria-label="Ações" aria-expanded={props.expandida || undefined}><MoreHorizontalIcon /></Button></TableCell>
      </TableRow>
    </TableBody>
  </Table>
)

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Hover simulado. Selected vem de `data-state=\"selected\"`; Expanded, de um botão com `aria-expanded` na linha, como o de um menu de ações aberto."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="Default">{linha({})}</Opcao>
      <Opcao nome="Hover"><Simula estado="Hover" so="[data-slot=table-row]">{linha({})}</Simula></Opcao>
      <Opcao nome="Selected">{linha({ selecionada: true })}</Opcao>
      <Opcao nome="Expanded">{linha({ expandida: true })}</Opcao>
    </Opcoes>
  ),
}

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("O exemplo do shadcn com Badge no status e um botão de ações no fim da linha. A tabela com caixas de seleção está na página do Checkbox."),
  render: () => (
    <div className="w-lg">
      <Table>
        <TableHeader><TableRow><TableHead>Fatura</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Valor</TableHead><TableHead><span className="sr-only">Ações</span></TableHead></TableRow></TableHeader>
        <TableBody>
          {faturas.map(([id, status, , valor]) => (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell><Badge variant={status === "Atrasado" ? "destructive" : "outline"}>{status}</Badge></TableCell>
              <TableCell className="text-right">{valor}</TableCell>
              <TableCell className="text-right"><Button variant="ghost" size="icon-xs" aria-label={`Ações da ${id}`}><MoreHorizontalIcon /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
}
