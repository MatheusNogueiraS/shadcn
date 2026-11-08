import type { Meta, StoryObj } from "@storybook/react-vite"
import { BellIcon, CircleAlertIcon, CircleCheckIcon, InfoIcon, SparklesIcon, TriangleAlertIcon } from "lucide-react"

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Opcao, Opcoes, pagina, vitrine } from "./Opcoes"

const variantes = ["default", "destructive", "warning", "success", "brand", "brand-secondary"] as const
type Variante = (typeof variantes)[number]
const icones = { InfoIcon, CircleAlertIcon, TriangleAlertIcon, CircleCheckIcon, SparklesIcon, BellIcon }
type NomeIcone = keyof typeof icones
// O ícone e o texto de cada Type na vitrine.
const exemplos: Record<Variante, [NomeIcone, string, string]> = {
  default: ["InfoIcon", "Agendado", "Sai amanhã."],
  destructive: ["CircleAlertIcon", "Recusado", "Saldo insuficiente."],
  warning: ["TriangleAlertIcon", "Vence em 3 dias", "Renove o plano."],
  success: ["CircleCheckIcon", "Pago", "Recibo enviado."],
  brand: ["SparklesIcon", "Novidade", "Pix agendado."],
  "brand-secondary": ["BellIcon", "Lembrete", "Fatura disponível."],
}

type Controles = { variant: Variante; icone: "Nenhum" | NomeIcone; titulo: string; descricao: boolean; textoDescricao: string; acao: boolean }

const meta = {
  title: "Componentes/Alert",
  render: ({ variant, icone, titulo, descricao, textoDescricao, acao }) => {
    const Icone = icone === "Nenhum" ? null : icones[icone]
    return (
      <Alert variant={variant === "default" ? undefined : variant}>
        {Icone && <Icone />}
        <AlertTitle>{titulo}</AlertTitle>
        {descricao && <AlertDescription>{textoDescricao}</AlertDescription>}
        {acao && <AlertAction><Button size="xs" variant="outline">Desfazer</Button></AlertAction>}
      </Alert>
    )
  },
  parameters: pagina("Aviso fixo na página, que chama a atenção sem interromper, como uma mudança salva ou um erro. Não tem Size: a largura preenche o pai."),
  argTypes: {
    variant: { name: "Type", control: "select", options: variantes, description: "No código, a propriedade `variant`. Cada tipo pinta o texto e o ícone com a cor do token: `text-danger`, `text-warning`, `text-success`, `text-brand` e `text-brand-secondary`.", table: { category: "Aparência" } },
    icone: { name: "Ícone", control: "select", options: ["Nenhum", ...Object.keys(icones)], description: "Qualquer ícone como primeiro filho abre uma coluna à esquerda do texto e pega a cor do Type.", table: { category: "Conteúdo" } },
    titulo: { name: "Título", control: "text", description: "`AlertTitle`.", table: { category: "Conteúdo" } },
    descricao: { name: "Descrição", control: "boolean", description: "`AlertDescription`, abaixo do título.", table: { category: "Conteúdo" } },
    textoDescricao: { name: "Texto da descrição", control: "text", if: { arg: "descricao" }, table: { category: "Conteúdo" } },
    acao: { name: "Ação", control: "boolean", description: "`AlertAction`, no canto de cima à direita. O texto abre espaço para ela.", table: { category: "Conteúdo" } },
  },
  args: { variant: "default", icone: "InfoIcon", titulo: "Pagamento agendado", descricao: true, textoDescricao: "O Pix sai amanhã às 9h.", acao: false },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia) => <div className="w-96"><Historia /></div>],
}

export const Tipos: Story = {
  name: "Type",
  parameters: vitrine("No código, `variant`. Sem a propriedade, o Alert é `default`."),
  render: () => (
    <Opcoes>
      {variantes.map((v) => {
        const [icone, titulo, descricao] = exemplos[v]
        const Icone = icones[icone]
        return <Opcao key={v} nome={v}><Alert variant={v}><Icone /><AlertTitle>{titulo}</AlertTitle><AlertDescription>{descricao}</AlertDescription></Alert></Opcao>
      })}
    </Opcoes>
  ),
}

export const Conteudo: Story = {
  name: "Conteúdo",
  parameters: vitrine("Cada parte que entra muda o desenho: a descrição abre outra linha, o ícone abre uma coluna e a ação reserva o canto direito."),
  render: () => (
    <Opcoes>
      <Opcao nome="Só título"><Alert><AlertTitle>Agendado</AlertTitle></Alert></Opcao>
      <Opcao nome="Título e descrição"><Alert><AlertTitle>Agendado</AlertTitle><AlertDescription>Sai amanhã.</AlertDescription></Alert></Opcao>
      <Opcao nome="Com ícone"><Alert><InfoIcon /><AlertTitle>Agendado</AlertTitle><AlertDescription>Sai amanhã.</AlertDescription></Alert></Opcao>
      <Opcao nome="Com ação"><Alert><AlertTitle>Agendado</AlertTitle><AlertDescription>Sai amanhã.</AlertDescription><AlertAction><Button size="xs" variant="outline">Desfazer</Button></AlertAction></Alert></Opcao>
    </Opcoes>
  ),
}
