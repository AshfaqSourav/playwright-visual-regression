import fs from 'fs';
import { createHtmlTemplate } from '../../baseTemplate';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'careersTablet-expected.png',
  actualImage = 'careersTablet-actual.png',
  diffImage = 'careersTablet-diff.png',
  pageName = 'Careers Tablet'
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
