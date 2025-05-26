export async function scrollPage(page: any) {
  await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise(resolve => setTimeout(resolve, 4000));
    window.scrollTo(0, 0);
    await new Promise(resolve => setTimeout(resolve, 4000));
  });
}
export async function scrollPageByPixel(page: any) {
  await page.evaluate(async () => {
    const scrollStep = 50; // pixels per step
    const delay = 150; // ms between steps

    function sleep(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Scroll down
    for (let i = 0; i < document.body.scrollHeight; i += scrollStep) {
      window.scrollBy(0, scrollStep);
      await sleep(delay);
    }

    await sleep(1000); // wait at bottom

    // Scroll up
    for (let i = document.body.scrollHeight; i > 0; i -= scrollStep) {
      window.scrollBy(0, -scrollStep);
      await sleep(delay);
    }

    await sleep(1000); // wait at top
  });
}
