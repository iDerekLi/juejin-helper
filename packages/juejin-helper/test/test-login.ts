import JuejinHelper from "..";

const mockCookie = `juejin-cookies`;

async function run() {
  const juejin = new JuejinHelper();
  await juejin.login(mockCookie);
  console.log("user_id", juejin.getUser()?.user_id);
}

run();
