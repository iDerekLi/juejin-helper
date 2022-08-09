# 参与贡献

## 分支介绍

- `package` 掘金API发布npm包，供给自动化工作流使用。
- `workflows` 自动化工作流开发分支。
- `main` 是 workflows 分支的稳定版。

**处理自动化相关逻辑:** 
base: `workflows` <- compare `your branch`

**处理JueJinAPI相关逻辑:** 
base: `package` <- compare `your branch`

## workflows 分支

### 安装

- `yarn` 安装依赖

### 环境变量

- `/scripts/utils/env.js` 替换本地测试所需的环境变量

```javascript
module.exports = {
  COOKIE: "测试掘金Cookie",
  // ...
};
```

### 本地运行

- `yarn checkin` 运行掘金签到脚本
- `yarn seagold` 运行海底掘金游戏脚本

## package 分支

- `yarn` 安装依赖
- `yarn dev` 启动开发模式
- `node tests/your-test.js` 测试一个模块
