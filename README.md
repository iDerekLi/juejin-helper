![juejin](./resources/logo.svg);

# JuejinHelper-稀土掘金助手

签到、抽奖、自动化工作流。

## 使用

掘金自动每日签到并执行免费抽奖次数最后将结果通过邮件通知订阅人。

使用方法：
1. [Fork 本仓库](https://github.com/iDerekLi/juejin-helper)
2. 当前仓库 -> Settings -> Secrets -> New repository secret, 添加Secrets变量如下:

    | Name | Value |
    | --- | --- |
    | COOKIE | 掘金网站Cookie, 打开浏览器，登录 [掘金](https://juejin.cn/) F12 查看 Network 面板，复制 cookie, **注意：掘金Cookie有效期约1个月，需定期更新Secret->COOKIE** |
    | EMAIL_USER | 发件人邮箱地址(需要开启 SMTP) |
    | EMAIL_PASS | 发件人邮箱密码(SMTP密码) |
    | EMAIL_TO | 订阅人邮箱地址(收件人) |

3. 当前仓库 -> Actions, 检查Workflows并启用工作流。
