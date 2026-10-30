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
const FUNDACOES = ["color", "opacity", "unit", "font-family", "font-size", "font-weight", "line-height", "letter-spacing"]
const ESPACOS = ["padding", "gap"]
// rounded-none e rounded-full são do Tailwind: os valores destes dois no JSON servem ao Figma e à documentação.
const RAIOS_NATIVOS = ["none", "full"]

const referencia = (texto) => `var(--${String(texto).slice(1, -1).replaceAll(".", "-")})`
const temOpacidade = (token) => token.original.$extensions?.[OPACITY] !== undefined

// O nome é o caminho no JSON: name/kebab transformaria 2xl em 2-xl.
StyleDictionary.registerTransform({
  name: "name/caminho",
  type: "name",
  transform: (token) => token.path.join("-"),
})

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

StyleDictionary.registerTransform({
  name: "dimension/css",
  type: "value",
  transitive: true,
  filter: (token) => token.$type === "dimension" && typeof token.$value === "object",
  transform: (token) => `${token.$value.value}${token.$value.unit}`,
})

StyleDictionary.registerTransform({
  name: "fontFamily/css",
  type: "value",
  transitive: true,
  filter: (token) => token.$type === "fontFamily" && Array.isArray(token.$value),
  transform: (token) => token.$value.map((f) => (f.includes(" ") ? `'${f}'` : f)).join(", "),
})

const eFundacao = (token) => FUNDACOES.includes(token.path[0])
const eEspaco = (token) => ESPACOS.includes(token.path[0])
const eCor = (token) => token.path[0] in UTILIDADES

async function gerar(modo, seletor, filtro, comReferencias) {
  const dicionario = new StyleDictionary({
    source: ["tokens/foundations/*.json", `tokens/semantic/color.${modo}.json`, "tokens/semantic/radius.json", "tokens/semantic/spacing.json", "tokens/semantic/typography.json"],
    log: { warnings: "disabled", verbosity: "silent" },
    platforms: {
      css: {
        transforms: ["name/caminho", "color/hex", "color/opacity", "dimension/css", "fontFamily/css"],
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
const claro = await gerar("light", ":root", (t) => eCor(t) || eEspaco(t), true)
const escuro = await gerar("dark", ".dark", eCor, true)

const todos = claro.tokens.allTokens
const mapeamento = todos
  .filter(eCor)
  .flatMap((token) => {
    const [grupo, ...resto] = token.path
    return UTILIDADES[grupo].map((prefixo) => `  ${prefixo}-${resto.join("-")}: var(--${token.name});`)
  })

// A altura de linha sai como proporção, como no Tailwind, para continuar valendo em um filho com outro tamanho de fonte.
const emRem = (alias) => todos.find((t) => t.path.join(".") === alias.slice(1, -1)).original.$value.value
const linhasDoEstilo = (token) => {
  const { fontSize, lineHeight, fontWeight, letterSpacing } = token.original.$value
  const nome = `--text-${token.name}`
  return [
    `  ${nome}: ${referencia(fontSize)};`,
    `  ${nome}--line-height: calc(${emRem(lineHeight)} / ${emRem(fontSize)});`,
    `  ${nome}--font-weight: ${referencia(fontWeight)};`,
    ...(letterSpacing ? [`  ${nome}--letter-spacing: ${referencia(letterSpacing)};`] : []),
  ]
}
// static: estas variáveis também são lidas em valores arbitrários, como [--cell-radius:var(--radius-4xl)].
const tema = [
  ...todos.filter((t) => t.path[0] === "radius" && !RAIOS_NATIVOS.includes(t.path[1])).map((t) => `  --${t.name}: ${referencia(t.original.$value)};`),
  ...todos.filter((t) => t.path[0] === "font").map((t) => `  --${t.name}: ${referencia(t.original.$value)};`),
  ...todos.filter((t) => t.path[0] === "letter-spacing").map((t) => `  --tracking-${t.path[1]}: var(--${t.name});`),
  ...todos.filter((t) => t.$type === "typography").flatMap(linhasDoEstilo),
]

const conteudo = [
  "/* Gerado por scripts/build-tokens.mjs a partir de tokens/. Não edite à mão: rode `pnpm tokens`. */",
  fundacoes.css,
  claro.css,
  escuro.css,
  `@theme inline {\n${mapeamento.join("\n")}\n}`,
  `@theme static {\n${tema.join("\n")}\n}`,
  "",
].join("\n\n")

mkdirSync("src/styles", { recursive: true })
writeFileSync(SAIDA, conteudo)
console.log(`${SAIDA}: ${todos.filter((t) => !eFundacao(t)).length} semânticos`)
