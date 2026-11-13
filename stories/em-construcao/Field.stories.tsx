import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Opcao, Opcoes, pagina, vitrine } from "../componentes/Opcoes"

// Input e Textarea escolhem entre vertical e responsive; Switch e Checkbox são sempre horizontal.
const orientacoes = ["vertical", "responsive"] as const
type Orientacao = (typeof orientacoes)[number]
const controles = ["Input", "Textarea", "Switch", "Checkbox"] as const
type Controle = (typeof controles)[number]

type Controles = { orientation: Orientacao; controle: Controle; nomeVisivel: boolean; rotulo: string; descricao: boolean; invalido: boolean; disabled: boolean }

const campo = ({ orientation, controle, nomeVisivel, rotulo, descricao, invalido, disabled }: Controles, id = "field-amostra") => {
  const comum = { id, disabled: disabled || undefined, "aria-invalid": invalido || undefined }
  const entrada = {
    Input: <Input {...comum} placeholder="voce@exemplo.com" />,
    Textarea: <Textarea {...comum} placeholder="Conte mais" />,
    Switch: <Switch {...comum} />,
    Checkbox: <Checkbox {...comum} />,
  }[controle]
  const marcador = controle === "Switch" || controle === "Checkbox"
  // Os dois vão juntos no código; com o FieldError na tela, o Field esconde a descrição.
  const texto = <>{descricao && <FieldDescription>Usamos só para mandar o recibo.</FieldDescription>}{invalido && <FieldError>Confira o que foi digitado.</FieldError>}</>
  // Sem o nome visível, o FieldLabel continua para o leitor de tela, com sr-only.
  const nome = <FieldLabel htmlFor={id} className={nomeVisivel ? undefined : "sr-only"}>{rotulo}</FieldLabel>
  // Com Switch e Checkbox, o FieldContent junta o nome e a descrição ao lado do controle.
  return (
    <Field orientation={marcador ? "horizontal" : orientation === "vertical" ? undefined : orientation} data-invalid={invalido || undefined} data-disabled={disabled || undefined}>
      {marcador ? (
        <>
          {controle === "Checkbox" && entrada}
          <FieldContent>{nome}{texto}</FieldContent>
          {controle === "Switch" && entrada}
        </>
      ) : (
        <>
          {nome}
          {entrada}
          {texto}
        </>
      )}
    </Field>
  )
}

const base: Controles = { orientation: "vertical", controle: "Input", nomeVisivel: true, rotulo: "E-mail", descricao: true, invalido: false, disabled: false }

const meta = {
  title: "Em construção/Field",
  render: (args) => campo(args),
  parameters: pagina("Junta o nome, o controle, a descrição e o erro de um campo de formulário, com os espaços certos entre eles. O `FieldLabel` liga o nome ao controle pelo `htmlFor`. `FieldSet` e `FieldGroup` organizam vários campos."),
  argTypes: {
    orientation: { name: "Orientation", control: "inline-radio", options: orientacoes, description: "No código, `orientation`, para Input e Textarea. `responsive` empilha no estreito e alinha lado a lado quando o `FieldGroup` passa de 448 px. Switch e Checkbox usam sempre `horizontal`, então este controle não muda nada neles.", table: { category: "Aparência" } },
    controle: { name: "Controle", control: "inline-radio", options: controles, description: "O que vai dentro. Com Switch ou Checkbox, o Field é `horizontal`: o controle mantém o próprio tamanho, e o nome e a descrição entram num `FieldContent` ao lado.", table: { category: "Conteúdo" } },
    nomeVisivel: { name: "Nome visível", control: "boolean", description: "Desligado, o `FieldLabel` ganha `className=\"sr-only\"`: some da tela, mas o leitor de tela continua anunciando o nome do campo.", table: { category: "Conteúdo" } },
    rotulo: { name: "Nome", control: "text", description: "`FieldLabel`.", table: { category: "Conteúdo" } },
    descricao: { name: "Descrição", control: "boolean", description: "`FieldDescription`.", table: { category: "Conteúdo" } },
    invalido: { name: "Invalid", control: "boolean", description: "`data-invalid` no `Field` pinta o nome de vermelho; `aria-invalid` no controle, a borda; o `FieldError` mostra a mensagem. Com o `FieldError` na tela, o Field esconde o `FieldDescription`, e o erro ocupa o lugar dela.", table: { category: "Estado" } },
    disabled: { name: "Disabled", control: "boolean", description: "`data-disabled` no `Field` esmaece o nome; `disabled` no controle o desliga.", table: { category: "Estado" } },
  },
  args: base,
} satisfies Meta<Controles>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  name: "Padrão",
  decorators: [(Historia) => <FieldGroup className="w-80"><Historia /></FieldGroup>],
}

