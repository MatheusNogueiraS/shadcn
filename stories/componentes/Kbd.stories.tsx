import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, ChevronUpIcon, CommandIcon, OptionIcon } from "lucide-react"

import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Opcao, Opcoes, pagina, vitrine } from "./Opcoes"

// As teclas mais comuns em atalhos. No código, a tecla é só o conteúdo do Kbd: qualquer texto ou ícone.
const TECLAS = {
  Ctrl: "Ctrl",
  Shift: "Shift",
  Alt: "Alt",
  Tab: "Tab",
  Esc: "Esc",
  Enter: "Enter",
  Espaço: "Espaço",
  "Command (Mac)": <CommandIcon />,
  // O Mac escreve o Control como ⌃; o lucide não tem esse ícone, e a seta para cima fina é o mais parecido.
  "Control (Mac)": <ChevronUpIcon />,
  "Option (Mac)": <OptionIcon />,
  "Seta para cima": <ArrowUpIcon />,
  "Seta para baixo": <ArrowDownIcon />,
  "Seta para a esquerda": <ArrowLeftIcon />,
  "Seta para a direita": <ArrowRightIcon />,
}

type Controles = { tecla: keyof typeof TECLAS; livre: boolean; texto: string }

const meta = {
  title: "Componentes/Kbd",
  render: ({ tecla, livre, texto }) => <Kbd>{livre ? texto : TECLAS[tecla]}</Kbd>,
  parameters: pagina("Mostra uma tecla do teclado, como num atalho. Não tem Type, Size nem State."),
  argTypes: {
    tecla: { name: "Tecla", control: "select", options: Object.keys(TECLAS), description: "No código, a tecla é o conteúdo do Kbd: qualquer texto ou ícone. A lista traz as mais comuns.", if: { arg: "livre", truthy: false }, table: { category: "Conteúdo" } },
    livre: { name: "Letra ou texto", control: "boolean", description: "Troca a lista por um campo para escrever a tecla, como uma letra.", table: { category: "Conteúdo" } },
    texto: { name: "Texto", control: "text", if: { arg: "livre" }, table: { category: "Conteúdo" } },
  },
  args: { tecla: "Ctrl", livre: false, texto: "K" },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Conteudo: Story = {
  name: "Conteúdo",
  parameters: vitrine("`KbdGroup` junta as teclas de um atalho."),
  render: () => (
    <Opcoes>
      <Opcao nome="Texto"><Kbd>K</Kbd></Opcao>
      <Opcao nome="Ícone"><Kbd><CommandIcon /></Kbd></Opcao>
      <Opcao nome="KbdGroup"><KbdGroup><Kbd>Ctrl</Kbd><Kbd>K</Kbd></KbdGroup></Opcao>
    </Opcoes>
  ),
}

