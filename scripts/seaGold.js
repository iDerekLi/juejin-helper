const api = require("./api/juejin-api");
const juejinGameApi = require("./api/juejin-game-api");
const utils = require("./utils/utils");
const { Grid, Astar } = require("fast-astar");
// const AStar = require("./utils/astar");
// const console = require("./utils/logger");

async function run(args) {
  class SeaGold {
    static async init() {
      const user = await api.getUserInfo();
      const token = await api.getToken();
      juejinGameApi.setUser(user);
      juejinGameApi.setToken(token);
      return new this();
    }
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

    gameId = "";
    seed = 0;
    mapData = [];
    curPos = { x: 0, y: 0 };
    isGaming = false;
    blockData = {
      moveUp: 0,
      moveDown: 0,
      moveLeft: 0,
      moveRight: 0,
      jump: 0,
      loop: 0
    };

    gameDiamond = 0; // 所得矿石
    todayLimitDiamond = 0;

    reset() {
      this.gameId = "";
      this.seed = 0;
      this.curPos = { x: 0, y: 0 };
      this.mapData = [];
      this.blockData = {
        moveUp: 0,
        moveDown: 0,
        moveLeft: 0,
        moveRight: 0,
        jump: 0,
        loop: 0
      };
      this.gameDiamond = 0;
    }

    async gameStart() {
      await seaGold.gameOver();
      this.reset();
      const result = await juejinGameApi.gameStart();
      this.gameId = result.gameId;
      this.seed = result.seed;
      this.curPos = result.curPos;
      this.mapData = this.makeMap(result.mapData, 6);
      this.blockData = result.blockData;
      this.isGaming = true;

      const bmmap = this.getBMMap();
      const curNode = this.getNode(this.curPos);
      const bestNode = this.getBestNode(bmmap);
      const path = this.getRoutePath(bmmap, curNode, bestNode);
      const commands = this.generateCommands(path);
      console.log("路线", path);
    }

    generateCommands(path) {
      return [];
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

      console.log("地图", this.getMaze(map));
      console.log("开始节点", startNode);
      console.log("结束节点", endNode);
      console.log("开始位置", startPos);
      console.log("结束位置", endPos);

      const astar = new Astar(maze);
      const path = astar.search(
        [startPos.x, startPos.y], // start
        [endPos.x, endPos.y], // end
        {                        // option
          rightAngle: true,    // default:false,Allow diagonal
          optimalResult: true   // default:true,In a few cases, the speed is slightly slower
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
      const mapData = this.mapData;
      const blockData = this.blockData;
      const curPos = this.curPos;
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
      return this.mapData[pos.y][pos.x];
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
        col: map[0].length,                  // col
        row: map.length,                   // row
        render() {       // Optional, this method is triggered when the grid point changes
          // console.log(this);
        }
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

    async gameOver() {
      const gameOver = await juejinGameApi.gameOver();
    }
  }

  const seaGold = await SeaGold.init();
  await seaGold.gameStart();
}

run(process.argv.splice(2)).catch(error => {
  console.log(error);
  // email({
  //   subject: "掘金每日签到",
  //   html: `<b>Error</b><div>${error.message}</div>`
  // });
});
