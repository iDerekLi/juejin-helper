# Juejin Workflows 掘金工作流

## 通知
🔈 海底掘金游戏官方已下线 `juejin-helper >= 1.7.3`

## 开始使用

下载项目 或 [ clone the repo:](https://github.com/iDerekLi/juejin-helper)
```shell
curl https://codeload.github.com/iDerekLi/juejin-helper/tar.gz/main | tar -xz --strip=2 juejin-helper-main/workflows
cd workflows
```

安装依赖并运行脚本
```shell
yarn
yarn checkin
yarn seagold
```

运行脚本前 配置环境变量 `/workflows/utils/env.js`

```javascript
module.exports = {
  COOKIE: "掘金Cookie"
  // ...
};
```

| Name | Value | Required |
| --- | --- | --- |
| COOKIE | 掘金网站Cookie  | 是 |
| COOKIE_2 | 多用户, 当需要同时运行多个掘金用户时所需, 支持最多 **5** 名用户(即COOKIE + COOKIE_2 - COOKIE_5)  | 否 |
| EMAIL_USER | 发件人邮箱地址(需要开启 SMTP) | 否 |
| EMAIL_PASS | 发件人邮箱密码(SMTP密码) | 否 |
| EMAIL_TO | 订阅人邮箱地址(收件人). 如需多人订阅使用 `, ` 分割, 例如: `a@163.com, b@qq.com` | 否 |
| DINGDING_WEBHOOK | 钉钉机器人WEBHOOK | 否 |
| PUSHPLUS_TOKEN | [Pushplus](http://www.pushplus.plus/) 官网申请，支持微信消息推送 | 否 |
|   WEIXIN_WEBHOOK | 企业微信机器人WEBHOOK                                    | 否 |

