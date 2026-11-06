import type { CSSProperties, ReactNode } from "react"

import opacidades from "../../tokens/foundations/opacity.json"
import { Tabela } from "./amostras-medidas"

// Lê o código dos componentes: as tabelas acompanham sozinhas o que entra e sai do projeto.
const fontes = import.meta.glob("../../src/components/ui/*.tsx", { query: "?raw", import: "default", eager: true }) as Record<string, string>

const ARB = String.raw`\[[^\]\s"'\x60]+\]`
const PALETA = "black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose"

const colchetes = (c: string) => c.slice(c.indexOf("[") + 1, c.lastIndexOf("]")).replaceAll("_", " ")

const quadro = (estilo: CSSProperties) => <div className="size-8 rounded-sm bg-surface" style={estilo} />

type Familia = { padrao: string; ignora?: (c: string) => boolean; valor: (c: string) => string; amostra: (c: string) => ReactNode; ordem?: (c: string) => number }

const opacidade = (c: string) => Number(c.match(/(?:\/|opacity-)(\d+(?:\.\d+)?)$/)?.[1])
const naEscala = new Set(Object.keys(opacidades.opacity).map((k) => k.replace("-", ".")))

const familias = {
  opacidade: {
    padrao: String.raw`(?:bg|text|border|ring|fill|stroke|outline|divide|decoration|placeholder|caret|accent)-[a-z0-9-]+\/\d+(?:\.\d+)?|opacity-\d+(?:\.\d+)?`,
    ignora: (c) => [0, 100].includes(opacidade(c)),
    valor: (c) => `${opacidade(c)}%${naEscala.has(String(opacidade(c))) ? ` · opacity-${opacidade(c)}` : ""}`,
    amostra: (c) => quadro({ background: "var(--bg-brand)", opacity: opacidade(c) / 100 }),
    ordem: opacidade,
  },
  cor: {
    padrao: `(?:bg|text|border|ring|fill|stroke|outline)-(?:${PALETA})(?:-\\d+)?(?:/\\d+)?`,
    valor: (c) => c.split("-").slice(1).join("-"),
    amostra: (c) => quadro({ background: `color-mix(in oklab, var(--color-${c.split("-").slice(1).join("-").split("/")[0]}) ${opacidade(c) || 100}%, transparent)` }),
  },
  sombra: {
    // shadow-sm a shadow-xl são tokens: aqui entram só as sombras escritas entre colchetes.
    padrao: String.raw`shadow-${ARB}|\[--[a-z-]*shadow[a-z-]*:[^\]\s"'\x60]+\]`,
    valor: (c) => colchetes(c).replace(/^--[a-z-]+:/, ""),
    amostra: (c) => quadro({ boxShadow: colchetes(c).replace(/^--[a-z-]+:/, "") }),
  },
} satisfies Record<string, Familia>

function coletar({ padrao, ignora }: Familia) {
  // A classe vem depois de espaço, aspas ou de uma variante (hover:, data-[x]:) e termina em espaço ou aspas.
  const busca = new RegExp(String.raw`(?<=[\s"'\x60:])(${padrao})(?=[\s"'\x60])`, "g")
  const achados = new Map<string, { usos: number; componentes: Set<string> }>()
  for (const [arquivo, codigo] of Object.entries(fontes)) {
    const componente = arquivo.split("/").pop()!.replace(".tsx", "")
    for (const [classe] of codigo.matchAll(busca)) {
      if (ignora?.(classe)) continue
      const achado = achados.get(classe) ?? { usos: 0, componentes: new Set<string>() }
      achado.usos++
      achado.componentes.add(componente)
      achados.set(classe, achado)
    }
  }
  return [...achados]
}

// Textos curtos não quebram; os longos, como sombras e calc(), quebram onde precisar.
const quebra = (texto: string) => (texto.length > 18 ? "break-all" : "whitespace-nowrap")

export function Tailwind({ familia }: { familia: keyof typeof familias }) {
  const f: Familia = familias[familia]
  const linhas = coletar(f).sort(([a], [b]) => (f.ordem ? f.ordem(a) - f.ordem(b) : 0) || a.localeCompare(b))
  if (!linhas.length) return <p className="text-body-sm text-muted">Nenhum componente usa hoje.</p>
  return (
    <Tabela
      densa
      colunas={["Classe", "Valor", "Usos", "Componentes", "Amostra"]}
      linhas={linhas.map(([classe, { usos, componentes }]) => [
        <code className={quebra(classe)}>{classe}</code>,
        <span className={quebra(f.valor(classe))}>{f.valor(classe)}</span>,
        usos,
        <span className="text-body-xs text-muted">{[...componentes].sort().join(", ")}</span>,
        f.amostra(classe),
      ])}
    />
  )
}
