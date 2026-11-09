import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronRightIcon, ChevronsUpDownIcon, FileIcon, FolderIcon } from "lucide-react"
import type { ReactNode } from "react"
import { useArgs } from "storybook/preview-api"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Opcao, Opcoes, pagina, vitrine } from "../componentes/Opcoes"

type Controles = { aberto: boolean; disabled: boolean }

const linha = "flex items-center justify-between rounded-2xl border-sm px-(--padding-lg) py-(--padding-sm)"

// O exemplo do shadcn: um pedido com o status sempre à vista e os itens escondidos.
const pedido = ({ aberto, disabled, aoMudar }: { aberto?: boolean; disabled?: boolean; aoMudar?: (aberto: boolean) => void }) => (
  <Collapsible open={aoMudar ? aberto : undefined} defaultOpen={aoMudar ? undefined : aberto} onOpenChange={aoMudar} disabled={disabled || undefined} className="flex w-72 flex-col gap-(--gap-sm) text-body-sm">
    <div className="flex items-center justify-between gap-(--gap-lg) px-(--padding-lg)">
      <span className="text-label-sm">Pedido #4189</span>
      <CollapsibleTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Mostrar itens" />}><ChevronsUpDownIcon /></CollapsibleTrigger>
    </div>
    <div className={linha}><span className="text-muted">Status</span><span>Enviado</span></div>
    <CollapsibleContent className="flex flex-col gap-(--gap-sm)">
      <div className={linha}><span className="text-muted">Endereço</span><span>Rua das Flores, 120</span></div>
      <div className={linha}><span className="text-muted">Itens</span><span>2 camisetas</span></div>
    </CollapsibleContent>
  </Collapsible>
)

const meta = {
  title: "Em construção/Collapsible",
  // Abrir e fechar na amostra atualiza o controle Open.
  render: function Amostra({ aberto, disabled }) {
    const [, atualizar] = useArgs<Controles>()
    return pedido({ aberto, disabled, aoMudar: (open) => atualizar({ aberto: open }) })
  },
  parameters: pagina("Mostra e esconde um trecho da página por um gatilho. Não tem aparência própria: o visual é do gatilho (aqui, um `Button`) e do conteúdo. Para várias perguntas que abrem uma por vez, use o Accordion."),
  argTypes: {
    aberto: { name: "Open", control: "boolean", description: "No código, `open` (ou `defaultOpen`, quando o próprio Collapsible guarda o estado).", table: { category: "Estado" } },
    disabled: { name: "Disabled", control: "boolean", description: "`disabled`: o gatilho deixa de abrir e fechar. O Collapsible não esmaece nada; quem esmaece é o `Button`, se receber `disabled`.", table: { category: "Estado" } },
  },
  args: { aberto: false, disabled: false },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Fechado, só o status aparece; aberto, entram o endereço e os itens."),
  render: () => (
    <Opcoes>
      <Opcao nome="Closed">{pedido({ aberto: false })}</Opcao>
      <Opcao nome="Open">{pedido({ aberto: true })}</Opcao>
    </Opcoes>
  ),
}

const pasta = (nome: string, filhos: ReactNode, aberta = false) => (
  <Collapsible defaultOpen={aberta}>
    <CollapsibleTrigger render={<Button variant="ghost" size="sm" className="w-full justify-start group" />}>
      <ChevronRightIcon data-icon="inline-start" className="transition-transform group-data-panel-open:rotate-90" /><FolderIcon />{nome}
    </CollapsibleTrigger>
    <CollapsibleContent className="ml-(--gap-xl) flex flex-col">{filhos}</CollapsibleContent>
  </Collapsible>
)
const arquivo = (nome: string) => <Button key={nome} variant="ghost" size="sm" className="w-full justify-start"><FileIcon data-icon="inline-start" />{nome}</Button>

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("O exemplo do shadcn de árvore de arquivos: um Collapsible dentro do outro, com a seta girando quando a pasta abre (`data-panel-open`)."),
  render: () => (
    <Opcoes>
      <Opcao nome="Árvore de arquivos">
        <div className="w-56">
          {pasta("src", <>{pasta("components", <>{arquivo("button.tsx")}{arquivo("card.tsx")}</>, true)}{arquivo("main.tsx")}</>, true)}
          {pasta("public", arquivo("favicon.svg"))}
        </div>
      </Opcao>
    </Opcoes>
  ),
}
