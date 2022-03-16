import Api from "./api";
import Growth from "./growth";
import SeaGold from "./seagold";
import { parseCookieTokens } from "./utils/parse-cookietokens";

class JuejinHelper extends Api {
  constructor() {
    super();
    this.baseURL = "https://api.juejin.cn";
    this.headers.referer = "https://juejin.cn/";
    this.headers.cookie = "";
    this.responseInterceptor = res => {
      if (res.err_no) {
        throw new Error(res.err_msg);
      }
      return res.data;
    }

    this.user = null;
  }

  async login(cookie) {
    this.headers.cookie = cookie;
    this.cookieTokens = parseCookieTokens(cookie);
    this.user = await this.get("/user_api/v1/user/get");
  }

  async logout() {
    this.headers.cookie = "";
    this.user = null;
  }

  getCookie() {
    return this.headers.cookie || "";
  }

  getCookieTokens() {
    return this.cookieTokens;
  }

  getUser() {
    return this.user;
  }

  async makeToken() {
    return this.get("/get/token", {
      baseURL: "https://juejin.cn"
    });
  }

  growth() {
    return new Growth(this);
  }

  seagold() {
    return new SeaGold(this);
  }

  numpuzz() {
    return new NumPuzz(this);
  }
}

export default JuejinHelper;
