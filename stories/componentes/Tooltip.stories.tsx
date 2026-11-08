import type { Meta, StoryObj } from "@storybook/react-vite"
import { SaveIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Opcao, Opcoes, pagina, vitrine } from "./Opcoes"

const lados = ["top", "right", "bottom", "left"] as const
type Lado = (typeof lados)[number]

type Controles = { side: Lado; texto: string; atalho: boolean }

// Nas páginas, o Tooltip fica sempre aberto (`open`); no uso, ele abre ao passar o mouse ou focar o gatilho.
const dica = (side: Lado, texto: string, atalho = false) => (
  <Tooltip open>
    <TooltipTrigger render={<Button variant="outline" />}>Salvar</TooltipTrigger>
    <TooltipContent side={side === "top" ? undefined : side}>{texto}{atalho && <Kbd>Ctrl S</Kbd>}</TooltipContent>
  </Tooltip>
)

const meta = {
  title: "Componentes/Tooltip",
  render: ({ side, texto, atalho }) => dica(side, texto, atalho),
  parameters: pagina("Dica curta que aparece ao passar o mouse ou focar um elemento, como um botão só com ícone. Não tem Type nem Size. Na amostra, ele fica sempre aberto."),
  argTypes: {
    side: { name: "Side", control: "inline-radio", options: lados, description: "No código, `side` do `TooltipContent`. `inline-start` e `inline-end` seguem a direção do texto: em português, são `left` e `right`.", table: { category: "Aparência" } },
    texto: { name: "Texto", control: "text", table: { category: "Conteúdo" } },
    atalho: { name: "Atalho", control: "boolean", description: "Um `Kbd` dentro do Tooltip: ele ganha fundo translúcido, e o Tooltip encolhe o padding da direita.", table: { category: "Conteúdo" } },
  },
  args: { side: "top", texto: "Salvar alterações", atalho: false },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia) => <div className="p-(--padding-2xl)"><Historia /></div>],
}

export const Lados: Story = {
  name: "Side",
  parameters: vitrine("No código, `side`. Sem a propriedade, o Tooltip fica em cima (`top`)."),
  render: () => <Opcoes>{lados.map((l) => <Opcao key={l} nome={l}>{dica(l, "Dica")}</Opcao>)}</Opcoes>,
}

export const Conteudo: Story = {
  name: "Conteúdo",
  parameters: vitrine("Só texto, ou texto com um `Kbd` de atalho."),
  render: () => (
    <Opcoes>
      <Opcao nome="Só texto">{dica("top", "Salvar")}</Opcao>
      <Opcao nome="Com Kbd">{dica("top", "Salvar", true)}</Opcao>
    </Opcoes>
  ),
}

export const Gatilhos: Story = {
  name: "Gatilho",
  parameters: vitrine("Os exemplos do shadcn: o gatilho pode ser um botão só com ícone. Um botão desabilitado não recebe o mouse, então o `TooltipTrigger` vira um `span` em volta dele."),
  render: () => (
    <Opcoes>
      <Opcao nome="Só ícone">
        <Tooltip open>
          <TooltipTrigger render={<Button variant="outline" size="icon-sm" aria-label="Salvar" />}><SaveIcon /></TooltipTrigger>
          <TooltipContent>Salvar <Kbd>S</Kbd></TooltipContent>
        </Tooltip>
      </Opcao>
      <Opcao nome="Botão desabilitado">
        <Tooltip open>
          <TooltipTrigger render={<span className="inline-block w-fit" />}><Button variant="outline" disabled>Exportar</Button></TooltipTrigger>
          <TooltipContent>Indisponível no plano grátis</TooltipContent>
        </Tooltip>
      </Opcao>
    </Opcoes>
  ),
}