export const Orientacoes: Story = {
  name: "Orientation",
  parameters: vitrine("No código, `orientation`. Sem a propriedade, o Field é `vertical`. O `horizontal` é o do Switch e do Checkbox, com o nome ao lado. O `responsive` aqui fica estreito, com até 320 px, então empilha como o vertical."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="vertical"><FieldGroup className="max-w-80">{campo(base, "field-o-vertical")}</FieldGroup></Opcao>
      <Opcao nome="horizontal"><FieldGroup className="max-w-80">{campo({ ...base, controle: "Switch", rotulo: "Avisos por e-mail" }, "field-o-horizontal")}</FieldGroup></Opcao>
      <Opcao nome="responsive"><FieldGroup className="max-w-80">{campo({ ...base, orientation: "responsive" }, "field-o-responsive")}</FieldGroup></Opcao>
    </Opcoes>
  ),
}

export const TiposDeControle: Story = {
  name: "Controle",
  parameters: vitrine("Com Input e Textarea, o nome fica em cima. Com Switch e Checkbox, ele fica ao lado, num `FieldContent` com a descrição, e o controle mantém o próprio tamanho."),
  render: () => <Opcoes larga>{controles.map((c) => <Opcao key={c} nome={c}><FieldGroup>{campo({ ...base, controle: c, rotulo: c === "Switch" ? "Avisos por e-mail" : c === "Checkbox" ? "Aceito os termos" : "E-mail" }, `field-c-${c}`)}</FieldGroup></Opcao>)}</Opcoes>,
}

export const Estados: Story = {
  name: "State",
  parameters: vitrine("Invalid pinta o nome e a borda e mostra o `FieldError` no lugar da descrição; Disabled esmaece o nome e desliga o controle."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="Default"><FieldGroup>{campo(base, "field-e1")}</FieldGroup></Opcao>
      <Opcao nome="Invalid"><FieldGroup>{campo({ ...base, invalido: true }, "field-e2")}</FieldGroup></Opcao>
      <Opcao nome="Disabled"><FieldGroup>{campo({ ...base, disabled: true }, "field-e3")}</FieldGroup></Opcao>
    </Opcoes>
  ),
}

export const Conjuntos: Story = {
  name: "FieldSet e FieldSeparator",
  parameters: vitrine("`FieldSet` agrupa campos sob um `FieldLegend`: `variant=\"legend\"` (o padrão) é um título; `variant=\"label\"`, do tamanho de um nome de campo. `FieldSeparator` traça uma linha, com ou sem texto no meio."),
  render: () => (
    <Opcoes larga>
      <Opcao nome="legend">
        <FieldSet className="w-full">
          <FieldLegend>Endereço</FieldLegend>
          <FieldDescription>Para onde mandamos o cartão.</FieldDescription>
          <FieldGroup>
            <Field><FieldLabel htmlFor="fs-rua">Rua</FieldLabel><Input id="fs-rua" /></Field>
            <Field><FieldLabel htmlFor="fs-cep">CEP</FieldLabel><Input id="fs-cep" /></Field>
          </FieldGroup>
        </FieldSet>
      </Opcao>
      <Opcao nome="label">
        <FieldSet className="w-full">
          <FieldLegend variant="label">Avisos</FieldLegend>
          <FieldGroup className="gap-(--gap-md)">
            <Field orientation="horizontal"><Checkbox id="fs-email" defaultChecked /><FieldLabel htmlFor="fs-email">Por e-mail</FieldLabel></Field>
            <Field orientation="horizontal"><Checkbox id="fs-sms" /><FieldLabel htmlFor="fs-sms">Por SMS</FieldLabel></Field>
          </FieldGroup>
        </FieldSet>
      </Opcao>
      <Opcao nome="FieldSeparator">
        <FieldGroup className="w-full">
          <Button variant="outline" className="w-full">Entrar com Google</Button>
          <FieldSeparator>ou</FieldSeparator>
          <Field><FieldLabel htmlFor="fs-sep">E-mail</FieldLabel><Input id="fs-sep" /></Field>
        </FieldGroup>
      </Opcao>
    </Opcoes>
  ),
}

