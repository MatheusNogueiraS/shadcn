# Diretrizes do projeto

## Branches
Todo trabalho acontece em uma branch aberta a partir da `main` atualizada, de um assunto só. Abra a branch antes de começar a alterar arquivos.

## Tokens
Cores, medidas e tipografia vivem em `tokens/`: fundações com os valores e semânticos com os nomes de uso. As cores têm uma versão para Light e outra para Dark. `src/styles/tokens.css` é gerado: edite os JSON e rode `pnpm tokens`.

Componentes usam somente semânticos: `bg-page`, `text-default`, `border-default`, `rounded-2xl`, `px-(--padding-lg)`, `gap-(--gap-sm)`, `text-body-sm`. Valores fora da escala continuam como classes do Tailwind. Componente novo do `shadcn add` chega com os nomes originais: troque-os pelos semânticos de mesmo valor e importe `cn` de `@/lib/utils`, porque o `cn` original apaga `text-body-sm` ao lado de uma cor.

## Tamanho de PR
A recomendação é de até **300 linhas por PR**, somando adições e remoções, sem contar o `pnpm-lock.yaml`. É uma recomendação: o usuário pode passar dela quando quiser.

Meça ao terminar cada bloco de alteração:

```
git diff --shortstat origin/main -- . ':!pnpm-lock.yaml'
```

Some as linhas dos arquivos novos ainda não rastreados (`git ls-files -o --exclude-standard`), que esse comando não conta.

Ao passar de 300, avise o usuário na mesma hora, com o total e a recomendação, e sugira como dividir. Depois siga o que ele escolher, sem travar o trabalho.
