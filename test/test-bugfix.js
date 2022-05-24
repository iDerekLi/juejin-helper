const JuejinHelper = require('..');

const mockCookie = `juejin-cookies`;

async function run() {
  const juejin = new JuejinHelper();
  await juejin.login(mockCookie);
  console.log(juejin.getUser().user_name);

  const bugfix = juejin.bugfix();

  const bugList = await bugfix.getBugList();

  console.log(`您当前有: ${bugList.length}个bug未消除`);

  await bugfix.bugfixBatch(bugList);

  console.log('您的bug已经全部解决');

  console.log(bugList);

}

run();
