import type { Meta, StoryObj } from "@storybook/react-vite"

import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { Opcao, Opcoes, pagina, vitrine } from "./Opcoes"

type Controles = { valor: number; rotulo: boolean; texto: string; porcentagem: boolean }

const meta = {
  title: "Componentes/Progress",
  render: ({ valor, rotulo, texto, porcentagem }) => (
    <Progress value={valor} aria-label={rotulo ? undefined : texto}>
      {rotulo && <ProgressLabel>{texto}</ProgressLabel>}
      {porcentagem && <ProgressValue />}
    </Progress>
  ),
  parameters: pagina("Barra que mostra quanto de uma tarefa já foi feito, como um envio de arquivo. Não tem Size: a barra tem 12 px de altura, e a largura preenche o pai."),
  argTypes: {
    valor: { name: "Value", control: { type: "range", min: 0, max: 100, step: 1 }, description: "No código, `value`, de 0 a 100.", table: { category: "Conteúdo" } },
    rotulo: { name: "Rótulo", control: "boolean", description: "`ProgressLabel`, acima da barra, à esquerda.", table: { category: "Conteúdo" } },
    texto: { name: "Texto", control: "text", description: "Texto do `ProgressLabel`. Sem o rótulo, vira o `aria-label` da barra.", table: { category: "Conteúdo" } },
    porcentagem: { name: "Porcentagem", control: "boolean", description: "`ProgressValue`, acima da barra, à direita. Escreve a porcentagem sozinho.", table: { category: "Conteúdo" } },
  },
  args: { valor: 60, rotulo: true, texto: "Enviando arquivo", porcentagem: true },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia) => <div className="w-72"><Historia /></div>],
}

export const Conteudo: Story = {
  name: "Conteúdo",
  parameters: vitrine("A barra sozinha, ou com o `ProgressLabel` e o `ProgressValue`, juntos ou separados."),
  render: () => (
    <Opcoes>
      <Opcao nome="Só a barra"><Progress value={60} aria-label="Envio" className="w-full" /></Opcao>
      <Opcao nome="Rótulo"><Progress value={60} className="w-full"><ProgressLabel>Enviando</ProgressLabel></Progress></Opcao>
      <Opcao nome="Porcentagem"><Progress value={60} aria-label="Envio" className="w-full"><ProgressValue /></Progress></Opcao>
      <Opcao nome="Rótulo e porcentagem"><Progress value={60} className="w-full"><ProgressLabel>Enviando</ProgressLabel><ProgressValue /></Progress></Opcao>
    </Opcoes>
  ),
}
