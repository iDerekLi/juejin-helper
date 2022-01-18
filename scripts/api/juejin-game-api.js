const Api = require("./api");

class JuejinGameApi extends Api {
  user = null;

  constructor() {
    super();
    this.baseURL = "https://juejin-game.bytedance.com/game";
    this.headers.referer = "https://juejin.cn/";
  }

  setUser(user) {
    this.user = user;
  }

  setToken(token) {
    this.headers.Authorization = `Bearer ${token}`;
  }

  requestInterceptor = config => {
    if (this.user) {
      config.url += (config.url.indexOf("?") === -1 ? "?" : "&") + `uid=${this.user.user_id}&time=${Date.now()}`;
    }
    return config;
  };

  responseInterceptor = res => {
    if (res.code !== 0) {
      throw new Error(res.message);
    }
    return res.data;
  }

  async gameLogin() {
    return this.post("/sea-gold/user/login", {
      data: {
        name: this.user.user_name
      }
    });
  }

  async gameStart() {
    return this.post("/sea-gold/game/start", {
      data: {
        roleId: 3
      }
    });
  }

  async gameOver() {
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
        isButton: 1
      }
    });
  }

  async gameCommand(command = []) {
    // const result = {
    //   appendMapData: [],
    //   blockData: { moveUp: 14, moveDown: 14, moveLeft: 2, moveRight: 5, jump: 3, loop: 3 },
    //   curPos: { x: 0, y: 2 },
    //   gameDiamond: 34
    // }
    return this.post("/sea-gold/game/command", {
      data: {
        command
        // command: ["R", { times: 2, command: ["R"] }, "2"]
      }
    });
  }
}

module.exports = new JuejinGameApi;
