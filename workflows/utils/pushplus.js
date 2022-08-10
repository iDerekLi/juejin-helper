const axios = require("axios");
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
    content: text || html,
    topic: "",
    template: "html",
    channel: "wechat",
    webhook: "",
    callbackUrl: "",
    timestamp: ""
  })
    .then(res => res.data)
    .then(json => {
      console.log(`PushPlus推送结果: ` + json.msg);
      return json;
    });
}

async function postMessage(message) {
  return await axios
    .post(userConfig.url, message, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .catch(err => console.log(err));
}

module.exports = main;
