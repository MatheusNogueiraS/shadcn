import type { Meta, StoryObj } from "@storybook/react-vite"
import { MinusIcon, PlusIcon } from "lucide-react"
import { useState } from "react"
import { useArgs } from "storybook/preview-api"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { pagina, vitrine } from "../componentes/Opcoes"

const direcoes = ["down", "up", "left", "right"] as const
type Direcao = (typeof direcoes)[number]

type Controles = { aberto: boolean; swipeDirection: Direcao; alca: boolean; modal: boolean; titulo: string; descricao: boolean; rodape: boolean }

// O exemplo do shadcn: uma meta diária que sobe e desce de 10 em 10.
function MetaDiaria() {
  const [meta, setMeta] = useState(350)
  return (
    <div className="flex items-center justify-center gap-(--gap-lg) p-(--padding-2xl)">
      <Button variant="outline" size="icon" aria-label="Diminuir" onClick={() => setMeta((m) => Math.max(200, m - 10))}><MinusIcon /></Button>
      <div className="text-center"><div className="text-display-md">{meta}</div><div className="text-body-xs text-muted">calorias por dia</div></div>
      <Button variant="outline" size="icon" aria-label="Aumentar" onClick={() => setMeta((m) => Math.min(400, m + 10))}><PlusIcon /></Button>
    </div>
  )
}

const conteudo = ({ titulo, descricao, rodape }: Pick<Controles, "titulo" | "descricao" | "rodape">) => (
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>{titulo}</DrawerTitle>
      {descricao && <DrawerDescription>Defina sua meta de atividade diária.</DrawerDescription>}
    </DrawerHeader>
    <MetaDiaria />
    {rodape && <DrawerFooter><Button>Salvar</Button><DrawerClose render={<Button variant="outline" />}>Cancelar</DrawerClose></DrawerFooter>}
  </DrawerContent>
)

const base = { swipeDirection: "down" as Direcao, alca: true, modal: true, titulo: "Meta do dia", descricao: true, rodape: true }
const aberto = ({ swipeDirection, alca, modal, ...resto }: Omit<Controles, "aberto">, extra?: { snapPoints?: (number | string)[] }) => (
  <Drawer defaultOpen swipeDirection={swipeDirection === "down" ? undefined : swipeDirection} showSwipeHandle={alca || undefined} modal={modal ? undefined : false} {...extra}>
    <DrawerTrigger render={<Button variant="outline" />}>Abrir</DrawerTrigger>
    {conteudo(resto)}
  </Drawer>
)

const meta = {
  title: "Em construção/Drawer",
  // Abrir e fechar na amostra atualiza o controle Open.
  render: function Amostra({ aberto: open, swipeDirection, alca, modal, ...resto }) {
    const [, atualizar] = useArgs<Controles>()
    return (
      <Drawer open={open} onOpenChange={(o) => atualizar({ aberto: o })} swipeDirection={swipeDirection === "down" ? undefined : swipeDirection} showSwipeHandle={alca || undefined} modal={modal ? undefined : false}>
        <DrawerTrigger render={<Button variant="outline" />}>Meta do dia</DrawerTrigger>
        {conteudo(resto)}
      </Drawer>
    )
  },
  parameters: pagina("Gaveta que sobe de uma borda e fecha arrastando, pensada para o celular. Parece o Sheet, mas responde ao gesto de arrastar e pode parar em alturas intermediárias. Na amostra, o botão ou o controle **Open** abre a gaveta por cima desta página; as opções embaixo rodam cada uma no próprio quadro."),
  argTypes: {
    aberto: { name: "Open", control: "boolean", description: "No código, `open` no `Drawer` (ou `defaultOpen`).", table: { category: "Estado" } },
    swipeDirection: { name: "Swipe direction", control: "inline-radio", options: direcoes, description: "No código, `swipeDirection`: para onde se arrasta para fechar. A gaveta sai da borda do lado oposto: `down` sai de baixo.", table: { category: "Aparência" } },
    alca: { name: "Alça", control: "boolean", description: "`showSwipeHandle`: o traço que mostra que a gaveta se arrasta.", table: { category: "Conteúdo" } },
    modal: { name: "Modal", control: "boolean", description: "`modal`. Com `false`, a página atrás não escurece e continua usável.", table: { category: "Comportamento" } },
    titulo: { name: "Título", control: "text", description: "`DrawerTitle`. Na gaveta de baixo ou de cima, centralizado.", table: { category: "Conteúdo" } },
    descricao: { name: "Descrição", control: "boolean", description: "`DrawerDescription`.", table: { category: "Conteúdo" } },
    rodape: { name: "Rodapé", control: "boolean", description: "`DrawerFooter`, colado embaixo, com os botões empilhados.", table: { category: "Conteúdo" } },
  },
  args: { aberto: false, ...base },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

const porDirecao = (swipeDirection: Direcao, descricao: string, altura: number): Story => ({
  name: `Swipe direction · ${swipeDirection}`,
  parameters: vitrine(descricao, altura),
  render: () => aberto({ ...base, swipeDirection }),
})

export const Baixo = porDirecao("down", "O exemplo do shadcn com a meta diária, um quadro por direção. Sem a propriedade, a gaveta sai de baixo.", 440)
export const Cima = porDirecao("up", "", 440)
export const Esquerda = porDirecao("left", "", 440)
export const Direita = porDirecao("right", "", 440)

export const SemAlca: Story = {
  name: "Sem alça",
  parameters: vitrine("Sem `showSwipeHandle`, a gaveta continua arrastável, mas sem o traço.", 440),
  render: () => aberto({ ...base, alca: false }),
}

export const NaoModal: Story = {
  name: "Modal · false",
  parameters: vitrine("`modal={false}`: sem o fundo escuro, e a página atrás continua usável.", 440),
  render: () => aberto({ ...base, modal: false }),
}

export const PontosDeParada: Story = {
  name: "Snap points",
  parameters: vitrine("`snapPoints`: alturas em que a gaveta para ao ser arrastada, como 40% da tela e a tela toda. O fundo fica meio transparente até a gaveta abrir por inteiro.", 480),
  render: () => aberto(base, { snapPoints: [0.4, 1] }),
}
