import Api from "./api";

class Growth extends Api {
  constructor(juejin) {
    super();
    this.baseURL = "https://api.juejin.cn";
    this.headers.referer = "https://juejin.cn/";
    this.requestInterceptor = config => {
      config.headers.cookie = juejin.getCookie();
      return config;
    };
    this.responseInterceptor = res => {
      if (res.err_no) {
        throw new Error(res.err_msg);
      }
      return res.data;
    }
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

  async getLotteriesLuckyUsers({ page_no = 1, page_size = 5 } = {}) {
    return this.post("/growth_api/v1/lottery_history/global_big", {
      data: {
        page_no: page_no,
        page_size: page_size
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

export default Growth;
