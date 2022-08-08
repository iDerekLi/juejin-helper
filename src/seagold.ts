import axios, { AxiosInstance } from "axios";
import JuejinHelper from "./index";
import jwt from "jsonwebtoken";

class Seagold {
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

  async gameLogin() {
    this.setToken(await this.juejin.makeToken());
    return this.http.post("/sea-gold/user/login", {
      name: this.juejin.user?.user_name
    });
  }

  async gameInfo() {
    return this.http.get("/sea-gold/home/info");
  }

  async gameStart(data: { roleId: 1 | 2 | 3 }) {
    const { roleId = 3 } = data || {};
    return this.http.post("/sea-gold/game/start", {
      roleId
    });
  }

  async gameOver(data: { isButton: number }) {
    const { isButton = 1 } = data || {};
    // const result = {
    //   activity: "",
    //   deep: 3,
    //   gameDiamond: 34, // 当局获取
    //   originMapData: [],
    //   passLine: [{ x: 0, y: 0 }, { x: 0, y: 1 }],
    //   picoDiamond: 0,
    //   realDiamond: 34, // 真实获取
    //   todayDiamond: 34, // 今日获取
    //   todayLimitDiamond: 1500 // 今日最大获取
    // };
    return this.http.post("/sea-gold/game/over", {
      isButton
    });
  }

  async gameCommand(gameId: number, command = []) {
    // const result = {
    //   appendMapData: [],
    //   blockData: { moveUp: 14, moveDown: 14, moveLeft: 2, moveRight: 5, jump: 3, loop: 3 },
    //   curPos: { x: 0, y: 2 },
    //   gameDiamond: 34
    // }
    const privateKey =
      "-----BEGIN EC PARAMETERS-----\nBggqhkjOPQMBBw==\n-----END EC PARAMETERS-----\n-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIDB7KMVQd+eeKt7AwDMMUaT7DE3Sl0Mto3LEojnEkRiAoAoGCCqGSM49\nAwEHoUQDQgAEEkViJDU8lYJUenS6IxPlvFJtUCDNF0c/F/cX07KCweC4Q/nOKsoU\nnYJsb4O8lMqNXaI1j16OmXk9CkcQQXbzfg==\n-----END EC PRIVATE KEY-----\n";
    const token = jwt.sign(
      {
        gameId: gameId,
        time: new Date().getTime()
      },
      privateKey,
      {
        algorithm: "ES256",
        expiresIn: 2592e3,
        header: {
          alg: "ES256",
          typ: "JWT"
        }
      }
    );
    return this.http.post(
      "/sea-gold/game/command",
      {
        command
        // command: ["R", { times: 2, command: ["R"] }, "2"]
      },
      {
        headers: {
          "x-tt-gameid": token
        }
      }
    );
  }
}

export default Seagold;
