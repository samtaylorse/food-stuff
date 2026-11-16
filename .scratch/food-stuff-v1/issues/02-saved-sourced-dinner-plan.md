# 02: Create and reopen a sourced dinner plan

**What to build:** A runnable local planner that displays a saved dinner week with identifiable sourced recipes, concise bullet previews and correct household coverage. Establish the smallest complete UI-to-durable-storage path that later tickets extend.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Use the selected TypeScript, React Router Framework SPA/Vite, Fastify, SQLite, Tailwind and limited shadcn/ui architecture. Prefer the latest stable dependency versions available when implementing, verify compatibility and pin reproducible versions. Use an older version only for a concrete documented compatibility or stability reason. Provide documented start, build and test commands.
- [ ] Create and reopen a week using controlled, source-backed examples with original links, attribution, base yield, ingredients and bullet method previews. Keep this initial controlled data explicit; it is not the final discovery catalog and contains no generated recipes or copied articles/photos.
- [ ] Centralize the initial two-person, two-recipe, six-individual-portions configuration, snapshot it with the week, and calculate household dinners and leftover portions correctly for default and non-default values. Do not assign weekdays or add a settings page.
- [ ] Save stable week/meal/recipe identities and immutable base recipe versions with local migrations. Reload and application restart restore the saved week.
- [ ] Construct the application separately from listening; startup owns binding and shutdown. Validate explicit private paths, host/port, application origin and callback settings. Bind to loopback and enforce appropriate Host/Origin checks.
- [ ] Serve built assets and HTTP operations from one local origin with a development proxy. Supported UI deep links reload correctly; API/auth errors retain their status instead of returning the SPA shell. Build-time shell rendering does not require browser globals or private runtime data.
- [ ] Establish public-workflow tests using real isolated SQLite and a small Playwright Chromium suite with controlled data, automatic server startup, isolated browser state and useful failure traces. Verify saved content, restart/reload and configuration coverage without live credentials.
- [ ] Keep credentials, databases, photos and runtime exports out of Git and ordinary logs. Verify the rendered basic flow with supported agent browser tools and record actual checks and limitations.
