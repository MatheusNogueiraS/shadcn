import foundations from "../../tokens/foundations/color.json"
import opacity from "../../tokens/foundations/opacity.json"
import dark from "../../tokens/semantic/color.dark.json"
import light from "../../tokens/semantic/color.light.json"

// Lê os JSON em vez de repetir valores: a documentação mostra exatamente o que o gerador recebe.
const OPACITY = "com.designsystem.opacity"

type Cor = { $value: { hex: string } }
type Semantico = { $value: string; $description?: string; $extensions?: Record<string, string> }
type Grupo = Record<string, Semantico>
type Tema = Record<string, Grupo>

function resolverCor(caminho: string) {
  const partes = caminho.split(".").slice(1)
  let no: unknown = foundations.color
  for (const parte of partes) no = (no as Record<string, unknown>)[parte]
  return (no as Cor).$value.hex
}

function lerToken(token: Semantico) {
  const caminho = token.$value.slice(1, -1)
  const percentual = token.$extensions?.[OPACITY]?.slice(1, -1).split(".")[1]
  const numero = percentual ? Number(percentual.replace("-", ".")) : undefined
  return {
    nome: caminho.replace("color.", "").replace(".", "-"),
    numero,
    css: numero === undefined ? resolverCor(caminho) : `color-mix(in oklab, ${resolverCor(caminho)} ${numero}%, transparent)`,
  }
}

function luminancia(hex: string) {
  const canais = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const [r, g, b] = canais.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function Escala({ nome }: { nome: "neutral" | "orange" | "purple" | "red" | "green" | "yellow" }) {
  return (
    <div className="grid grid-cols-2 gap-2 font-sans text-sm sm:grid-cols-4 lg:grid-cols-6">
      {Object.entries(foundations.color[nome]).map(([tom, cor]) => {
        const hex = (cor as Cor).$value.hex
        const contraste = 1.05 / (luminancia(hex) + 0.05)
        return (
          <div key={tom} className="overflow-hidden rounded-2xl border bg-surface text-default">
            <div className="h-14" style={{ background: hex }} />
            <div className="p-2.5">
              <div className="font-medium">{nome}-{tom}</div>
              <div className="text-xs text-muted">{hex}</div>
              <div className="text-xs text-muted">
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
    <div className="flex flex-wrap gap-2 font-sans text-sm">
      {Object.entries(opacity.opacity).filter(([k]) => !k.startsWith("$")).map(([nome, token]) => {
        const valor = (token as { $value: number }).$value
        return (
          <div key={nome} className="w-24 overflow-hidden rounded-2xl border bg-surface text-default">
            <div className="h-10 bg-white">
              <div className="size-full" style={{ background: `color-mix(in oklab, #000000 ${valor}%, transparent)` }} />
            </div>
            <div className="p-2 font-medium">opacity-{nome}</div>
          </div>
        )
      })}
    </div>
  )
}

function Celula({ token, grupo, fundo }: { token: Semantico; grupo: string; fundo: string }) {
  const { nome, numero, css } = lerToken(token)
  const eClaro = fundo === "#ffffff"
  // Cor igual ao fundo da coluna, como branco sobre branco: sem um apoio neutro, a amostra some.
  const apoio = css === fundo ? foundations.color.neutral["500"].$value.hex : undefined
  return (
    <td className="w-[30%] border-l p-3 align-middle" style={{ background: fundo, color: eClaro ? foundations.color.neutral["950"].$value.hex : foundations.color.neutral["50"].$value.hex }}>
      <div className="flex items-center gap-2.5">
        {grupo === "text" ? (
          <span className="w-9 shrink-0 rounded-lg text-center text-lg font-medium" style={{ color: css, background: apoio }}>Aa</span>
        ) : grupo === "stroke" ? (
          <span className="size-9 shrink-0 rounded-lg border-2" style={{ borderColor: css, background: apoio }} />
        ) : (
          <span className="size-9 shrink-0 rounded-lg" style={{ background: css, boxShadow: `inset 0 0 0 1px ${eClaro ? "#0000001a" : "#ffffff1a"}` }} />
        )}
        <span className="text-xs leading-snug">
          {nome}
          {numero !== undefined && <span className="block opacity-70">{String(numero).replace(".", ",")}%</span>}
        </span>
      </div>
    </td>
  )
}

export function Semanticos({ grupo }: { grupo: "bg" | "text" | "stroke" | "data" }) {
  const claro = (light as unknown as Tema)[grupo]
  const escuro = (dark as unknown as Tema)[grupo]
  const nomes = Object.keys(claro).filter((k) => !k.startsWith("$"))
  return (
    <div className="overflow-x-auto rounded-2xl border font-sans text-sm">
      <table className="w-full border-collapse font-sans">
        <thead>
          <tr className="border-b bg-muted text-left text-default">
            <th className="p-3 font-medium">Token</th>
            <th className="border-l p-3 font-medium">Light</th>
            <th className="border-l p-3 font-medium">Dark</th>
          </tr>
        </thead>
        <tbody>
          {nomes.map((nome) => (
            <tr key={nome} className="border-b last:border-b-0">
              <td className="bg-surface p-3 align-middle text-default">
                <div className="font-medium">{grupo}-{nome}</div>
                <div className="text-xs text-muted">{claro[nome].$description}</div>
              </td>
              <Celula token={claro[nome]} grupo={grupo} fundo="#ffffff" />
              <Celula token={escuro[nome]} grupo={grupo} fundo={foundations.color.neutral["950"].$value.hex} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
