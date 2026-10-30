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
      colunas={["Token", "Valor", "Classe", "Amostra"]}
      linhas={entradas<{ $value: number }>(PESOS).map(([nome, token]) => [
        <span className="text-label-sm">font-weight-{nome}</span>,
        token.$value,
        <code>font-{nome}</code>,
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
      colunas={["Token", "Valor", "Classe", "Amostra"]}
      linhas={entradas<Medida>(ESPACAMENTOS).map(([nome, token]) => [
        <span className="text-label-sm">letter-spacing-{nome}</span>,
        `${token.$value.value}em`,
        <code>tracking-{nome}</code>,
        <span className="text-heading-md" style={{ letterSpacing: `var(--letter-spacing-${nome})` }}>Saldo disponível</span>,
      ])}
    />
  )
}

export function Papeis() {
  return (
    <Tabela
      colunas={["Token", "Aponta para", "Classe", "Amostra"]}
      linhas={entradas<{ $value: string; $description: string }>(semanticos.font).map(([nome, token]) => [
        <>
          <div className="text-label-sm">font-{nome}</div>
          <div className="text-body-xs text-muted">{token.$description}</div>
        </>,
        <span className="whitespace-nowrap">font-family-{fim(token.$value)}</span>,
        <code className="whitespace-nowrap">font-{nome}</code>,
        <span className="whitespace-nowrap text-heading-md" style={{ fontFamily: `var(--font-${nome})` }}>R$ 1.234,56</span>,
      ])}
    />
  )
}

export function Estilos({ grupo }: { grupo: "display" | "heading" | "body" | "label" }) {
  return (
    <Tabela
      colunas={["Token", "Medidas", "Classe", "Amostra"]}
      linhas={entradas<Estilo>(semanticos[grupo]).map(([nome, token]) => {
        const { fontSize, lineHeight, fontWeight, letterSpacing } = token.$value
        const id = `${grupo}-${nome}`
        return [
          <>
            <div className="text-label-sm">{id}</div>
            <div className="text-body-xs text-muted">{token.$description}</div>
          </>,
          `${fim(fontSize)}/${fim(lineHeight)} · ${PESOS[fim(fontWeight)].$value}${letterSpacing ? ` · ${fim(letterSpacing)}` : ""}`,
          <code>text-{id}</code>,
          <span
            style={{
              fontSize: `var(--text-${id})`,
              lineHeight: `var(--text-${id}--line-height)`,
              fontWeight: `var(--text-${id}--font-weight)`,
              letterSpacing: `var(--text-${id}--letter-spacing, normal)`,
            }}
          >
            Saldo disponível
          </span>,
        ]
      })}
    />
  )
}
