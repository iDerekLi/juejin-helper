const JuejinHelper = require("juejin-helper");
const utils = require("./utils/utils");
const pushMessage = require("./utils/pushMessage");
const env = require("./utils/env");

class CheckIn {
  username = "";
  cookie = "";
  todayStatus = 0; // 未签到
  incrPoint = 0;
  sumPoint = 0; // 当前矿石数
  contCount = 0; // 连续签到天数
  sumCount = 0; // 累计签到天数
  dipStatus = 0;
  dipValue = 0; // 沾喜气
  luckyValue = 0;
  lottery = []; // 奖池
  pointCost = 0; // 一次抽奖消耗
  freeCount = 0; // 免费抽奖次数
  drawLotteryHistory = {};
  lotteryCount = 0;
  luckyValueProbability = 0;
  bugStatus = 0;
  collectBugCount = 0;
  userOwnBug = 0;

  calledSdkSetting = false;
  calledTrackGrowthEvent = false;
  calledTrackOnloadEvent = false;

  constructor(cookie) {
    this.cookie = cookie;
  }

  async run() {
    const juejin = new JuejinHelper();
    try {
      await juejin.login(this.cookie);
    } catch (e) {
      console.error(e);
      throw new Error("登录失败, 请尝试更新Cookies!");
    }

    this.username = juejin.getUser().user_name;

    const growth = juejin.growth();

    const todayStatus = await growth.getTodayStatus();
    if (!todayStatus) {
      const checkInResult = await growth.checkIn();

      this.incrPoint = checkInResult.incr_point;
      this.sumPoint = checkInResult.sum_point;
      this.todayStatus = 1; // 本次签到
    } else {
      this.todayStatus = 2; // 已签到
    }

    const counts = await growth.getCounts();
    this.contCount = counts.cont_count;
    this.sumCount = counts.sum_count;

    const luckyusersResult = await growth.getLotteriesLuckyUsers();
    if (luckyusersResult.count > 0) {
      const no1LuckyUser = luckyusersResult.lotteries[0];
      const dipLuckyResult = await growth.dipLucky(no1LuckyUser.history_id);
      if (dipLuckyResult.has_dip) {
        this.dipStatus = 2;
      } else {
        this.dipStatus = 1;
        this.dipValue = dipLuckyResult.dip_value;
      }
    }

    const luckyResult = await growth.getMyLucky();
    this.luckyValue = luckyResult.total_value;

    const lotteryConfig = await growth.getLotteryConfig();
    this.lottery = lotteryConfig.lottery;
    this.pointCost = lotteryConfig.point_cost;
    this.freeCount = lotteryConfig.free_count;
    this.lotteryCount = 0;

    let freeCount = this.freeCount;
    while (freeCount > 0) {
      const result = await growth.drawLottery();
      this.drawLotteryHistory[result.lottery_id] = (this.drawLotteryHistory[result.lottery_id] || 0) + 1;
      this.luckyValue = result.total_lucky_value;
      freeCount--;
      this.lotteryCount++;
      await utils.wait(utils.randomRangeNumber(300, 1000));
    }

    this.sumPoint = await growth.getCurrentPoint();

    const getProbabilityOfWinning = sumPoint => {
      const pointCost = this.pointCost;
      const luckyValueCost = 10;
      const totalDrawsNumber = sumPoint / pointCost;
      let supplyPoint = 0;
      for (let i = 0, length = Math.floor(totalDrawsNumber * 0.65); i < length; i++) {
        supplyPoint += Math.ceil(Math.random() * 100);
      }
      const luckyValue = ((sumPoint + supplyPoint) / pointCost) * luckyValueCost + this.luckyValue;
      return luckyValue / 6000;
    };

    this.luckyValueProbability = getProbabilityOfWinning(this.sumPoint);

    // 收集bug
    const bugfix = juejin.bugfix();

    const competition = await bugfix.getCompetition();
    const bugfixInfo = await bugfix.getUser(competition);
    this.userOwnBug = bugfixInfo.user_own_bug;

    try {
      const notCollectBugList = await bugfix.getNotCollectBugList();
      await bugfix.collectBugBatch(notCollectBugList);
      this.bugStatus = 1;
      this.collectBugCount = notCollectBugList.length;
      this.userOwnBug += this.collectBugCount;
    } catch (e) {
      this.bugStatus = 2;
    }

    // 调用埋点
    const sdk = juejin.sdk();

    try {
      await sdk.slardarSDKSetting();
      this.calledSdkSetting = true;
    } catch {
      this.calledSdkSetting = false;
    }

    try {
      const result = await sdk.mockTrackGrowthEvent();
      if (result && result.e === 0) {
        this.calledTrackGrowthEvent = true;
      } else {
        throw result;
      }
    } catch {
      this.calledTrackGrowthEvent = false;
    }

    try {
      const result = await sdk.mockTrackOnloadEvent();
      if (result && result.e === 0) {
        this.calledTrackOnloadEvent = true;
      } else {
        throw result;
      }
    } catch {
      this.calledTrackOnloadEvent = false;
    }

    console.log("------事件埋点追踪-------");
    console.log(`SDK状态: ${this.calledSdkSetting ? "加载成功" : "加载失败"}`);
    console.log(`成长API事件埋点: ${this.calledTrackGrowthEvent ? "调用成功" : "调用失败"}`);
    console.log(`OnLoad事件埋点: ${this.calledTrackOnloadEvent ? "调用成功" : "调用失败"}`);
    console.log("-------------------------");

    await juejin.logout();
  }

