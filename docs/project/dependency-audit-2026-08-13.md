# Dependency Audit: 2026-08-13

## Scope

This audit used a clean checkout of committed `HEAD` at `2ff47cc` and its
committed `package-lock.json`. The pre-existing dirty local lockfile was not
used as evidence and was not modified. `npm audit` reported:

- 20 findings: 2 low, 4 moderate, 14 high
- 0 critical findings
- 12 findings remained in an `npm ci --omit=dev` audit

`npm audit --omit=dev` still reports packages from the Tailwind chain because
`tailwindcss-animate` is currently listed under `dependencies`, even though it
is used by `tailwind.config.ts` during the build. This is an installation
classification issue, not evidence that the Tailwind toolchain is shipped in
the browser bundle.

## Findings and exposure

| Package/path | Severity | Classification | Assessment |
| --- | --- | --- | --- |
| `react-router-dom` -> `react-router` -> `@remix-run/router` | high | direct browser runtime | Actionable. The app uses `BrowserRouter`, `Routes`, `Route`, and `useLocation`; upgrade within React Router v6 before treating the preview as final. The audit fix boundary is `react-router-dom` `6.30.4`. |
| `recharts` -> `lodash` | high | transitive; browser-capable but not currently confirmed in bundle | Recharts is imported by `src/components/ui/chart.tsx`, but no application source currently imports that chart component. The audit flags Lodash code-injection/prototype-pollution behavior. Confirm bundle inclusion before remediation; do not force an override blindly. |
| `recharts` -> `react-smooth` -> `@babel/runtime` | moderate | transitive; browser-capable but not currently confirmed in bundle | The advisory concerns generated-code RegExp complexity. Review with the Recharts upgrade decision after confirming whether the unused chart component is retained. |
| `postcss`, `nanoid`, `picomatch`, `glob`, `minimatch`, `brace-expansion`, `yaml` | moderate/high | build/configuration chain | Not browser code. These are pulled through Tailwind/PostCSS configuration, including the incorrectly production-classified `tailwindcss-animate` chain. Move `tailwindcss-animate` to `devDependencies` in a clean lockfile update. |
| `vite`, `esbuild`, `rollup` | high/moderate | build-only | Not shipped in `dist/`. Upgrade Vite within a controlled toolchain change; the audit requires Vite beyond the affected `5.x`/`6.4.2` ranges. |
| `eslint`, `@eslint/plugin-kit`, `ajv`, `flatted`, `js-yaml` | low/high/moderate | lint/build-only | Not shipped in `dist/`. Upgrade as a separate lint-tool batch; no production runtime impact. |

## Recommended order

1. Upgrade `react-router-dom` to `6.30.4` or later within v6, regenerate the
   lockfile in a clean worktree, and test direct navigation, links, and SPA
   fallback.
2. Move `tailwindcss-animate` from `dependencies` to `devDependencies`, then
   regenerate the lockfile cleanly. This removes the Tailwind/PostCSS chain
   from production installation; it does not eliminate the need to keep build
   tooling patched.
3. Upgrade `postcss` to the current compatible 8.x release and Vite to a
   patched supported line, currently at least `6.4.3` per the audit ranges.
   Re-run the Worker build and preview parity checks.
4. Review Recharts separately. A Recharts major upgrade may change chart APIs;
   do not apply it as an automatic audit fix. If the chart component remains
   unused by the public page, removing that unused dependency is a safer
   architectural option than an untested major upgrade.
5. Batch-upgrade ESLint, TypeScript ESLint, Tailwind, and related build tools
   only after the runtime dependency review. Keep each batch build-verified.

No `npm audit fix` or dependency upgrade was run. The existing static output is
not server-executing these Node-side tools, but the React Router findings still
deserve priority because routing code is part of the browser bundle.
