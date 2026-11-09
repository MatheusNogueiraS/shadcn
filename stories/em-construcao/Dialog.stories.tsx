import type { Meta, StoryObj } from "@storybook/react-vite"
import { CopyIcon } from "lucide-react"
import { useArgs } from "storybook/preview-api"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { pagina, vitrine } from "../componentes/Opcoes"

type Controles = { aberto: boolean; titulo: string; descricao: boolean; textoDescricao: string; fechar: boolean; rodape: boolean; fecharRodape: boolean }

const formulario = (
  <FieldGroup>
    <Field><FieldLabel htmlFor="dialog-nome">Nome</FieldLabel><Input id="dialog-nome" defaultValue="Ana Souza" /></Field>
    <Field><FieldLabel htmlFor="dialog-usuario">Usuário</FieldLabel><Input id="dialog-usuario" defaultValue="@anasouza" /></Field>
  </FieldGroup>
)

const meta = {
  title: "Em construção/Dialog",
  // Abrir e fechar a janela na amostra atualiza o controle Open.
  render: function Amostra({ aberto, titulo, descricao, textoDescricao, fechar, rodape, fecharRodape }) {
    const [, atualizar] = useArgs<Controles>()
    return (
      <Dialog open={aberto} onOpenChange={(open) => atualizar({ aberto: open })}>
        <DialogTrigger render={<Button variant="outline" />}>Editar perfil</DialogTrigger>
        <DialogContent showCloseButton={fechar}>
          <DialogHeader>
            <DialogTitle>{titulo}</DialogTitle>
            {descricao && <DialogDescription>{textoDescricao}</DialogDescription>}
          </DialogHeader>
          {formulario}
          {rodape && (
            <DialogFooter showCloseButton={fecharRodape}>
              <Button>Salvar</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    )
  },
  parameters: pagina("Janela que abre por cima da página e pede atenção antes de seguir, como editar um cadastro. O fundo escurece e a página atrás fica bloqueada. Não tem Type nem Size: a largura máxima é 448 px. Na amostra, o botão ou o controle **Open** abre a janela por cima desta página; as opções embaixo rodam cada uma no próprio quadro, já abertas."),
  argTypes: {
    aberto: { name: "Open", control: "boolean", description: "No código, `open` no `Dialog` (ou `defaultOpen`, quando ele mesmo guarda o estado). Fechada, sobra o gatilho.", table: { category: "Estado" } },
    titulo: { name: "Título", control: "text", description: "`DialogTitle`. É o nome que o leitor de tela anuncia.", table: { category: "Conteúdo" } },
    descricao: { name: "Descrição", control: "boolean", description: "`DialogDescription`, abaixo do título.", table: { category: "Conteúdo" } },
    textoDescricao: { name: "Texto da descrição", control: "text", if: { arg: "descricao" }, table: { category: "Conteúdo" } },
    fechar: { name: "Botão de fechar", control: "boolean", description: "`showCloseButton` no `DialogContent`: o X no canto de cima. Sem ele, a janela fecha pelo Esc, pelo clique fora ou por um botão seu.", table: { category: "Conteúdo" } },
    rodape: { name: "Rodapé", control: "boolean", description: "`DialogFooter`, com as ações. Na tela estreita, os botões empilham.", table: { category: "Conteúdo" } },
    fecharRodape: { name: "Fechar no rodapé", control: "boolean", description: "`showCloseButton` no `DialogFooter`: um botão `outline` Close antes das ações.", if: { arg: "rodape" }, table: { category: "Conteúdo" } },
  },
  args: { aberto: false, titulo: "Editar perfil", descricao: true, textoDescricao: "Mude seus dados e salve no fim.", fechar: true, rodape: true, fecharRodape: false },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const SemFechar: Story = {
  name: "Sem botão de fechar",
  parameters: vitrine("O exemplo do shadcn sem o X: `showCloseButton={false}`. A janela fecha pelo Esc ou pelo clique fora.", 300),
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="outline" />}>Abrir</DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader><DialogTitle>Sem botão de fechar</DialogTitle><DialogDescription>Aperte Esc ou clique fora para fechar.</DialogDescription></DialogHeader>
      </DialogContent>
    </Dialog>
  ),
}

export const FecharPersonalizado: Story = {
  name: "Fechar personalizado",
  parameters: vitrine("O exemplo do shadcn de compartilhar um link: o rodapé fecha a janela com um `DialogClose` em volta de um `Button`.", 340),
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="outline" />}>Compartilhar</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Compartilhar link</DialogTitle><DialogDescription>Quem tiver o link pode ver este documento.</DialogDescription></DialogHeader>
        <div className="flex gap-(--gap-sm)">
          <Input defaultValue="https://exemplo.com/doc/123" readOnly aria-label="Link" />
          <Button size="icon" variant="outline" aria-label="Copiar"><CopyIcon /></Button>
        </div>
        <DialogFooter className="sm:justify-start"><DialogClose render={<Button variant="secondary" />}>Fechar</DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

const paragrafos = Array.from({ length: 8 }, (_, i) => <p key={i}>Cláusula {i + 1}. O pagamento é feito por Pix, boleto ou cartão. O recibo chega por e-mail e fica salvo na sua conta.</p>)

export const Rolagem: Story = {
  name: "Rolagem",
  parameters: vitrine("Os exemplos do shadcn com texto longo: o conteúdo rola por dentro, com `max-h` e `overflow-y-auto`, e o rodapé pode ficar fixo embaixo.", 460),
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="outline" />}>Termos</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Termos de uso</DialogTitle><DialogDescription>Leia antes de aceitar.</DialogDescription></DialogHeader>
        <div className="-mx-(--padding-3xl) flex max-h-48 flex-col gap-(--gap-lg) overflow-y-auto px-(--padding-3xl)">{paragrafos}</div>
        <DialogFooter showCloseButton><Button>Aceitar</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
