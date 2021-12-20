const fetch = require("node-fetch");
const env = require("./env");

const headers = {
  "content-type": "application/json; charset=utf-8",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
  "accept-encoding": "gzip, deflate, br",
  "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
  "sec-ch-ua": `"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"`,
  "sec-ch-ua-mobile": "?0",
  referer: "https://juejin.cn/",
  accept: "*/*",
  cookie: env.COOKIE
};

module.exports = {
  async fetch({ path, method, data }) {
    return fetch(`https://api.juejin.cn/growth_api/v1${path}`, {
      headers: headers,
      method: method,
      body: JSON.stringify(data),
      credentials: "include"
    })
      .then(res => res.json())
      .then(res => {
        if (res.err_no) {
          throw new Error(res.err_msg);
        }
        return res.data;
      });
  },
  async get(path) {
    return this.fetch({ path, method: "GET" });
  },
  async post(path, data) {
    return this.fetch({ path, method: "POST", data });
  },
  async getLotteryConfig() {
    return this.get("/lottery_config/get");
  },
  async getCurrentPoint() {
    return this.get("/get_cur_point");
  },
  async drawLottery() {
    return this.post("/lottery/draw");
  },
  async checkIn() {
    return this.post("/check_in");
  },
  async getLotteriesLuckyUsers() {
    return this.post("/lottery_history/global_big", {
      page_no: 1,
      page_size: 5
    });
  },
  async dipLucky(lottery_history_id) {
    return this.post("/lottery_lucky/dip_lucky", {
      lottery_history_id
    });
  },
  async getMyLucky() {
    return this.post("/lottery_lucky/my_lucky");
  }
}
