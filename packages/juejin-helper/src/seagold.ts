import axios, { AxiosInstance } from "axios";
import JuejinHelper from "./index";
import jwt from "jsonwebtoken";

interface Position {
  x: number;
  y: number;
}

interface BlockData {
  moveUp: number;
  moveDown: number;
  moveLeft: number;
  moveRight: number;
  jump: number;
  loop: number;
}

type MapData = number[];

interface GameCommandResult {
  appendMapData: MapData;
  blockData: BlockData;
  curPos: Position;
  gameDiamond: number;
}

interface GameOverResult {
  activity: string;
  deep: number;
  gameDiamond: number; // 当局获取
  originMapData: MapData;
  passLine: Position[];
  picoDiamond: number;
  realDiamond: number; // 真实获取
  todayDiamond: number; // 今日获取
  todayLimitDiamond: number; // 今日最大获取
}

interface GameStartResult {
  seed: number;
  gameId: string;
  curPos: Position;
  mapData: MapData;
  blockData: BlockData;
}

interface GameInfoResult {
  activity: string;
  gameStatus: 0 | 1;
  userInfo: {
    uid: string;
    name: string;
    todayDiamond: number;
    todayLimitDiamond: number;
    maxTodayDiamond: number;
    badge: string;
  };
  gameInfo: {
    gameId: string;
    roleId: 1 | 2 | 3;
    gameDiamond: number;
    isNew: boolean;
    addRate: number;
    mapData: MapData;
    mapDeep: number;
    blockData: BlockData;
    curPos: Position;
    commandList: any[];
    deep: number;
    elementData: { pearl: number; jellyfish: number; pico: number; starfish: number; shell: number };
    remainDoubleStep: number;
    isGameOver: boolean;
    picoNode: unknown[];
    shopPosList: unknown[];
    passLine: string;
    activity: string;
    picoDiamond: number;
    version: string;
  } | null;
}

interface GameLoginResult {
  uid: string;
  name: string;
  isAuth: number;
  isNew: number;
}

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

  async gameLogin(): Promise<GameLoginResult> {
    this.setToken(await this.juejin.makeToken());
    return this.http.post("/sea-gold/user/login", {
      name: this.juejin.user?.user_name
    });
  }

  async gameInfo(): Promise<GameInfoResult> {
    return this.http.get("/sea-gold/home/info");
  }

  async gameStart(data?: { roleId: 1 | 2 | 3 }): Promise<GameStartResult> {
    const { roleId = 3 } = data || {};
    return this.http.post("/sea-gold/game/start", {
      roleId
    });
  }

  async gameOver(data?: { isButton: number }): Promise<GameOverResult> {
    const { isButton = 1 } = data || {};
    return this.http.post("/sea-gold/game/over", {
      isButton
    });
  }

  async gameCommand(gameId: number, command = []): Promise<GameCommandResult> {
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
