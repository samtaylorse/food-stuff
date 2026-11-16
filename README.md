# Food Stuff

A personal meal-planning tool, starting with dinners, for choosing practical meals and turning them into recipes, shopping lists, and reviewable delivery carts.

Planned capabilities:

- Flexible weekly batch recipes with clear quantities and cooking steps.
- Pantry, fridge, and freezer photos that distinguish observations from confirmed stock.
- Natural-language meal changes that keep unaffected recipes and shopping lists consistent.
- Saved favourite recipes for reuse.
- Grocery-store price comparison and cart preparation for review before checkout.

See the [project brief](docs/PROJECT_BRIEF.md) for the agreed scope and requirements.

The standalone [shopping handoff contract](docs/shopping-handoff.md) provides versioned approval/result validation and synthetic examples. Use a compatible Node version from `package.json`, `npm ci`, and `npm run verify`. Unit and filesystem integration tests are separately runnable; typechecking remains separate from test execution. The planner and desktop shopping skill are not implemented yet, so browser E2E coverage belongs to the planner task.
