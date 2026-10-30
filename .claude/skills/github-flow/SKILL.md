---
name: github-flow
description: Leva trabalho ao GitHub pelo GitHub Flow, com triagem de arquivos, varredura de segredos e dados pessoais, revisão e PR. Use sempre que a conversa indicar, com quaisquer palavras, que o trabalho deve ir para o GitHub (subir, commitar, push, abrir PR), que um PR foi mergeado, ou que um segredo ou dado pessoal vazou no Git.
---

# GitHub Flow

Todo trabalho chega à branch principal por um PR curto, depois de _triagem_, _varredura_ e _revisão_. **O merge é sempre manual, feito por uma pessoa no GitHub.** Pedido de merge: entregue o link do PR. Aprovar e mergear ficam fora deste fluxo, inclusive `gh pr merge`, `gh pr review --approve` e auto-merge.

`guarda` abaixo significa `node "$(git rev-parse --show-toplevel)/.claude/skills/github-flow/scripts/guarda.mjs"`.

## O que dispara o quê

| A conversa indica | Faça |
|---|---|
| Levar trabalho ao GitHub | Passos 1 a 9, sem novas confirmações |
| Um PR foi mergeado | Passo 1 |
| Segredo ou dado pessoal no Git | Seção Incidente |
| Tornar um repositório público | `guarda historico` e relate o resultado antes |

Pergunte só diante de: requisito faltando, bloqueio da _varredura_, arquivo que a _triagem_ não consegue classificar, achado grave da _revisão_ ou conflito. O restante está decidido aqui. Mudar visibilidade, instalar hooks e reescrever histórico compartilhado exigem pedido próprio.

## Passos

### 1. Situar e limpar
Rode `guarda situacao`. Cada linha `FALTA` traz a instrução: repasse ao usuário e aguarde. Depois rode `git status -sb`, `gh repo view --json nameWithOwner,visibility,defaultBranchRef` e `guarda limpar`.

`guarda limpar` apaga, local e remota, só a branch cujo PR foi mergeado, com o commit de merge já dentro da principal e a ponta igual à do PR. Depois de um squash, `git branch --merged` não enxerga isso: use sempre `guarda limpar`, e mantenha as branches que ele manteve.

Se `git config user.email` estiver vazio, configure a identidade **só neste repositório**, com a conta do `gh auth` e o e-mail noreply: `gh api user --jq '.login, .id'`, depois `git config user.name "<login>"` e `git config user.email "<id>+<login>@users.noreply.github.com"`.

**Pronto quando:** nada falta; você sabe o repositório, a branch e se está à frente ou atrás da base; as branches mergeadas sumiram; a identidade está definida.

### 2. Branch
- Na branch principal: `git switch -c <tipo>/<descricao-curta>` (leva as alterações junto). Tipos: `feat`, `fix`, `style`, `refactor`, `docs`, `chore`.
- Em branch cujo PR já foi mergeado: atualize a principal e crie outra.
- Assuntos sem relação entre si vão em branches separadas.

**Pronto quando:** você está em uma branch de um assunto só, que não é a principal.

### 3. Triagem
Dê um destino a **cada** linha de `git status --short`, inclusive arquivos novos:

| Classe | Destino |
|---|---|
| Desta mudança | `git add <arquivo>`, pelo nome |
| Gerado (build, cache, log) | `.gitignore` |
| Credencial, backup ou dado real | Fora do Git; relate |
| De outro assunto | Fora deste commit; relate |

Leia o `git diff --cached` inteiro. Se a mudança passar da recomendação de tamanho de PR do projeto, avise e siga o que o usuário escolher.

**Pronto quando:** todo arquivo tem destino e o diff preparado contém só esta mudança.

### 4. Varredura
Rode `guarda staged`. O relatório traz só arquivo, linha e tipo; ao falar de um achado, mantenha o valor fora da conversa, de commits e de logs.

