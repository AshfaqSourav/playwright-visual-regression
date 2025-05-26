// global-setup.ts
import fs from 'fs';
import path from 'path';

async function globalSetup() {
  const dir = path.resolve('./diff_output');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('📂 Created diff_output directory');
  }
}

export default globalSetup;
