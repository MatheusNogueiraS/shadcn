import * as React from "react"
import type { Decorator } from "@storybook/react-vite"

import { Badge } from "@/components/ui/badge"
import { PaginaComponente } from "./PaginaComponente"

// Parâmetros de toda página de componente: amostra fixa no topo, controles na ordem escrita e as opções embaixo.
export const pagina = (descricao: string) => ({
  controls: { sort: "none" as const, expanded: true },
  docs: { page: PaginaComponente, description: { component: descricao } },
})

// As histórias de "Todas as opções" são vitrines fixas: quem muda é a amostra do topo.
export const vitrine = (descricao?: string) => ({
  layout: "padded" as const,
  controls: { disable: true },
  ...(descricao ? { docs: { description: { story: descricao } } } : {}),
})

// Uma opção por card, com a etiqueta embaixo, como na documentação do Figma.
export function Opcoes({ children }: { children: React.ReactNode }) {
  return <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-(--gap-lg)">{children}</div>
}

export function Opcao({ nome, children }: { nome: string; children: React.ReactNode }) {
  return (
    <figure className="flex flex-col gap-(--gap-lg) rounded-2xl border-sm bg-muted/50 p-(--padding-lg)">
      <div className="flex min-h-20 items-center justify-center">{children}</div>
      <figcaption><Badge variant="outline">{nome}</Badge></figcaption>
    </figure>
  )
}

// Hover, foco e clique não são propriedades: quem aplica é o navegador. Para mostrá-los parados,
// cada regra com o pseudo-estado ganha uma cópia que vale dentro de .simula-<estado>.
const PSEUDOS = { Hover: ":hover", Focus: ":focus-visible", Pressed: ":active" } as const
export type Interacao = "Default" | keyof typeof PSEUDOS
export const interacoes: Interacao[] = ["Default", "Hover", "Focus", "Pressed"]

// Ignora o pseudo escapado dentro do nome da classe, como em .hover\:bg-brand-hover:hover.
export const simular = (seletor: string, pseudo: string, classe: string) =>
  seletor.replace(new RegExp(`(?<!\\\\)${pseudo}(?![\\w-])`, "g"), `:is(.${classe}, .${classe} *)`)
console.assert(simular(".hover\\:bg-x:hover", ":hover", "s") === ".hover\\:bg-x:is(.s, .s *)", "simular trocou o pseudo errado")

// shortcut: copia as regras uma vez por página; depois de editar o CSS com o Storybook aberto, recarregue a página.
function copiarRegras() {
  if (document.head.dataset.simula) return
  document.head.dataset.simula = "copiado"
  // A cópia entra logo depois da original, na mesma camada e media query, para perder e ganhar das mesmas regras.
  const visitar = (pai: CSSStyleSheet | CSSGroupingRule) => {
    for (let i = pai.cssRules.length - 1; i >= 0; i--) {
      const regra = pai.cssRules[i]
      if (regra instanceof CSSStyleRule) {
        for (const [estado, pseudo] of Object.entries(PSEUDOS)) {
          const seletor = simular(regra.selectorText, pseudo, `simula-${estado.toLowerCase()}`)
          if (seletor !== regra.selectorText) pai.insertRule(`${seletor} { ${regra.style.cssText} }`, i + 1)
        }
      } else if (regra instanceof CSSGroupingRule) visitar(regra)
    }
  }
  for (const folha of Array.from(document.styleSheets)) {
    try { visitar(folha) } catch { /* folha de outra origem: o navegador não deixa ler */ }
  }
}

// `so` põe o estado só no primeiro elemento que casa com o seletor, para um grupo não mostrar duas opções em foco.
export function Simula({ estado, so, children }: { estado: Interacao; so?: string; children: React.ReactNode }) {
  const caixa = React.useRef<HTMLDivElement>(null)
  const classe = `simula-${estado.toLowerCase()}`
  React.useEffect(() => {
    if (estado === "Default") return
    copiarRegras()
    const alvo = so ? caixa.current?.querySelector(so) : null
    alvo?.classList.add(classe)
    return () => alvo?.classList.remove(classe)
  }, [estado, so, classe])
  if (estado === "Default") return <>{children}</>
  return <div ref={caixa} className={so ? "contents" : `contents ${classe}`}>{children}</div>
}

// Desabilitado não recebe hover, foco nem clique no navegador, então a simulação também não aplica.
export const estadoDe = (args: { estado?: Interacao; disabled?: boolean; carregando?: boolean }): Interacao =>
  args.disabled || args.carregando ? "Default" : (args.estado ?? "Default")

export const simulaEstado: Decorator = (Historia, { args }) => <Simula estado={estadoDe(args)}><Historia /></Simula>
