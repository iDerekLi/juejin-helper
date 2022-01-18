const Api = require("./api");
const env = require("../utils/env");

class JuejinApi extends Api {
  constructor() {
    super();
    this.baseURL = "https://api.juejin.cn";
    this.headers.referer = "https://juejin.cn/";
    this.headers.cookie = env.COOKIE;
  }

  responseInterceptor = res => {
    if (res.err_no) {
      throw new Error(res.err_msg);
    }
    return res.data;
  }

  async getToken() {
    return this.get("/get/token", {
      baseURL: "https://juejin.cn"
    });
  }

  async getUserInfo() {
    return this.get("/user_api/v1/user/get");
  }

  async getLotteryConfig() {
    return this.get("/growth_api/v1/lottery_config/get");
  }

  async getCurrentPoint() {
    return this.get("/growth_api/v1/get_cur_point");
  }

  async drawLottery() {
    return this.post("/growth_api/v1/lottery/draw");
  }

  async checkIn() {
    return this.post("/growth_api/v1/check_in");
  }

  async getLotteriesLuckyUsers() {
    return this.post("/growth_api/v1/lottery_history/global_big", {
      data: {
        page_no: 1,
        page_size: 5
      }
    });
  }

  async dipLucky(lottery_history_id) {
    return this.post("/growth_api/v1/lottery_lucky/dip_lucky", {
      data: {
        lottery_history_id
      }
    });
  }

  async getMyLucky() {
    return this.post("/growth_api/v1/lottery_lucky/my_lucky");
  }
}

module.exports = new JuejinApi;
