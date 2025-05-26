// /figma/download.ts

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { figmaConfig } from './figma.config';

const { token, fileKey, nodes, outputDir } = figmaConfig;
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Group node entries into chunks
function chunkEntries<T>(entries: [string, T][], size: number): [string, T][][] {
  const chunks: [string, T][][] = [];
  for (let i = 0; i < entries.length; i += size) {
    chunks.push(entries.slice(i, i + size));
  }
  return chunks;
}

// Process batched node downloads
async function downloadBatch(batch: [string, string][]) {
  const ids = batch.map(([_, nodeId]) => nodeId).join(',');
  const url = `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(ids)}&format=png&scale=1`;

  const res = await fetch(url, {
    headers: { 'X-Figma-Token': token }
  });

  const json = await res.json();

  if (!json.images) {
    console.error(`❌ API returned no images. Raw: ${JSON.stringify(json)}`);
    return;
  }

  for (const [name, nodeId] of batch) {
    const imageUrl = json.images[nodeId];
    if (!imageUrl) {
      console.warn(`⚠️ No image URL found for ${name} (${nodeId})`);
      continue;
    }

    try {
      const imageRes = await fetch(imageUrl);
      const buffer = await imageRes.buffer();

      const section = name.replace(/(Desktop|Laptop|Tablet|Mobile)$/, '');
      const dir = path.resolve(outputDir, section);
      fs.mkdirSync(dir, { recursive: true });

      const filename = `${name}Figma.png`;
      fs.writeFileSync(path.join(dir, filename), buffer);
      console.log(`✅ Saved: ${path.join(section, filename)}`);
    } catch (err: any) {
      console.error(`❌ Failed to download image for ${name}: ${err.message}`);
    }
  }
}

// Main execution
(async () => {
  const entries = Object.entries(nodes);
  const batches = chunkEntries(entries, 8); // 5 nodes per batch

  for (const batch of batches) {
    await downloadBatch(batch);
    await delay(800); // 800ms between batches is safe and fast
  }
})();
