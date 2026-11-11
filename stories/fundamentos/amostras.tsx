import foundations from "../../tokens/foundations/color.json"
import opacity from "../../tokens/foundations/opacity.json"
import dark from "../../tokens/semantic/color.dark.json"
import light from "../../tokens/semantic/color.light.json"
import sombras from "../../tokens/semantic/shadow.json"
import { Tabela } from "./amostras-medidas"

// Lê os JSON em vez de repetir valores: a documentação mostra exatamente o que o gerador recebe.
const OPACITY = "com.designsystem.opacity"

type Cor = { $value: { hex: string } }
type Semantico = { $value: string; $description?: string; $extensions?: Record<string, string> }
type Pasta = { [nome: string]: Semantico | Pasta }

const TEMAS = { claro: light as unknown as Pasta, escuro: dark as unknown as Pasta }
const eToken = (no: Semantico | Pasta): no is Semantico => "$value" in no
const filhos = (pasta: Pasta) => Object.entries(pasta).filter(([k]) => !k.startsWith("$"))

function buscar(raiz: unknown, caminho: string) {
  let no = raiz
  for (const parte of caminho.split(".")) no = (no as Record<string, unknown>)[parte]
  return no
}

// Uma cor parte de uma fundação ou de outro semântico do mesmo tema.
function lerToken(token: Semantico, tema: Pasta): { nome: string; numero?: number; css: string } {
  const caminho = token.$value.slice(1, -1)
  const fundacao = caminho.startsWith("color.")
  const percentual = token.$extensions?.[OPACITY]?.slice(1, -1).split(".")[1]
  const numero = percentual ? Number(percentual.replace("-", ".")) : undefined
  const base = fundacao ? (buscar(foundations, caminho) as Cor).$value.hex : lerToken(buscar(tema, caminho) as Semantico, tema).css
  return {
    nome: fundacao ? caminho.replace("color.", "").replace(".", "-") : caminho.split(".").at(-1)!,
    numero,
    css: numero === undefined ? base : `color-mix(in oklab, ${base} ${numero}%, transparent)`,
  }
}

