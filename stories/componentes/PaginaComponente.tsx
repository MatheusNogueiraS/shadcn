import { Controls, Description, Primary, Stories, Title } from "@storybook/addon-docs/blocks"

// A amostra fica fixa no topo para o resultado continuar visível enquanto se mexe nos controles abaixo.
export function PaginaComponente() {
  return (
    <>
      <Title />
      <Description />
      <div className="sticky top-0 z-10 -mx-(--padding-sm) max-h-[60vh] overflow-y-auto bg-white px-(--padding-sm) [&_.sbdocs-preview]:!mt-(--gap-sm)">
        <Primary />
      </div>
      <Controls />
      <Stories title="Todas as opções" includePrimary={false} />
    </>
  )
}
