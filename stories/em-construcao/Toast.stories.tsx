import type { Meta, StoryObj } from "@storybook/react-vite"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Toaster, toast } from "@/components/ui/toast"
import { pagina, vitrine } from "../componentes/Opcoes"

const tipos = ["default", "success", "info", "warning", "error", "loading"] as const
type Tipo = (typeof tipos)[number]
const textos: Record<Tipo, [string, string]> = {
  default: ["Evento criado", "Sexta, 10 de janeiro, às 9h."],
  success: ["Pix enviado", "R$ 250,00 para Ana Souza."],
  info: ["Nova versão", "Atualize para ver as novidades."],
  warning: ["Saldo baixo", "Restam R$ 12,00 na conta."],
  error: ["Pagamento recusado", "O cartão não tem limite."],
  loading: ["Enviando...", "Isso leva alguns segundos."],
}

type Controles = { tipo: Tipo; titulo: string; descricao: boolean; acao: boolean; duracao: number }

const disparar = ({ tipo, titulo, descricao, acao, duracao }: Controles) =>
  toast.add({
    type: tipo === "default" ? undefined : tipo,
    title: titulo,
    description: descricao ? textos[tipo][1] : undefined,
    actionProps: acao ? { children: "Desfazer" } : undefined,
    timeout: duracao * 1000,
  })

// Nas vitrines, os toasts aparecem sozinhos e não somem (`timeout: 0`).
function Mostra({ lista }: { lista: Controles[] }) {
  useEffect(() => {
    // O Toaster começa a ouvir no efeito dele, que roda depois deste: o disparo espera um instante.
    let ids: string[] = []
    const t = setTimeout(() => { ids = lista.map((item) => disparar({ ...item, duracao: 0 })) }, 100)
    return () => { clearTimeout(t); ids.forEach((id) => toast.close(id)) }
  }, [lista])
  return null
}

const base: Controles = { tipo: "default", titulo: textos.default[0], descricao: true, acao: false, duracao: 5 }
const deTipo = (tipo: Tipo, extra: Partial<Controles> = {}): Controles => ({ ...base, tipo, titulo: textos[tipo][0], ...extra })

const meta = {
  title: "Em construção/Toast",
  render: (args) => <Button variant="outline" onClick={() => disparar(args)}>Mostrar toast</Button>,
  // O Toaster fica uma vez na raiz do app; aqui, em volta de cada história.
  decorators: [(Historia) => <Toaster><Historia /></Toaster>],
  parameters: pagina("Aviso rápido no canto de baixo da tela, que some sozinho, como a confirmação de um envio. O `Toaster` fica uma vez na raiz do app, e qualquer parte dispara um aviso com `toast.add()`. Vários se empilham; ao passar o mouse, eles se abrem em lista. Na amostra, o botão dispara um toast com o que está nos controles."),
  argTypes: {
    tipo: { name: "Type", control: "select", options: tipos, description: "No código, `type` em `toast.add()`. Cada tipo ganha um ícone à esquerda; `loading` gira, como no `toast.promise()`, que troca de tipo quando a tarefa termina.", table: { category: "Aparência" } },
    titulo: { name: "Título", control: "text", description: "`title`.", table: { category: "Conteúdo" } },
    descricao: { name: "Descrição", control: "boolean", description: "`description`, abaixo do título, em cor apagada.", table: { category: "Conteúdo" } },
    acao: { name: "Ação", control: "boolean", description: "`actionProps`: um botão `outline` pequeno antes do X.", table: { category: "Conteúdo" } },
    duracao: { name: "Duração", control: { type: "range", min: 0, max: 10, step: 1 }, description: "`timeout`, em milissegundos (aqui, em segundos). Com 0, o toast só fecha pelo X.", table: { category: "Comportamento" } },
  },
  args: base,
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

// Cada lista é criada uma vez, fora do render, para o efeito do Mostra não disparar de novo.
const porTipo = (tipo: Tipo, descricao: string): Story => {
  const lista = [deTipo(tipo)]
  return { name: `Type · ${tipo}`, parameters: vitrine(descricao, 140), render: () => <Mostra lista={lista} /> }
}

export const Default = porTipo("default", "Os tipos do exemplo do shadcn, um quadro por tipo. Sem `type`, o toast não tem ícone.")
export const Sucesso = porTipo("success", "")
export const Info = porTipo("info", "")
export const Aviso = porTipo("warning", "")
export const Erro = porTipo("error", "O `error` pinta o ícone de vermelho; os outros ícones ficam na cor do texto.")
export const Carregando = porTipo("loading", "")

const comAcao = [deTipo("success", { acao: true })]
const pilha = [deTipo("info"), deTipo("warning"), deTipo("success")]

export const ComAcao: Story = {
  name: "Com ação",
  parameters: vitrine("O exemplo do shadcn com um botão de desfazer (`actionProps`).", 140),
  render: () => <Mostra lista={comAcao} />,
}

export const Empilhados: Story = {
  name: "Empilhados",
  parameters: vitrine("Três toasts: o mais novo fica na frente, e os outros aparecem por trás, menores. Passe o mouse para abrir a pilha.", 220),
  render: () => <Mostra lista={pilha} />,
}
