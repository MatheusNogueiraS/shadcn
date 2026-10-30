// Teste de ponta a ponta da guarda em um repositório descartável com remoto local.
// Uso: node guarda.e2e.mjs <caminho do guarda.mjs> <pasta de trabalho vazia, fora do repositório>
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { copyFileSync, mkdirSync, renameSync, writeFileSync, readFileSync, existsSync } from "node:fs"
import { delimiter, join } from "node:path"

const [guarda, raiz] = process.argv.slice(2)
const remoto = join(raiz, "remoto.git")
const repo = join(raiz, "repo")
mkdirSync(raiz, { recursive: true })
const run = (cwd, cmd, ...args) => spawnSync(cmd, args, { cwd, encoding: "utf8" })
const git = (...args) => run(repo, "git", "-c", "user.name=Teste", "-c", "user.email=1+teste@users.noreply.github.com", ...args)
const ok = (r, nome) => { assert.equal(r.status, 0, `${nome}: ${r.stderr}`); console.log(`ok    ${nome}`) }
const barrado = (r, nome, trecho) => { assert.notEqual(r.status, 0, `${nome}: deveria ter sido barrado`); if (trecho) assert.ok((r.stderr + r.stdout).includes(trecho), `${nome}: ${r.stderr}`); console.log(`ok    ${nome} (barrado)`) }
const arquivo = (nome, conteudo) => { mkdirSync(join(repo, nome, ".."), { recursive: true }); writeFileSync(join(repo, nome), conteudo) }

ok(run(raiz, "git", "init", "--bare", "-b", "main", remoto), "cria remoto")
ok(run(raiz, "git", "init", "-b", "main", repo), "cria repositório")
ok(git("remote", "add", "origin", remoto), "liga remoto")
// O hook procura o script dentro do próprio repositório, como no uso real.
const pastaLocal = join(repo, ".claude/skills/github-flow/scripts")
mkdirSync(pastaLocal, { recursive: true })
const guardaLocal = join(pastaLocal, "guarda.mjs")
copyFileSync(guarda, guardaLocal)
ok(run(repo, "node", guardaLocal, "instalar"), "instala hooks")
ok(run(repo, "node", guardaLocal, "instalar"), "reinstalar não quebra")
assert.ok(readFileSync(join(repo, ".git/hooks/pre-push"), "utf8").includes("github-flow-hook"))

arquivo("README.md", "# Projeto\n")
ok(git("add", "README.md"), "prepara readme")
ok(git("commit", "-m", "chore: inicia"), "commit limpo passa")
ok(git("push", "-u", "origin", "main"), "primeira publicação da main em remoto vazio passa")

arquivo("README.md", "# Projeto\n\nmudança\n")
ok(git("add", "README.md"), "prepara mudança")
ok(git("commit", "-m", "docs: muda"), "commit na main local")
barrado(git("push", "origin", "main"), "push direto na main", "push direto na branch principal")
ok(git("reset", "--hard", "origin/main"), "desfaz commit local")

ok(git("switch", "-c", "feat/teste"), "cria branch")
arquivo("a.ts", "export const a = 1\n")
ok(git("add", "a.ts"), "prepara a.ts")
ok(git("commit", "-m", "feat: a"), "commit na branch")
ok(git("push", "-u", "origin", "feat/teste"), "push da branch passa")

const aws = "AKIA" + "QWERTYUIOPASDFGH"
arquivo("b.ts", `export const k = "${aws}"\n`)
ok(git("add", "b.ts"), "prepara segredo")
const r1 = git("commit", "-m", "feat: b")
barrado(r1, "commit com chave AWS", "chave AWS")
assert.ok(!(r1.stderr + r1.stdout).includes(aws), "o relatório não pode conter o valor do segredo")
console.log("ok    relatório não expõe o segredo")
ok(git("reset", "-q", "HEAD", "b.ts"), "tira do preparo")
arquivo("b.ts", "export const b = 2\n")

arquivo("clientes.ts", 'export const c = { cpf: "529.982.247-25" }\n') // dado-ficticio
ok(git("add", "clientes.ts"), "prepara CPF")
const r2 = git("commit", "-m", "feat: clientes")
barrado(r2, "commit com CPF válido", "CPF válido")
assert.ok(!(r2.stderr + r2.stdout).includes("529.982.247-25"), "o relatório não pode conter o CPF") // dado-ficticio
console.log("ok    relatório não expõe o CPF")
arquivo("clientes.ts", 'export const c = { cpf: "529.982.247-25" } // dado-ficticio\n')
ok(git("add", "clientes.ts"), "prepara CPF marcado")
ok(git("commit", "-m", "test: dado fictício"), "CPF marcado como fictício passa")

