const JuejinHelper = require('juejin-helper');
const email = require("./utils/email");
const env = require("./utils/env");

const CheckInState = {
  no: -1,
  success: 1,
  error: 0
}

class CheckIn {
  state = {
    simulateSpeed: 100, // ms/进行一次抽奖
    sumPoint: 0,
    pointCost: 0,
    supplyPoint: 0,
    freeCount: 0,
    luckyValue: 0,
    lottery: [],
    counter: 0,
    prize: {},
    checkInState: CheckInState.no
  };

  juejin = new JuejinHelper();

  static async run() {
    email({
      subject: "掘金每日签到",
      html: `
<div>
  <style>
    .progress {
      flex: 1;
      position: relative;
      overflow: hidden;
      display: block;
      z-index: 0;
      background-color: rgba(197, 197, 197, 0.75);
      height: 10px;
      border-radius: 5px;
      margin: 0 6px;
    }
    .progress-bar {
      width: 100%;
      position: absolute;
      left: 0px;
      bottom: 0px;
      top: 0px;
      transition: transform 0.4s linear 0s;
      transform-origin: left center;
      border-radius: 5px;
      background-color: rgb(26, 144, 255);
    }
    .lucky-wrap {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  </style>
  <div>签到成功 +700 矿石</div>
  <div>沾喜气 +10 幸运值</div>
  <div>矿石 <span>98559</span></div>
  <div class="lucky-wrap">
    <div>幸运值</div>
    <div class="progress">
      <div class="progress-bar" style="transform: translateX(-50%);"></div>
    </div>
    <div><span>1385</span><span>/6000</span></div>
  </div>
  <div>All In矿石预估累计幸运值比: 119.10%</div>
  <div>
    <div>免费抽奖 1 次</div>
    <div>我的奖品</div>
    <ul>
      <li>[第1抽]：<span>30矿石</span></li>
    </ul>
  </div>
</div>`
    });
  }
}

CheckIn.run();

// async function run() {
//   const checkin = new CheckIn();
//   const juejin = new JuejinHelper();
//   await juejin.login(mockCookie);
//   console.log(checkin.hello, juejin.getUser());
// }
//
// run();
