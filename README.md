**PaintCalc** — Productivity Tools for Painting Calculations

An interactive suite of tools to accurately calculate paint quantities, costs, and time for any project. Built as a clean, modular JavaScript application using ES modules to demonstrate real-world code organization.

### Features
- Multi-surface area calculator (walls, ceilings, trim)
- Smart paint coverage & can estimator (with waste factor)
- Detailed cost & labor time projections
- Project dashboard with multiple rooms/surfaces
- Local project saving & export
- All calculations powered by dedicated modules

### Live Demo
https://bennettwellsnet.github.io/paintcalc/

### Why Modules?
The entire calculator logic is split into focused, reusable ES modules (geometry, coverage, cost, time, project management, UI, storage). This makes the code maintainable, testable, and easy to extend — exactly how you'd structure a real productivity tool.

### Tech
- Pure static site (no build step)
- Tailwind CSS via CDN
- Modern ES modules (import/export)
- Fully client-side

---

Built following the same pattern as [spacexdemo](https://github.com/bennettwellsnet/spacexdemo) and [patio](https://github.com/bennettwellsnet/patio).