arquivo(".env", "SEGREDO=1\n")
ok(git("add", ".env"), "prepara .env")
barrado(git("commit", "-m", "chore: env"), "commit de .env", "arquivo de credencial")
ok(git("config", "diff.noprefix", "true"), "liga diff.noprefix")
barrado(git("commit", "-m", "chore: env"), "commit de .env com diff.noprefix", "arquivo de credencial")
ok(git("config", "--unset", "diff.noprefix"), "desliga diff.noprefix")
ok(git("rm", "-q", "--cached", ".env"), "tira .env do preparo")

// Um segredo adicionado e removido depois: o diff total fica limpo, mas ele continua no histórico.
ok(git("switch", "-q", "-c", "feat/historico"), "branch de histórico")
arquivo("c.ts", `export const k = "${aws}"\n`)
ok(git("add", "c.ts"), "prepara segredo temporário")
ok(git("commit", "--no-verify", "-m", "feat: engano"), "simula commit que escapou do hook")
arquivo("c.ts", "export const k = process.env.K\n")
ok(git("add", "c.ts"), "prepara correção")
ok(git("commit", "-m", "fix: remove"), "commit que apaga o segredo")
barrado(git("push", "origin", "feat/historico"), "push com segredo no meio do histórico", "chave AWS")
barrado(run(repo, "node", guarda, "branch"), "guarda branch vê o histórico", "chave AWS")

barrado(git("push", "origin", "--delete", "main"), "apagar a main remota", "push direto na branch principal")

// Branch sem o script (a main antes do merge, por exemplo): avisa, sem travar o commit.
renameSync(guardaLocal, `${guardaLocal}.fora`)
arquivo("sem-guarda.txt", "ok\n")
ok(git("add", "sem-guarda.txt"), "prepara arquivo sem guarda")
const semGuarda = git("commit", "-m", "chore: sem guarda")
ok(semGuarda, "commit passa sem o script")
assert.ok(semGuarda.stderr.includes("não existe nesta branch"), semGuarda.stderr)
console.log("ok    avisa quando a branch não tem o script")
renameSync(`${guardaLocal}.fora`, guardaLocal)

const foraRepo = run(raiz, "node", guarda, "instalar")
assert.equal(foraRepo.status, 2)
assert.ok(!existsSync(join(raiz, "pre-commit")))
console.log("ok    instalar fora de repositório não cria nada")
barrado(run(raiz, "node", guarda, "historico"), "varredura fora de repositório não se diz limpa", "Não foi possível concluir")

const repo2 = join(raiz, "outro")
ok(run(raiz, "git", "init", "-b", "main", repo2), "repositório com hook próprio")
writeFileSync(join(repo2, ".git/hooks/pre-commit"), "#!/bin/sh\nexit 0\n")
const r3 = run(repo2, "node", guarda, "instalar")
assert.equal(r3.status, 2)
assert.equal(readFileSync(join(repo2, ".git/hooks/pre-commit"), "utf8"), "#!/bin/sh\nexit 0\n")
console.log("ok    hook de terceiros não é sobrescrito")
assert.ok(existsSync(join(repo, ".git/hooks/pre-commit")))
console.log("\nTudo passou.")

