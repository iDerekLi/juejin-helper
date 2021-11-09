const fetch = require('node-fetch');
const env = require("./env");

const headers = {
  'content-type': 'application/json; charset=utf-8',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
  'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  referer: 'https://juejin.cn/',
  accept: '*/*',
  cookie: env.COOKIE
};

module.exports = {
  async fetch({ path, method }) {
    return fetch(path, {
      headers: headers,
      method: method,
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
  async getCurrentPoint() {
    return this.fetch({
      path: "https://api.juejin.cn/growth_api/v1/get_cur_point",
      method: "GET"
    });
  },
  async drawLottery() {
    return this.fetch({
      path: "https://api.juejin.cn/growth_api/v1/lottery/draw",
      method: "POST"
    });
  },
  async getLotteryConfig() {
    return this.fetch({
      path: "https://api.juejin.cn/growth_api/v1/lottery_config/get",
      method: "GET"
    });
  },
  async checkIn() {
    return this.fetch({
      path: "https://api.juejin.cn/growth_api/v1/check_in",
      method: "POST"
    });
  }
}
