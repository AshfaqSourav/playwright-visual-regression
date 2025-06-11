import fs from 'fs';
import { createHtmlTemplate } from '../../baseTemplate';

export function generateHtmlReport({
  diffPixels,
  outputDir,
  reportPath,
  expectedImage = 'sponsorshipLaptop-expected.png',
  actualImage = 'sponsorshipLaptop-actual.png',
  diffImage = 'sponsorshipLaptop-diff.png',
  pageName = 'Sponsorship Laptop'
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
