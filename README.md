# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
pnpm dlx shadcn@latest add button
```

This project uses the `base-luma` style. UI components are placed in
`src/components/ui`.

The Data Table guide builds on the Table component and `@tanstack/react-table`.
Date Picker is composed from Calendar and Popover. The Typography documentation
now covers Typeset, which is configured separately rather than added as a UI
component.

## Documentação dos componentes

Rode `pnpm storybook` para abrir a documentação em `http://localhost:6006`, com os fundamentos da marca e cada componente em uso. `pnpm build-storybook` gera a versão estática.

## Publicando no GitHub

Este repositório traz a skill `github-flow`, em `.claude/skills/github-flow/`. Abra o Claude Code na raiz do projeto e diga que quer subir o trabalho: ela revisa os arquivos, procura segredos e dados pessoais, roda as verificações e abre um PR. O merge é sempre manual, no GitHub.

Requisitos: [Git](https://git-scm.com/downloads), [Node.js](https://nodejs.org) e [GitHub CLI](https://cli.github.com) com `gh auth login` feito. Recomendado: [gitleaks](https://github.com/gitleaks/gitleaks#installing).

Para confirmar o ambiente e, se quiser, ativar a varredura em todo commit e o bloqueio de push direto na `main` nesta máquina:

```bash
node .claude/skills/github-flow/scripts/guarda.mjs situacao
node .claude/skills/github-flow/scripts/guarda.mjs instalar
```

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```
