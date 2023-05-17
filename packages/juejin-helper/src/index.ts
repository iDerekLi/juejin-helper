import api from "./services/api";
import { parseCookieTokens } from "./utils/index";
import Cookie from "./utils/cookie";
import Sdk from "./sdk";
import Growth from "./growth";
import SeaGold from "./seagold";
import NumPuzz from "./numpuzz";
import Bugfix from "./bugfix";
import JuejinBrowser from "./utils/browser";

type JuejinUserProps = {
  user_id: string;
  user_name: string;
  [prop: string]: any;
} | null;

type JuejinCookieTokens = {
  aid: string;
  uuid: string;
  user_unique_id: string;
  web_id: string;
} | null;

class JuejinHelper {
  cookie: Cookie = new Cookie();
  cookieTokens: JuejinCookieTokens = null;
  user: JuejinUserProps = null;

  async login(cookie: string) {
    this.cookie.setCookieValue(cookie);
    this.cookieTokens = parseCookieTokens(this.cookie);
    this.user = await api.get("/user_api/v1/user/get", {
      headers: { cookie: this.getCookie() }
    });
  }

  async logout() {
    this.cookie.clear();
    this.user = null;
  }

  getCookie() {
    return this.cookie.toString();
  }

  getCookieTokens() {
    return this.cookieTokens;
  }

  getUser() {
    return this.user;
  }

  async makeToken(): Promise<string> {
    return api.get("/get/token", {
      baseURL: "https://juejin.cn",
      headers: { cookie: this.getCookie() }
    });
  }

  sdk() {
    return new Sdk(this);
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

  bugfix() {
    return new Bugfix(this);
  }

  browser() {
    return new JuejinBrowser(this);
  }
}

export default JuejinHelper;
