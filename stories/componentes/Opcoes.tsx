import * as React from "react"
import type { Decorator } from "@storybook/react-vite"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PaginaComponente } from "./PaginaComponente"

// Parâmetros de toda página de componente: amostra fixa no topo, controles na ordem escrita e as opções embaixo.
// Com `foto`, o Show code troca o endereço longo das imagens geradas (data:) por esse caminho curto.
export const pagina = (descricao: string, foto?: string) => ({
  controls: { sort: "none" as const, expanded: true },
  docs: {
    page: PaginaComponente,
    description: { component: descricao },
    ...(foto ? { source: { transform: (codigo: string) => codigo.replace(/src="data:[^"]*"/g, `src="${foto}"`) } } : {}),
  },
})

// As histórias de "Todas as opções" são vitrines fixas: quem muda é a amostra do topo.
// Janela, menu e o que mais abre por cima da página ocupariam a tela inteira: com `quadro` (altura em px),
// a vitrine roda no próprio quadro, e o que abre fica dentro dele. A amostra do topo não usa quadro,
// porque o Storybook não leva os controles até ele.
export const vitrine = (descricao?: string, quadro?: number) => ({
  layout: "padded" as const,
  controls: { disable: true },
  docs: {
    ...(descricao ? { description: { story: descricao } } : {}),
    ...(quadro ? { story: { inline: false, height: `${quadro}px` } } : {}),
  },
})

// Marca a região de conteúdo livre de um componente: ali entra qualquer componente, como no slot do Figma.
export function Slot({ className }: { className?: string }) {
  return <div className={cn("flex min-h-24 items-center justify-center rounded-2xl border-sm border-dashed border-default bg-muted/50 text-body-sm text-muted", className)}>Slot</div>
}

// Uma opção por card, com a etiqueta embaixo, como na documentação do Figma.
// `larga` dá mais espaço a cada card, para componentes que não cabem em 13rem (Card, grupos de botões, trilhas).
export function Opcoes({ larga, children }: { larga?: boolean; children: React.ReactNode }) {
  return <div className={`grid w-full gap-(--gap-lg) ${larga ? "grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]" : "grid-cols-[repeat(auto-fill,minmax(13rem,1fr))]"}`}>{children}</div>
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

// Folhas já copiadas. Quando o Vite recompila o CSS, a folha nova chega sem as cópias e é copiada de novo.
const copiadas = new WeakSet<CSSStyleSheet>()
function copiarRegras() {
  // A cópia entra logo depois da original, na mesma camada e media query, para perder e ganhar das mesmas regras.
  const visitar = (pai: CSSStyleSheet | CSSGroupingRule) => {
    for (let i = pai.cssRules.length - 1; i >= 0; i--) {
      const regra = pai.cssRules[i]
      if (regra instanceof CSSStyleRule) {
        for (const [estado, pseudo] of Object.entries(PSEUDOS)) {
          const seletor = simular(regra.selectorText, pseudo, `simula-${estado.toLowerCase()}`)
          // Uma cópia recusada (pseudo-elemento seguido de :is()) não pode impedir as outras.
          if (seletor !== regra.selectorText) try { pai.insertRule(`${seletor} { ${regra.style.cssText} }`, i + 1) } catch { /* fica sem simulação */ }
        }
      } else if (regra instanceof CSSGroupingRule) visitar(regra)
    }
  }
  for (const folha of Array.from(document.styleSheets)) {
    if (copiadas.has(folha)) continue
    copiadas.add(folha)
    try { visitar(folha) } catch { /* folha de outra origem: o navegador não deixa ler */ }
  }
}
// Recompilação com um estado já simulado na tela.
import.meta.hot?.on("vite:afterUpdate", copiarRegras)

// `so` põe o estado só no primeiro elemento que casa com o seletor, para um grupo não mostrar duas opções em foco.
export function Simula({ estado, so, children }: { estado: Interacao; so?: string; children: React.ReactNode }) {
  const caixa = React.useRef<HTMLDivElement>(null)
  const classe = `simula-${estado.toLowerCase()}`
  // Sem dependências: roda a cada troca de controle, porque a troca pode recriar o elemento (uma `key` que muda).
  React.useEffect(() => {
    if (estado === "Default") return
    copiarRegras()
    const alvo = so ? caixa.current?.querySelector(so) : null
    alvo?.classList.add(classe)
    return () => alvo?.classList.remove(classe)
  })
  if (estado === "Default") return <>{children}</>
  return <div ref={caixa} className={so ? "contents" : `contents ${classe}`}>{children}</div>
}

// Desabilitado não recebe hover, foco nem clique no navegador, então a simulação também não aplica.
export const estadoDe = (args: { estado?: Interacao; disabled?: boolean; carregando?: boolean }): Interacao =>
  args.disabled || args.carregando ? "Default" : (args.estado ?? "Default")

export const simulaEstado: Decorator = (Historia, { args }) => <Simula estado={estadoDe(args)}><Historia /></Simula>
