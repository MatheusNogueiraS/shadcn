// Gera src/styles/tokens.css a partir dos JSON em tokens/. Rode com `pnpm tokens`.
import { mkdirSync, writeFileSync } from "node:fs"
import StyleDictionary from "style-dictionary"

const OPACITY = "com.designsystem.opacity"
const SAIDA = "src/styles/tokens.css"

// Cada grupo semântico vira as utilidades do Tailwind da sua propriedade. stroke-default vira border-default, ring-default e outline-default.
const UTILIDADES = {
  bg: ["--background-color"],
  text: ["--text-color"],
  stroke: ["--border-color", "--ring-color", "--outline-color"],
  data: ["--color-data"],
}

const referencia = (texto) => `var(--${String(texto).slice(1, -1).replaceAll(".", "-")})`
const temOpacidade = (token) => token.original.$extensions?.[OPACITY] !== undefined

StyleDictionary.registerTransform({
  name: "color/hex",
  type: "value",
  transitive: true,
  filter: (token) => token.$type === "color" && typeof token.$value === "object",
  transform: (token) => token.$value.hex,
})

// Mantém o vínculo com a fundação em vez de achatar a cor com o percentual em um valor fixo.
StyleDictionary.registerTransform({
  name: "color/opacity",
  type: "value",
  transitive: true,
  filter: temOpacidade,
  transform: (token) => {
    const cor = referencia(token.original.$value)
    const percentual = referencia(token.original.$extensions[OPACITY])
    return `color-mix(in oklab, ${cor} calc(${percentual} * 1%), transparent)`
  },
})

const eFundacao = (token) => ["color", "opacity"].includes(token.path[0])

async function gerar(modo, seletor, filtro, comReferencias) {
  const dicionario = new StyleDictionary({
    source: ["tokens/foundations/*.json", `tokens/semantic/color.${modo}.json`],
    log: { warnings: "disabled", verbosity: "silent" },
    platforms: {
      css: {
        transforms: ["name/kebab", "color/hex", "color/opacity"],
        files: [{
          destination: "saida.css",
          format: "css/variables",
          filter: filtro,
          // Sem esta exceção, o gerador troca o valor pela referência e o percentual some sem aviso.
          options: { selector: seletor, showFileHeader: false, outputReferences: comReferencias ? (token) => !temOpacidade(token) : false },
        }],
      },
    },
  })
  const [arquivo] = await dicionario.formatPlatform("css")
  return { css: arquivo.output.trim(), tokens: await dicionario.getPlatformTokens("css") }
}

const fundacoes = await gerar("light", ":root", eFundacao, false)
const claro = await gerar("light", ":root", (t) => !eFundacao(t), true)
const escuro = await gerar("dark", ".dark", (t) => !eFundacao(t), true)

const mapeamento = claro.tokens.allTokens
  .filter((token) => !eFundacao(token))
  .flatMap((token) => {
    const [grupo, ...resto] = token.path
    return UTILIDADES[grupo].map((prefixo) => `  ${prefixo}-${resto.join("-")}: var(--${token.name});`)
  })

const conteudo = [
  "/* Gerado por scripts/build-tokens.mjs a partir de tokens/. Não edite à mão: rode `pnpm tokens`. */",
  fundacoes.css,
  claro.css,
  escuro.css,
  `@theme inline {\n${mapeamento.join("\n")}\n}`,
  "",
].join("\n\n")

mkdirSync("src/styles", { recursive: true })
writeFileSync(SAIDA, conteudo)
console.log(`${SAIDA}: ${claro.tokens.allTokens.filter((t) => !eFundacao(t)).length} semânticos`)