/* ---------- limpeza de branches ---------- */
{
  const raizL = join(raiz, "limpeza")
  const remotoL = join(raizL, "remoto.git")
  const repoL = join(raizL, "repo")
  mkdirSync(raizL, { recursive: true })
  const g = (...args) => run(repoL, "git", "-c", "user.name=Teste", "-c", "user.email=1+teste@users.noreply.github.com", ...args)
  const sha = (ref) => g("rev-parse", ref).stdout.trim()
  const salvar = (nome, texto) => writeFileSync(join(repoL, nome), texto)
  const commit = (nome, texto, msg) => { salvar(nome, texto); g("add", nome); assert.equal(g("commit", "-q", "-m", msg).status, 0, msg) }
  const refExiste = (ref) => g("show-ref", "--verify", "--quiet", ref).status === 0
  const remotaExiste = (b) => g("ls-remote", "--heads", "origin", b).stdout.trim() !== ""

  assert.equal(run(raizL, "git", "init", "--bare", "-b", "main", remotoL).status, 0)
  assert.equal(run(raizL, "git", "init", "-b", "main", repoL).status, 0)
  g("remote", "add", "origin", remotoL)
  commit("base.txt", "base\n", "chore: base")
  g("push", "-q", "-u", "origin", "main")
  g("remote", "set-head", "origin", "main")

  const nova = (b, arq) => { g("switch", "-q", "-c", b, "main"); commit(arq, `${b}\n`, `feat: ${b}`); g("push", "-q", "-u", "origin", b) }
  // Squash: o conteúdo entra na main em um commit novo, e a branch não vira ancestral dela.
  const squash = (b, arq) => { const ponta = sha(b); g("switch", "-q", "main"); commit(arq, `${b}\n`, `feat: ${b} (squash)`); g("push", "-q", "origin", "main"); return { ponta, merge: sha("HEAD") } }

  nova("feat/mergeada", "a.txt")
  const a = squash("feat/mergeada", "a.txt")
  nova("feat/commit-depois", "b.txt")
  const b = squash("feat/commit-depois", "b.txt")
  g("switch", "-q", "feat/commit-depois"); commit("b2.txt", "novo\n", "feat: trabalho novo"); g("switch", "-q", "main")
  nova("feat/sem-pr", "c.txt")
  nova("feat/aberta", "d.txt")
  const pontaAberta = sha("feat/aberta")
  nova("feat/fechada", "e.txt")
  const pontaFechada = sha("feat/fechada")
  nova("feat/fora-da-main", "f.txt")
  const pontaFora = sha("feat/fora-da-main")
  nova("feat/atual", "g.txt")
  const atual = squash("feat/atual", "g.txt")
  g("switch", "-q", "feat/atual")

  const merged = (ponta, merge) => ({ number: 1, state: "MERGED", baseRefName: "main", headRefOid: ponta, mergeCommit: { oid: merge } })
  const fixture = join(raizL, "prs.json")
  writeFileSync(fixture, JSON.stringify({
    "feat/mergeada": [merged(a.ponta, a.merge)],
    "feat/commit-depois": [merged(b.ponta, b.merge)],
    "feat/aberta": [{ number: 2, state: "OPEN", baseRefName: "main", headRefOid: pontaAberta, mergeCommit: null }],
    "feat/fechada": [{ number: 3, state: "CLOSED", baseRefName: "main", headRefOid: pontaFechada, mergeCommit: null }],
    "feat/fora-da-main": [merged(pontaFora, pontaFora)],
    "feat/atual": [merged(atual.ponta, atual.merge)],
  }))
  const r = spawnSync("node", [guarda, "limpar"], { cwd: repoL, encoding: "utf8", env: { ...process.env, GUARDA_PRS_FALSO: fixture } })
  assert.equal(r.status, 0, r.stderr)
  console.log(r.stderr.trim().split("\n").map((l) => `      ${l}`).join("\n"))

  assert.ok(!refExiste("refs/heads/feat/mergeada") && !remotaExiste("feat/mergeada"), "mergeada some dos dois lados")
  console.log("ok    branch mergeada por squash é apagada, local e remota")
  assert.ok(refExiste("refs/heads/feat/commit-depois"), "commit novo depois do merge fica")
  assert.ok(!remotaExiste("feat/commit-depois"), "a remota, igual à do PR, some")
  console.log("ok    commit feito depois do merge não se perde")
  for (const manter of ["feat/sem-pr", "feat/aberta", "feat/fechada", "feat/fora-da-main"]) assert.ok(refExiste(`refs/heads/${manter}`) && remotaExiste(manter), `${manter} precisa ficar`)
  console.log("ok    sem PR, PR aberto, PR fechado e merge fora da main são mantidas")
  assert.ok(refExiste("refs/heads/main") && remotaExiste("main"))
  console.log("ok    main intacta")
  assert.ok(!refExiste("refs/heads/feat/atual"))
  assert.equal(g("branch", "--show-current").stdout.trim(), "main")
  console.log("ok    branch atual mergeada: volta para a main e apaga")

  // gh indisponível, com git funcionando: nada pode ser apagado.
  const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => k.toLowerCase() !== "path" && k !== "GUARDA_PRS_FALSO"))
  env.PATH = (process.env.PATH ?? process.env.Path).split(delimiter).filter((d) => !existsSync(join(d, "gh.exe")) && !existsSync(join(d, "gh"))).join(delimiter)
  const semGh = spawnSync("node", [guarda, "limpar"], { cwd: repoL, encoding: "utf8", env })
  assert.equal(semGh.status, 0, semGh.stderr)
  assert.ok(semGh.stderr.includes("Mantida: feat/sem-pr (não foi possível consultar os PRs)"), semGh.stderr)
  assert.ok(refExiste("refs/heads/feat/sem-pr"))
  console.log("ok    sem gh, nenhuma branch é apagada")
  console.log("\nLimpeza passou.")
}
