# Issue tracker: Local Markdown

Store issues and specs under `.scratch/<feature-slug>/`.

- Spec: `spec.md`.
- Tickets: `issues/<NN>-<slug>.md`, numbered from `01`.
- Record triage state in a `Status:` line using `triage-labels.md`.
- Append discussion under `## Comments`.
- Publishing means creating the appropriate local file.
- Fetching a ticket means reading its referenced file.

## Wayfinding

- Map: `.scratch/<effort>/map.md`.
- Child tickets: `issues/<NN>-<slug>.md`.
- Record ticket type in `Type:`: research, prototype, grilling, or task.
- Use `Status: claimed` when starting and `Status: resolved` when finished.
- List dependencies in `Blocked by: NN, NN`.
- Start the first numbered unclaimed ticket whose blockers are resolved.
- Resolve by appending `## Answer` and adding a summary and link to the map's Decisions-so-far.
