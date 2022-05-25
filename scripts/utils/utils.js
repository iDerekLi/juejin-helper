const env = require("./env");
const fetch = require('node-fetch')
module.exports = {
  async wait(time = 0) {
    return new Promise(resolve => setTimeout(resolve, time));
  },
  randomRangeNumber(start = 500, end = 1000) {
    return (Math.random() * (end - start) + start) >> 0;
  },
  dingding(msg) {
    DINGDING_WEBHOOK = env.DINGDING_WEBHOOK
    if (typeof DINGDING_WEBHOOK != "undefined" && DINGDING_WEBHOOK != null && DINGDING_WEBHOOK != "" && DINGDING_WEBHOOK != undefined) {
      data = {
        "msgtype": "text",
        "text": {
          "content": msg
        }
      }
      fetch(DINGDING_WEBHOOK, {
        headers: {
          "Content-Type": "application/json", "Charset": "UTF-8"
        },
        method: "POST",
        body: JSON.stringify(data)
      }).then(res => console.log(JSON.stringify(res)))
    }
  }
}
