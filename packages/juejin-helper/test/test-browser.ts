import JuejinHelper from "..";

const mockCookie = `juejin-cookies`;

async function run() {
  const juejin = new JuejinHelper();
  await juejin.login(mockCookie);

  const browser = juejin.browser();

  await browser.open();

  try {
    await browser.visitPage("/");
    console.log("掘金首页：页面访问成功");
  } catch (e) {
    console.log("掘金首页：页面访问失败");
  }

  try {
    await browser.visitPage("/user/center/signin");
    console.log("掘金每日签到：页面访问成功");
  } catch (e) {
    console.log("掘金每日签到：页面访问失败");
  }

  // const page = await browser.visitPage("/user/center/signin");
  // const screenshotBuffer = await page.screenshot(); // 获取页面快照

  await browser.close();
}

run();
