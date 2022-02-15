const JuejinHelper = require('..');

const mockCookie = `juejin-cookie`;

async function run() {
  const juejin = new JuejinHelper();
  await juejin.login(mockCookie);
  console.log(juejin.getUser().user_name);

  const growth = juejin.growth();

  const luckyusersResult = await growth.getLotteriesLuckyUsers();
  if (luckyusersResult.count > 0) {
    const no1LuckyUser = luckyusersResult.lotteries[0];
    const dipLuckyResult = await growth.dipLucky(no1LuckyUser.history_id);
    console.log(dipLuckyResult);
    if (dipLuckyResult.has_dip) {
      console.log(`今天你已经沾过喜气，明天再来吧!`);
    } else {
      console.log(`沾喜气 +${dipLuckyResult.dip_value} 幸运值`);
    }
  }
}

run();