export const SemNomeVisivel: Story = {
  name: "Sem nome visível",
  parameters: vitrine("Formulário com o nome dentro do campo, como placeholder. O `FieldLabel` continua em cada campo com `className=\"sr-only\"`: some da tela, mas o leitor de tela anuncia o nome, que o placeholder sozinho não garante."),
  render: () => (
    <FieldGroup className="w-md">
      <Field><FieldLabel htmlFor="snv-rua" className="sr-only">Rua</FieldLabel><Input id="snv-rua" placeholder="Rua" /></Field>
      <div className="grid grid-cols-2 gap-(--gap-lg)">
        <Field><FieldLabel htmlFor="snv-numero" className="sr-only">Número</FieldLabel><Input id="snv-numero" placeholder="Número" /></Field>
        <Field><FieldLabel htmlFor="snv-complemento" className="sr-only">Complemento</FieldLabel><Input id="snv-complemento" placeholder="Complemento" /></Field>
      </div>
      <Field><FieldLabel htmlFor="snv-cep" className="sr-only">CEP</FieldLabel><Input id="snv-cep" placeholder="CEP" /><FieldDescription>Só os números.</FieldDescription></Field>
      <Field><FieldLabel htmlFor="snv-cidade" className="sr-only">Cidade</FieldLabel><Input id="snv-cidade" placeholder="Cidade" /></Field>
    </FieldGroup>
  ),
}

export const Composicoes: Story = {
  name: "Composições",
  parameters: vitrine("O exemplo do shadcn de formulário de pagamento: um `FieldSet` com título, campos lado a lado num grid, um separador, um comentário e os botões num `Field` horizontal. O `FieldLegend` é título de seção; o nome de cada campo é sempre um `FieldLabel`, do mesmo tamanho em todos. O cartão de escolha (`FieldLabel` em volta de um `Field`) está nas páginas do Checkbox, do Radio Group e do Switch."),
  render: () => (
    <form className="w-md" onSubmit={(e) => e.preventDefault()}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Pagamento</FieldLegend>
          <FieldDescription>Todas as transações são seguras.</FieldDescription>
          <FieldGroup>
            <Field><FieldLabel htmlFor="pg-nome">Nome no cartão</FieldLabel><Input id="pg-nome" placeholder="Ana Souza" /></Field>
            <Field><FieldLabel htmlFor="pg-numero">Número</FieldLabel><Input id="pg-numero" placeholder="0000 0000 0000 0000" /><FieldDescription>Os 16 números da frente.</FieldDescription></Field>
            <div className="grid grid-cols-2 gap-(--gap-lg)">
              <Field><FieldLabel htmlFor="pg-validade">Validade</FieldLabel><Input id="pg-validade" placeholder="MM/AA" /></Field>
              <Field><FieldLabel htmlFor="pg-cvv">CVV</FieldLabel><Input id="pg-cvv" placeholder="123" /></Field>
            </div>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        <Field><FieldLabel htmlFor="pg-obs">Comentário</FieldLabel><Textarea id="pg-obs" placeholder="Algo que devemos saber?" /></Field>
        <Field orientation="horizontal"><Button type="submit">Pagar</Button><Button variant="outline" type="button">Cancelar</Button></Field>
      </FieldGroup>
    </form>
  ),
}
