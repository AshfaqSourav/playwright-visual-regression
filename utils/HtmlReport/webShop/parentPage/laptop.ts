// /utils/HtmlReport/generatewsParentPageDesktopHtmlReport.ts

import fs from 'fs';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'wsParentPageLaptop-expected.png',
  actualImage = 'wsParentPageLaptop-actual.png',
  diffImage = 'wsParentPageLaptop-diff.png',
  pageName = 'WebShop ParentPage Laptop'
}: {
  diffPixels: number;
  outputDir: string;
  reportPath: string;
  expectedImage?: string;
  actualImage?: string;
  diffImage?: string;
  pageName?: string;
}) {
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
  <div class="summary"><strong>Diff Pixels:</strong> ${diffPixels}</div>
  <div class="grid">
    <div class="grid-column"><h3>Expected (Figma)</h3><img src="${expectedImage}" /></div>
    <div class="grid-column"><h3>Actual (Live)</h3><img src="${actualImage}" /></div>
    <div class="grid-column"><h3>Diff</h3><img src="${diffImage}" /></div>
  </div>
</body>
</html>
  `;
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(reportPath, html);
}