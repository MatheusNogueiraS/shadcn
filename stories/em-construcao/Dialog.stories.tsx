import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs } from "storybook/preview-api"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { pagina, Slot, vitrine } from "../componentes/Opcoes"

type Controles = { aberto: boolean; titulo: string; descricao: boolean; textoDescricao: string; formulario: boolean; slot: boolean; fechar: boolean; rodape: boolean; fecharRodape: boolean }

const campos = (
  <FieldGroup>
    <Field><FieldLabel htmlFor="dialog-nome">Nome</FieldLabel><Input id="dialog-nome" defaultValue="Ana Souza" /></Field>
    <Field><FieldLabel htmlFor="dialog-usuario">Usuário</FieldLabel><Input id="dialog-usuario" defaultValue="@anasouza" /></Field>
  </FieldGroup>
)

const meta = {
  title: "Em construção/Dialog",
  // Abrir e fechar a janela na amostra atualiza o controle Open.
  render: function Amostra({ aberto, titulo, descricao, textoDescricao, formulario, slot, fechar, rodape, fecharRodape }) {
    const [, atualizar] = useArgs<Controles>()
    return (
      <Dialog open={aberto} onOpenChange={(open) => atualizar({ aberto: open })}>
        <DialogTrigger render={<Button variant="outline" />}>Editar perfil</DialogTrigger>
        <DialogContent showCloseButton={fechar}>
          <DialogHeader>
            <DialogTitle>{titulo}</DialogTitle>
            {descricao && <DialogDescription>{textoDescricao}</DialogDescription>}
          </DialogHeader>
          {formulario && campos}
          {slot && <Slot />}
          {rodape && (
            <DialogFooter showCloseButton={fecharRodape}>
              <Button>Salvar</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    )
  },
  parameters: pagina("Janela que abre por cima da página e pede atenção antes de seguir, como editar um cadastro. O fundo escurece e a página atrás fica bloqueada. Serve a mais de um propósito: preencher um formulário (a amostra), compartilhar um link, ler um texto longo. Para confirmar uma ação destrutiva, use o AlertDialog. Não tem Type nem Size: a largura máxima é 448 px. Na amostra, o botão ou o controle **Open** abre a janela por cima desta página; as opções embaixo rodam cada uma no próprio quadro, já abertas."),
  argTypes: {
    aberto: { name: "Open", control: "boolean", description: "No código, `open` no `Dialog` (ou `defaultOpen`, quando ele mesmo guarda o estado). Fechada, sobra o gatilho.", table: { category: "Estado" } },
    titulo: { name: "Título", control: "text", description: "`DialogTitle`. É o nome que o leitor de tela anuncia.", table: { category: "Conteúdo" } },
    descricao: { name: "Descrição", control: "boolean", description: "`DialogDescription`, abaixo do título.", table: { category: "Conteúdo" } },
    textoDescricao: { name: "Texto da descrição", control: "text", if: { arg: "descricao" }, table: { category: "Conteúdo" } },
    formulario: { name: "Formulário", control: "boolean", description: "O conteúdo do exemplo: um `FieldGroup` com dois campos.", table: { category: "Conteúdo" } },
    slot: { name: "Slot", control: "boolean", description: "Componentes deste tipo aceitam outros componentes dentro, entre o cabeçalho e o rodapé. Ligue para ver a região onde eles entram, no fim do conteúdo; no Figma, é o slot.", table: { category: "Conteúdo" } },
    fechar: { name: "Botão de fechar", control: "boolean", description: "`showCloseButton` no `DialogContent`: o X no canto de cima. Sem ele, a janela fecha pelo Esc, pelo clique fora ou por um botão seu.", table: { category: "Conteúdo" } },
    rodape: { name: "Rodapé", control: "boolean", description: "`DialogFooter`, com as ações. Na tela estreita, os botões empilham.", table: { category: "Conteúdo" } },
    fecharRodape: { name: "Fechar no rodapé", control: "boolean", description: "`showCloseButton` no `DialogFooter`: um botão `outline` Close antes das ações.", if: { arg: "rodape" }, table: { category: "Conteúdo" } },
  },
  args: { aberto: false, titulo: "Editar perfil", descricao: true, textoDescricao: "Mude seus dados e salve no fim.", formulario: true, slot: false, fechar: true, rodape: true, fecharRodape: false },
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = { name: "Padrão" }

export const SemFechar: Story = {
  name: "Sem botão de fechar",
  parameters: vitrine("O exemplo No close button do shadcn: `showCloseButton={false}` no `DialogContent` tira o X. A janela fecha pelo Esc ou pelo clique fora.", 300),
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
  parameters: vitrine("O exemplo Custom close button do shadcn: qualquer botão fecha a janela quando vai dentro de um `DialogClose`, com `render={<Button />}`. Aqui ele fica à esquerda do rodapé, com `sm:justify-start`.", 320),
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="outline" />}>Compartilhar</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Compartilhar link</DialogTitle><DialogDescription>Quem tiver o link pode ver este documento.</DialogDescription></DialogHeader>
        <Input defaultValue="https://exemplo.com/doc/123" readOnly aria-label="Link" />
        <DialogFooter className="sm:justify-start"><DialogClose render={<Button />}>Fechar</DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

const textoLongo = (
  <div tabIndex={0} className="no-scrollbar -mx-(--padding-3xl) flex max-h-[50vh] flex-col gap-(--gap-2xl) overflow-y-auto px-(--padding-3xl)">
    {Array.from({ length: 10 }, (_, i) => <p key={i}>Cláusula {i + 1}. O pagamento é feito por Pix, boleto ou cartão. O recibo chega por e-mail e fica salvo na sua conta. Dá para cancelar a qualquer momento, sem multa.</p>)}
  </div>
)

export const RodapeFixo: Story = {
  name: "Rodapé fixo",
  parameters: vitrine("O exemplo Sticky footer do shadcn: só o texto rola, com `max-h-[50vh]` e `overflow-y-auto`, e o rodapé fica sempre à vista. O Close é o `showCloseButton` do `DialogFooter`: o mesmo `DialogClose` em `outline` que o shadcn escreve à mão.", 460),
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="outline" />}>Termos</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Termos de uso</DialogTitle><DialogDescription>O texto rola e o rodapé fica fixo embaixo.</DialogDescription></DialogHeader>
        {textoLongo}
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
}

export const Rolagem: Story = {
  name: "Conteúdo com rolagem",
  parameters: vitrine("O exemplo Scrollable content do shadcn: o mesmo texto longo, sem rodapé. A janela fecha pelo X, pelo Esc ou pelo clique fora.", 420),
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="outline" />}>Termos</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Termos de uso</DialogTitle><DialogDescription>Role para ler todas as cláusulas.</DialogDescription></DialogHeader>
        {textoLongo}
      </DialogContent>
    </Dialog>
  ),
}
