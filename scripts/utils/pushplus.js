const fetch = require("node-fetch");
const env = require("./env");
const userConfig = {
  url: "http://www.pushplus.plus/send",
  token: env.PUSHPLUS_TOKEN
};

async function main({ subject, text, html }) {
  if (!userConfig.token) {
    console.warn("未配置PushPlus之Token, 请先配置PushPlus");
    return;
  }
  return await postMessage({
    token: userConfig.token,
    title: subject,
    content: text ?? html,
    topic: "",
    template: "html",
    channel: "wechat",
    webhook: "",
    callbackUrl: "",
    timestamp: ""
  })
    .then((res) => res.json())
    .then((json) => console.log(json.msg));
}

async function postMessage(message) {
  return await fetch(userconfig.baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  }).catch((err) => console.log(err));
}

module.exports = main;
