import JuejinHelper from "..";

const mockCookie = `juejin-cookies`;

async function run() {
  const juejin = new JuejinHelper();
  await juejin.login(mockCookie);
  console.log("user_id", juejin.getUser()?.user_id);

  const sdk = juejin.sdk();
  console.log("SDK设置", await sdk.slardarSDKSetting());
  console.log("成长API事件埋点", await sdk.mockTrackGrowthEvent());
  console.log("load事件埋点", await sdk.mockTrackOnloadEvent());
}

run();
