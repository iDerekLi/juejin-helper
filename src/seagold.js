import Api from "./api";
import jwt from "jsonwebtoken";

class Seagold extends Api {
  constructor(juejin) {
    super();
    this.baseURL = "https://juejin-game.bytedance.com/game";
    this.headers.referer = "https://juejin.cn/";
    this.juejin = juejin;
    this.requestInterceptor = config => {
      if (juejin.user) {
        config.url += (config.url.indexOf("?") === -1 ? "?" : "&") + `uid=${juejin.user.user_id}&time=${Date.now()}`;
      }
      return config;
    };

    this.responseInterceptor = res => {
      if (res.code !== 0) {
        throw new Error(res.message);
      }
      return res.data;
    };
  }

  setToken(token) {
    this.headers.Authorization = `Bearer ${token}`;
  }

  async gameLogin() {
    this.setToken(await this.juejin.makeToken());
    return this.post("/sea-gold/user/login", {
      data: {
        name: this.juejin.user?.user_name
      }
    });
  }

  async gameInfo() {
    return this.get("/sea-gold/home/info");
  }

  async gameStart({ roleId = 3 } = {}) {
    return this.post("/sea-gold/game/start", {
      data: {
        roleId
      }
    });
  }

  async gameOver({ isButton = 1 } = {}) {
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
    return this.post("/sea-gold/game/over", {
      data: {
        isButton
      }
    });
  }

  async gameCommand(gameId, command = []) {
    // const result = {
    //   appendMapData: [],
    //   blockData: { moveUp: 14, moveDown: 14, moveLeft: 2, moveRight: 5, jump: 3, loop: 3 },
    //   curPos: { x: 0, y: 2 },
    //   gameDiamond: 34
    // }
    const privateKey = "-----BEGIN EC PARAMETERS-----\nBggqhkjOPQMBBw==\n-----END EC PARAMETERS-----\n-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIDB7KMVQd+eeKt7AwDMMUaT7DE3Sl0Mto3LEojnEkRiAoAoGCCqGSM49\nAwEHoUQDQgAEEkViJDU8lYJUenS6IxPlvFJtUCDNF0c/F/cX07KCweC4Q/nOKsoU\nnYJsb4O8lMqNXaI1j16OmXk9CkcQQXbzfg==\n-----END EC PRIVATE KEY-----\n";
    const token = jwt.sign({
      gameId: gameId,
      time: new Date().getTime()
    }, privateKey, {
      algorithm: "ES256",
      expiresIn: 2592e3,
      header: {
        alg: "ES256",
        typ: "JWT"
      }
    });
    return this.post("/sea-gold/game/command", {
      headers: {
        "x-tt-gameid": token
      },
      data: {
        command
        // command: ["R", { times: 2, command: ["R"] }, "2"]
      }
    });
  }
}

export default Seagold;
