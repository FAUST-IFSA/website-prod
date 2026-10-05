# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

There is no application code yet. The repo holds only planning docs: `README.md`, `TODO.md`, and `PROJ-DESC.md`. There are no build, lint, or test commands. Once a framework is scaffolded, add its commands here.

The `.gitignore` is the standard Next.js template, and the README says the repo will be deployed on Vercel. Next.js is likely, but nobody has confirmed it. Check with the user before scaffolding anything.

## What this project is

This repo is the marketing website for a **web-based vocal autotune tool** made for Faust Studio, a recording studio in Prague (client site: https://www.fauststudio.net/). A separate team builds the autotune tool itself, so it is **not** in this repo. This team owns how the tool is positioned and promoted.

Deliverables (from `PROJ-DESC.md`):
- Competitive review of similar tools
- Landing page for the autotune tool
- Marketing strategy
- An AI agent or marketing automation that carries out one of the strategy's ideas
- QA/UX testing, documentation, and recommendations for future work

Business goal: send visitors to the free autotune tool, then turn its users into paying customers by upselling music courses, studio time, and other Faust Studio products. The tool requires email signup. Those emails are collected in one central place for later marketing, which is the main input to the automation deliverable.

## Team and ownership

- Two teams (Berlin and Paris) share this repo.
- Inside this workspace, work is split across four roles: pm, programmer, researcher, and designer. The pm writes requirements and acceptance criteria. Code goes to the programmer, and visual and UX decisions go to the designer.

## Open decisions (see `TODO.md`)

- Domain
- Color scheme
- Design philosophy for the site
- Not yet specified: where the collected signup emails are stored, and how this site links to the separately hosted autotune tool. The automation and signup work depends on both.
