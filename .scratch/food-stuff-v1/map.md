# Food Stuff V1 implementation

Type: map
Status: claimed

## Destination

Implement the [canonical specification](spec.md) through the approved numbered [tickets](issues/). This map records completed implementation decisions; it does not replace the specification or alter ticket scope/dependencies.

## Decisions so far

- [01: Shopping handoff contract](issues/01-shopping-handoff-contract.md): version 1 binds exact approval content and run identity, preserves quantity and cost uncertainty, and defines immutable file projections plus stale-safe import. Ordinary shared TypeScript validators and synthetic examples support independent producers/consumers. Detailed cart reconciliation stays in issue 09 and transactional application import in issue 08. All fast tests use Vitest with separate typechecking; Playwright Test remains for future browser regressions.
