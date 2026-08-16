# Creative Direction v1 — Prototype Lab (disposable)

This directory is a disposable testing laboratory for
`docs/design/laltrospazio-creative-experience-direction-v1.md`. It is not
production code, not wired into `src/`, has no build step, and depends on no
framework or new package. Open `index.html` directly in a browser (no server
required — all paths are relative).

Findings, changes, and recommendations are written up in
`docs/design/laltrospazio-creative-prototype-test-v1.md`. This directory
should be considered evidence attached to that document, not a deliverable in
its own right, and is expected to be deleted or archived once its findings
have been absorbed into the creative direction and later phases.

## Structure

- `shared/tokens.css` — three palette hypotheses (`[data-palette="1|2|3"]`)
- `shared/type.css` — three typography systems (`[data-type="1|2|3"]`)
- `shared/base.css` — layout primitives, focus states, reduced-motion handling
- `shared/lab.js` — palette/type switcher (prototype-only, not a production feature)
- `study-1-current-archive/` through `study-5-relationship/` — the five studies
- `index.html` — lab home

## What these are not

Not a Figma spec, not final type/color decisions, not a component library,
not an accessibility audit of the eventual production site (though each
study follows the accessibility baseline set for this test: semantic HTML,
keyboard support, visible focus, sufficient contrast, reduced-motion support,
no color-only distinctions, alt text where images carry meaning).
