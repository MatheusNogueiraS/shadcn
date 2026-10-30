#!/usr/bin/env node
// Guarda do fluxo de subida: varre o que vai para o Git e impede push direto na branch principal.
// Uso: node guarda.mjs situacao | instalar | limpar | staged | branch | historico | pre-push <remote> | --self-test
// O relatório traz só arquivo, linha e tipo. O valor encontrado nunca é impresso, para não vazar no terminal ou no chat.
import assert from "node:assert/strict"
import { execFileSync, spawnSync } from "node:child_process"
import { chmodSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { homedir, tmpdir } from "node:os"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const ZERO = /^0+$/
const MIB = 1024 * 1024
const MARCADOR_FICTICIO = "dado-ficticio"
const MARCADOR_HOOK = "github-flow-hook"

const git = (...args) => execFileSync("git", ["-c", "core.quotepath=off", ...args], { encoding: "utf8", maxBuffer: 512 * MIB, stdio: ["ignore", "pipe", "pipe"] })
const tentarGit = (...args) => { try { return git(...args).trim() } catch { return "" } }

/* ---------- regras ---------- */

const NOME_BLOQUEADO = /(^|\/)([^/]*\.env(\.[^/]*)?|\.netrc|\.pgpass|id_(rsa|dsa|ecdsa|ed25519)|credentials(\.(json|ya?ml|xml|csv))?|[^/]*\.(pem|key|p12|pfx|jks|keystore|kdbx|ovpn|dump|bak))$/i
const NOME_MODELO = /\.env\.(example|sample|template|defaults|d\.ts|ts|js|mjs)$/i
const NOME_REVISAR = /\.(csv|tsv|xls|xlsx|parquet|sql|db|sqlite)$/i
const SEM_CONTEUDO = /(^|\/)(pnpm-lock\.yaml|package-lock\.json|yarn\.lock|bun\.lock)$/

const SEGREDOS = [
  ["chave AWS", /\bA(KIA|SIA)[0-9A-Z]{16}\b/],
  ["token do GitHub", /\b(gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{40,})\b/],
  ["token do Slack", /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ["chave privada", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["chave do Stripe", /\b[sr]k_live_[A-Za-z0-9]{16,}/],
  ["chave do Google", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["chave de API de IA", /\bsk-(ant-)?[A-Za-z0-9_-]{32,}\b/],
  ["JWT", /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  ["token de registro npm", /_authToken=(?!\$\{)\S+/], // dado-ficticio
  ["URL com usuário e senha", /\b[a-z][a-z0-9+.-]*:\/\/[^\s:@/'"]+:[^\s:@/'"$&{}<]{3,}@[^\s'"]+/i],
]
const SENHA_LITERAL = /(?<![a-z])(pass(word|wd)?|senha|secret|token|api[_-]?key)(_[a-z]+)?["']?\s*[:=]\s*["'][^"'\s]{8,}["']/i
const EMAIL = /\b[\w.+-]+@((?:[\w-]+\.)+[a-z]{2,})\b/gi
const EMAIL_RESERVADO = /(^|\.)(example\.(com|org|net)|exemplo\.[a-z.]+|teste?\.[a-z.]+|invalid|localhost|users\.noreply\.github\.com|anthropic\.com)$/i
const TELEFONE = /(?:\([1-9]{2}\)\s?|\b[1-9]{2}[\s-])9\d{4}-?\d{4}\b/

const digitos = (s) => s.replace(/\D/g, "")
const repetido = (d) => /^(\d)\1+$/.test(d)

function cpfValido(valor) {
  const d = digitos(valor)
  if (d.length !== 11 || repetido(d)) return false
  const dv = (n) => { let s = 0; for (let i = 0; i < n; i++) s += +d[i] * (n + 1 - i); const r = (s * 10) % 11; return r === 10 ? 0 : r }
  return dv(9) === +d[9] && dv(10) === +d[10]
}

function cnpjValido(valor) {
  const d = digitos(valor)
  if (d.length !== 14 || repetido(d)) return false
  const dv = (n) => { const pesos = n === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]; let s = 0; for (let i = 0; i < n; i++) s += +d[i] * pesos[i]; const r = s % 11; return r < 2 ? 0 : 11 - r }
  return dv(12) === +d[12] && dv(13) === +d[13]
}

function cartaoValido(valor) {
  const d = digitos(valor)
  if (d.length < 13 || d.length > 19 || repetido(d) || !/^(4|5[1-5]|2[2-7]|3[47]|6011|65)/.test(d)) return false
  let soma = 0
  for (let i = 0; i < d.length; i++) {
    let n = +d[d.length - 1 - i]
    if (i % 2 === 1) { n *= 2; if (n > 9) n -= 9 }
    soma += n
  }
  return soma % 10 === 0
}

const achaValido = (linha, regex, valida) => [...linha.matchAll(regex)].some((m) => valida(m[0]))

// Devolve os achados de uma linha: [nivel, tipo], com nivel "bloqueia" ou "revisa".
function avaliarLinha(linha) {
  if (linha.includes(MARCADOR_FICTICIO)) return []
  const achados = []
  for (const [tipo, regex] of SEGREDOS) if (regex.test(linha)) achados.push(["bloqueia", tipo])
  if (SENHA_LITERAL.test(linha)) achados.push(["revisa", "senha ou token escrito no código"])
  if (achaValido(linha, /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g, cpfValido)) achados.push(["bloqueia", "CPF válido"])
  if (achaValido(linha, /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/g, cnpjValido)) achados.push(["bloqueia", "CNPJ válido"])
  if (achaValido(linha, /(?<![\w.-])(?:\d{4}[ -]\d{4}[ -]\d{4}[ -]\d{1,7}|\d{4}[ -]\d{6}[ -]\d{5}|\d{13,19})(?![\w-])/g, cartaoValido)) achados.push(["bloqueia", "número de cartão válido"])
  if (achaValido(linha, /(?<![\w.])\d{11}(?![\w.])/g, cpfValido)) achados.push(["revisa", "possível CPF sem pontuação"])
  if (achaValido(linha, /(?<![\w.])\d{14}(?![\w.])/g, cnpjValido)) achados.push(["revisa", "possível CNPJ sem pontuação"])
  if ([...linha.matchAll(EMAIL)].some((m) => !EMAIL_RESERVADO.test(m[1]))) achados.push(["revisa", "e-mail que parece real"])
  if (TELEFONE.test(linha)) achados.push(["revisa", "telefone"])
  return achados
}

function avaliarNome(caminho) {
  if (NOME_MODELO.test(caminho)) return []
  if (NOME_BLOQUEADO.test(caminho)) return [["bloqueia", "arquivo de credencial ou backup"]]
  if (NOME_REVISAR.test(caminho)) return [["revisa", "arquivo de dados; confira se há dado real"]]
  return []
}

function avaliarTamanho(bytes) {
  if (bytes > 100 * MIB) return [["bloqueia", "maior que 100 MiB; o GitHub rejeita"]]
  if (bytes > 50 * MIB) return [["revisa", "maior que 50 MiB; o Git vai avisar"]]
  return []
}

/* ---------- leitura de diff ---------- */

// Espera um diff gerado com -U0 e --no-renames: os dois caminhos do cabeçalho são iguais.
function lerDiff(texto) {
  const arquivos = []
  let atual = null
  let linhaNova = 0
  for (const l of texto.split(/\r?\n/)) {
    if (l.startsWith("diff --git ")) {
      const resto = l.slice(11).replace(/"/g, "")
      atual = { caminho: resto.slice(2, (resto.length - 1) / 2), apagado: false, linhas: [], emBloco: false }
      arquivos.push(atual)
    } else if (!atual) continue
    else if (l.startsWith("deleted file mode")) atual.apagado = true
    else if (l.startsWith("@@ ")) { linhaNova = +l.match(/\+(\d+)/)[1]; atual.emBloco = true }
    else if (atual.emBloco && l.startsWith("+")) atual.linhas.push({ n: linhaNova++, texto: l.slice(1) })
  }
  return arquivos
}

/* ---------- varredura ---------- */

function caminhoGitleaks() {
  if (!spawnSync("gitleaks", ["version"], { stdio: "ignore" }).error) return "gitleaks"
  const pacotes = join(process.env.LOCALAPPDATA ?? join(homedir(), "AppData/Local"), "Microsoft/WinGet/Packages")
  if (!existsSync(pacotes)) return null
  const pasta = readdirSync(pacotes).find((p) => p.startsWith("Gitleaks.Gitleaks"))
  return pasta ? join(pacotes, pasta, "gitleaks.exe") : null
}

function rodarGitleaks(args, acumular) {
  const exe = caminhoGitleaks()
  if (!exe) return acumular("revisa", "gitleaks", "não instalado; só as regras próprias rodaram")
  const pasta = mkdtempSync(join(tmpdir(), "guarda-"))
  const relatorio = join(pasta, "r.json")
  try {
    const r = spawnSync(exe, ["git", ...args, "--redact", "--no-banner", "--log-level", "error", "--report-format", "json", "--report-path", relatorio], { encoding: "utf8" })
    if (r.status === 0) return
    let achados = null
    try { achados = JSON.parse(readFileSync(relatorio, "utf8")) } catch { /* sem relatório: tratado abaixo como falha */ }
    if (!achados?.length) return acumular("bloqueia", "gitleaks", "a ferramenta falhou; varredura incompleta")
    for (const a of achados) acumular("bloqueia", `${a.File}:${a.StartLine}`, `segredo (${a.RuleID})`)
  } finally {
    rmSync(pasta, { recursive: true, force: true })
  }
}

function novoRelatorio() {
  const itens = new Map()
  return {
    acumular: (nivel, onde, tipo) => itens.set(`${nivel}|${onde}|${tipo}`, { nivel, onde, tipo }),
    itens: () => [...itens.values()],
  }
}

function avaliarDiff(texto, tamanhoDe, rel) {
  for (const a of lerDiff(texto)) {
    if (a.apagado) continue
    for (const [nivel, tipo] of avaliarNome(a.caminho)) rel.acumular(nivel, a.caminho, tipo)
    for (const [nivel, tipo] of avaliarTamanho(tamanhoDe(a.caminho))) rel.acumular(nivel, a.caminho, tipo)
    if (SEM_CONTEUDO.test(a.caminho)) continue
    for (const { n, texto: linha } of a.linhas) {
      for (const [nivel, tipo] of avaliarLinha(linha)) rel.acumular(nivel, `${a.caminho}:${n}`, tipo)
    }
  }
}

const OPCOES_DIFF = ["-U0", "--no-color", "--no-ext-diff", "--no-renames", "--src-prefix=a/", "--dst-prefix=b/"]

function varrerStaged(rel) {
  avaliarDiff(git("diff", "--cached", ...OPCOES_DIFF), (c) => +(tentarGit("cat-file", "-s", `:${c}`) || 0), rel)
  rodarGitleaks(["--staged", "--pre-commit", "."], rel.acumular)
}

// Varre commit por commit: um segredo adicionado e removido depois não aparece no diff total, mas continua no histórico.
function varrerCommits(revisoes, rel) {
  const commits = git("rev-list", ...revisoes).trim().split("\n").filter(Boolean)
  for (const sha of commits) {
    avaliarDiff(git("show", "--format=", "--diff-merges=first-parent", ...OPCOES_DIFF, sha), (c) => +(tentarGit("cat-file", "-s", `${sha}:${c}`) || 0), rel)
  }
  if (commits.length) rodarGitleaks([`--log-opts=${revisoes.join(" ")}`, "."], rel.acumular)
  return commits.length
}

function imprimir(rel, resumo) {
  const itens = rel.itens()
  const bloqueios = itens.filter((i) => i.nivel === "bloqueia")
  const revisoes = itens.filter((i) => i.nivel === "revisa")
  if (bloqueios.length) {
    console.error(`BLOQUEADO (${bloqueios.length}):`)
    for (const i of bloqueios) console.error(`  ${i.onde} - ${i.tipo}`)
  }
  if (revisoes.length) {
    console.error(`REVISAR (${revisoes.length}):`)
    for (const i of revisoes) console.error(`  ${i.onde} - ${i.tipo}`)
  }
  if (!itens.length) console.error(`Varredura limpa: ${resumo}.`)
  return bloqueios.length ? 1 : 0
}

/* ---------- branch principal ---------- */

function branchesPrincipais() {
  const atual = tentarGit("symbolic-ref", "--short", "refs/remotes/origin/HEAD").replace(/^origin\//, "")
  return new Set([atual, "main", "master"].filter(Boolean))
}

function basePrincipal() {
  for (const nome of branchesPrincipais()) if (tentarGit("rev-parse", "--verify", "--quiet", `origin/${nome}`)) return `origin/${nome}`
  return null
}

function prePush(remote) {
  const principais = branchesPrincipais()
  const rel = novoRelatorio()
  let total = 0
  const entrada = readFileSync(0, "utf8").split(/\r?\n/).filter(Boolean)
  for (const linha of entrada) {
    const [, localSha, refRemota, remotoSha] = linha.split(" ")
    const nome = refRemota.replace("refs/heads/", "")
    if (principais.has(nome)) {
      const remotoVazio = ZERO.test(remotoSha) && !tentarGit("ls-remote", "--heads", remote)
      if (!remotoVazio) rel.acumular("bloqueia", nome, "push direto na branch principal; o caminho é uma branch e um PR")
    }
    if (ZERO.test(localSha)) continue
    total += varrerCommits([localSha, "--not", `--remotes=${remote}`], rel)
  }
  return imprimir(rel, `${total} commit(s)`)
}

/* ---------- limpeza de branches ---------- */

// Prova que a ponta da branch já está na principal. O ancestral não serve sozinho: depois de um squash,
// os commits da branch não fazem parte da principal, então a prova vem do PR mais o commit de merge dele.
function avaliarBranch(prs, principal, estaNaPrincipal) {
  if (!prs.length) return { manter: "sem PR" }
  if (prs.some((p) => p.state === "OPEN")) return { manter: "PR aberto" }
  const candidatos = prs.filter((p) => p.state === "MERGED" && p.baseRefName === principal && p.mergeCommit?.oid && estaNaPrincipal(p.mergeCommit.oid))
  if (!candidatos.length) return { manter: "nenhum PR mergeado que tenha chegado à principal" }
  return { provas: candidatos }
}

function prsDe(nome) {
  const falso = process.env.GUARDA_PRS_FALSO // só para o teste de ponta a ponta
  if (falso) return JSON.parse(readFileSync(falso, "utf8"))[nome] ?? []
  const r = spawnSync("gh", ["pr", "list", "--head", nome, "--state", "all", "--json", "number,state,headRefOid,baseRefName,mergeCommit"], { encoding: "utf8" })
  if (r.error || r.status !== 0) throw new Error("gh falhou")
  return JSON.parse(r.stdout)
}

function mapaDeRefs(prefixo, recorte) {
  const refs = new Map()
  for (const linha of tentarGit("for-each-ref", "--format=%(objectname) %(refname)", prefixo).split("\n").filter(Boolean)) {
    const [sha, ref] = linha.split(" ")
    refs.set(ref.slice(recorte), sha)
  }
  return refs
}

function limpar() {
  try { git("fetch", "--prune", "origin") } catch { console.error("Sem acesso ao remoto. Nenhuma branch foi apagada."); return 2 }
  tentarGit("remote", "set-head", "origin", "--auto")
  const base = basePrincipal()
  if (!base) { console.error("Branch principal não encontrada. Nenhuma branch foi apagada."); return 2 }
  const principal = base.replace("origin/", "")
  const protegidas = branchesPrincipais()
  const locais = mapaDeRefs("refs/heads", "refs/heads/".length)
  const remotas = mapaDeRefs("refs/remotes/origin", "refs/remotes/origin/".length)
  remotas.delete("HEAD")
  const estaNaPrincipal = (sha) => spawnSync("git", ["merge-base", "--is-ancestor", sha, base]).status === 0
  const sujo = () => Boolean(tentarGit("status", "--porcelain"))
  const motivo = (e) => e.stderr?.toString().trim().split("\n")[0] || e.message

  for (const nome of new Set([...locais.keys(), ...remotas.keys()])) {
    if (protegidas.has(nome)) continue
    let prs
    try { prs = prsDe(nome) } catch { console.error(`Mantida: ${nome} (não foi possível consultar os PRs)`); continue }
    const { manter, provas } = avaliarBranch(prs, principal, estaNaPrincipal)
    if (manter) { console.error(`Mantida: ${nome} (${manter})`); continue }
    const provaDe = (sha) => provas.find((p) => p.headRefOid === sha)

    // Cada ponta é conferida separadamente: commit novo depois do merge é trabalho que ainda não está na principal.
    const local = locais.get(nome)
    if (local) {
      if (!provaDe(local)) console.error(`Mantida: ${nome} local (tem commits depois do merge)`)
      else if (tentarGit("branch", "--show-current") === nome && sujo()) console.error(`Mantida: ${nome} local (alterações não commitadas)`)
      else {
        try {
          if (tentarGit("branch", "--show-current") === nome) { git("switch", principal); git("pull", "--ff-only") }
          git("branch", "-D", nome)
          console.error(`Apagada: ${nome} local (PR #${provaDe(local).number} já está na ${principal})`)
        } catch (e) { console.error(`Mantida: ${nome} local (${motivo(e)})`) }
      }
    }
    const remota = remotas.get(nome)
    if (remota) {
      if (!provaDe(remota)) console.error(`Mantida: ${nome} remota (tem commits depois do merge)`)
      else {
        try {
          git("push", "origin", "--delete", nome)
          console.error(`Apagada: ${nome} remota (PR #${provaDe(remota).number} já está na ${principal})`)
        } catch (e) { console.error(`Mantida: ${nome} remota (${motivo(e)})`) }
      }
    }
  }
  if (tentarGit("branch", "--show-current") === principal) { try { git("pull", "--ff-only") } catch { console.error(`A ${principal} local não pôde ser atualizada.`) } }
  return 0
}

/* ---------- instalação ---------- */

// Confere o que o fluxo precisa. O que falta vem com a instrução, para quem acabou de baixar o repositório.
function situacao() {
  const faltando = []
  if (spawnSync("git", ["--version"], { stdio: "ignore" }).error) faltando.push("git: instale em https://git-scm.com/downloads")
  if (spawnSync("gh", ["--version"], { stdio: "ignore" }).error) faltando.push("GitHub CLI: instale em https://cli.github.com")
  else if (spawnSync("gh", ["auth", "status"], { stdio: "ignore" }).status !== 0) faltando.push("GitHub CLI sem login: rode gh auth login")
  if (!tentarGit("rev-parse", "--is-inside-work-tree")) faltando.push("repositório: rode este comando dentro de um repositório Git")
  else if (!tentarGit("remote", "get-url", "origin")) faltando.push("remoto: este repositório não tem um remoto chamado origin")
  for (const f of faltando) console.error(`FALTA  ${f}`)

  const pasta = tentarGit("rev-parse", "--git-path", "hooks")
  const ativo = (nome) => Boolean(pasta) && existsSync(join(pasta, nome)) && readFileSync(join(pasta, nome), "utf8").includes(MARCADOR_HOOK)
  console.error(`Hooks: ${ativo("pre-commit") && ativo("pre-push") ? "ativos" : "inativos (opcional: guarda instalar)"}.`)
  console.error(`gitleaks: ${caminhoGitleaks() ? "disponível" : "ausente (opcional, recomendado: https://github.com/gitleaks/gitleaks#installing)"}.`)
  return faltando.length ? 1 : 0
}

function instalar() {
  const topo = tentarGit("rev-parse", "--show-toplevel")
  if (!topo) { console.error("Rode este comando dentro de um repositório Git. Nada foi instalado."); return 2 }
  const proprio = relative(topo, fileURLToPath(import.meta.url)).replace(/\\/g, "/")
  if (tentarGit("config", "--get", "core.hooksPath")) {
    console.error("Este repositório usa core.hooksPath. Nada foi instalado: integre a guarda aos hooks dele.")
    return 2
  }
  const pasta = tentarGit("rev-parse", "--git-path", "hooks")
  const hooks = { "pre-commit": "staged", "pre-push": 'pre-push "$1"' }
  let conflito = false
  for (const [nome, comando] of Object.entries(hooks)) {
    const destino = join(pasta, nome)
    if (existsSync(destino) && !readFileSync(destino, "utf8").includes(MARCADOR_HOOK)) {
      console.error(`Já existe um ${nome} que não é desta guarda. Mantido como está.`)
      conflito = true
      continue
    }
    // Caminho relativo à raiz: resiste a mover a pasta. Em branch sem o script, avisa em vez de impedir todo commit.
    writeFileSync(destino, `#!/bin/sh\n# ${MARCADOR_HOOK}: gerado pela skill github-flow\nguarda="$(git rev-parse --show-toplevel)/${proprio}"\nif [ -f "$guarda" ]; then\n  exec node "$guarda" ${comando}\nfi\necho "github-flow: guarda.mjs não existe nesta branch; ${nome} sem varredura." >&2\n`)
    chmodSync(destino, 0o755)
  }
  if (conflito) return 2
  console.error(`Hooks ativos: pre-commit e pre-push. gitleaks: ${caminhoGitleaks() ? "disponível" : "ausente"}.`)
  return 0
}

/* ---------- autoteste ---------- */

function autoteste() {
  const niveis = (l) => avaliarLinha(l).map(([n, t]) => `${n}:${t}`)
  // Valores montados em tempo de execução, para o próprio arquivo não parecer um vazamento.
  const aws = "AKIA" + "ABCDEFGHIJKLMNOP"
  const gh = "ghp_" + "a".repeat(36)
  assert.deepEqual(niveis(`key=${aws}`), ["bloqueia:chave AWS"])
  assert.deepEqual(niveis(`t="${gh}"`), ["bloqueia:token do GitHub"])
  assert.ok(niveis("-----BEGIN RSA " + "PRIVATE KEY-----")[0].includes("chave privada"))
  assert.ok(niveis("postgres://admin:s3nh4forte@db.interno:5432/app")[0].includes("URL com usuário")) // dado-ficticio
  assert.deepEqual(niveis('url: "postgres://localhost:5432/app"'), [])
  assert.deepEqual(niveis('const senha = "hunter2hunter2"'), ["revisa:senha ou token escrito no código"]) // dado-ficticio
  assert.deepEqual(niveis('senha: process.env.SENHA'), [])
  assert.deepEqual(niveis('DB_PASSWORD="hunter2hunter2"'), ["revisa:senha ou token escrito no código"]) // dado-ficticio
  assert.deepEqual(niveis('AWS_SECRET_KEY = "hunter2hunter2"'), ["revisa:senha ou token escrito no código"]) // dado-ficticio

  assert.ok(cpfValido("529.982.247-25")) // dado-ficticio
  assert.ok(!cpfValido("529.982.247-24"))
  assert.ok(!cpfValido("000.000.000-00"))
  assert.deepEqual(niveis("cpf 529.982.247-25"), ["bloqueia:CPF válido"]) // dado-ficticio
  assert.deepEqual(niveis("cpf 529.982.247-24"), [])
  assert.deepEqual(niveis("id 52998224725"), ["revisa:possível CPF sem pontuação"]) // dado-ficticio
  assert.ok(cnpjValido("11.222.333/0001-81")) // dado-ficticio
  assert.ok(!cnpjValido("11.222.333/0001-80"))
  assert.deepEqual(niveis("cnpj 11.222.333/0001-81"), ["bloqueia:CNPJ válido"]) // dado-ficticio

  assert.ok(cartaoValido("4111 1111 1111 1111")) // dado-ficticio
  assert.ok(!cartaoValido("4111 1111 1111 1112"))
  assert.deepEqual(niveis("cartão 4111 1111 1111 1111"), ["bloqueia:número de cartão válido"]) // dado-ficticio
  assert.deepEqual(niveis('placeholder="0000 0000 0000 0000"'), [])
  assert.deepEqual(niveis("M12 19 5 12 7 8 9 10 11 12 13 14 15"), [])
  assert.deepEqual(niveis("R$ 1.250,00 e 12.480,00"), [])
  assert.deepEqual(niveis("cartão 4111 1111 1111 1111 // dado-ficticio"), [])

  assert.deepEqual(niveis("ana@exemplo.com noreply@anthropic.com 1+a@users.noreply.github.com"), [])
  assert.deepEqual(niveis("contato: ana.souza@gmail.com"), ["revisa:e-mail que parece real"]) // dado-ficticio
  assert.deepEqual(niveis("(11) 98765-4321"), ["revisa:telefone"]) // dado-ficticio
  assert.deepEqual(niveis("(11)98765-4321"), ["revisa:telefone"]) // dado-ficticio

  assert.deepEqual(avaliarNome(".env.local"), [["bloqueia", "arquivo de credencial ou backup"]])
  assert.deepEqual(avaliarNome("config/.env"), [["bloqueia", "arquivo de credencial ou backup"]])
  assert.deepEqual(avaliarNome(".env.example"), [])
  assert.equal(avaliarNome("prod.env")[0][0], "bloqueia")
  assert.deepEqual(avaliarNome("src/env.ts"), [])
  assert.deepEqual(avaliarNome("src/app.env.ts"), [])
  assert.deepEqual(avaliarNome("certs/servidor.pem"), [["bloqueia", "arquivo de credencial ou backup"]])
  assert.deepEqual(avaliarNome("src/components/credentials.tsx"), [])
  assert.deepEqual(avaliarNome("id_rsa.pub"), [])
  assert.equal(avaliarNome("clientes.csv")[0][0], "revisa")
  assert.deepEqual(avaliarTamanho(10 * MIB), [])
  assert.equal(avaliarTamanho(60 * MIB)[0][0], "revisa")
  assert.equal(avaliarTamanho(101 * MIB)[0][0], "bloqueia")

  const diff = ["diff --git a/pasta com espaço/x.ts b/pasta com espaço/x.ts", "index 1..2 100644", "--- a/pasta com espaço/x.ts", "+++ b/pasta com espaço/x.ts", "@@ -1,0 +5,2 @@", "+um", "+dois", "diff --git a/y.ts b/y.ts", "deleted file mode 100644", "--- a/y.ts", "+++ /dev/null", "@@ -1 +0,0 @@", "-tchau"].join("\n")
  const [a, b] = lerDiff(diff)
  assert.equal(a.caminho, "pasta com espaço/x.ts")
  assert.deepEqual(a.linhas, [{ n: 5, texto: "um" }, { n: 6, texto: "dois" }])
  assert.ok(b.apagado)
  assert.deepEqual(b.linhas, [])

  const pr = (o) => ({ number: 1, state: "MERGED", baseRefName: "main", headRefOid: "abc", mergeCommit: { oid: "m1" }, ...o })
  const sim = () => true
  const nao = () => false
  assert.ok(avaliarBranch([], "main", sim).manter)
  assert.ok(avaliarBranch([pr({ state: "OPEN", mergeCommit: null })], "main", sim).manter)
  assert.ok(avaliarBranch([pr({ state: "CLOSED", mergeCommit: null })], "main", sim).manter)
  assert.ok(avaliarBranch([pr()], "main", nao).manter, "o commit de merge precisa estar na principal")
  assert.ok(avaliarBranch([pr({ baseRefName: "develop" })], "main", sim).manter, "mergeado em outra base não conta")
  assert.ok(avaliarBranch([pr(), pr({ state: "OPEN", mergeCommit: null })], "main", sim).manter, "PR aberto na mesma branch mantém")
  assert.equal(avaliarBranch([pr()], "main", sim).provas.length, 1)
  console.error("Autoteste ok.")
  return 0
}

/* ---------- entrada ---------- */

process.on("uncaughtException", (e) => { console.error(`Não foi possível concluir: ${e.stderr?.toString().trim() || e.message}`); process.exit(1) })

const [modo, argumento] = process.argv.slice(2)
let saida
if (modo === "--self-test") saida = autoteste()
else if (modo === "instalar") saida = instalar()
else if (modo === "situacao") saida = situacao()
else if (modo === "limpar") saida = limpar()
else if (modo === "historico") { const rel = novoRelatorio(); const total = varrerCommits(["--all"], rel); saida = imprimir(rel, `${total} commit(s) do histórico`) }
else if (modo === "staged") { const rel = novoRelatorio(); varrerStaged(rel); saida = imprimir(rel, "alterações preparadas") }
else if (modo === "branch") {
  const rel = novoRelatorio()
  const base = basePrincipal()
  const total = varrerCommits(base ? ["HEAD", "--not", base] : ["HEAD"], rel)
  saida = imprimir(rel, `${total} commit(s) desta branch`)
} else if (modo === "pre-push") saida = prePush(argumento ?? "origin")
else { console.error("Uso: guarda.mjs situacao | instalar | limpar | staged | branch | historico | pre-push <remote> | --self-test"); saida = 2 }
process.exit(saida)
