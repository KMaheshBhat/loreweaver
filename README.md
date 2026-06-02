# LoreWeaver

**LoreWeaver** is a high-fidelity, local-first **Narrative Engine** and **Simulation Harness**. It is designed to reconcile complex timelines and world states into a unified "Temporal Loom," shifting the focus of AI-assisted roleplaying from stochastic chat-logs to **Deterministic Causality Accounting**.

## 🎯 Project Goal

Implement a local, single-player MVP of LoreWeaver as a **thick desktop client** that shifts text-roleplaying away from simple "glorified autocomplete" chatbots into a **deterministic, state-driven simulation engine**.

### Core Pillars

1.  **Orchestrator Workflow over Agents:** Rely on a deterministic, centralized code loop (the **System of Engagement**) rather than stochastic, agent-led coordination to resolve turns and enforce world mechanics without structural drift.
2.  **Causality Accounting:** Enforce a strict separation between **hard mathematical mechanics** (entity stats, inventories) and **soft linguistic lore**. Game rules remain immutable and audit-logged, while narrative layers (the **System of Synthesis**) adapt around them.
3.  **The "Bubble of Play" Simulation:** Treat player and non-player entities ('C') under a unified operational framework. The engine simulates actions locally within an active narrative or spatial zone, choosing when to open the floor for user input or delegate to automated personas.
4.  **Heuristic Context Control:** Actively prune and structure instructions dynamically—the **"Dynamic Camera Lens"**—based on genre and narrative weight to prevent attention dilution and maintain a coherent world model.

## 🏗️ System Architecture

LoreWeaver follows a **Hexagonal (Ports & Adapters)** architecture to ensure complete engine agnosticism and portability.

*   **System of Experience (SoX):** A high-density, spatial interface (the **"Cyberpunk Ledger"**) optimized for widescreen desktop displays using **JetBrainsMono Nerd Font**.
*   **System of Engagement (SoE):** The headless execution core (`src/engine/`) that manages the in-memory **Central State Ledger** and orchestrates the turn lifecycle.
*   **System of Record (SoR):** The **"Lore Keeper"** persistence layer. It utilizes a hybrid of human-readable **Markdown + YAML** for soft lore and **SQLite** for high-speed deterministic indexing.
*   **System of Synthesis (SoS):** An isolated boundary for text-generation providers (e.g., llama-server), transforming mechanical state into contextual prose within engine-provided guardrails.

## 🗺️ Spatial Layout & Narrative Flow

The interface rejects the standard vertical chat stream in favor of a **6-column horizontal pipeline** mapped to the **Motivation $\rightarrow$ Specification $\rightarrow$ Gratification** psychological triad.

1.  **Chrome Selector:** Global application state and mode controller (Weaver, Keeper, Settings).
2.  **Collapsed Upstream:** Pending jobs and pre-compiled prompt segments.
3.  **Context (Motivation):** Injected lore keys, world rules, and prompt context payload previews.
4.  **The Weave & Forge (Specification):** The active prose canvas (The Weave) and the command deck for turn forging (The Forge).
5.  **Causality (Gratification):** Real-time telemetry of database mutations, SQLite state hierarchies, and causal branch tracking.
6.  **Collapsed Downstream:** Background post-processing and long-term archival exports.

## 🛠️ Tech Stack

*   **Runtime:** [Electron](https://www.electronjs.org/) (Main process as Game Master, Renderer as Viewport).
*   **Frontend:** [React](https://react.dev/) + [Vite](https://vitejs.dev/) + [TailwindCSS v4](https://tailwindcss.com/).
*   **Language:** [TypeScript](https://www.typescriptlang.org/) (Universally typed across IPC boundaries).
*   **Database:** [SQLite](https://sqlite.org/) (High-speed relational indexing).
*   **Typography:** [JetBrainsMono Nerd Font](https://www.nerdfonts.com/font-downloads).

## 🚀 Recommended IDE Setup

*   **Editor:** [VSCode](https://code.visualstudio.com/) (or [Zed](https://zed.dev/))
*   **Extensions:** ESLint, Prettier, Tailwind CSS IntelliSense

## 📦 Project Setup

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
# For Windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

---

*“The matrix doesn't hide its gears; it lets you watch the data solidify right inside the columns.”*