function luminancia(hex: string) {
  const canais = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const [r, g, b] = canais.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function Escala({ nome }: { nome: "neutral" | "orange" | "purple" | "red" | "green" | "yellow" }) {
  return (
    <div className="grid grid-cols-2 gap-(--gap-sm) font-sans text-body-sm sm:grid-cols-4 lg:grid-cols-6">
      {Object.entries(foundations.color[nome]).map(([tom, cor]) => {
        const hex = (cor as Cor).$value.hex
        const contraste = 1.05 / (luminancia(hex) + 0.05)
        return (
          <div key={tom} className="overflow-hidden rounded-3xl border bg-surface text-default">
            <div className="h-14" style={{ background: hex }} />
            <div className="p-(--padding-md)">
              <div className="font-medium">{nome}-{tom}</div>
              <div className="text-body-xs text-muted">{hex}</div>
              <div className="text-body-xs text-muted">
                Branco {contraste.toFixed(2).replace(".", ",")}:1{contraste >= 4.5 ? " · AA" : ""}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function Percentuais() {
  return (
    <div className="flex flex-wrap gap-(--gap-sm) font-sans text-body-sm">
      {Object.entries(opacity.opacity).filter(([k]) => !k.startsWith("$")).map(([nome, token]) => {
        const valor = (token as { $value: number }).$value
        return (
          <div key={nome} className="w-24 overflow-hidden rounded-3xl border bg-surface text-default">
            <div className="h-10 bg-white">
              <div className="size-full" style={{ background: `color-mix(in oklab, #000000 ${valor}%, transparent)` }} />
            </div>
            <div className="p-(--padding-sm) font-medium">opacity-{nome}</div>
          </div>
        )
      })}
    </div>
  )
}

function Celula({ token, tema, uso, fundo }: { token: Semantico; tema: Pasta; uso: string; fundo: string }) {
  const { nome, numero, css } = lerToken(token, tema)
  const eClaro = fundo === "#ffffff"
  // Cor igual ao fundo da coluna, como branco sobre branco: sem um apoio neutro, a amostra some.
  const apoio = css === fundo ? foundations.color.neutral["500"].$value.hex : undefined
  return (
    <td className="w-[30%] border-l p-(--padding-lg) align-middle" style={{ background: fundo, color: eClaro ? foundations.color.neutral["950"].$value.hex : foundations.color.neutral["50"].$value.hex }}>
      <div className="flex items-center gap-(--gap-md)">
        {uso === "text" ? (
          <span className="w-9 shrink-0 rounded-lg text-center text-heading-md" style={{ color: css, background: apoio }}>Aa</span>
        ) : uso === "stroke" ? (
          <span className="size-9 shrink-0 rounded-lg border-2" style={{ borderColor: css, background: apoio }} />
        ) : (
          <span className="size-9 shrink-0 rounded-lg" style={{ background: css, boxShadow: `inset 0 0 0 1px ${eClaro ? "#0000001a" : "#ffffff1a"}` }} />
        )}
        <span className="text-body-xs leading-snug">
          {nome}
          {numero !== undefined && <span className="block opacity-70">{String(numero).replace(".", ",")}%</span>}
        </span>
      </div>
    </td>
  )
}

type Camada = Record<"offsetY" | "blur" | "spread", { value: number }>

// As camadas aparecem como no Figma, e a amostra usa o próprio token.
export function Sombras() {
  return (
    <Tabela
      colunas={["Token", "Camadas (Y · Blur · Spread)", "Amostra"]}
      linhas={Object.entries(sombras.shadow).map(([nome, token]) => [
        <>
          <div className="text-label-sm">shadow-{nome}</div>
          <div className="text-body-xs text-muted">{token.$description}</div>
        </>,
        <div className="whitespace-nowrap text-body-xs">
          {(token.$value as Camada[]).map((c, i) => (
            <div key={i}>{[c.offsetY, c.blur, c.spread].map((m) => String(m.value).replace("-", "−")).join(" · ")}</div>
          ))}
        </div>,
        <div className="m-(--padding-lg) h-14 w-24 rounded-2xl bg-surface" style={{ boxShadow: `var(--shadow-${nome})` }} />,
      ])}
    />
  )
}

// Uma tabela por pasta, como no Figma, com uma linha de título para cada uso: bg, text e stroke.
export function Semanticos({ pasta }: { pasta: keyof typeof light }) {
  const raiz = TEMAS.claro[pasta] as Pasta
  // data e shadow têm um uso só e ficam sem subpasta.
  const usos: [string | null, Pasta][] = filhos(raiz).some(([, no]) => eToken(no)) ? [[null, raiz]] : (filhos(raiz) as [string, Pasta][])
  const linhas = usos.flatMap(([uso, grupo]) => [
    ...(uso ? [{ uso }] : []),
    ...filhos(grupo).map(([nome]) => ({ nome, caminho: [pasta, uso, nome].filter(Boolean).join(".") })),
  ])
  return (
    <div className="overflow-x-auto rounded-3xl border font-sans text-body-sm">
      <table className="w-full border-collapse font-sans">
        <thead>
          <tr className="border-b bg-muted text-left text-default">
            <th className="p-(--padding-lg) font-medium">Token</th>
            <th className="border-l p-(--padding-lg) font-medium">Light</th>
            <th className="border-l p-(--padding-lg) font-medium">Dark</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha) => {
            if ("uso" in linha) {
              return (
                <tr key={linha.uso} className="border-b bg-subtle text-default">
                  <td colSpan={3} className="px-(--padding-lg) py-(--padding-2xs) text-label-sm">{linha.uso}</td>
                </tr>
              )
            }
            const claro = buscar(TEMAS.claro, linha.caminho) as Semantico
            const escuro = buscar(TEMAS.escuro, linha.caminho) as Semantico
            return (
              <tr key={linha.nome} className="border-b last:border-b-0">
                <td className="bg-surface p-(--padding-lg) align-middle text-default">
                  <div className="font-medium">{linha.nome}</div>
                  <div className="text-body-xs text-muted">{claro.$description}</div>
                </td>
                <Celula token={claro} tema={TEMAS.claro} uso={linha.nome.split("-")[0]} fundo="#ffffff" />
                <Celula token={escuro} tema={TEMAS.escuro} uso={linha.nome.split("-")[0]} fundo={foundations.color.neutral["950"].$value.hex} />
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
