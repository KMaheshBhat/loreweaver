# LoreWeaver

## goal

Implement a local, single-player MVP of LoreWeaver as a thick desktop client that shifts text-roleplaying away from simple "glorified autocomplete" chatbots into a deterministic, state-driven simulation engine. 

### core pillars

1. **Orchestrator Workflow over Agents:** Rely on a deterministic, centralized code loop rather than stochastic, agent-led coordination to resolve turns, manage timelines, and enforce world mechanics without structural drift.
2. **Causality Accounting:** Enforce a strict separation between hard mathematical mechanics (entity stats, inventories, positioning) and soft linguistic lore. Game rules must be immutable and audit-logged, while narrative layers adapt around them.
3. **The "Bubble of Play" Simulation:** Treat player and non-player entities under a unified operational framework. The game engine simulates actions and updates world states locally within the active narrative or spatial zone, choosing when to open the floor to user input or delegate to automated character personas.
4. **Heuristic Context Control:** Actively prune, bound, and structure instructions dynamically based on current narrative weight to prevent long-term attention dilution and maintain a coherent, persistent world model.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
