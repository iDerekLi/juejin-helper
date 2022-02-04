const JuejinHelper = require('..');

const mockCookie = `juejin-cookie`;

async function run() {
  const juejin = new JuejinHelper();
  await juejin.login(mockCookie);
  console.log(juejin.getUser());
}

run();
