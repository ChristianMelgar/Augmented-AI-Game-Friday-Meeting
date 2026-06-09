# The Augmented Consultant Game

A browser-based workshop game for the **Implement AI Learning Lab**. Teams work through a fictional NordicFoods operations strategy engagement in four phases — from project initiation to landing the recommendation with the client — while brainstorming how AI could augment each step of a real consulting workflow.

No build step: React runs in the browser via Babel standalone and CDN scripts.

---

## How the game works

1. **Setup** — Players enter a team name on the welcome screen.
2. **Gameboard** — A visual map of four phases. Hover a phase for a short guide; click to open it.
3. **Phase detail** — Each phase has tabs for context, deliverables, and downloadable materials (in-app data previews plus Excel workbooks).
4. **Brainstorm overlay** — A full-screen priority matrix where teams drag AI-augmentation ideas onto a 2×2 grid, add their own ideas, and star up to three top picks per phase.
5. **Progress** — Completing a phase's brainstorm advances the team to the next phase (with a completion chime).
6. **Finish** — After all four phases, a summary screen shows starred ideas and new ideas added.
7. **Export** — At any time after setup, teams can export an **AI Playbook** (print-ready HTML → Save as PDF) from the top nav or finish screen.

The case background (NordicFoods network optimisation) is available from the **Case** button in the top nav.

---

## File structure

```
.
├── index.html                  # Shell: CDN imports, root div, script load order
├── styles.css                  # Global styles
├── README.md                   # This file
├── facilitatorNotes.md         # Workshop copy for facilitators (not shown in the app)
├── Office new year.png         # Background image (referenced by URL, not embedded)
│
├── data.js                     # React hooks alias + OPS_DATA, PL_DATA, SCENARIO_CRITERIA, SITE_REF
├── excelData.js                # fetch-based Excel downloads from assets/excel/
├── stepsConfig.js              # STEPS array — phase titles, copy, positions, deliverables
├── helpers.js                  # renderIcon(), buildPath(), cornerStyle()
├── components.jsx              # CopyButton, DataTab, Phase1–4Data (in-app data previews)
├── initialMatrixData.js        # Pre-filled brainstorm idea pool per phase
├── playbookExport.js           # AI Playbook print/PDF export (plain JS, not Babel)
│
├── phase1ProjectInitiation.js    # Phase 1 materials intro copy
├── phase2FactPack.js           # Phase 2 materials intro copy
├── phase3Analysis.js           # Phase 3 materials intro copy
├── phase4ClientLanding.js      # Phase 4 materials intro copy
│
├── SetupScreen.jsx             # Team name entry
├── TopNav.jsx                  # Header, case modal trigger, export, finish
├── Gameboard.jsx               # Phase map and hover guide
├── PhaseDetailPage.jsx         # Phase tabs (context / deliverables / data)
├── BrainstormOverlay.jsx       # Priority matrix brainstorm UI
├── FinishScreen.jsx            # End-of-game summary and confetti
├── CaseModal.jsx               # NordicFoods case background
├── App.jsx                     # State and composition (~240 lines)
├── main.jsx                    # ReactDOM.createRoot(...).render(<App/>)
│
└── assets/
    └── excel/                  # One workbook per phase (downloaded via fetch)
        ├── nordicfoods_phase1_hypothesis.xlsx
        ├── nordicfoods_phase2_factpack.xlsx
        ├── nordicfoods_phase3_scenarios.xlsx
        └── nordicfoods_phase4_landing.xlsx
```

---

## How it runs

Scripts load in dependency order via `index.html`. Each `.jsx` / `.js` file (except `playbookExport.js`) uses:

```html
<script type="text/babel" src="<file>"></script>
```

Babel transpiles in the browser. All files share one global script scope — e.g. `STEPS` from `stepsConfig.js` is visible in `App.jsx` without imports.

**Load order matters.** `index.html` already lists files correctly; if you add a file, place it before anything that depends on it.

`playbookExport.js` is plain JavaScript (no Babel) and exposes `printPlaybookExport()` globally.

---

## How to run locally

Because the app loads scripts and assets via `src` / `fetch`, you cannot open `index.html` directly from the filesystem (`file://` blocks cross-file requests). Serve the folder over HTTP:

```bash
# Python
python -m http.server 8000

# Node
npx serve .

# or any static file server
```

Then open `http://localhost:8000`.

Excel downloads and the background image require HTTP serving. If a download fails, the app will prompt you to use a local server.

---

## Editing content

| What you want to change | Where to edit |
|-------------------------|---------------|
| Phase titles, timing, deliverables, situation copy | `stepsConfig.js` |
| In-app data tables and previews | `components.jsx`, `data.js` |
| Pre-filled brainstorm ideas | `initialMatrixData.js` |
| Phase materials intro text | `phase1ProjectInitiation.js` … `phase4ClientLanding.js` |
| Excel workbooks | `assets/excel/` (update paths in `excelData.js` if filenames change) |
| Facilitator timing, seeds, “wow the client” examples | `facilitatorNotes.md` (not read by the app) |
| Export / playbook layout | `playbookExport.js` |

---

## Developing in Cursor

1. Open this folder in Cursor.
2. Edit any `.jsx`, `.js`, or `.css` file.
3. Save and refresh the browser — Babel re-transpiles on every load.

To migrate to a bundler later (e.g. Vite with ES modules), convert script tags to `import`/`export`. The current setup stays zero-config and deployment-friendly for static hosting.

---

## Deployment

The project is static — deploy the entire folder to any static host (e.g. Vercel, Netlify, GitHub Pages). Ensure `assets/excel/` and `Office new year.png` are included in the deploy.
