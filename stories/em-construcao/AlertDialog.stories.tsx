import type { Meta, StoryObj } from "@storybook/react-vite"
import { BluetoothIcon, Trash2Icon } from "lucide-react"
import { useArgs } from "storybook/preview-api"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { pagina, vitrine } from "../componentes/Opcoes"

const tamanhos = ["default", "sm"] as const
type Tamanho = (typeof tamanhos)[number]

type Controles = { aberto: boolean; size: Tamanho; midia: boolean; titulo: string; descricao: string; destrutiva: boolean }

const janela = ({ size, midia, titulo, descricao, destrutiva }: Omit<Controles, "aberto">) => (
  <AlertDialogContent size={size === "default" ? undefined : size}>
    <AlertDialogHeader>
      {midia && <AlertDialogMedia className={destrutiva ? "bg-danger-subtle text-danger" : undefined}>{destrutiva ? <Trash2Icon /> : <BluetoothIcon />}</AlertDialogMedia>}
      <AlertDialogTitle>{titulo}</AlertDialogTitle>
      <AlertDialogDescription>{descricao}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction variant={destrutiva ? "destructive" : undefined}>{destrutiva ? "Excluir" : "Continuar"}</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
)

const base = { size: "default" as Tamanho, midia: false, titulo: "Excluir a conta?", descricao: "Seus dados somem e não dá para desfazer.", destrutiva: false }
const aberta = (props: Omit<Controles, "aberto">) => <AlertDialog defaultOpen><AlertDialogTrigger render={<Button variant="outline" />}>Abrir</AlertDialogTrigger>{janela(props)}</AlertDialog>

const meta = {
  title: "Em construção/AlertDialog",
  // Abrir e fechar na amostra atualiza o controle Open.
  render: function Amostra({ aberto, ...props }) {
    const [, atualizar] = useArgs<Controles>()
    return (
      <AlertDialog open={aberto} onOpenChange={(open) => atualizar({ aberto: open })}>
        <AlertDialogTrigger render={<Button variant="outline" />}>Excluir conta</AlertDialogTrigger>
        {janela(props)}
      </AlertDialog>
    )
  },
  parameters: pagina("Janela de confirmação que interrompe a pessoa antes de uma ação importante, como excluir. Diferente do Dialog, não fecha com o clique fora: só pelos botões ou pelo Esc. Na amostra, o botão ou o controle **Open** abre a janela por cima desta página; as opções embaixo rodam cada uma no próprio quadro."),
  argTypes: {
    aberto: { name: "Open", control: "boolean", description: "No código, `open` no `AlertDialog` (ou `defaultOpen`).", table: { category: "Estado" } },
    size: { name: "Size", control: "inline-radio", options: tamanhos, description: "No código, `size` no `AlertDialogContent`. `sm` é estreito, centraliza o texto e divide o rodapé em duas colunas iguais.", table: { category: "Aparência" } },
    midia: { name: "Mídia", control: "boolean", description: "`AlertDialogMedia`: um ícone num círculo `muted`. No `default`, ele fica à esquerda do texto; no `sm`, em cima.", table: { category: "Conteúdo" } },
    titulo: { name: "Título", control: "text", description: "`AlertDialogTitle`.", table: { category: "Conteúdo" } },
    descricao: { name: "Descrição", control: "text", description: "`AlertDialogDescription`.", table: { category: "Conteúdo" } },
    destrutiva: { name: "Ação destrutiva", control: "boolean", description: "`variant=\"destructive\"` no `AlertDialogAction`, que é um `Button` e aceita os Types dele. Na mídia, as classes `bg-danger-subtle text-danger`.", table: { category: "Conteúdo" } },
  },
  args: { aberto: false, ...base },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Default: Story = {
  name: "Size · default",
  parameters: vitrine("Sem a propriedade, o AlertDialog é `default`: texto à esquerda e botões à direita.", 300),
  render: () => aberta(base),
}

export const Pequeno: Story = {
  name: "Size · sm",
  parameters: vitrine("`size=\"sm\"`: estreito, com o texto centralizado e os dois botões dividindo o rodapé.", 320),
  render: () => aberta({ ...base, size: "sm" }),
}

export const ComMidia: Story = {
  name: "Com mídia",
  parameters: vitrine("Os exemplos Media e Small with media do shadcn: no `default`, o ícone ocupa uma coluna à esquerda; no `sm`, fica em cima.", 300),
  render: () => aberta({ ...base, midia: true, titulo: "Conectar o aparelho?", descricao: "O fone vai aparecer na lista de aparelhos." }),
}

export const ComMidiaPequeno: Story = {
  name: "Com mídia · sm",
  parameters: vitrine(undefined, 380),
  render: () => aberta({ ...base, size: "sm", midia: true, titulo: "Conectar o aparelho?", descricao: "O fone vai aparecer na lista." }),
}

export const Destrutiva: Story = {
  name: "Ação destrutiva",
  parameters: vitrine("O exemplo Destructive do shadcn: o botão de confirmar em `destructive` e a mídia em vermelho.", 380),
  render: () => aberta({ ...base, size: "sm", midia: true, destrutiva: true }),
}
