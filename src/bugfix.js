import Api from "./api";
import { wait, randomRangeNumber } from './utils/index'

class Bugfix extends Api {
  constructor(juejin) {
    super();
    this.baseURL = "https://api.juejin.cn";
    this.headers.referer = "https://juejin.cn/";
    this.requestInterceptor = config => {
      config.headers.cookie = juejin.getCookie();
      if (juejin.user) {
        const tokens = juejin.getCookieTokens();
        config.url += `${config.url.indexOf("?") === -1 ? "?" : "&"}aid=${tokens.aid}&uuid=${tokens.uuid}`;
      }
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
   * 获取Bug列表
   * @returns {Promise<*>}
   *  [
   *   {
   *     bug_type: number 类型位置
   *     bug_time: number 时间戳
   *     bug_show_type: 1 显示类型
   *     is_first: boolean 是否第一次
   *   }
   * ]
   * 
   */
  async getBugList() {
    return this.post('/user_api/v1/bugfix/not_collect', {
      // 必须加个空对象，否则接口提示少了参数
      data: {}
    })
  }
  /**
   * 消除bug的接口
   * @returns {Promise<*>}
   * {
   * 
   * }
   */
  async handleBugfix({ bug_time, bug_type }) {
    return this.post("/user_api/v1/bugfix/collect", {
      data: { bug_time, bug_type }
    })
  }

  async bugfixBatch(buglist = []) {
    try {
      await Promise.all(buglist.map(async bug => {
        await this.handleBugfix(bug);
        await wait(randomRangeNumber(500, 1000));
      }))
      return true
    } catch (error) {
      return error;
    }
  }
}

export default Bugfix;