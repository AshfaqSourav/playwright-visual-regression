import fs from 'fs';
import { createHtmlTemplate } from '../../baseTemplate';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'blogCtgLaptop-expected.png',
  actualImage = 'blogCtgLaptop-actual.png',
  diffImage = 'blogCtgLaptop-diff.png',
  pageName = 'blogCtg Laptop'
}: {
  diffPixels: number;
  outputDir: string;
  reportPath: string;
  expectedImage?: string;
  actualImage?: string;
  diffImage?: string;
  pageName?: string;
}) {
const html = createHtmlTemplate({
    pageName,
    diffPixels,
    expectedImage,
    actualImage,
    diffImage
  });

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(reportPath, html);
}
