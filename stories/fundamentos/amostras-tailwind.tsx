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

// Opacidade por função, como os semânticos de cor: o estado vem da variante (hover:, disabled:, data-open:) e o resto, do token.
const FUNCOES = [
  ["disabled", "Desabilitado ou ainda indisponível"],
  ["hover", "Com o mouse em cima"],
  ["selected", "Marcado, aberto ou ativo"],
  ["focus", "Foco pelo teclado"],
  ["error", "Estado de erro"],
  ["field", "Fundo e borda de campo"],
  ["control", "Trilho e fundo de controle"],
  ["separator", "Separador e linha de grade"],
  ["area", "Fundo de uma área parada"],
  ["label", "Rótulo e texto secundário"],
  ["description", "Texto de descrição"],
  ["icon", "Ícone de apoio"],
  ["shortcut", "Fundo do atalho de teclado"],
  ["sem função", "A tabela não reconheceu: diga em amostras-tailwind.tsx para que serve"],
] as const
type Funcao = (typeof FUNCOES)[number][0]

// Sem variante, e com um token que não diz a função, quem diz é o componente.
const PELO_COMPONENTE: Record<string, Funcao> = {
  "calendar opacity-50": "disabled", // dia desabilitado
  "attachment opacity-60": "disabled", // imagem enviando
  "combobox opacity-50": "icon", // X do chip
  "command opacity-50": "icon", // lupa da busca
}

function funcaoDe(variante: string, base: string, componente: string): Funcao {
  if (/hover/.test(variante)) return "hover"
  if (/focus/.test(variante)) return "focus"
  if (/disabled/.test(variante)) return "disabled"
  // checked, mas não unchecked: o switch desligado é o trilho, não um estado marcado. O = pega data-[state=open].
  if (/(^|[-:[=])(open|active|checked|expanded|selected)/.test(variante)) return "selected"
  if (/error|invalid/.test(variante)) return "error"
  if (/kbd|tooltip-content/.test(variante)) return "shortcut"
  if (/description/.test(variante)) return "description"
  const doComponente = PELO_COMPONENTE[`${componente} ${base}`]
  if (doComponente) return doComponente
  if (base === "bg-control/90") return "control"
  if (/^(bg-control|border-field)\//.test(base)) return "field"
  if (/^(bg-divider|stroke-)/.test(base)) return "separator"
  if (/^bg-muted\//.test(base)) return "area"
  if (/^text-|^opacity-70$/.test(base)) return "label"
  return "sem função"
}

const UTILIDADE = String.raw`(?:bg|text|border|ring|fill|stroke|outline|divide|decoration|placeholder|caret|accent)-(?:[a-z0-9-]+|\(--[a-z0-9-]+\))\/\d+(?:\.\d+)?|opacity-\d+(?:\.\d+)?`
// A variante vem inteira, com colchetes que podem ter aspas dentro, como [stroke='#ccc']. A classe pode terminar em ! (importante).
const COM_VARIANTE = new RegExp(String.raw`(?<=[\s"'\x60])((?:(?:[^\s"'\x60\[]|\[[^\]]*\])*:)?)(${UTILIDADE})(?=!?[\s"'\x60])`, "g")

type Uso = { funcao: Funcao; base: string; componentes: Set<string> }

function usosPorFuncao() {
  const achados = new Map<string, Uso>()
  for (const [arquivo, codigo] of Object.entries(fontes)) {
    const componente = arquivo.split("/").pop()!.replace(".tsx", "")
    for (const [, variante, base] of codigo.matchAll(COM_VARIANTE)) {
      if ([0, 100].includes(opacidade(base))) continue
      const funcao = funcaoDe(variante, base, componente)
      const chave = `${funcao} ${base}`
      const uso = achados.get(chave) ?? { funcao, base, componentes: new Set<string>() }
      uso.componentes.add(componente)
      achados.set(chave, uso)
    }
  }
  return FUNCOES.map(([funcao, descricao]) => ({
    funcao,
    descricao,
    usos: [...achados.values()].filter((u) => u.funcao === funcao).sort((a, b) => opacidade(a.base) - opacidade(b.base) || a.base.localeCompare(b.base)),
  })).filter((g) => g.usos.length)
}

// Uma linha de título por função, como os usos (bg, text, stroke) nas tabelas de cor.
export function OpacidadePorFuncao() {
  const celula = "px-(--padding-lg) py-(--padding-2xs) align-middle"
  return (
    <div className="overflow-x-auto rounded-3xl border font-sans text-body-sm">
      <table className="w-full border-collapse font-sans">
        <thead>
          <tr className="border-b bg-muted text-left text-default">
            {["Classe", "Valor", "Componentes", "Amostra"].map((c) => <th key={c} className="p-(--padding-lg) text-label-sm">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {usosPorFuncao().flatMap(({ funcao, descricao, usos }) => [
            <tr key={funcao} className="border-b bg-subtle text-default">
              <td colSpan={4} className="px-(--padding-lg) py-(--padding-2xs)">
                <span className="text-label-sm">{funcao}</span> <span className="text-body-xs text-muted">· {descricao}</span>
              </td>
            </tr>,
            ...usos.map((u) => (
              <tr key={`${funcao} ${u.base}`} className="border-b bg-surface text-default last:border-b-0">
                <td className={celula}><code className="whitespace-nowrap">{u.base}</code></td>
                <td className={celula}>
                  <span className="whitespace-nowrap">{opacidade(u.base)}%{naEscala.has(String(opacidade(u.base))) ? ` · opacity-${opacidade(u.base)}` : ""}</span>
                </td>
                <td className={celula}><span className="text-body-xs text-muted">{[...u.componentes].sort().join(", ")}</span></td>
                <td className={celula}>{quadro({ background: "var(--bg-brand)", opacity: opacidade(u.base) / 100 })}</td>
              </tr>
            )),
          ])}
        </tbody>
      </table>
    </div>
  )
}
