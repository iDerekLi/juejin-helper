import puppeteer, { Browser, PuppeteerLaunchOptions, Page } from "puppeteer";
import JuejinHelper from "../index";

export default class JuejinBrowser {
  juejin: JuejinHelper;
  browser: Browser | null = null;

  constructor(juejin: JuejinHelper) {
    this.juejin = juejin;
  }

  async open(options?: PuppeteerLaunchOptions) {
    if (this.browser) {
      await this.close();
    }
    this.browser = await puppeteer.launch(options);
    return this.browser;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async visitPage(path: string = "", options = {}): Promise<Page> {
    const opts = Object.assign(
      {
        viewport: { width: 414, height: 820 },
        timeout: 30000
      },
      options
    );

    const browser = this.browser as Browser;
    const page = await browser.newPage();

    await page.setViewport(opts.viewport);
    page.setDefaultTimeout(opts.timeout);

    const cookiesString = this.juejin.cookie.toString();
    const cookiesArray = cookiesString.split(/;\W+/).map(item => item.split("="));
    const cookies = cookiesArray.map(([name, value]) => ({ name, value, domain: ".juejin.cn" }));
    await page.setCookie(...cookies);
    await page.goto("https://juejin.cn" + path);

    return page;
  }
}
