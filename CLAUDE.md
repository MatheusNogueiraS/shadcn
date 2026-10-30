# Diretrizes do projeto

## Branches
Todo trabalho acontece em uma branch aberta a partir da `main` atualizada, de um assunto só. Abra a branch antes de começar a alterar arquivos.

## Tokens
Cores vivem em `tokens/`: fundações com os hexadecimais e semânticos com uma versão para Light e outra para Dark. `src/styles/tokens.css` é gerado: edite os JSON e rode `pnpm tokens`.

Componentes usam somente semânticos (`bg-page`, `text-default`, `border-default`). Componente novo do `shadcn add` chega com os nomes originais: troque-os pelos semânticos de mesmo valor.

## Tamanho de PR
A recomendação é de até **300 linhas por PR**, somando adições e remoções, sem contar o `pnpm-lock.yaml`. É uma recomendação: o usuário pode passar dela quando quiser.

Meça ao terminar cada bloco de alteração:

```
git diff --shortstat origin/main -- . ':!pnpm-lock.yaml'
```

Some as linhas dos arquivos novos ainda não rastreados (`git ls-files -o --exclude-standard`), que esse comando não conta.

Ao passar de 300, avise o usuário na mesma hora, com o total e a recomendação, e sugira como dividir. Depois siga o que ele escolher, sem travar o trabalho.
