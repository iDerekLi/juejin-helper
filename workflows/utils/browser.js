const puppeteer = require("puppeteer");

async function visitJuejinPage(path = "", cookiesString = "") {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: 414, height: 820 });

  const cookiesArray = cookiesString.split(/;\W+/).map(item => item.split("="));
  const cookies = cookiesArray.map(([name, value]) => ({ name, value, domain: ".juejin.cn" }));
  await page.setCookie(...cookies);
  await page.goto("https://juejin.cn" + path);

  await new Promise(resolve => setTimeout(resolve, 5000));

  const screenshot = await page.screenshot();
  await browser.close();
  return screenshot;
}

module.exports = { visitJuejinPage };
