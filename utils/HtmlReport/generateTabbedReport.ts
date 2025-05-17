import fs from 'fs';


type ViewportResult = {
  name: string;
  diffPixels: number;
  expectedImage: string;
  actualImage: string;
  diffImage: string;
};

export function generateHtmlReport({
  outputDir,
  reportPath,
  pageName = 'Paystation',
  viewports
}: {
  outputDir: string;
  reportPath: string;
  pageName?: string;
  viewports: ViewportResult[];
}) {
  const tabs = viewports.map((vp, i) => `
    <button class="tab-button${i === 0 ? ' active' : ''}" onclick="showTab('${vp.name}', this)">
      ${vp.name}
    </button>
  `).join('');

  const contents = viewports.map((vp, i) => `
    <div id="${vp.name}" class="tab-content${i === 0 ? ' active' : ''}">
      <div class="summary"><strong>Diff Pixels:</strong> ${vp.diffPixels}</div>
      <div class="grid">
        <div class="grid-column"><h3>Expected (Figma)</h3><img src="${vp.expectedImage}" /></div>
        <div class="grid-column"><h3>Actual (Live)</h3><img src="${vp.actualImage}" /></div>
        <div class="grid-column"><h3>Diff</h3><img src="${vp.diffImage}" /></div>
      </div>
    </div>
  `).join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Visual Regression Report - ${pageName}</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; color: #333; }
    header { text-align: center; padding: 20px; background: #0d6efd; color: white; }
    .tabs { display: flex; justify-content: center; gap: 10px; margin: 20px; }
    .tab-button { padding: 10px 20px; cursor: pointer; background: #dee2e6; border: none; border-radius: 4px; font-weight: bold; }
    .tab-button.active { background: #0d6efd; color: white; }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    .summary { text-align: center; font-size: 18px; margin: 15px 0; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 20px; }
    .grid-column { background: white; padding: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05); border-radius: 8px; text-align: center; }
    .grid-column h3 { margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 10px; font-size: 18px; }
    .grid-column img { max-width: 100%; border-radius: 6px; box-shadow: 0 0 8px rgba(0,0,0,0.1); }
    @media screen and (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <header><h1>Visual Regression Report: ${pageName}</h1></header>
  <div class="tabs">${tabs}</div>
  ${contents}
  <script>
    function showTab(id, btn) {
      document.querySelectorAll('.tab-content').forEach(e => e.classList.remove('active'));
      document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
      document.getElementById(id).classList.add('active');
      btn.classList.add('active');
    }
  </script>
</body>
</html>
  `;

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(reportPath, html);
}
