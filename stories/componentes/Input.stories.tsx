import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs } from "storybook/preview-api"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Opcao, Opcoes, Simula, estadoDe, pagina, vitrine, type Interacao } from "./Opcoes"

const campos = ["text", "file"] as const
const interacoes: Interacao[] = ["Default", "Focus"]

type Controles = { campo: (typeof campos)[number]; placeholder: string; valor: string; estado: Interacao; disabled: boolean; invalido: boolean }

const meta = {
  title: "Componentes/Input",
  // O que se digita na amostra atualiza o controle Valor, e o controle atualiza a amostra.
  render: function Amostra({ campo, placeholder, valor, disabled, invalido }) {
    const [, atualizar] = useArgs<Controles>()
    // O navegador não deixa o código escolher um arquivo, então o file fica sem `value`.
    const arquivo = campo === "file"
    return (
      <Input
        key={campo}
        type={arquivo ? campo : undefined}
        placeholder={arquivo ? undefined : placeholder}
        value={arquivo ? undefined : valor}
        onChange={arquivo ? undefined : (e) => atualizar({ valor: e.target.value })}
        disabled={disabled || undefined}
        aria-invalid={invalido || undefined}
        aria-label="Nome"
      />
    )
  },
  parameters: pagina("Campo de uma linha para digitar texto. Não tem Size: a altura é sempre 36 px, e a largura preenche o pai."),
  argTypes: {
    campo: { name: "Tipo de campo", control: "inline-radio", options: campos, description: "No código, `type`. Só o `file` muda a aparência: ganha o botão de escolher arquivo.", table: { category: "Conteúdo" } },
    placeholder: { name: "Placeholder", control: "text", description: "Texto de exemplo, em cor apagada, enquanto o campo está vazio.", if: { arg: "campo", eq: "text" }, table: { category: "Conteúdo" } },
    valor: { name: "Valor", control: "text", description: "No código, `value` (ou `defaultValue`, quando o próprio Input guarda o valor).", if: { arg: "campo", eq: "text" }, table: { category: "Conteúdo" } },
    estado: { name: "State", control: "inline-radio", options: interacoes, description: "Simulado. O Input não tem hover no código.", table: { category: "Estado" } },
    disabled: { name: "Disabled", control: "boolean", description: "`disabled`: impede a digitação e esmaece.", table: { category: "Estado" } },
    invalido: { name: "Invalid", control: "boolean", description: "`aria-invalid`: borda de erro.", table: { category: "Estado" } },
  },
  args: { campo: "text", placeholder: "Seu nome", valor: "", estado: "Default", disabled: false, invalido: false },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia, { args }) => <div className="w-64"><Simula estado={estadoDe(args)}><Historia /></Simula></div>],
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Focus simulado. Empty mostra o placeholder; Filled, o valor digitado."),
  render: () => (
    <Opcoes>
      <Opcao nome="Empty"><Input placeholder="Seu nome" aria-label="Nome" /></Opcao>
      <Opcao nome="Filled"><Input defaultValue="Ana Souza" aria-label="Nome" /></Opcao>
      <Opcao nome="Focus"><Simula estado="Focus"><Input placeholder="Seu nome" aria-label="Nome" /></Simula></Opcao>
      <Opcao nome="Disabled"><Input placeholder="Seu nome" disabled aria-label="Nome" /></Opcao>
      <Opcao nome="Invalid"><Input defaultValue="Ana" aria-invalid aria-label="Nome" /></Opcao>
    </Opcoes>
  ),
}

export const Campos: Story = {
  name: "Tipo de campo",
  parameters: vitrine("No código, `type`. Os outros tipos (email, password, number…) têm a aparência do `text`."),
  render: () => <Opcoes>{campos.map((c) => <Opcao key={c} nome={c}><Input type={c} placeholder={c === "text" ? "Seu nome" : undefined} aria-label="Campo" /></Opcao>)}</Opcoes>,
}

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("Os exemplos do shadcn com outros componentes: o `Field` dá o nome e a descrição, e o `ButtonGroup` cola o botão no campo."),
  render: () => (
    <Opcoes>
      <Opcao nome="Com Field"><Field><FieldLabel htmlFor="input-nome">Nome</FieldLabel><Input id="input-nome" placeholder="Seu nome" /><FieldDescription>Como aparece no recibo.</FieldDescription></Field></Opcao>
      <Opcao nome="Obrigatório"><Field><FieldLabel htmlFor="input-email">E-mail <span className="text-danger">*</span></FieldLabel><Input id="input-email" placeholder="voce@exemplo.com" required /></Field></Opcao>
      <Opcao nome="Com botão"><Field orientation="horizontal"><Input type="search" placeholder="Buscar" aria-label="Buscar" /><Button>Buscar</Button></Field></Opcao>
      <Opcao nome="Em ButtonGroup"><ButtonGroup><Input placeholder="Cupom" aria-label="Cupom" /><Button variant="outline">Aplicar</Button></ButtonGroup></Opcao>
    </Opcoes>
  ),
}
