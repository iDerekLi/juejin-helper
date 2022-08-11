const axios = require("axios");

const env = require("./env");
async function dingding({ subject, text, html }) {
  return axios
    .post(
      env.DINGDING_WEBHOOK,
      {
        msgtype: "text",
        text: {
          content: `${subject}\n${text || html}`
        }
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    .then(res => console.log(JSON.stringify(res.data)));
}

module.exports = dingding;
