const JuejinHelper = require("juejin-helper");
const utils = require("./utils/utils");
const { Grid, Astar } = require("fast-astar");
const console = require("./utils/logger");
const email = require("./utils/email");
const env = require("./utils/env");

async function run(args) {
  console.clear();

  class SeaGold {
    static async init() {
      const juejin = new JuejinHelper();
      await juejin.login(env.COOKIE);
      const seaGold = new this();
      const gameApi = juejin.seagold();
      seaGold.gameApi = gameApi;
      await seaGold.init();
      return seaGold;
    }

    gameApi = null;

    nodeRules = [
      { code: 0, hasBounty: false, isWall: false, name: "空地" },
      { code: 2, hasBounty: true, isWall: false, name: "矿石", isBest: true },
      { code: 3, hasBounty: false, isWall: false, name: "星星" },
      { code: 4, hasBounty: false, isWall: true, name: "贝壳" },
      { code: 5, hasBounty: false, isWall: true, name: "水母" },
      { code: 6, hasBounty: false, isWall: true, name: "石头" },
      { code: 10, hasBounty: true, isWall: false, name: "上指令" },
      { code: 11, hasBounty: true, isWall: false, name: "下指令" },
      { code: 12, hasBounty: true, isWall: false, name: "左指令" },
      { code: 13, hasBounty: true, isWall: false, name: "右指令" },
      { code: 14, hasBounty: true, isWall: false, name: "跳跃指令" },
      { code: 15, hasBounty: true, isWall: false, name: "循环指令" }
    ];

    debug = false;
    userInfo = {
      uid: "",
      name: "",
      todayDiamond: 0, // 今日获取矿石数
      todayLimitDiamond: 1500, // 今日限制获取矿石数
      maxTodayDiamond: 0 // 今日最大矿石数
    };

    gameInfo = {
      gameId: "",
      mapData: [],
      curPos: { x: 0, y: 0 },
      blockData: {
        moveUp: 0,
        moveDown: 0,
        moveLeft: 0,
        moveRight: 0,
        jump: 0,
        loop: 0
      },
      gameDiamond: 0
    };

    get isGaming() {
      return this.gameInfo && this.gameInfo.gameId !== "";
    }

    async init() {
      const loginInfo = await this.gameApi.gameLogin();
      if (!loginInfo.isAuth) {
        throw Error("玩家未授权, 请前往掘金授权!");
      }
      console.log(`玩家: ${loginInfo.name}`);
      const info = await this.gameApi.gameInfo();
      this.userInfo = {
        uid: info.userInfo.uid,
        name: info.userInfo.name,
        todayDiamond: info.userInfo.todayDiamond,
        todayLimitDiamond: info.userInfo.todayLimitDiamond,
        maxTodayDiamond: info.userInfo.maxTodayDiamond
      };
      if (info.gameStatus === 1) {
        this.restoreGame(info.gameInfo);
      } else {
        this.resetGame();
      }
    }

    resetGame() {
      this.gameInfo = {
        gameId: "",
        mapData: [],
        curPos: { x: 0, y: 0 },
        blockData: {
          moveUp: 0,
          moveDown: 0,
          moveLeft: 0,
          moveRight: 0,
          jump: 0,
          loop: 0
        },
        gameDiamond: 0
      };
    }

    restoreGame(gameInfo) {
      this.gameInfo = {
        gameId: gameInfo.gameId,
        mapData: this.makeMap(gameInfo.mapData, 6),
        curPos: gameInfo.curPos,
        blockData: gameInfo.blockData,
        gameDiamond: gameInfo.gameDiamond
      }
    }

    async gameStart() {
      if (this.isGaming) return;
      const gameInfo = await this.gameApi.gameStart();

      this.gameInfo = {
        gameId: gameInfo.gameId,
        mapData: this.makeMap(gameInfo.mapData, 6),
        curPos: gameInfo.curPos,
        blockData: gameInfo.blockData,
        gameDiamond: 0
      };

      console.log("╔══════游戏开始══════╗");
      console.log(`gameId: ${this.gameInfo.gameId}`);
      console.log(`curPos(${this.gameInfo.curPos.x},${this.gameInfo.curPos.y}): ${this.gameInfo.gameDiamond} 矿石`);
    }

    async gameOver() {
      if (!this.isGaming) return;
      const gameOverInfo = await this.gameApi.gameOver();
      this.userInfo.todayDiamond = gameOverInfo.todayDiamond;
      this.userInfo.todayLimitDiamond = gameOverInfo.todayLimitDiamond;
      // console.log("|==================|");
      const gameDiamond = this.gameInfo.gameDiamond;
      console.log(`游戏清算: ${gameDiamond} 矿石`);
      console.log("╚══════游戏结束══════╝");
      this.resetGame();
      return gameDiamond;
    }

    async executeGameCommand() {
      const bmmap = this.getBMMap();
      const curNode = this.getNode(this.gameInfo.curPos);
      const bestNode = this.getBestNode(bmmap);
      const path = this.getRoutePath(bmmap, curNode, bestNode);
      const commands = this.getCommands(path);
      if (commands.length <= 0) {
        console.log("当局游戏资源耗尽");
        return false;
      }
      const gameCommandInfo = await this.gameApi.gameCommand(this.gameInfo.gameId, commands);
      this.gameInfo.curPos = gameCommandInfo.curPos;
      this.gameInfo.blockData = gameCommandInfo.blockData;
      this.gameInfo.gameDiamond = gameCommandInfo.gameDiamond;
      console.log(`curPos(${this.gameInfo.curPos.x},${this.gameInfo.curPos.y}): ${this.gameInfo.gameDiamond} 矿石`);
      return true;
    }

    getCommand(start, end) {
      const [sx, sy] = start;
      const [ex, ey] = end;

      if (sx === ex && sy !== ey) {
        return sy > ey ? "U" : "D";
      }

      if (sy === ey && sx !== ex) {
        return sx > ex ? "L" : "R";
      }

      return null;
    }

    getCommands(path) {
      const commands = [];
      for(let i=0; i<path.length-1; i++) {
        const cmd = this.getCommand(path[i], path[i+1]);
        if (!cmd) {
          throw new Error(`路径错误: ${i}->${i+1}`);
        }
        commands.push(cmd);
      }
      return commands;
    }

    getNodePosition(map, node) {
      for (let y = 0; y < map.length; y++) {
        const list = map[y];
        for (let x = 0; x < list.length; x++) {
          const cNode = list[x];
          if (cNode === node) {
            return { x, y };
          }
        }
      }
      return { x: 0, y: 0 };
    }

    getRoutePath(map, startNode, endNode) {
      const maze = this.generateMapMaze(map);
      const startPos = this.getNodePosition(map, startNode);
      const endPos = this.getNodePosition(map, endNode);

      if (this.debug) {
        console.log("地图", this.getMaze(map));
        console.log("开始位置", startPos);
        console.log("结束位置", endPos);
      }

      const astar = new Astar(maze);
      const path = astar.search(
        [startPos.x, startPos.y],
        [endPos.x, endPos.y],
        {
          rightAngle: true,
          optimalResult: true
        }
      );

      return path;
    }

    makeMap(mapData, grid = 6) {
      const map = [];
      for (let i = 0, y = 0; i < mapData.length; i+=grid, y++) {
        const row = [];
        map.push(row);
        for (let x = 0; x < grid; x++) {
          const cell = mapData[i + x];
          row.push(this.createMapNode(x, y, cell));
        }
      }
      return map;
    }

    createMapNode(x, y, secret) {
      const rule = this.getNodeRule(secret);
      return {
        code: rule.code,
        bounty: rule.hasBounty ? this.getBounty(secret, rule.code) : 0,
        x,
        y,
        isWall: rule.isWall,
        isBest: !!rule.isBest
      }
    }

    // 获取范围地图
    getBMMap() {
      const { mapData, blockData, curPos } = this.gameInfo;
      const minX = Math.max(curPos.x - blockData.moveLeft, 0);
      const maxX = Math.min(curPos.x + blockData.moveRight, mapData[0].length - 1);
      const minY = Math.max(curPos.y - blockData.moveUp, 0);
      const maxY = Math.min(curPos.y + blockData.moveDown, mapData.length - 1);

      const map = [];
      for (let y = minY; y <= maxY; y++) {
        const row = []; map.push(row);
        for (let x = minX; x <= maxX; x++) {
          row.push(mapData[y][x]);
        }
      }

      return map;
    }

    getNode(pos) {
      return this.gameInfo.mapData[pos.y][pos.x];
    }

    getBestNode(map) {
      let bestNode = null;
      map.forEach(row => {
        row.forEach(node => {
          if (node.isBest && bestNode === null) {
            bestNode = node;
          } else if (node.isBest && node.bounty > bestNode.bounty) {
            bestNode = node;
          }
        });
      });
      return bestNode;
    }

    getMaze(map) {
      return map.map((row, y) => {
        return row.map((node, x) => {
          if (node.isWall) {
            return 1;
          } else {
            return 0;
          }
        });
      });
    }

    // 生成迷宫
    generateMapMaze(map) {
      const grid = new Grid({
        col: map[0].length,
        row: map.length
      });

      map.forEach((row, y) => {
        row.forEach((node, x) => {
          if (node.isWall) {
            grid.set([x, y], 'value', 1);
          }
        });
      });

      return grid;
    }

    getNodeRule(secret) {
      return this.nodeRules.find(rule => {
        const reg = new RegExp(`^${rule.code}`);
        return reg.test(secret);
      });
    }

    getBounty(secret, key) {
      const reg = new RegExp(`^${key}([0-9]*)`);
      const match = secret.toString().match(reg);
      if (match) {
        const materials = Number.parseInt(match[1]);
        return !isNaN(materials) ? materials : 0;
      }
      return 0;
    }
  }

  const seaGold = await SeaGold.init();

  async function runOnceGame() {
    try {
      if (seaGold.isGaming) {
        await seaGold.gameOver();
      }
      await seaGold.gameStart();
      let run = true;
      while (run) {
        await utils.wait(utils.randomRangeNumber(1000, 1500));
        run = await seaGold.executeGameCommand();
      }
      return await seaGold.gameOver();
    } catch (e) {
      await seaGold.gameOver();
      throw e;
    }
  }
  console.log(`今日开采限制: ${seaGold.userInfo.todayLimitDiamond} 矿石`);
  if (seaGold.userInfo.todayDiamond >= seaGold.userInfo.todayLimitDiamond) {
    console.log(`今日开采已达上限!`);
  } else {
    const maxZeroCount = 5;
    let zeroCount = 0;
    const runEndTime = new Date();
    runEndTime.setMinutes(runEndTime.getMinutes() + 30);
    let runTime = new Date();
    console.log(`准备挖矿!`);
    console.log(`当前进度: ${seaGold.userInfo.todayDiamond}/${seaGold.userInfo.todayLimitDiamond} 矿石`);
    while (seaGold.userInfo.todayDiamond < seaGold.userInfo.todayLimitDiamond) {
      if (runTime >= runEndTime) {
        console.log("掘金游戏异常: 服务运行时间过长.");
        throw new Error(console.toString());
      }
      await utils.wait(utils.randomRangeNumber(1000, 1500));
      const gameDiamond = await runOnceGame();
      if (gameDiamond === 0) {
        zeroCount++;
      }
      if (zeroCount > maxZeroCount) {
        console.log("掘金游戏异常: 您 0 矿石游戏对局次数过多.");
        throw new Error(console.toString());
      }
      console.log(`当前进度: ${seaGold.userInfo.todayDiamond}/${seaGold.userInfo.todayLimitDiamond} 矿石`);
      runTime = new Date();
    }

    if (seaGold.userInfo.todayDiamond >= seaGold.userInfo.todayLimitDiamond) {
      console.log(`今日开采已达上限!`);
    }
  }

  email({
    subject: "海底掘金游戏",
    text: console.toString()
  });
}

run(process.argv.splice(2)).catch(error => {
  console.log(error);
  email({
    subject: "海底掘金游戏",
    html: `<b>Error</b><pre>${error.message}</pre><div>如版本过低请前往升级: <a href="https://github.com/iDerekLi/juejin-helper">juejin-helper</a></div>`
  });
});
