// Lê os valores do CSS em vez de repeti-los aqui: a documentação não pode divergir de index.css.
const lerToken = (token: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--${token}`).trim()

function luminancia(hex: string) {
  const canais = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const [r, g, b] = canais.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrasteComBranco = (hex: string) => 1.05 / (luminancia(hex) + 0.05)

export function Escala({ nome, tons }: { nome: string; tons: number[] }) {
  return (
    <div className="grid gap-2 font-sans text-sm sm:grid-cols-5">
      {tons.map((tom) => {
        const hex = lerToken(`brand-${nome}-${tom}`)
        const contraste = contrasteComBranco(hex)
        return (
          <div key={tom} className="overflow-hidden rounded-2xl border bg-card text-card-foreground">
            <div className="h-16" style={{ background: hex }} />
            <div className="p-3">
              <div className="font-medium">brand-{nome}-{tom}</div>
              <div className="text-muted-foreground">{hex}</div>
              <div className="text-xs text-muted-foreground">
                Branco {contraste.toFixed(2).replace(".", ",")}:1{contraste >= 4.5 ? " · AA" : ""}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function Tokens({ itens }: { itens: [token: string, uso: string][] }) {
  return (
    <div className="divide-y rounded-2xl border bg-card font-sans text-sm text-card-foreground">
      {itens.map(([token, uso]) => (
        <div key={token} className="flex items-center gap-3 p-3">
          <div className="size-8 shrink-0 rounded-lg border" style={{ background: `var(--${token})` }} />
          <code className="w-48 shrink-0 font-sans font-medium">--{token}</code>
          <span className="text-muted-foreground">{uso}</span>
        </div>
      ))}
    </div>
  )
}
