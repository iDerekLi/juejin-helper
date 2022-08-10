import JuejinHelper from "..";

const mockCookie = `juejin-cookies`;

// const rules = [
//   [{ test: /^0\.1$/, name: "空地", type: "cell", value: 0 }]
//   [{ test: /^0\.2$/, name: "障碍", type: "cell", value: 1 }],
//   [{ test: /^0\.3$/, name: "加法", type: "symbol", value: "+" }],
//   [{ test: /^0\.4$/, name: "减法", type: "symbol", value: "-" }],
//   [{ test: /^0\.5$/, name: "乘法", type: "symbol", value: "*" }],
//   [{ test: /^0\.6$/, name: "除法", type: "symbol", value: "/" }],
//   [{ test: /^[1-9]\d*$/, name: "数字", type: "number", value: n => n }]
// ]

async function run() {
  const juejin = new JuejinHelper();
  await juejin.login(mockCookie);

  const numpuzz = juejin.numpuzz();

  const loginInfo = await numpuzz.gameLogin();
  console.log(loginInfo);

  // const gameInfo = await numpuzz.gameStart({ level: 1 });
  // console.log(gameInfo);

  // const gameResult = await numpuzz.gameComplete({ level: 1, command: [[1, 1, "d"]] });
  // console.log(gameResult);
}

run();
