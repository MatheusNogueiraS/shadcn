import type { Meta, StoryObj } from "@storybook/react-vite"
import { CameraIcon, CheckIcon, PlusIcon, StarIcon, XIcon } from "lucide-react"

import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar"
import { portrait } from "../../sandbox/art"
import { Opcao, Opcoes, pagina, vitrine } from "./Opcoes"

const tamanhos = ["sm", "default", "lg"] as const
type Tamanho = (typeof tamanhos)[number]
// Medida de cada tamanho em avatar.tsx (--size-xl, --size-2xl e --size-4xl).
const medidas = { sm: 24, default: 32, lg: 40 } as const
const icones = { CheckIcon, PlusIcon, StarIcon, CameraIcon, XIcon }
const selos = ["Nenhum", "Ponto", ...Object.keys(icones)] as ("Nenhum" | "Ponto" | keyof typeof icones)[]
// Sem a classe, o selo é bg-brand. As outras cores trocam o fundo pelo `className`, como no exemplo do shadcn.
const cores = { brand: undefined, success: "bg-success", danger: "bg-danger" } as const
const foto = portrait("#fa6300", "AS")

type Controles = { size: Tamanho; imagem: boolean; iniciais: string; selo: (typeof selos)[number]; cor: keyof typeof cores }

const meta = {
  title: "Componentes/Avatar",
  render: ({ size, imagem, iniciais, selo, cor }) => {
    const Icone = selo === "Nenhum" || selo === "Ponto" ? null : icones[selo]
    return (
      <Avatar size={size === "default" ? undefined : size}>
        {imagem && <AvatarImage src={foto} alt="Ana Souza" />}
        <AvatarFallback>{iniciais}</AvatarFallback>
        {selo !== "Nenhum" && <AvatarBadge className={cores[cor]}>{Icone && <Icone />}</AvatarBadge>}
      </Avatar>
    )
  },
  parameters: pagina("Foto de uma pessoa, ou as iniciais dela quando não há foto."),
  argTypes: {
    size: { name: "Size", control: "inline-radio", options: tamanhos, description: "No código, a propriedade `size`.", table: { category: "Aparência" } },
    imagem: { name: "Imagem", control: "boolean", description: "`AvatarImage`. Sem ela, ou enquanto ela carrega, aparece o `AvatarFallback`.", table: { category: "Conteúdo" } },
    iniciais: { name: "Iniciais", control: "text", description: "Texto do `AvatarFallback`.", table: { category: "Conteúdo" } },
    selo: { name: "Selo", control: "select", options: selos, description: "`AvatarBadge`, no canto de baixo: um ponto ou um ícone. No `sm`, o ícone some e fica o ponto.", table: { category: "Conteúdo" } },
    cor: { name: "Cor do selo", control: "inline-radio", options: Object.keys(cores), description: "Sem classe, o selo é `brand`. As outras cores vêm do `className`, como `bg-success`.", if: { arg: "selo", neq: "Nenhum" }, table: { category: "Aparência" } },
  },
  args: { size: "default", imagem: true, iniciais: "AS", selo: "Nenhum", cor: "brand" },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  // A imagem de exemplo é um data URI enorme: no Show code, ela vira um caminho curto.
  parameters: { docs: { source: { transform: (codigo: string) => codigo.replace(/src="data:[^"]*"/, 'src="/fotos/ana.png"') } } },
}

export const Tamanhos: Story = {
  name: "Size",
  parameters: vitrine("No código, `size`. A etiqueta traz a medida."),
  render: () => <Opcoes>{tamanhos.map((s) => <Opcao key={s} nome={`${s} · ${medidas[s]} px`}><Avatar size={s}><AvatarImage src={foto} alt="Ana Souza" /><AvatarFallback>AS</AvatarFallback></Avatar></Opcao>)}</Opcoes>,
}

export const Conteudo: Story = {
  name: "Conteúdo",
  parameters: vitrine("Com a foto, ou com as iniciais do `AvatarFallback` quando não há foto."),
  render: () => (
    <Opcoes>
      <Opcao nome="Imagem"><Avatar><AvatarImage src={foto} alt="Ana Souza" /><AvatarFallback>AS</AvatarFallback></Avatar></Opcao>
      <Opcao nome="Iniciais"><Avatar><AvatarFallback>AS</AvatarFallback></Avatar></Opcao>
    </Opcoes>
  ),
}

export const Selos: Story = {
  name: "Selo",
  parameters: vitrine("`AvatarBadge` como ponto ou com ícone, em cada tamanho e cor. O selo cresce com o Avatar, e no `sm` o ícone some."),
  render: () => (
    <Opcoes>
      <Opcao nome="Ponto"><Avatar size="lg"><AvatarFallback>AS</AvatarFallback><AvatarBadge /></Avatar></Opcao>
      {tamanhos.map((s) => <Opcao key={s} nome={`Ícone · ${s}`}><Avatar size={s}><AvatarFallback>AS</AvatarFallback><AvatarBadge><PlusIcon /></AvatarBadge></Avatar></Opcao>)}
      {(["success", "danger"] as const).map((c) => <Opcao key={c} nome={`Cor · ${c}`}><Avatar size="lg"><AvatarFallback>AS</AvatarFallback><AvatarBadge className={cores[c]} /></Avatar></Opcao>)}
    </Opcoes>
  ),
}

export const Grupo: Story = {
  name: "Grupo",
  parameters: vitrine("`AvatarGroup` sobrepõe os Avatares com um anel da cor da página. O `AvatarGroupCount` conta os que ficaram de fora, com número ou ícone, e segue o tamanho deles."),
  render: () => (
    <Opcoes>
      {tamanhos.map((s) => (
        <Opcao key={s} nome={s}>
          <AvatarGroup>
            {["AS", "BR", "CM"].map((i) => <Avatar key={i} size={s}><AvatarFallback>{i}</AvatarFallback></Avatar>)}
            <AvatarGroupCount>+3</AvatarGroupCount>
          </AvatarGroup>
        </Opcao>
      ))}
      <Opcao nome="Contagem com ícone">
        <AvatarGroup>
          {["AS", "BR", "CM"].map((i) => <Avatar key={i}><AvatarFallback>{i}</AvatarFallback></Avatar>)}
          <AvatarGroupCount><PlusIcon /></AvatarGroupCount>
        </AvatarGroup>
      </Opcao>
    </Opcoes>
  ),
}
