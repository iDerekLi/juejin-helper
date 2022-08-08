import JuejinHelper from "./index";
import axios, { AxiosInstance } from "axios";

/**
 * 数字拼图
 * 游戏地址: https://juejin.cn/game/shuzimiti/
 */
class NumPuzz {
  juejin: JuejinHelper;
  http: AxiosInstance;

  constructor(juejin: JuejinHelper) {
    this.juejin = juejin;

    this.http = axios.create({
      baseURL: "https://juejin-game.bytedance.com/game",
      headers: {
        referer: "https://juejin.cn/",
        origin: "https://juejin.cn",
        Authorization: ""
      }
    });

    this.http.interceptors.request.use(
      function (config) {
        if (juejin.user) {
          // @ts-ignore
          config.url += (config.url.indexOf("?") === -1 ? "?" : "&") + `uid=${juejin.user.user_id}&time=${Date.now()}`;
        }
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    this.http.interceptors.response.use(
      function (response) {
        const res = response.data;
        if (res.code !== 0) {
          throw new Error(res.message);
        }
        return res.data;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    // @ts-ignore
    this.http.defaults.headers.Authorization = `Bearer ${token}`;
  }

  /**
   * 游戏登录
   * @returns {Promise<*>}
   */
  async gameLogin() {
    this.setToken(await this.juejin.makeToken());
    return this.http.post("/num-puzz/user/login", {
      name: this.juejin.user?.user_name
    });
  }

  /**
   * 获取主页信息
   * @returns {Promise<*>}
   * bug: 0
   * diamond: 200
   * originality: 0
   * showToast: false
   */
  async gameInfo() {
    return this.http.get("/num-puzz/home/info");
  }

  /**
   * 开始游戏
   * @param level Number [1|2|3] 简单|中等|困难
   * @returns {Promise<*>}
   * guide: 0
   * level: 游戏等级
   * map: 游戏地图
   * round: 关卡
   * target: 目标结果
   */
  async gameStart(data: { level: number }) {
    const { level = 1 } = data || {};
    return this.http.post("/num-puzz/game/start", {
      level
    });
  }

  /**
   * 跳过游戏
   * @description 结构同开始游戏
   * @param level
   * @returns {Promise<*>}
   */
  async gameSkip(data: { level: number }) {
    const { level = 1 } = data || {};
    return this.http.post("/num-puzz/game/skip", {
      level
    });
  }

  /**
   * 游戏完成
   * @param level Array<[x, y, direction]>, direction["u", "d", "l", "r"]
   * @param command
   * @returns {Promise<*>}
   */
  async gameComplete(data: { level: number; command: [number, number, "u" | "d" | "l" | "r"] }) {
    const { level = 1, command = [] } = data || {};
    return this.http.post("/num-puzz/game/complete", {
      level,
      command
    });
  }
}

export default NumPuzz;
