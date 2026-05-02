# AGENTS.md

Codex entrypoint for `orchestra-canvas-tokyo/homepage`.

## First Read

- Human-facing setup and maintenance notes: `README.md`
- Agent-facing repo guidance: `CLAUDE.md`
- Current application source: `src/`
- GitHub automation: `.github/workflows/`

## Working Rules

- Keep repo-specific implementation and maintenance facts in `CLAUDE.md`.
- Keep user-facing operational details in `README.md`.
- Treat PR and issue comments as evidence. Promote only reusable knowledge into repo docs.
- Do not add a local `.codex/skills/` workflow for a one-off task. Add a skill only after the same workflow repeats and cannot be described cleanly in `CLAUDE.md`.
- Ignore local `.codex` and `.serena` artifacts; they are not part of normal repo changes.

## Common Close-Out

- For application or dependency changes, run the narrowest useful local validation first, then broaden to `npm run check`, `npm run lint`, `npm run test`, and `npm run build` when risk warrants it.
- For documentation-only changes, `npm run lint:prettier` is usually enough.
- When publishing a branch, summarize the changed scope, validation, and any known pre-existing warnings.
