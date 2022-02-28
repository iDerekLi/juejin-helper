const JuejinHelper = require("juejin-helper");
const console = require("./utils/logger");
const utils = require("./utils/utils");
const email = require("./utils/email");
const env = require("./utils/env");

async function run(args) {
  const state = {
    simulateSpeed: 100, // ms/进行一次抽奖
    sumPoint: 0,
    pointCost: 0,
    supplyPoint: 0,
    freeCount: 0,
    luckyValue: 0,
    lottery: [],
    counter: 0,
    prize: {}
  };

  await utils.wait(100);
  console.clear();

  const juejin = new JuejinHelper();
  await juejin.login(env.COOKIE);
  const api = juejin.growth();

  try {
    const checkInResult = await api.checkIn();
    const incrPoint = checkInResult.incr_point;
    console.log(`签到成功 +${incrPoint} 矿石`);

    const sumPoint = checkInResult.sum_point;
    state.sumPoint = sumPoint;
  } catch (e) {
    console.log(e.message);

    const sumPoint = await api.getCurrentPoint();
    state.sumPoint = sumPoint;
  }

  try {
    const luckyusersResult = await api.getLotteriesLuckyUsers();
    if (luckyusersResult.count > 0) {
      const no1LuckyUser = luckyusersResult.lotteries[0];
      const dipLuckyResult = await api.dipLucky(no1LuckyUser.history_id);
      if (dipLuckyResult.has_dip) {
        console.log(`今天你已经沾过喜气，明天再来吧!`);
      } else {
        console.log(`沾喜气 +${dipLuckyResult.dip_value} 幸运值`);
      }
    }
  } catch {}

  console.log(`当前余额：${state.sumPoint} 矿石`);

  const luckyResult = await api.getMyLucky();
  state.luckyValue = luckyResult.total_value;
  console.log(`当前幸运值：${state.luckyValue}/6000`);

  const lotteryConfig = await api.getLotteryConfig();
  state.lottery = lotteryConfig.lottery;
  state.pointCost = lotteryConfig.point_cost;
  state.freeCount = lotteryConfig.free_count;
  state.sumPoint += state.freeCount * state.pointCost;

  const getProbabilityOfWinning = sumPoint => {
    const pointCost = state.pointCost;
    const luckyValueCost = 10;
    const totalDrawsNumber = sumPoint / pointCost;
    let supplyPoint = 0;
    for(let i = 0, length = Math.floor(totalDrawsNumber * 0.65); i < length; i++) {
      supplyPoint += Math.ceil(Math.random() * 100)
    }
    const luckyValue = (sumPoint + supplyPoint) / pointCost * luckyValueCost + state.luckyValue;
    return luckyValue / 6000;
  }
  console.log(`预测梭哈矿石累计幸运值比率: ${(getProbabilityOfWinning(state.sumPoint) * 100).toFixed(2) + "%"}`);

  console.log(`免费抽奖次数: ${state.freeCount}`);
  console.log(`准备免费抽奖！`);

  console.logGroupStart("奖品实况");

  const getSupplyPoint = draw => {
    const maybe = [
      ["lottery_id", "6981716980386496552"],
      ["lottery_name", "随机矿石"],
      ["lottery_type", 1]
    ];
    if (maybe.findIndex(([prop, value]) => draw[prop] === value) !== -1) {
      const supplyPoint = Number.parseInt(draw.lottery_name);
      if (!isNaN(supplyPoint)) {
        return supplyPoint;
      }
    }
    return 0;
  };

  const lottery = async () => {
    const result = await api.drawLottery();
    state.sumPoint -= state.pointCost;
    state.sumPoint += getSupplyPoint(result);
    state.luckyValue += result.draw_lucky_value;
    state.counter++;
    state.prize[result.lottery_name] = (state.prize[result.lottery_name] || 0) + 1;
    console.log(`[第${state.counter}抽]：${result.lottery_name}`);
  };

  while (state.freeCount > 0) {
    await lottery();
    state.freeCount--;
    await utils.wait(state.simulateSpeed);
  }

  await juejin.logout();

  console.logGroupEnd("奖品实况");

  console.log(`当前余额：${state.sumPoint} 矿石`);

  const recordInfo = [];
  recordInfo.push("=====[战绩详情]=====");
  if (state.counter > 0) {
    const prizeList = [];
    for (const key in state.prize) {
      prizeList.push(`${key}: ${state.prize[key]}`);
    }
    recordInfo.push(...prizeList);
    recordInfo.push("-------------------");
    recordInfo.push(`共计: ${state.counter}`);
  } else {
    recordInfo.push("暂无奖品");
  }
  recordInfo.push("+++++++++++++++++++");
  recordInfo.push(`幸运值: ${state.luckyValue}/6000`);
  recordInfo.push("===================");
  console.log(recordInfo.join("\n  "));

  email({
    subject: "掘金每日签到",
    text: console.toString()
  });
}

run(process.argv.splice(2)).catch(error => {
  email({
    subject: "掘金每日签到",
    html: `<b>Error</b><div>${error.message}</div>`
  });
});
