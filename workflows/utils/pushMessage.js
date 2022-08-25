const env = require("./env");
const email = require("./email");
const pushplus = require("./pushplus");
const dingding = require("./dingding");
const weixinrobot = require("./weixinrobot");

async function pushMessage({ subject, text, html }) {
  env.EMAIL_USER && (await email({ subject, text, html }));
  env.DINGDING_WEBHOOK && (await dingding({ subject, text, html }));
  env.PUSHPLUS_TOKEN && (await pushplus({ subject, text, html }));
  env.WEIXIN_WEBHOOK && (await weixinrobot({ subject, text, html }));
}

module.exports = pushMessage;
