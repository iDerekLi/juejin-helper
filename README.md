<section align="center">
  <a href="https://github.com/iDerekLi/juejin-helper" target="_blank">
    <img src="./resources/logo.svg" alt="稀土掘金" width="260" />
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

  await growth.checkIn(); // 签到
  // await growth.getCurrentPoint(); // 获取当前矿石数
  // await growth.getLotteryConfig(); // 获取抽奖配置
  // await growth.drawLottery(); // 抽奖
  // await growth.getLotteriesLuckyUsers(); // 获取抽奖幸运用户
  // await growth.getMyLucky(); // 获取我的幸运值
  // await growth.dipLucky(); // 沾喜气

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

## 赞赏
### ☕️微信赞赏！鼓励升级！
<img src="https://user-images.githubusercontent.com/24502299/150144723-863ad914-3849-40df-8857-5ec5cd60cacd.JPG" alt="微信赞赏" width="300" />

## 许可

[MIT](./LICENSE)
