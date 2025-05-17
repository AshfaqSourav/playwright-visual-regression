import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

export function compareScreenshots({
  actualBuffer,
  expectedPath,
  actualPath,
  diffPath,
  expectedCopyPath
}: {
  actualBuffer: Buffer;
  expectedPath: string;
  actualPath: string;
  diffPath: string;
  expectedCopyPath: string;
}) {
  fs.writeFileSync(actualPath, actualBuffer);
  
// 🔽 Load the expected (baseline) screenshot from file
const expectedBuffer = fs.readFileSync(expectedPath);
const expectedPNG = PNG.sync.read(expectedBuffer);

// 🔽 Read the actual screenshot captured during the test
const fullActualPNG = PNG.sync.read(actualBuffer);

// 🧠 Determine the common dimensions — crop to the smaller of both
// This avoids bitblt() errors when dimensions mismatch
const cropWidth = Math.min(expectedPNG.width, fullActualPNG.width);
const cropHeight = Math.min(expectedPNG.height, fullActualPNG.height);

// ✂️ Create new empty PNGs to hold the cropped images
const croppedExpected = new PNG({ width: cropWidth, height: cropHeight });
const croppedActual = new PNG({ width: cropWidth, height: cropHeight });

// 📤 Copy (crop) data from the original images into the new cropped versions
// Start at top-left (0, 0), copy `cropWidth x cropHeight` region
PNG.bitblt(expectedPNG, croppedExpected, 0, 0, cropWidth, cropHeight, 0, 0);
PNG.bitblt(fullActualPNG, croppedActual, 0, 0, cropWidth, cropHeight, 0, 0);

// 🎨 Create a blank PNG image to store the diff result
const diff = new PNG({ width: cropWidth, height: cropHeight });

// 🔍 Compare the two cropped images pixel by pixel
// - diffPixels: number of mismatched pixels
const diffPixels = pixelmatch(
  croppedExpected.data,
  croppedActual.data,
  diff.data,
  cropWidth,
  cropHeight,
  { threshold: 0.1 }
);

  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  fs.copyFileSync(expectedPath, expectedCopyPath);

  return diffPixels;
}
