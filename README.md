<section align="center">
    <img src="./resources/logo.svg" alt="稀土掘金" width="260" />
</section>

<h1 align="center">JuejinHelper-稀土掘金助手</h1>

<p align="center">签到、抽奖、自动化工作流。</p>

## 使用

自动化运行掘金每日签到, 并执行免费抽奖次数, 最后将结果报告邮件通知订阅人。

1. [Fork 仓库](https://github.com/iDerekLi/juejin-helper)

2. 仓库 -> Settings -> Secrets -> New repository secret, 添加Secrets变量如下:

    | Name | Value |
    | --- | --- |
    | COOKIE | 掘金网站Cookie, 打开浏览器，登录 [掘金](https://juejin.cn/), 控制台DevTools -> Network，复制 cookie, **掘金Cookie有效期约1个月需定期更新.** |
    | EMAIL_USER | 发件人邮箱地址(需要开启 SMTP) |
    | EMAIL_PASS | 发件人邮箱密码(SMTP密码) |
    | EMAIL_TO | 订阅人邮箱地址(收件人). 如需多人订阅使用 `, ` 分割, 例如: `a@163.com, b@qq.com` |

3. 仓库 -> Actions, 检查Workflows并启用。

## 许可

[MIT](./LICENSE)
