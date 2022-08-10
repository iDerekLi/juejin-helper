import JuejinHelper from "..";

const mockCookie = `juejin-cookies`;

async function run() {
  const juejin = new JuejinHelper();
  await juejin.login(mockCookie);
  console.log("user_id", juejin.getUser()?.user_id);

  const seagold = juejin.seagold();

  const loginInfo = await seagold.gameLogin();
  console.log(loginInfo);

  // const gameInfo = await seagold.gameInfo();
  // console.log(gameInfo);

  const gameInfo = await seagold.gameStart();
  console.log(gameInfo);

  const overInfo = await seagold.gameOver();
  console.log(overInfo);
}

run();
