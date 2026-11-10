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
  // A cor da sombra não vira classe: as sombras e o contorno do slider a leem como var(--shadow-color).
  shadow: [],
}
// A espessura também é stroke: stroke-sm vira border-sm, ring-sm e outline-sm.
const ESPESSURAS = ["--border-width", "--ring-width", "--outline-width"]
const FUNDACOES = ["color", "opacity", "unit", "font-family", "font-size", "font-weight", "line-height", "letter-spacing"]
const ESPACOS = ["padding", "gap", "size"]
// rounded-full é do Tailwind: o valor dele no JSON serve ao Figma e à documentação.
const RAIOS_NATIVOS = ["full"]

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
    return `color-mix(in oklab, ${cor} ${percentual}, transparent)`
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
// stroke guarda cores e espessuras: o tipo separa uma da outra.
const eCor = (token) => token.path[0] in UTILIDADES && token.$type === "color"
const eEspessura = (token) => token.path[0] === "stroke" && token.$type === "dimension"
const eOpacidade = (token) => token.path[0] === "opacity"
const eSombra = (token) => token.$type === "shadow"

async function gerar(modo, seletor, filtro, comReferencias) {
  const dicionario = new StyleDictionary({
    source: ["tokens/foundations/*.json", `tokens/semantic/color.${modo}.json`, "tokens/semantic/radius.json", "tokens/semantic/spacing.json", "tokens/semantic/stroke.json", "tokens/semantic/shadow.json", "tokens/semantic/typography.json"],
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

// A opacidade sai no @theme, em percentual: é dali que o Tailwind lê bg-muted/50 e opacity-50.
const fundacoes = await gerar("light", ":root", (t) => eFundacao(t) && !eOpacidade(t), false)
const claro = await gerar("light", ":root", (t) => eCor(t) || eEspaco(t) || eEspessura(t), true)
const escuro = await gerar("dark", ".dark", eCor, true)

const todos = claro.tokens.allTokens
const mapeamento = todos
  .filter(eCor)
  .flatMap((token) => {
    const [grupo, ...resto] = token.path
    return UTILIDADES[grupo].map((prefixo) => `  ${prefixo}-${resto.join("-")}: var(--${token.name});`)
  })
const espessuras = todos
  .filter(eEspessura)
  .flatMap((t) => ESPESSURAS.map((prefixo) => `  ${prefixo}-${t.path[1]}: var(--${t.name});`))

// A altura de linha sai como proporção, como no Tailwind, para continuar valendo em um filho com outro tamanho de fonte.
const emRem = (alias) => todos.find((t) => t.path.join(".") === alias.slice(1, -1)).original.$value.value
// Cada estilo é uma classe só, com a família dentro: o text-* do Tailwind não aceita família.
const utilidadeDoEstilo = (token) => {
  const { fontFamily, fontSize, lineHeight, fontWeight, letterSpacing } = token.original.$value
  return [
    `@utility text-${token.name} {`,
    `  font-family: ${referencia(fontFamily)};`,
    `  font-size: ${referencia(fontSize)};`,
    `  line-height: calc(${emRem(lineHeight)} / ${emRem(fontSize)});`,
    `  font-weight: ${referencia(fontWeight)};`,
    ...(letterSpacing ? [`  letter-spacing: ${referencia(letterSpacing)};`] : []),
    "}",
  ].join("\n")
}
// Cada camada da sombra em CSS: x y desfoque expansão cor.
const medida = ({ value, unit }) => (value === 0 ? "0" : `${value}${unit}`)
const camadas = (token) =>
  token.original.$value.map((c) => [c.offsetX, c.offsetY, c.blur, c.spread].map(medida).concat(referencia(c.color)).join(" ")).join(", ")
// static: estas variáveis também são lidas em valores arbitrários, como [--cell-radius:var(--radius-4xl)].
const tema = [
  ...todos.filter((t) => t.path[0] === "radius" && !RAIOS_NATIVOS.includes(t.path[1])).map((t) => `  --${t.name}: ${referencia(t.original.$value)};`),
  ...todos.filter((t) => t.path[0] === "font").map((t) => `  --${t.name}: ${referencia(t.original.$value)};`),
  ...todos.filter((t) => t.path[0] === "letter-spacing").map((t) => `  --tracking-${t.path[1]}: var(--${t.name});`),
  ...todos.filter(eOpacidade).map((t) => `  --${t.name}: ${t.original.$value}%;`),
  // Só a escala do JSON: as outras sombras do Tailwind (2xs, xs, 2xl) deixam de existir.
  "  --shadow-*: initial;",
  ...todos.filter(eSombra).map((t) => `  --${t.name}: ${camadas(t)};`),
]

const conteudo = [
  "/* Gerado por scripts/build-tokens.mjs a partir de tokens/. Não edite à mão: rode `pnpm tokens`. */",
  fundacoes.css,
  claro.css,
  escuro.css,
  `@theme inline {\n${[...mapeamento, ...espessuras].join("\n")}\n}`,
  `@theme static {\n${tema.join("\n")}\n}`,
  ...todos.filter((t) => t.$type === "typography").map(utilidadeDoEstilo),
  "",
].join("\n\n")

mkdirSync("src/styles", { recursive: true })
writeFileSync(SAIDA, conteudo)
console.log(`${SAIDA}: ${todos.filter((t) => !eFundacao(t)).length} semânticos`)
