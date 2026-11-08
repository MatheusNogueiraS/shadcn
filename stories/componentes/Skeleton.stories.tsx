import type { Meta, StoryObj } from "@storybook/react-vite"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Opcao, Opcoes, pagina, vitrine } from "./Opcoes"

const meta = {
  title: "Componentes/Skeleton",
  render: () => <Skeleton className="h-4 w-48" />,
  parameters: pagina("Ocupa o lugar de um conteúdo que ainda está carregando, dentro de qualquer componente. Não tem Type, Size nem State: a forma vem do `className`, com a altura e a largura do que ele substitui."),
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("Os exemplos do shadcn: a forma de cada Skeleton copia o conteúdo que ele substitui, como uma foto redonda, linhas de texto ou campos."),
  render: () => (
    <Opcoes>
      <Opcao nome="Avatar e texto">
        <div className="flex items-center gap-(--gap-2xl)">
          <Skeleton className="size-(--size-4xl) shrink-0 rounded-full" />
          <div className="grid gap-(--gap-sm)"><Skeleton className="h-4 w-32" /><Skeleton className="h-4 w-20" /></div>
        </div>
      </Opcao>
      <Opcao nome="Texto">
        <div className="flex w-full flex-col gap-(--gap-sm)"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></div>
      </Opcao>
      <Opcao nome="Card">
        <Card className="w-full">
          <CardHeader><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-1/2" /></CardHeader>
          <CardContent><Skeleton className="aspect-video w-full" /></CardContent>
        </Card>
      </Opcao>
      <Opcao nome="Formulário">
        <div className="flex w-full flex-col gap-(--gap-3xl)">
          <div className="flex flex-col gap-(--gap-lg)"><Skeleton className="h-4 w-20" /><Skeleton className="h-8 w-full" /></div>
          <div className="flex flex-col gap-(--gap-lg)"><Skeleton className="h-4 w-24" /><Skeleton className="h-8 w-full" /></div>
          <Skeleton className="h-8 w-24" />
        </div>
      </Opcao>
      <Opcao nome="Tabela">
        <div className="flex w-full flex-col gap-(--gap-sm)">
          {[1, 2, 3, 4, 5].map((linha) => <div key={linha} className="flex gap-(--gap-2xl)"><Skeleton className="h-4 flex-1" /><Skeleton className="h-4 w-12" /><Skeleton className="h-4 w-10" /></div>)}
        </div>
      </Opcao>
    </Opcoes>
  ),
}
