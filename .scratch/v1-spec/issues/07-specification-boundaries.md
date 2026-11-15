# Architecture boundaries and specification readiness

Type: grilling
Status: resolved
Resolved by: final synthesis and user-confirmed build order, November 14, 2026
Parent: ../map.md
Blocked by: 01, 02, 03, 04, 05, 08, 09, 10, 11

## Answer

[Implementation specification](../../food-stuff-v1/spec.md) consolidates the accepted product decisions, stored-record invariants, module interfaces, source/AI constraints, local approval export, desktop result handling, recovery, privacy and acceptance evidence.

The technical plan is one TypeScript repository, React/Vite, a local Fastify server and SQLite through better-sqlite3. The user subsequently confirmed Tailwind CSS plus a small set of shadcn/ui components on November 14, 2026, replacing the initial plain-CSS preference. On November 15, after reviewing the framework research, the user confirmed React Router Framework mode with Vite in SPA configuration. Fastify remains the single local HTTP server for private data, callbacks and inference; route client loaders/actions call its shared workflow. No runtime HTML rendering or full-stack server replacement is selected. These choices are not a claim of a tested dependency installation. Precise compatible releases will be pinned when implementation starts; official references are linked in the specification.

After clarification of what a complete planner through an approved shopping list includes, the user confirmed this build order: implement sourced meals, independent alternatives, extras, stock capture/corrections, editable shopping and durable list approval first; then connect the separate desktop shopping skill; then try one real week. Both planner and shopping remain V1. The specification contains the finer-grained implementation slices. No production implementation or deployment has started.

The preliminary cart trial remains deferred. Automated extraction, real cart quantities/fees/reconciliation and phone connectivity remain explicit implementation verification obligations. The spec does not report them as proven.

The planning destination is reached: major product decisions, local architecture, data and integration contracts, build order and acceptance checks are recorded. Further work is implementation and validation rather than another planning gate unless new evidence exposes a genuine product decision.

## Question

Given the source, quantity, interaction, and cart findings, what minimal component boundaries, persistence records, and acceptance scenarios make V1 ready to implement?

Choose a simple local architecture consistent with the validated subscription flow and approved handoff. Distinguish sources, scaled selections, stock observations, approvals, and cart results. Define failures and evidence for one real week. Capture agreed specification and explicit limitations without building the app or converting decisions into implementation tickets.
