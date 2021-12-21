!(({ api, console, utils }) => {
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

  !(async () => {
    await utils.wait(100);
    console.clear();

    try {
      const checkInResult = await api.checkIn();
      console.log(checkInResult);
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
    console.log(`免费抽奖次数: ${state.freeCount}`);

    const getProbabilityOfWinning = sumPoint => {
      const pointCost = 200;
      const luckyValueCost = 10;
      const totalDrawsNumber = sumPoint / pointCost;
      const perhapsSupplyNumber = Math.floor(totalDrawsNumber * (2 / 3));
      let supplyPoint = 0;
      for(let i = 0; i < perhapsSupplyNumber; i++) {
        supplyPoint += Math.ceil(Math.random() * 100)
      }
      const luckyValue = (sumPoint + supplyPoint) / pointCost * luckyValueCost + state.luckyValue;
      return luckyValue / 6000;
    }

    console.log(`预测您必中奖幸运概率: ${(getProbabilityOfWinning(state.sumPoint) * 100).toFixed(2) + "%"}`);

    console.log(`准备梭哈！`);

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

    // while (state.sumPoint >= state.pointCost) {
    //   await lottery();
    //   await utils.wait(state.simulateSpeed);
    // }

    console.logGroupEnd("奖品实况");

    console.log(`弹药不足，当前余额：${state.sumPoint} 矿石`);
    console.log(`养精蓄锐来日再战！`);

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
    console.log(recordInfo.join("\n"));
  })();
})(
  (() => {
    const cs = (() => {
      const result = [];
      return {
        done: () => (typeof completion === "function" && completion(result), (result.length = 0)),
        log: msg => (result.push(msg), console.log(msg)),
        clear: () => ((result.length = 0), console.clear()),
        logGroupStart: name => console.group(name),
        logGroupEnd: name => console.groupEnd(name)
      };
    })();

    const api = (() => {
      return {
        async fetch({ path, method, data }) {
          return fetch(`https://api.juejin.cn/growth_api/v1${path}`, {
            headers: {
              cookie: document.cookie
            },
            method: method,
            body: JSON.stringify(data),
            credentials: "include"
          })
            .then(res => res.json())
            .then(res => {
              if (res.err_no) {
                throw new Error(res.err_msg);
              }
              return res.data;
            });
        },
        async get(path) {
          return this.fetch({ path, method: "GET" });
        },
        async post(path, data) {
          return this.fetch({ path, method: "POST", data });
        },
        async getLotteryConfig() {
          return this.get("/lottery_config/get");
        },
        async getCurrentPoint() {
          return this.get("/get_cur_point");
        },
        async drawLottery() {
          return this.post("/lottery/draw");
        },
        async checkIn() {
          return this.post("/check_in");
        },
        async getLotteriesLuckyUsers() {
          return this.post("/lottery_history/global_big", {
            page_no: 1,
            page_size: 5
          });
        },
        async dipLucky(lottery_history_id) {
          return this.post("/lottery_lucky/dip_lucky", {
            lottery_history_id
          });
        },
        async getMyLucky() {
          return this.post("/lottery_lucky/my_lucky");
        }
      };
    })();

    const utils = (() => {
      return {
        async wait(time = 0) {
          return new Promise(resolve => setTimeout(resolve, time));
        }
      };
    })();

    return { console: cs, api, utils };
  })()
);