- **BLOQUEADO:** pare e mostre o relatório. Segredo vai para variável de ambiente. Dado real sai e dá lugar a um fictício. Se for mesmo fictício, com a confirmação do usuário, marque a linha com o comentário `dado-ficticio` (em achado do gitleaks, `gitleaks:allow`).
- **REVISAR:** abra cada item e decida. Os que ficarem vão listados na entrega.
- **Já está no remoto:** siga a seção Incidente.

**Pronto quando:** não há bloqueio e cada item de REVISAR tem decisão.

### 5. Revisão
1. Rode as verificações do projeto, com o gerenciador de pacotes dele: scripts de `lint`, `typecheck`, `test` e `build` do `package.json`, ou os equivalentes de outra stack.
2. Se a tela mudou, abra no navegador, olhe e leia o console. Compilar não prova que a tela está certa.
3. Rode a skill `code-review` em nível `medium` sobre a mudança. Sem ela disponível, releia o diff procurando bugs, casos de borda e código sem uso.

Correção feita aqui volta ao passo 3.

**Pronto quando:** toda verificação existente rodou e passou, e cada achado foi corrigido ou registrado como risco no PR.

### 6. Commit
Mensagem em português, no formato `tipo: o que muda`, com corpo explicando o porquê quando ajudar. Termine com as linhas de atribuição indicadas pelo sistema. Commit com falha no hook volta ao passo 4.

**Pronto quando:** o commit existe e o `git status` não mostra mais os arquivos desta mudança.

### 7. Push
Rode `guarda branch`, que varre commit por commit: segredo removido depois continua no histórico. Se a base andou, `git rebase origin/<principal>`. Depois `git push -u origin <branch>`.

Só uma branch sua, que você mesmo rebaseou, aceita `git push --force-with-lease`. Hook que barrou algo volta ao passo 4; passar por cima dele com `--no-verify` é decisão de uma pessoa, fora deste fluxo.

**Pronto quando:** `git rev-parse HEAD` é igual ao SHA de `git ls-remote origin refs/heads/<branch>`.

### 8. PR
Crie com `gh pr create --base <principal>`, ou atualize o PR aberto da branch. O PR é _curto_ e _estratégico_: quem lê entende o que mudou em menos de um minuto, sem abrir o código.

- **Título:** `tipo: o que muda`, no imperativo, que faça sentido sozinho no histórico. "Corrige o bug" ou "Ajustes" não dizem nada.
- **Corpo:** este modelo, sempre, cabendo em uma tela e escrito para quem não programa. Sem dado real, segredo ou link interno, inclusive em imagens.

```markdown
## Por quê
<problema ou objetivo, em até duas frases>

## O que muda
- <até cinco itens, do ponto de vista de quem usa>

## Onde olhar
<o ponto que merece atenção; antes e depois, ou print, quando a tela mudou>

## Verificado
<o que rodou e passou; o que não foi verificado>

## Risco
<Baixo, Médio ou Alto, e por quê>
```

Termine com a linha de atribuição indicada pelo sistema. Confira `gh pr view --json files,mergeable,statusCheckRollup`.

**Pronto quando:** o PR existe e seus arquivos são exatamente os da triagem.

### 9. Entrega
Entregue o link do PR, as verificações, os itens de REVISAR mantidos, os arquivos deixados de fora, o que não foi verificado e, se os hooks estiverem inativos, o comando `guarda instalar`. Encerre dizendo que o merge é manual, no GitHub, e que a branch será limpa depois dele.

## Incidente

Pare de subir nesse repositório. Relate arquivo, linha, tipo e até onde o dado chegou, sem repetir o valor.

**Ainda só local** (`git branch -r --contains <sha>` não retorna nada): tire o dado do arquivo, use `git commit --amend` ou `git rebase` na própria branch e rode `guarda branch` até sair limpo.

**Já no GitHub:** um commit novo apagando o dado não resolve, pois ele continua no histórico.
1. Neutralize primeiro: o usuário revoga e troca a credencial, ou aciona o responsável por privacidade, no caso de dado pessoal.
2. Com pedido explícito, reescreva o histórico seguindo [Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).

**Pronto quando:** a credencial foi trocada ou o responsável foi acionado, e `guarda historico` não aponta o achado, se o histórico foi reescrito.
