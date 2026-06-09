function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isUserIdea(card) {
  return card && !String(card.id).startsWith("pre_");
}

function buildExportLogoPlaceholder() {
  // Placeholder — swap the <span> for an <img> when the logo asset is ready:
  // <img src="implement-logo.png" alt="Implement" class="export-logo-img" />
  return `<div class="export-logo-placeholder" aria-hidden="true">
    <span class="export-logo-text">IM_</span>
  </div>`;
}

function getExportMatrix(matrixData, stepId) {
  const m = matrixData[stepId] || { pool: [], placed: [] };
  const placedIds = new Set(m.placed.map((c) => c.id));
  const userPool = m.pool.filter((c) => !placedIds.has(c.id) && isUserIdea(c));
  return {
    placed: m.placed,
    userPool,
    allIdeas: [...m.placed, ...userPool],
  };
}

function buildPlaybookHtml(matrixData, teamName, steps) {
  const dateLabel = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).toUpperCase();
  const safeTeam = escapeHtml(teamName || "Team");

  const coverPhases = steps.map((step, i) => {
    const m = getExportMatrix(matrixData, step.id);
    const count = m.allIdeas.length;
    const starred = m.placed.filter((c) => c.starred).length;
    const border = i > 0 ? "border-left:1px solid #30373B;padding-left:20px;" : "";
    return `<div style="flex:1;${border}">
      <div style="font-family:Arial,sans-serif;font-size:8px;letter-spacing:2px;color:${step.color};text-transform:uppercase;margin-bottom:4px;">${escapeHtml(step.number)}</div>
      <div style="font-family:Arial,sans-serif;font-size:10px;color:#F8F5E7;margin-bottom:6px;line-height:1.3;">${escapeHtml(step.title)}</div>
      <div style="font-family:Arial,sans-serif;font-size:9px;color:#A8A5A1;">${count} ideas · ${starred} starred</div>
    </div>`;
  }).join("");

  const allStarred = steps.flatMap((step) => {
    const m = getExportMatrix(matrixData, step.id);
    return m.placed.filter((c) => c.starred).map((c) => ({ ...c, step }));
  });

  const starredSection = allStarred.length === 0 ? "" : `
    <div style="page-break-inside:avoid;page-break-after:always;margin-bottom:48px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <span style="font-size:16px;color:#C8973A;">★</span>
        <h2 style="font-family:Georgia,serif;font-size:22px;font-weight:500;margin:0;">Priority Ideas</h2>
        <span style="font-family:monospace;font-size:9px;letter-spacing:2px;color:#6B655A;">TOP PICKS ACROSS ALL PHASES</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;">
        ${allStarred.map((card) => `
          <div style="background:#FFFBEB;border:1.5px solid #C8973A;border-radius:6px;padding:14px 16px;border-top:3px solid ${card.step.color};page-break-inside:avoid;">
            <div style="font-family:monospace;font-size:8px;letter-spacing:2px;color:${card.step.color};margin-bottom:6px;font-weight:600;">${escapeHtml(card.step.number)} · ${escapeHtml(card.step.title.toUpperCase())}</div>
            <div style="font-size:13px;font-weight:600;margin-bottom:6px;line-height:1.3;">${escapeHtml(card.headline)}</div>
            ${card.desc ? `<div style="font-size:11px;color:#6B655A;line-height:1.5;">${escapeHtml(card.desc)}</div>` : ""}
            <div style="margin-top:10px;display:flex;gap:14px;">
              <span style="font-family:monospace;font-size:8px;color:#6B655A;">IMPACT <strong style="color:${card.step.color};">${Math.round(card.iy * 10)}/10</strong></span>
              <span style="font-family:monospace;font-size:8px;color:#6B655A;">FEASIBILITY <strong style="color:${card.step.color};">${Math.round(card.ix * 10)}/10</strong></span>
            </div>
          </div>
        `).join("")}
      </div>
    </div>`;

  const phaseSections = steps.map((step, si) => {
    const m = getExportMatrix(matrixData, step.id);
    const pageBreak = si > 0 ? "page-break-before:always;padding-top:25.4mm;" : "";
    const timing = step.timingContext ? escapeHtml(step.timingContext.toUpperCase()) : "";

    if (m.allIdeas.length === 0) {
      return `<div style="${pageBreak}margin-bottom:48px;">
        <div style="border-left:4px solid ${step.color};padding-left:16px;margin-bottom:24px;">
          <div style="font-family:monospace;font-size:9px;letter-spacing:2.5px;color:${step.color};font-weight:600;margin-bottom:3px;">PHASE ${escapeHtml(step.number)}</div>
          <h2 style="font-family:Georgia,serif;font-size:24px;font-weight:500;margin:0 0 2px 0;">${escapeHtml(step.title)}</h2>
          <div style="font-family:monospace;font-size:9px;color:#6B655A;letter-spacing:1px;">${timing}</div>
        </div>
        <div style="font-size:12px;color:#A8A5A1;font-style:italic;padding-left:20px;">No ideas captured for this phase.</div>
      </div>`;
    }

    const starredRows = m.placed.filter((c) => c.starred).map((card) => `
      <div style="display:flex;gap:14px;align-items:flex-start;background:#FFFBEB;border:1px solid #C8973A55;border-radius:4px;padding:10px 14px;margin-bottom:8px;page-break-inside:avoid;">
        <span style="color:#C8973A;font-size:13px;">★</span>
        <div style="flex:1;">
          <div style="font-size:13px;font-weight:600;margin-bottom:3px;">${escapeHtml(card.headline)}</div>
          ${card.desc ? `<div style="font-size:12px;color:#6B655A;line-height:1.5;">${escapeHtml(card.desc)}</div>` : ""}
        </div>
        <div style="text-align:right;padding-left:12px;">
          <div style="font-family:monospace;font-size:8px;color:#6B655A;">IMPACT <strong style="color:${step.color};">${Math.round(card.iy * 10)}/10</strong></div>
          <div style="font-family:monospace;font-size:8px;color:#6B655A;">FEASIBILITY <strong style="color:${step.color};">${Math.round(card.ix * 10)}/10</strong></div>
        </div>
      </div>
    `).join("");

    const tableRows = m.allIdeas.map((card, idx) => {
      const placed = m.placed.find((p) => p.id === card.id);
      const bg = idx % 2 === 0 ? "white" : "#FAFAF7";
      return `<tr style="border-bottom:1px solid #E8E3D8;background:${bg};">
        <td style="padding:7px 8px 7px 0;font-weight:600;vertical-align:top;line-height:1.3;">${escapeHtml(card.headline)}</td>
        <td style="padding:7px 8px;color:#6B655A;line-height:1.4;vertical-align:top;">${card.desc ? escapeHtml(card.desc) : "<span style='color:#C4BFBA;font-style:italic;'>—</span>"}</td>
        <td style="padding:7px 8px;text-align:center;vertical-align:top;">${placed ? `<span style="font-family:monospace;font-size:9px;font-weight:700;color:${step.color};">${Math.round(placed.iy * 10)}/10</span>` : "<span style='color:#C4BFBA;font-size:9px;'>—</span>"}</td>
        <td style="padding:7px 8px;text-align:center;vertical-align:top;">${placed ? `<span style="font-family:monospace;font-size:9px;font-weight:700;color:${step.color};">${Math.round(placed.ix * 10)}/10</span>` : "<span style='color:#C4BFBA;font-size:9px;'>—</span>"}</td>
        <td style="padding:7px 0 7px 8px;text-align:center;vertical-align:top;"><span style="color:${card.starred ? "#C8973A" : "#C4BFBA"};font-size:12px;">${card.starred ? "★" : "☆"}</span></td>
      </tr>`;
    }).join("");

    return `<div style="${pageBreak}margin-bottom:48px;">
      <div style="border-left:4px solid ${step.color};padding-left:16px;margin-bottom:24px;">
        <div style="font-family:monospace;font-size:9px;letter-spacing:2.5px;color:${step.color};font-weight:600;margin-bottom:3px;">PHASE ${escapeHtml(step.number)}</div>
        <h2 style="font-family:Georgia,serif;font-size:24px;font-weight:500;margin:0 0 2px 0;">${escapeHtml(step.title)}</h2>
        <div style="font-family:monospace;font-size:9px;color:#6B655A;letter-spacing:1px;">${timing}</div>
      </div>
      ${starredRows ? `<div style="margin-bottom:20px;page-break-inside:avoid;">
        <div style="font-family:monospace;font-size:9px;letter-spacing:2px;color:#C8973A;margin-bottom:10px;font-weight:600;">★ PRIORITY IDEAS</div>
        ${starredRows}
      </div>` : ""}
      <div style="margin-bottom:32px;">
        <div style="font-family:monospace;font-size:9px;letter-spacing:2px;color:#6B655A;margin-bottom:10px;font-weight:600;">ALL IDEAS (${m.allIdeas.length})</div>
        <table style="width:100%;border-collapse:collapse;font-size:11px;">
          <thead>
            <tr style="border-bottom:2px solid ${step.color};">
              <th style="font-family:monospace;font-size:8px;letter-spacing:1.5px;color:${step.color};font-weight:600;padding:6px 8px 8px 0;text-align:left;width:25%;">HEADLINE</th>
              <th style="font-family:monospace;font-size:8px;letter-spacing:1.5px;color:${step.color};font-weight:600;padding:6px 8px;text-align:left;">DESCRIPTION</th>
              <th style="font-family:monospace;font-size:8px;letter-spacing:1.5px;color:${step.color};font-weight:600;padding:6px 8px;text-align:center;width:60px;">IMPACT</th>
              <th style="font-family:monospace;font-size:8px;letter-spacing:1.5px;color:${step.color};font-weight:600;padding:6px 8px;text-align:center;width:72px;">FEASIBILITY</th>
              <th style="font-family:monospace;font-size:8px;letter-spacing:1.5px;color:#C8973A;font-weight:600;padding:6px 0 8px 8px;text-align:center;width:56px;">STARRED</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
    </div>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>The Augmented Consultant Game — Brainstorm Export</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; background: white; color: #1A1814; font-family: Inter, system-ui, sans-serif; }
  @page { margin: 12mm; size: A4; }
  .export-logo-placeholder {
    position: fixed;
    top: 12mm;
    right: 2mm;
    z-index: 1000;
    pointer-events: none;
    overflow: visible;
  }
  .export-logo-text,
  .export-logo-img {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: rotate(90deg);
    transform-origin: top right;
    white-space: nowrap;
  }
  .export-logo-text {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -1px;
    color: #1A1814;
    line-height: 1;
  }
  .export-logo-img {
    max-height: 64px;
    width: auto;
  }
</style>
</head>
<body>
  ${buildExportLogoPlaceholder()}
  <div style="page-break-after:always;page-break-inside:avoid;background:#1F1F23;display:flex;flex-direction:column;justify-content:space-between;min-height:240mm;padding:25.4mm;position:relative;">
    <div style="position:absolute;top:0;right:0;width:6px;height:100%;background:#67817F;"></div>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
      <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;color:#A8A5A1;text-transform:uppercase;">Implement Consulting Group_</div>
      <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;color:#A8A5A1;">${dateLabel}</div>
    </div>
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
      <div style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;color:#67817F;text-transform:uppercase;margin-bottom:24px;">The AI-powered Financial Year Finale</div>
      <h1 style="font-family:Palatino Linotype,Palatino,serif;font-size:52px;font-weight:400;color:#F8F5E7;margin:0 0 16px 0;line-height:1.1;">The Augmented<br/>Consultant Game</h1>
      <div style="width:48px;height:2px;background:#67817F;margin:24px 0;"></div>
      <div style="font-family:Palatino Linotype,Palatino,serif;font-size:22px;font-weight:400;color:#B9C7C2;font-style:italic;margin-bottom:8px;">${safeTeam}</div>
      <div style="font-family:Arial,sans-serif;font-size:12px;color:#A8A5A1;letter-spacing:1px;">NordicFoods Network 2030 · AI Brainstorm</div>
    </div>
    <div style="display:flex;gap:0;border-top:1px solid #30373B;padding-top:24px;">${coverPhases}</div>
  </div>
  <div style="padding:25.4mm 25.4mm 0 25.4mm;">
    ${starredSection}
    ${phaseSections}
  </div>
  <div style="margin:32px 25.4mm 25.4mm 25.4mm;padding-top:16px;border-top:1px solid #B9C7C2;display:flex;justify-content:space-between;align-items:center;">
    <div style="font-family:Arial,sans-serif;font-size:8px;color:#A8A5A1;letter-spacing:2px;text-transform:uppercase;">Implement Consulting Group_</div>
    <div style="font-family:Arial,sans-serif;font-size:8px;color:#A8A5A1;letter-spacing:1.5px;text-transform:uppercase;">${safeTeam}</div>
  </div>
</body>
</html>`;
}

function printPlaybookExport(matrixData, teamName, steps) {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
    document.body.appendChild(iframe);

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      iframe.remove();
      resolve();
    };

    const fail = (error) => {
      if (settled) return;
      settled = true;
      iframe.remove();
      reject(error);
    };

    const fallback = setTimeout(finish, 15000);

    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(buildPlaybookHtml(matrixData, teamName, steps));
      doc.close();

      const win = iframe.contentWindow;
      let printed = false;
      const runPrint = () => {
        if (printed) return;
        printed = true;
        try {
          win.focus();
          win.print();
        } catch (error) {
          clearTimeout(fallback);
          fail(error);
        }
      };

      win.addEventListener("afterprint", () => {
        clearTimeout(fallback);
        finish();
      }, { once: true });

      iframe.addEventListener("load", () => setTimeout(runPrint, 0), { once: true });
      setTimeout(runPrint, 300);
    } catch (error) {
      clearTimeout(fallback);
      fail(error);
    }
  });
}
