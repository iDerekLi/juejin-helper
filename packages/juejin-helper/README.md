<section align="center">
  <a href="https://github.com/iDerekLi/juejin-helper" target="_blank">
    <img src="../../resources/logo.svg" alt="稀土掘金" width="260" />
  </a>
</section>

<h1 align="center">JuejinHelper-稀土掘金助手</h1>

<p align="center">签到、抽奖、沾喜气、海底掘金游戏、自动化工作流。</p>

## 示例

### 签到示例
```javascript
const JuejinHelper = require("juejin-helper");

async function run() {
  const juejin = new JuejinHelper();
  await juejin.login("你的掘金Cookie");

  const growth = juejin.growth();

  // 签到
  await growth.checkIn();

  // 获取当前矿石数
  // await growth.getCurrentPoint();

  // 获取统计签到天数
  // await growth.getCounts();

  // 获取今日签到状态
  // await growth.getTodayStatus();

  // 获取抽奖配置
  // await growth.getLotteryConfig();

  // 抽奖
  // await growth.drawLottery();

  // 获取抽奖幸运用户
  // await growth.getLotteriesLuckyUsers({ page_no = 1, page_size = 5 }); // => { lotteries: [{ lottery_history_id }, ...] }

  // 获取我的幸运值
  // await growth.getMyLucky();

  // 沾喜气
  // await growth.dipLucky(lottery_history_id); // => { has_dip, dip_value, total_value, dip_action }

  await juejin.logout();
}

run();
```

### 海底掘金游戏示例
```javascript
const JuejinHelper = require("juejin-helper");

async function run() {
  const juejin = new JuejinHelper();
  await juejin.login("你的掘金Cookie");

  const seagold = juejin.seagold();

  await seagold.gameLogin(); // 登陆游戏
  
  let gameInfo = null;

  const info = await seagold.gameInfo(); // 游戏状态
  if (info.gameStatus === 1) {
    gameInfo = info.gameInfo; // 继续游戏
  } else {
    gameInfo = await seagold.gameStart(); // 开始游戏
  }

  const command = ["U", "L"];
  await seagold.gameCommand(gameInfo.gameId, command); // 执行命令

  const result = await seagold.gameOver(); // 游戏结束
  console.log(result); // => { ... }

  await juejin.logout();
}

run();
```

### bugfix 游戏示例
```javascript
const JuejinHelper = require("juejin-helper");

async function run() {
  const juejin = new JuejinHelper();
  await juejin.login("你的掘金Cookie");

  const bugfix = juejin.bugfix();

  const notCollectBugList = await bugfix.getNotCollectBugList();
  await bugfix.collectBugBatch(notCollectBugList);
  console.log(`收集Bug ${notCollectBugList.length}`);

  const competition = await bugfix.getCompetition();
  const bugfixInfo = await bugfix.getUser(competition);
  console.log(`未消除Bug数量 ${bugfixInfo.user_own_bug}`);
}
```

### SDK示例

```javascript
const JuejinHelper = require("juejin-helper");

async function run() {
  const juejin = new JuejinHelper();
  await juejin.login("你的掘金Cookie");

  const sdk = juejin.sdk();

  await sdk.slardarSDKSetting(); // SDK设置
  await sdk.list(/* events */); // 埋点数据
}

run();
```

### Browser 浏览器访问示例
```javascript
const JuejinHelper = require("juejin-helper");

async function run() {
  const juejin = new JuejinHelper();
  await juejin.login("你的掘金Cookie");

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

  // const page = await browser.visitPage("/");
  // const screenshotBuffer = await page.screenshot(); // 获取页面快照

  await browser.close();
}
```

## 问题

### 如何获取Cookie

掘金网站Cookie, 打开浏览器，登录 [掘金](https://juejin.cn/), 打开控制台DevTools(快捷键F12) -> Network，复制 cookie, **掘金Cookie有效期约1个月需定期更新.**

DevTools截图:
<img width="1156" alt="getcookie" src="https://user-images.githubusercontent.com/24502299/152626917-26aca423-4e9c-48c9-be06-d228af5a492b.png">

## 赞赏
### ☕️微信赞赏！鼓励升级！
<img src="https://user-images.githubusercontent.com/24502299/150144723-863ad914-3849-40df-8857-5ec5cd60cacd.JPG" alt="微信赞赏" width="300" />

## 许可

[Apache-2.0](./LICENSE)
