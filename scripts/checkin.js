const juejinApi = require("./utils/juejin-api");
const console = require("./utils/console");
const utils = require("./utils/utils");
const email = require("./utils/email");

function checkGold(result) {
  const list = [
    ["lottery_id", "6981716980386496552"],
    ["lottery_name", "66矿石"],
    ["lottery_type", 1]
  ];
  return list.findIndex(([prop, value]) => result[prop] === value) !== -1;
}

async function run(args) {
  const state = {
    simulateSpeed: 100, // ms/进行一次抽奖
    oneConsume: 200, // 一次消耗矿石数
    supplyPoint: 66,
    sumPoint: 0,
    counter: 0,
    prize: {},
    freeCount: 0
  }

  console.clear();

  try {
    const checkInResult = await juejinApi.checkIn();
    const incrPoint = checkInResult.incr_point;
    console.log(`签到成功 +${incrPoint} 矿石`);

    const sumPoint = checkInResult.sum_point;
    state.sumPoint = sumPoint;
  } catch (e) {
    console.log(e.message);

    const sumPoint = await juejinApi.getCurrentPoint();
    state.sumPoint = sumPoint;
  }

  console.log(`当前余额：${state.sumPoint} 矿石`);

  const lotteryConfig = await juejinApi.getLotteryConfig();
  state.freeCount = lotteryConfig.free_count;
  state.sumPoint += state.freeCount * state.oneConsume;
  console.log(`免费抽奖次数: ${state.freeCount}`);

  if (state.freeCount > 0) {
    console.log(`准备免费抽奖！`);
    console.logGroupStart("奖品实况");
    async function lottery() {
      const result = await juejinApi.drawLottery();
      state.sumPoint -= state.oneConsume;
      if (checkGold(result)) {
        state.sumPoint += state.supplyPoint;
      }
      state.counter++;
      state.prize[result.lottery_name] = (state.prize[result.lottery_name] || 0) + 1;
      console.log(`[第${state.counter}抽]：${result.lottery_name}`);
    }
    while (state.freeCount > 0) {
      await lottery();
      state.freeCount--;
      await utils.wait(state.simulateSpeed);
    }
    console.logGroupEnd("奖品实况");
  }

  console.log(`当前余额：${state.sumPoint} 矿石`);

  const recordInfo = [];
  recordInfo.push("===[战绩详情]===");
  if (state.counter > 0) {
    const prizeList = [];
    for (const key in state.prize) {
      prizeList.push(`${key}: ${state.prize[key]}`);
    }
    recordInfo.push(...prizeList);
    recordInfo.push("---------------");
    recordInfo.push(`共计: ${state.counter}`);
  } else {
    recordInfo.push("暂无奖品");
  }
  recordInfo.push("===============");
  console.log(recordInfo.join("\n"));

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
