# 🎯 Visual Regression Testing Framework

This project provides a fully automated **visual regression testing pipeline** using:

- ✅ [Playwright](https://playwright.dev/) for browser automation
- ✅ Screenshots from your **live web app**
- ✅ Baseline UI designs exported directly from **Figma**
- 🧪 Pixel-by-pixel comparison with a beautifully generated HTML report

---

## 🚀 Features

- Baseline screenshots pulled via Figma API
- Screenshot actual production pages
- Auto-crop and diff to match dimensions
- Side-by-side **Expected / Actual / Diff** in HTML report
- Scroll-to-bottom support for full content rendering
- Modular structure for easy reuse across multiple pages/modules/devices

---

## 📦 Prerequisites

Make sure you have the following installed:

- [Node.js v18+, preferred to use v20.17.0](https://nodejs.org/en/download/)
- Git
- A Figma personal access token (for downloading design baselines)

---

## 🔧 Project Setup

After cloning the repo:

```bash
git clone https://github.com/AshfaqSourav/playwright-visual-regression.git
cd playwright-visual-regression

```Install dependencies
npm install

```Install Playwright browsers:
npx playwright install
npm install --save-dev @types/node

```Add .env file
npm install dotenv
Add a file with .env
Add FIGMA_TOKEN ,FIGMA_FILE_KEY,URL

```Run a Visual Test
npx playwright test

``` open the HTML report directly after test run:
start diff_output/report.html     # On Windows
open diff_output/report.html      # On macOS



📂 Folder Structure

playwright-visual-regression/
├── figma/                        # Download baseline from Figma
│   └── download.ts
│
├── pages/                        # Page Object Models (e.g. PaystationPage)
│   └── PaystationPage.ts
│
├── tests/visual/                # Playwright test specs
│   └── paystation.spec.ts
│
├── utils/                       # Reusable helpers
│   ├── common/scrollUtils.ts   # Page scroll logic
│   ├── compareScreenshots.ts   # Core pixel comparison logic
│   └── report/products/...     # HTML report templates per product/module
│
├── expected_screenshots/       # Baseline images from Figma
│
├── diff_output/                # Diff results, actuals, HTML report


🧪 Add a New Module (e.g. Checkout Page)
Let's say you're adding checkout module. Here's the flow:

1️⃣ Add a baseline frame in Figma
Get the fileKey and nodeId of your frame

Update figma.config.ts:

nodes: {
  paystation: '5214:24158',
  checkout: '7319:12653'
}
2️⃣ Download baseline screenshot

npm run figma:download
This creates: expected_screenshots/checkout/baseline.png

3️⃣ Add new Page Object
4️⃣ Create test spec




#just for ref
<!-- 
start diff_output/report.html 
 npx playwright test
 npm run figma:download
  npm install --save-dev typescript ts-node
  npm install --save-dev playwright @playwright/test
   npm install --save-dev @types/node-fetch
   npm install node-fetch@2
   npm install
    npm install pixelmatch
    npm install pngjs -->