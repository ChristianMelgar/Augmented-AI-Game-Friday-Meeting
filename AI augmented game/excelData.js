// ─── EXCEL EXPORTS ───────────────────────────────────────────────────────────
// Workbooks live in assets/excel/ (not embedded base64). Requires HTTP serving
// (e.g. Vercel, or `npx serve .` locally) — file:// won't load assets via fetch.

const EXCEL_FILES = {
  phase1: { path: "assets/excel/nordicfoods_phase1_hypothesis.xlsx", filename: "nordicfoods_phase1_hypothesis.xlsx" },
  phase2: { path: "assets/excel/nordicfoods_phase2_factpack.xlsx", filename: "nordicfoods_phase2_factpack.xlsx" },
  phase3: { path: "assets/excel/nordicfoods_phase3_scenarios.xlsx", filename: "nordicfoods_phase3_scenarios.xlsx" },
  phase4: { path: "assets/excel/nordicfoods_phase4_landing.xlsx", filename: "nordicfoods_phase4_landing.xlsx" },
};

async function downloadExcel(assetPath, filename) {
  const res = await fetch(assetPath);
  if (!res.ok) throw new Error(`Could not load ${filename}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadExcelPhase(phase) {
  const { path, filename } = EXCEL_FILES[phase];
  return downloadExcel(path, filename).catch(() => {
    window.alert("Download failed. If you're opening the page as a file, run a local server (e.g. npx serve .) or deploy to Vercel.");
  });
}

function downloadPhase1Excel() { return downloadExcelPhase("phase1"); }
function downloadPhase2Excel() { return downloadExcelPhase("phase2"); }
function downloadPhase3Excel() { return downloadExcelPhase("phase3"); }
function downloadPhase4Excel() { return downloadExcelPhase("phase4"); }
