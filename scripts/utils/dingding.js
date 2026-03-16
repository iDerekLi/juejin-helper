const fetch = require("node-fetch");

const env = require("./env");
async function dingding({ subject, text, html }) {
  return fetch(env.DINGDING_WEBHOOK, {
    headers: {
      "Content-Type": "application/json",
      Charset: "UTF-8"
    },
    method: "POST",
    body: JSON.stringify({
      msgtype: "text",
      text: {
        content: `${subject}\n${text || html}`
      }
    })
  }).then((res) => console.log(JSON.stringify(res)));
}

module.exports = dingding;
