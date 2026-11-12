// Builds the pinned autotuner (site.config.json) into dist/tool/.
// Runs after the landing-page build, which empties dist/. The checkout lives in .autotuner/ (gitignored).
// `npm ci` is required, not optional: its postinstall copies the model and WASM files into the tool's public/.
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { build, loadEnv } from 'vite'

const root = path.resolve(import.meta.dirname, '..')
const { base, noindex, autotuner, signupEndpoint } = JSON.parse(fs.readFileSync(path.join(root, 'site.config.json'), 'utf8'))
const src = path.join(root, '.autotuner')
const stamp = path.join(src, 'node_modules', '.installed-commit')

const run = (cmd, args) => execFileSync(cmd, args, { cwd: src, stdio: 'inherit' })
const read = (file) => (fs.existsSync(file) ? fs.readFileSync(file, 'utf8').trim() : null)

if (!fs.existsSync(path.join(src, '.git'))) {
  fs.mkdirSync(src, { recursive: true })
  run('git', ['init', '-q'])
}
// Empty on a fresh `git init` (no HEAD yet).
const head = spawnSync('git', ['rev-parse', '--verify', '-q', 'HEAD'], { cwd: src, encoding: 'utf8' }).stdout.trim()
if (head !== autotuner.commit) {
  run('git', ['fetch', '--depth', '1', autotuner.repo, autotuner.commit])
  run('git', ['checkout', '-q', '--force', 'FETCH_HEAD'])
}
// npm ci wipes node_modules, so the stamp only survives a completed install of this commit.
if (read(stamp) !== autotuner.commit) {
  run('npm', ['ci'])
  fs.writeFileSync(stamp, autotuner.commit)
}
const outDir = path.join(root, 'dist', 'tool')
run('npm', ['exec', '--', 'vite', 'build', `--base=${base}tool/`, '--outDir', outDir, '--emptyOutDir'])

// Client demo: keep search engines out of the tool page too (the landing page links to it). We can't change the
// tool's repo, so the tag goes into its built HTML. Set "noindex": false in site.config.json for production.
if (noindex) {
  const html = path.join(outDir, 'index.html')
  const parts = fs.readFileSync(html, 'utf8').split('<head>')
  if (parts.length !== 2) throw new Error(`noindex: expected exactly one <head> in ${html}, found ${parts.length - 1}`)
  fs.writeFileSync(html, parts.join('<head>\n    <meta name="robots" content="noindex, nofollow" />'))
}

// Export email gate (docs/email-gate-spec.md): src/gate.ts is built here as one classic script (its CSS inlined)
// into dist/assets/, next to the landing page's files so both pages share the same Jost font files, and injected
// into the tool's page, like the noindex tag. It finds the tool's Export button by this selector, the gate's only tie
// to the tool's code (src/components/ExportBar.tsx there). The gate fails open at runtime, so a renamed class
// would silently lose the gate: fail the build instead.
const EXPORT_BUTTON = '.export-menu > button.primary'
const assets = path.join(outDir, 'assets')
const toolJs = fs.readdirSync(assets).filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(path.join(assets, f), 'utf8'))
for (const [, name] of EXPORT_BUTTON.matchAll(/\.([\w-]+)/g)) {
  if (!toolJs.some((js) => new RegExp(`["'\`]${name}["'\`]`).test(js))) {
    throw new Error(
      `export gate: the tool at ${autotuner.commit} no longer has the class "${name}" that the gate's selector ` +
        `"${EXPORT_BUTTON}" relies on. Find the Export button in .autotuner/src/components/ and update EXPORT_BUTTON ` +
        'in scripts/build-tool.mjs, then re-test the gate on preview.',
    )
  }
}
const gate = await build({
  root,
  base,
  configFile: false,
  logLevel: 'warn',
  define: {
    __EXPORT_BUTTON__: JSON.stringify(EXPORT_BUTTON),
    // The same value, and the same VITE_SIGNUP_ENDPOINT override, as the landing page gets in vite.config.ts.
    'import.meta.env.SIGNUP_ENDPOINT': JSON.stringify(loadEnv('production', root, 'VITE_').VITE_SIGNUP_ENDPOINT || signupEndpoint),
  },
  build: {
    outDir: path.join(root, 'dist'),
    emptyOutDir: false,
    rollupOptions: {
      input: path.join(root, 'src', 'gate.ts'),
      output: { format: 'iife', entryFileNames: 'assets/gate-[hash].js' },
    },
  },
})
{
  const html = path.join(outDir, 'index.html')
  const parts = fs.readFileSync(html, 'utf8').split('</head>')
  if (parts.length !== 2) throw new Error(`export gate: expected exactly one </head> in ${html}, found ${parts.length - 1}`)
  const tag = `  <script defer src="${base}${gate.output[0].fileName}"></script>\n  `
  fs.writeFileSync(html, parts.join(`${tag}</head>`))
}
