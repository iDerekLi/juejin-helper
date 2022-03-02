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

  /**
   * 获取统计签到天数
   * @returns {Promise<*>}
   * {
   *   cont_count 连续签到天数
   *   sum_count 累计签到天数
   * }
   */
  async getCounts() {
    return this.get("/growth_api/v1/get_counts");
  }

  /**
   * 获取当前矿石数
   * @returns {Promise<*>}
   * number 当前矿石数
   */
  async getCurrentPoint() {
    return this.get("/growth_api/v1/get_cur_point");
  }

  /**
   * 获取今日签到状态
   * @returns {Promise<*>}
   * boolean 是否签到
   */
  async getTodayStatus() {
    return this.get("/growth_api/v1/get_today_status");
  }

  /**
   * 获取月签到日历
   * @returns {Promise<*>}
   * [
   *   {
   *     date: timestamp(格式1646150400)
   *     point: number增加矿石数
   *     status: enum(1 今日, 4 未签到, 3 已签到)
   *   }
   * ]
   */
  async getByMonth() {
    return this.get("/growth_api/v1/get_by_month");
  }

  async getLotteryConfig() {
    return this.get("/growth_api/v1/lottery_config/get");
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
