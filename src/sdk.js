import Api from "./api";

/**
 * SDK
 */
class Sdk extends Api {
  constructor(juejin) {
    super();
    this.juejin = juejin;
    this.baseURL = "";
    Object.assign(this.headers, {
      referer: "https://juejin.cn/",
      origin: "https://juejin.cn",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site"
    });
    this.requestInterceptor = config => {
      return config;
    };

    this.responseInterceptor = res => {
      if (res.errno !== 200) {
        throw new Error(res.message);
      }
      return res.data;
    };
  }

  async slardarSDKSetting() {
    return this.get("https://i.snssdk.com/slardar/sdk_setting?bid=juejin_web", {
      headers: {
        cookie: `MONITOR_WEB_ID=${this.juejin.cookie.get("MONITOR_WEB_ID")}`
      }
    });
  }

  async list(data) {
    return this.post("https://mcs.snssdk.com/list", {
      headers: {
        host: "mcs.snssdk.com"
      },
      data
    });
  }
}

export default Sdk;