  toString() {
    const drawLotteryHistory = Object.entries(this.drawLotteryHistory)
      .map(([lottery_id, count]) => {
        const lotteryItem = this.lottery.find(item => item.lottery_id === lottery_id);
        if (lotteryItem) {
          return `${lotteryItem.lottery_name}: ${count}`;
        }
        return `${lottery_id}: ${count}`;
      })
      .join("\n");

    return `
掘友: ${this.username}
${this.todayStatus === 1 ? `签到成功 +${this.incrPoint} 矿石` : this.todayStatus === 2 ? "今日已完成签到" : "签到失败"}
${this.dipStatus === 1 ? `沾喜气 +${this.dipValue} 幸运值` : this.dipStatus === 2 ? "今日已经沾过喜气" : "沾喜气失败"}
${
  this.bugStatus === 1
    ? this.collectBugCount > 0
      ? `收集Bug +${this.collectBugCount}`
      : "没有可收集Bug"
    : "收集Bug失败"
}
连续签到天数 ${this.contCount}
累计签到天数 ${this.sumCount}
当前矿石数 ${this.sumPoint}
当前未消除Bug数量 ${this.userOwnBug}
当前幸运值 ${this.luckyValue}/6000
预测All In矿石累计幸运值比率 ${(this.luckyValueProbability * 100).toFixed(2) + "%"}
抽奖总次数 ${this.lotteryCount}
免费抽奖次数 ${this.freeCount}
${this.lotteryCount > 0 ? "==============\n" + drawLotteryHistory + "\n==============" : ""}
`.trim();
  }
}

async function run(args) {
  const cookies = utils.getUsersCookie(env);
  let messageList = [];
  for (let cookie of cookies) {
    const checkin = new CheckIn(cookie);

    await utils.wait(utils.randomRangeNumber(1000, 5000)); // 初始等待1-5s
    await checkin.run(); // 执行

    const content = checkin.toString();
    console.log(content); // 打印结果

    messageList.push(content);
  }

  const message = messageList.join(`\n${"-".repeat(15)}\n`);
  pushMessage({
    subject: "掘金每日签到",
    text: message
  });
}

run(process.argv.splice(2)).catch(error => {
  pushMessage({
    subject: "掘金每日签到",
    html: `<strong>Error</strong><pre>${error.message}</pre>`
  });

  throw error;
});
