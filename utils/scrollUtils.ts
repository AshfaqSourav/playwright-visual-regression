export async function scrollPage(page: any) {
  await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise(resolve => setTimeout(resolve, 800));
    window.scrollTo(0, 0);
    await new Promise(resolve => setTimeout(resolve, 800));
  });
}
