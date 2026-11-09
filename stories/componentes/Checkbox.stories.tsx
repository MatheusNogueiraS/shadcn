import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { useArgs } from "storybook/preview-api"

import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Opcao, Opcoes, Simula, pagina, simulaEstado, vitrine, type Interacao } from "./Opcoes"

const interacoes: Interacao[] = ["Default", "Focus"]

type Controles = { checked: boolean; estado: Interacao; disabled: boolean; invalido: boolean }

const meta = {
  title: "Componentes/Checkbox",
  // O clique na amostra atualiza o controle Checked, e o controle atualiza a amostra.
  render: function Amostra({ checked, disabled, invalido }) {
    const [, atualizar] = useArgs<Controles>()
    return (
      <Checkbox checked={checked} onCheckedChange={(marcado) => atualizar({ checked: marcado })} disabled={disabled || undefined} aria-invalid={invalido || undefined} aria-label="Aceito os termos" />
    )
  },
  parameters: pagina("Marca ou desmarca uma opção independente das outras."),
  argTypes: {
    checked: { name: "Checked", control: "boolean", description: "No código, `checked` (ou `defaultChecked`, quando o próprio Checkbox guarda o valor).", table: { category: "Estado" } },
    estado: { name: "State", control: "inline-radio", options: interacoes, description: "Simulado. O Checkbox não tem hover no código.", table: { category: "Estado" } },
    disabled: { name: "Disabled", control: "boolean", description: "`disabled`: impede a mudança e esmaece.", table: { category: "Estado" } },
    invalido: { name: "Invalid", control: "boolean", description: "`aria-invalid`: borda de erro.", table: { category: "Estado" } },
  },
  args: { checked: true, estado: "Default", disabled: false, invalido: false },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [simulaEstado],
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Focus simulado. Não há estado \"meio marcado\" (`indeterminate`) desenhado no nosso Checkbox."),
  render: () => (
    <Opcoes>
      <Opcao nome="Unchecked"><Checkbox aria-label="Opção" /></Opcao>
      <Opcao nome="Checked"><Checkbox defaultChecked aria-label="Opção" /></Opcao>
      <Opcao nome="Focus"><Simula estado="Focus"><Checkbox aria-label="Opção" /></Simula></Opcao>
      <Opcao nome="Disabled"><Checkbox disabled aria-label="Opção" /></Opcao>
      <Opcao nome="Invalid"><Checkbox aria-invalid aria-label="Opção" /></Opcao>
    </Opcoes>
  ),
}

const opcoesInicio = [["saldo", "Saldo", true], ["extrato", "Extrato", true], ["cartoes", "Cartões", false]] as const
const pessoas = [["1", "Ana", "Admin"], ["2", "Bruno", "Editor"], ["3", "Carla", "Leitor"]] as const

// O exemplo de tabela do shadcn: a caixa do cabeçalho marca ou desmarca todas as linhas.
function TabelaComSelecao() {
  const [marcadas, setMarcadas] = useState<Set<string>>(new Set(["1"]))
  const trocar = (id: string, marcado: boolean) => setMarcadas((atual) => {
    const nova = new Set(atual)
    if (marcado) nova.add(id)
    else nova.delete(id)
    return nova
  })
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8"><Checkbox checked={marcadas.size === pessoas.length} onCheckedChange={(marcado) => setMarcadas(new Set(marcado ? pessoas.map(([id]) => id) : []))} aria-label="Selecionar todas" /></TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Perfil</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pessoas.map(([id, nome, perfil]) => (
          <TableRow key={id} data-state={marcadas.has(id) ? "selected" : undefined}>
            <TableCell><Checkbox checked={marcadas.has(id)} onCheckedChange={(marcado) => trocar(id, marcado)} aria-label={`Selecionar ${nome}`} /></TableCell>
            <TableCell>{nome}</TableCell>
            <TableCell>{perfil}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("Os exemplos do shadcn com o `Field`: nome, descrição, grupo com legenda e cartão de escolha. Com `data-disabled` ou `data-invalid` no Field, o nome acompanha o Checkbox. Na tabela, a caixa do cabeçalho marca todas as linhas."),
  render: () => (
    <Opcoes>
      <Opcao nome="Com nome"><Field orientation="horizontal" className="w-fit"><Checkbox id="cb-nome" /><FieldLabel htmlFor="cb-nome">Aceito os termos</FieldLabel></Field></Opcao>
      <Opcao nome="Com descrição">
        <Field orientation="horizontal">
          <Checkbox id="cb-descricao" defaultChecked />
          <FieldContent><FieldLabel htmlFor="cb-descricao">Aceito os termos</FieldLabel><FieldDescription>Ao marcar, você concorda com as regras de uso.</FieldDescription></FieldContent>
        </Field>
      </Opcao>
      <Opcao nome="Disabled no Field"><Field orientation="horizontal" data-disabled className="w-fit"><Checkbox id="cb-desabilitado" disabled /><FieldLabel htmlFor="cb-desabilitado">Receber avisos</FieldLabel></Field></Opcao>
      <Opcao nome="Invalid no Field"><Field orientation="horizontal" data-invalid className="w-fit"><Checkbox id="cb-invalido" aria-invalid /><FieldLabel htmlFor="cb-invalido">Aceito os termos</FieldLabel></Field></Opcao>
      <Opcao nome="Grupo">
        <FieldSet>
          <FieldLegend variant="label">Mostrar no início</FieldLegend>
          <FieldDescription>Escolha o que aparece na tela inicial.</FieldDescription>
          <FieldGroup data-slot="checkbox-group">
            {opcoesInicio.map(([valor, nome, marcado]) => (
              <Field key={valor} orientation="horizontal"><Checkbox id={`cb-${valor}`} defaultChecked={marcado} /><FieldLabel htmlFor={`cb-${valor}`} className="text-body-sm">{nome}</FieldLabel></Field>
            ))}
          </FieldGroup>
        </FieldSet>
      </Opcao>
      <Opcao nome="Cartão de escolha">
        <FieldLabel htmlFor="cb-cartao">
          <Field orientation="horizontal">
            <Checkbox id="cb-cartao" />
            <FieldContent><FieldTitle>Receber avisos</FieldTitle><FieldDescription>Dá para mudar quando quiser.</FieldDescription></FieldContent>
          </Field>
        </FieldLabel>
      </Opcao>
      <Opcao nome="Tabela"><TabelaComSelecao /></Opcao>
    </Opcoes>
  ),
}
