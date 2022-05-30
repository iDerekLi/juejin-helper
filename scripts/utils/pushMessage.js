const env = require("./env");
const email = require("./email");
const dingding = require("./dingding");
const pushplus = require("./pushplus");

async function main({ subject, text, html }) {
  env.EMAIL_USER && email({ subject, text, html });
  env.PUSHPLUS_TOKEN && pushplus({ subject, text, html });
  env.DINGDING_WEBHOOK && dingding(text);
}

module.exports = main;
