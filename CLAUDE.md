# Diretrizes do projeto

## Branches
Todo trabalho acontece em uma branch aberta a partir da `main` atualizada, de um assunto só. Abra a branch antes de começar a alterar arquivos.

## Tokens
Cores, medidas e tipografia vivem em `tokens/`: fundações com os valores e semânticos com os nomes de uso. As cores têm uma versão para Light e outra para Dark. `src/styles/tokens.css` é gerado: edite os JSON e rode `pnpm tokens`.

Componentes usam somente semânticos: `bg-page`, `text-default`, `border-default`, `border-sm`, `ring-xl`, `rounded-2xl`, `px-(--padding-lg)`, `gap-(--gap-sm)`, `size-(--size-md)`, `text-body-sm`. Texto usa uma classe só, a do estilo, que já traz família, peso, altura de linha e espaçamento: nada de `font-heading`, `font-mono` ou `font-medium` ao lado. Toda superfície que recebe texto (menus, janelas, cards, Sidebar, Calendar, Toast) tem um estilo, para nenhum texto herdar a fonte da página; as partes de dentro, como `TableCell` e `CardContent`, herdam o estilo do componente onde estão e não precisam de um. Modificador de altura de linha (`text-body-sm/relaxed`) não funciona com os estilos. Margens usam os tokens de gap; quando desfazem um padding, usam o token desse padding. Alturas, larguras, posições e o que mais vier da escala do Tailwind ficam como o shadcn escreveu. Componente novo do `shadcn add` chega com os nomes originais: troque-os pelos semânticos de mesmo valor (`border` sem número vira `border-sm`, `ring-3` vira `ring-xl`, `size-4` vira `size-(--size-md)`, `font-heading text-heading-sm` vira `text-heading-sm`, `font-mono` com um estilo vira o `text-mono-*`, `font-medium` vira o `text-label-*` do mesmo tamanho, `font-bold` vira o `text-body-*-bold`, `leading-none` vira o estilo `-compact`, `tracking-widest` vira o `-wide`; sem estilo de mesmo valor, crie um em `tokens/`) e importe `cn` de `@/lib/utils`, porque o `cn` original apaga `text-body-sm` e `border-sm` ao lado de uma cor.

## Tamanho de PR
A recomendação é de até **300 linhas por PR**, somando adições e remoções, sem contar o `pnpm-lock.yaml`. É uma recomendação: o usuário pode passar dela quando quiser.

Meça ao terminar cada bloco de alteração:

```
git diff --shortstat origin/main -- . ':!pnpm-lock.yaml'
```

Some as linhas dos arquivos novos ainda não rastreados (`git ls-files -o --exclude-standard`), que esse comando não conta.

Ao passar de 300, avise o usuário na mesma hora, com o total e a recomendação, e sugira como dividir. Depois siga o que ele escolher, sem travar o trabalho.
