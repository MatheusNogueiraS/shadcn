import type { ReactNode } from "react"

import unidades from "../../tokens/foundations/unit.json"
import raios from "../../tokens/semantic/radius.json"
import espacos from "../../tokens/semantic/spacing.json"

type Medida = { $value: { value: number; unit: string } }
type Alias = { $value: string; $description?: string }

const UNIDADES = unidades.unit as unknown as Record<string, Medida>
const CHAVES_UNIDADE = Object.keys(UNIDADES).filter((k) => !k.startsWith("$")).sort((a, b) => Number(a) - Number(b))

const entradas = (grupo: object) => Object.entries(grupo).filter(([k]) => !k.startsWith("$")) as [string, Alias][]
const unidadeDe = (alias: string) => alias.slice(1, -1).split(".")[1]
const rem = (chave: string) => UNIDADES[chave].$value.value

export function Tabela({ colunas, linhas, densa }: { colunas: string[]; linhas: ReactNode[][]; densa?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-3xl border font-sans text-body-sm">
      <table className="w-full border-collapse font-sans">
        <thead>
          <tr className="border-b bg-muted text-left text-default">
            {colunas.map((c) => <th key={c} className="p-(--padding-lg) text-label-sm">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {linhas.map((celulas, i) => (
            <tr key={i} className="border-b bg-surface text-default last:border-b-0">
              {celulas.map((c, j) => <td key={j} className={densa ? "px-(--padding-lg) py-(--padding-2xs) align-middle" : "p-(--padding-lg) align-middle"}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Unidades() {
  return (
    <Tabela
      densa
      colunas={["Token", "Valor", "Em px", "Tamanho"]}
      linhas={CHAVES_UNIDADE.map((k) => [
        <span className="text-label-sm">unit-{k}</span>,
        `${rem(k)}rem`,
        `${k}px`,
        k === "999" ? "Maior que qualquer componente" : <div className="h-3 rounded-sm bg-brand" style={{ width: `${rem(k)}rem` }} />,
      ])}
    />
  )
}

export function Raios() {
  return (
    <Tabela
      colunas={["Token", "Valor", "Classe", "Amostra"]}
      linhas={entradas(raios.radius).map(([nome, token]) => {
        const chave = unidadeDe(token.$value)
        return [
          <>
            <div className="text-label-sm">radius-{nome}</div>
            <div className="text-body-xs text-muted">{token.$description}</div>
          </>,
          `unit-${chave} · ${chave}px`,
          <code>rounded-{nome}</code>,
          <div className="h-14 w-24 border-2 border-brand bg-muted" style={{ borderRadius: `${rem(chave)}rem` }} />,
        ]
      })}
    />
  )
}

export function Espacos({ grupo }: { grupo: "padding" | "gap" }) {
  return (
    <Tabela
      colunas={["Token", "Valor", "Classe", "Amostra"]}
      linhas={entradas(espacos[grupo]).map(([nome, token]) => {
        const chave = unidadeDe(token.$value)
        return [
          <span className="text-label-sm">{grupo}-{nome}</span>,
          `unit-${chave} · ${chave}px`,
          <code>{grupo === "padding" ? "p" : "gap"}-(--{grupo}-{nome})</code>,
          grupo === "padding" ? (
            <div className="inline-block rounded-sm bg-brand" style={{ padding: `var(--padding-${nome})` }}>
              <div className="size-6 rounded-sm bg-surface" />
            </div>
          ) : (
            <div className="flex" style={{ gap: `var(--gap-${nome})` }}>
              <div className="size-6 rounded-sm bg-brand" />
              <div className="size-6 rounded-sm bg-brand" />
            </div>
          ),
        ]
      })}
    />
  )
}
