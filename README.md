<section align="center">
  <a href="https://github.com/iDerekLi/juejin-helper" target="_blank">
    <img src="./resources/logo.svg" alt="稀土掘金" width="260" />
  </a>
</section>

<h1 align="center">JuejinHelper-稀土掘金助手</h1>

<p align="center">签到、抽奖、沾喜气、消除Bug、海底掘金游戏、自动化工作流。</p>

## 通知
✨ 自动化工作流，新增飞书推送。 \
🔈 海底掘金游戏官方已下线 `juejin-helper >= 1.7.3`

## 如何使用?
使用自动化工作流有两种方式：快速使用(在线) 和 私有化部署(本地)

- 快速使用自动化：[阅读 使用](#使用)
- 私有化部署自动化：[见 workflows](./workflows/README.md)
- 除上诉两种之外，如您喜欢也可以自定义脚本：[npm juejin-helper](https://www.npmjs.com/package/juejin-helper)

## 使用

自动化执行任务: 掘金每日签到, 沾喜气, 免费抽奖, 消除Bug, 海底掘金游戏, 最后将结果报告邮件通知订阅人。\
自动化运行时间: 北京时间上午06:30

1. [Fork 仓库](https://github.com/iDerekLi/juejin-helper)

2. 仓库 -> Settings -> Secrets -> New repository secret, 添加Secrets变量如下:

   | Name | Value | Required |
   | --- | --- | --- |
   | COOKIE | 掘金网站Cookie  | 是 |
   | COOKIE_2 | 多用户, 当需要同时运行多个掘金用户时所需, 支持最多 **5** 名用户(即COOKIE + COOKIE_2 - COOKIE_5)  | 否 |
   | EMAIL_USER | 发件人邮箱地址(需要开启 SMTP) | 否 |
   | EMAIL_PASS | 发件人邮箱密码(SMTP密码) | 否 |
   | EMAIL_TO | 订阅人邮箱地址(收件人). 如需多人订阅使用 `, ` 分割, 例如: `a@163.com, b@qq.com` | 否 |
   | DINGDING_WEBHOOK | 钉钉机器人WEBHOOK | 否 |
   | PUSHPLUS_TOKEN | [Pushplus](http://www.pushplus.plus/) 官网申请，支持微信消息推送 | 否 |
   | SERVERPUSHKEY | [Server酱](https://sct.ftqq.com//) 官网申请，支持微信消息推送 | 否 |
   |   WEIXIN_WEBHOOK | 企业微信机器人WEBHOOK | 否 |
   | FEISHU_WEBHOOK | 飞书机器人WEBHOOK | 否 |

4. 仓库 -> Actions, 检查Workflows并启用。

## 预览

| 掘金每日签到 | 海底掘金游戏 |
|:-----------:| :-------------:|
| ![掘金每日签到](https://user-images.githubusercontent.com/24502299/156475511-342cfcd8-3b66-4b9c-8614-215e0b4e08a1.jpg) | ![海底掘金游戏](https://user-images.githubusercontent.com/24502299/156475550-c8cc459a-3b27-4ca6-a07b-902b65bea7a9.jpg) |

## 问题

### 如何获取Cookie

掘金网站Cookie, 打开浏览器，登录 [掘金](https://juejin.cn/), 打开控制台DevTools(快捷键F12) -> Network，复制 cookie, **掘金Cookie有效期约1个月需定期更新.**

DevTools截图:
<img width="1156" alt="getcookie" src="./resources/getcookie.png">

### 如何授权海底掘金游戏

运行自动化后通知订阅人 `玩家未授权, 请前往掘金授权!`, 说明您是新玩家从始至终未进行海底掘金游戏, 需要先进行游戏授权.

授权步骤: 登陆 [掘金](https://juejin.cn/) -> 每日签到 -> 海底掘金挑战赛(点击进入游戏, 点击授权, 最好再随意玩一局). 后续就可以由掘金助手自动处理.

或点击👇这个海报帮您直达海底掘金挑战赛

[![海底掘金挑战赛](https://user-images.githubusercontent.com/24502299/151397151-0d69998a-2310-4a32-945f-c8e0035ed65d.png)](https://juejin.cn/game/haidijuejin/)

## 贡献

这个项目的存在要感谢所有做出贡献的人。 请先阅读 [[Contribute](CONTRIBUTING.md)]。  
您可以将任何想法作为 [拉取请求](https://github.com/iDerekLi/juejin-helper/pulls) 或 [GitHub问题](https://github.com/iDerekLi/juejin-helper/issues) 提交。

## 赞赏
### ☕️微信赞赏！
<img src="https://user-images.githubusercontent.com/24502299/150144723-863ad914-3849-40df-8857-5ec5cd60cacd.JPG" alt="微信赞赏" width="300" />

## 许可

[MIT](./LICENSE)
