# FAUST STUDIO WEBSITE PRODUCTION REPOSITORY

This is the repo for both teams Berlin and Paris. This repo is eventually going to get linked to our vercel. 



## Development

Landing page: Vite + React + TypeScript. The autotuner is built from a pinned commit into `dist/tool/`.

```bash
npm install
npm run dev       # landing page only: http://localhost:5173/website-prod/
npm run build     # landing page + pinned autotuner -> dist/ and dist/tool/
npm run preview   # serve dist/ at http://localhost:4173/website-prod/ (tool at /website-prod/tool/)
npm run lint
```

`site.config.json` is the only place for:

- `base`: the URL path the site is served under. `/website-prod/` for GitHub Pages; `/` for Vercel or a custom domain.
- `noindex`: `true` adds `<meta name="robots" content="noindex, nofollow">` to the landing page and the tool, because
  this is a client demo. Set it to `false` for production. (There's deliberately no robots.txt `Disallow`: it would
  stop crawlers from ever seeing the noindex tag.)
- `autotuner.commit`: the autotuner commit to ship (full SHA, currently from branch `aidan/pitch-engine`). To ship a
  new tool version, change only this.

`npm run build` fetches that commit into `.autotuner/` (gitignored), runs `npm ci` there (its postinstall copies the
model and WASM files), and builds it with `--base=<base>tool/`. `FAUST-IFSA/autotuner` is public, so no credentials
are needed.

Deploys: `.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main` (or run it by
hand from the Actions tab). It needs Settings → Pages → Source set to "GitHub Actions".
