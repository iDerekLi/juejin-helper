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

  async gameStart() {
    return this.post("/sea-gold/game/start", {
      data: {
        roleId: 3
      }
    });
  }

  async gameOver() {
    return this.post("/sea-gold/game/over", {
      data: {
        isButton: 1
      }
    });
  }

  async gameCommand(command = []) {
    return this.post("/sea-gold/game/command", {
      data: {
        command
        // command: ["R", { times: 2, command: ["R"] }, "2"]
      }
    });
  }
}

module.exports = new JuejinGameApi;
