const env = require("./env");
async function main(msg) {
  DINGDING_WEBHOOK = env.DINGDING_WEBHOOK;
  data = {
    msgtype: "text",
    text: {
      content: msg
    }
  };
  fetch(DINGDING_WEBHOOK, {
    headers: {
      "Content-Type": "application/json",
      Charset: "UTF-8"
    },
    method: "POST",
    body: JSON.stringify(data)
  }).then((res) => console.log(JSON.stringify(res)));
}

module.exports = main;
