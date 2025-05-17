
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { figmaConfig } from './figma.config';

const { token, fileKey, nodes, outputDir } = figmaConfig;

interface FigmaResponse {
  images: { [key: string]: string };
}

for (const [name, nodeId] of Object.entries(nodes)) {
  const apiUrl = `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(nodeId)}&format=png&scale=1`;

  fetch(apiUrl, {
    headers: { 'X-Figma-Token': token }
  })
    .then(res => res.json())
    .then(async (json: FigmaResponse) => {
      const imageUrl = json.images[nodeId];
      if (!imageUrl) throw new Error(`Image URL not found for node ${nodeId}`);

      const imageRes = await fetch(imageUrl);
      const buffer = await imageRes.buffer();

      const dir = path.resolve(outputDir, 'paystation');
      fs.mkdirSync(dir, { recursive: true });

      // 📂 Determine filename dynamically based on the node name
      let filename = '';
      switch (name) {
        case 'paystationLaptop':
          filename = 'paystationLaptopFigma.png';
          break;
        case 'paystationTablet':
          filename = 'paystationTabletFigma.png';
          break;
        case 'paystationMobile':
          filename = 'paystationMobileFigma.png';
          break;
        default:
          filename = 'paystationDesktopFigma.png';
      }

      fs.writeFileSync(path.join(dir, filename), buffer);
      console.log(`✅ Saved baseline: ${filename}`);
    })
    .catch(console.error);
}
