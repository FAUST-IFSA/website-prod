// Builds the pinned autotuner (site.config.json) into dist/tool/.
// Runs after the landing-page build, which empties dist/. The checkout lives in .autotuner/ (gitignored).
// `npm ci` is required, not optional: its postinstall copies the model and WASM files into the tool's public/.
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const { base, autotuner } = JSON.parse(fs.readFileSync(path.join(root, 'site.config.json'), 'utf8'))
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
run('npm', ['exec', '--', 'vite', 'build', `--base=${base}tool/`, '--outDir', path.join(root, 'dist', 'tool'), '--emptyOutDir'])
