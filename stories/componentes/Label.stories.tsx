import type { Meta, StoryObj } from "@storybook/react-vite"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { pagina } from "./Opcoes"

const meta = {
  title: "Componentes/Label",
  render: ({ texto }) => <Label htmlFor="label-campo">{texto}</Label>,
  parameters: pagina("Nome de um campo de formulário. O `htmlFor` recebe o `id` do campo: clicar no nome foca o campo (ou marca o Checkbox, o Switch e o Radio), e o leitor de tela lê o nome junto com ele. Na amostra, clique no nome e o cursor vai para o campo abaixo. Para texto solto, sem campo, use os estilos de tipografia, e não o Label."),
  argTypes: {
    texto: { name: "Texto", control: "text", table: { category: "Conteúdo" } },
  },
  args: { texto: "Nome" },
} satisfies Meta<{ texto: string }>

export default meta

export const Padrao: StoryObj<typeof meta> = {
  name: "Padrão",
  // O campo fica fora do Show code: a página documenta o Label, e o campo só mostra o clique funcionando.
  decorators: [(Historia) => <div className="flex w-60 flex-col gap-(--gap-sm)"><Historia /><Input id="label-campo" placeholder="Seu nome" /></div>],
}
