import fs from 'fs';
import { createHtmlTemplate } from '../../baseTemplate';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'crossPlatformMobile-expected.png',
  actualImage = 'crossPlatformMobile-actual.png',
  diffImage = 'crossPlatformMobile-diff.png',
  pageName = 'crossPlatform Mobile'
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
