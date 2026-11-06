import fundacoes from "../../tokens/foundations/typography.json"
import semanticos from "../../tokens/semantic/typography.json"
import { Tabela } from "./amostras-medidas"

type Medida = { $value: { value: number; unit: string } }
type Estilo = {
  $description: string
  $value: { fontFamily: string; fontSize: string; lineHeight: string; fontWeight: string; letterSpacing?: string }
}

const PESOS = fundacoes["font-weight"] as unknown as Record<string, { $value: number }>
const ESPACAMENTOS = fundacoes["letter-spacing"] as unknown as Record<string, Medida>

const entradas = <T,>(grupo: object) => Object.entries(grupo).filter(([k]) => !k.startsWith("$")) as [string, T][]
const fim = (alias: string) => alias.slice(1, -1).split(".")[1]

export function Familias() {
  return (
    <Tabela
      colunas={["Token", "Valor", "Amostra"]}
      linhas={entradas<{ $value: string[]; $description?: string }>(fundacoes["font-family"]).map(([nome, token]) => [
        <>
          <div className="text-label-sm">font-family-{nome}</div>
          {token.$description && <div className="text-body-xs text-muted">{token.$description}</div>}
        </>,
        token.$value.join(", "),
        <span className="text-heading-md" style={{ fontFamily: `var(--font-family-${nome})` }}>R$ 1.234,56 Açúcar</span>,
      ])}
    />
  )
}

export function Pesos() {
  return (
    <Tabela
      colunas={["Token", "Valor", "Amostra"]}
      linhas={entradas<{ $value: number }>(PESOS).map(([nome, token]) => [
        <span className="text-label-sm">font-weight-{nome}</span>,
        token.$value,
        <span className="text-heading-md" style={{ fontWeight: token.$value }}>Saldo disponível</span>,
      ])}
    />
  )
}

function Medidas({ grupo, rotulo, amostra }: { grupo: "font-size" | "line-height"; rotulo: string; amostra: (nome: string) => React.ReactNode }) {
  return (
    <Tabela
      colunas={["Token", "Valor", "Em px", rotulo]}
      linhas={entradas<Medida>(fundacoes[grupo]).map(([nome, token]) => [
        <span className="text-label-sm">{grupo}-{nome}</span>,
        `${token.$value.value}rem`,
        `${nome}px`,
        amostra(nome),
      ])}
    />
  )
}

export function Tamanhos() {
  return <Medidas grupo="font-size" rotulo="Amostra" amostra={(nome) => <span className="leading-none" style={{ fontSize: `var(--font-size-${nome})` }}>Aa</span>} />
}

export function AlturasDeLinha() {
  return <Medidas grupo="line-height" rotulo="Altura" amostra={(nome) => <div className="w-24 rounded-sm bg-muted" style={{ height: `var(--line-height-${nome})` }} />} />
}

export function Espacamentos() {
  return (
    <Tabela
      colunas={["Token", "Valor", "Amostra"]}
      linhas={entradas<Medida>(ESPACAMENTOS).map(([nome, token]) => [
        <span className="text-label-sm">letter-spacing-{nome}</span>,
        `${token.$value.value}em`,
        <span className="text-heading-md" style={{ letterSpacing: `var(--letter-spacing-${nome})` }}>Saldo disponível</span>,
      ])}
    />
  )
}

export function Papeis() {
  return (
    <Tabela
      colunas={["Token", "Aponta para", "Amostra"]}
      linhas={entradas<{ $value: string; $description: string }>(fundacoes.font).map(([nome, token]) => [
        <>
          <div className="text-label-sm">font-{nome}</div>
          <div className="text-body-xs text-muted">{token.$description}</div>
        </>,
        <span className="whitespace-nowrap">font-family-{fim(token.$value)}</span>,
        <span className="whitespace-nowrap text-heading-md" style={{ fontFamily: `var(--font-${nome})` }}>R$ 1.234,56</span>,
      ])}
    />
  )
}

// {font-size.14} vira font-size-14, o nome da variável da fundação.
const token = (alias: string) => alias.slice(1, -1).replace(".", "-")

export function Estilos({ grupo }: { grupo: "display" | "heading" | "body" | "label" | "mono" }) {
  return (
    <Tabela
      colunas={["Estilo", "Tokens", "Medidas", "Classe", "Amostra"]}
      linhas={entradas<Estilo>(semanticos[grupo]).map(([nome, estilo]) => {
        const { fontFamily, fontSize, lineHeight, fontWeight, letterSpacing } = estilo.$value
        const id = `${grupo}-${nome}`
        return [
          <>
            <div className="text-label-sm">{id}</div>
            <div className="text-body-xs text-muted">{estilo.$description}</div>
          </>,
          <div className="whitespace-nowrap text-body-xs">
            {[fontFamily, fontSize, lineHeight, fontWeight, letterSpacing].filter((a) => a !== undefined).map((a) => (
              <div key={a}>{token(a)}</div>
            ))}
          </div>,
          `${fim(fontSize)}/${fim(lineHeight)} · ${PESOS[fim(fontWeight)].$value}${letterSpacing ? ` · ${fim(letterSpacing)}` : ""}`,
          <code className="whitespace-nowrap">text-{id}</code>,
          // A amostra lê as fundações: o Tailwind só gera as classes que algum componente usa.
          <span
            style={{
              fontFamily: `var(--${token(fontFamily)})`,
              fontSize: `var(--${token(fontSize)})`,
              lineHeight: `var(--${token(lineHeight)})`,
              fontWeight: `var(--${token(fontWeight)})`,
              letterSpacing: letterSpacing ? `var(--${token(letterSpacing)})` : "normal",
            }}
          >
            Saldo disponível
          </span>,
        ]
      })}
    />
  )
}
