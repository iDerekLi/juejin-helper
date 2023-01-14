import path from "path";
import nodemailer from "nodemailer";
import axios from "axios";
import env from "./env";

interface NotificationOptions {
  title: string;
  content: string;
  msgtype?: "text" | "html";
}

interface EmailOptions extends NotificationOptions {}
interface DingTalkOptions extends NotificationOptions {}
interface PushPlusOptions extends NotificationOptions {}
interface WeComOptions extends NotificationOptions {}
interface WeiXinOptions extends WeComOptions {}

export class NotificationKit {
  /**
   * 邮件推送
   * @param options
   */
  async email(options: EmailOptions) {
    const auth: { user: string | undefined; pass: string | undefined } = {
      user: env.EMAIL_USER, // generated ethereal user
      pass: env.EMAIL_PASS // generated ethereal password
    };

    if (!auth.user || !auth.pass) {
      throw new Error("邮箱功能不可用, 请先配置邮箱用户和密码。");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp." + (auth.user as any).match(/@(.*)/)[1],
      secure: true,
      port: 465,
      auth,
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      }
    });

    const template = `
<section>
  <header style="padding: 10px 0; border-bottom: 1px solid #f1f1f1;">
    <img src="cid:logo.svg" width="120" height="24" alt="稀土掘金" />
  </header>
  <main style="padding: 10px;">
    ${options.msgtype === "html" ? options.content : `<pre style="margin: 0;">${options.content}</pre>`}
  </main>
  <footer style="padding: 10px 0; border-top: 1px solid #f1f1f1; text-align: center; font-size: 12px; color: #6e6e73;">
    <span>稀土掘金助手</span> |
    <span>Copyright © ${new Date().getFullYear()} Derek Li.</span>
  </footer>
</section>
`.trim();

    await transporter.sendMail({
      from: `稀土掘金助手 <${auth.user}>`, // sender address（'"Fred Foo 👻" <foo@example.com>'）
      to: env.EMAIL_TO, // list of receivers
      subject: options.title, // Subject line
      // text, // plain text body
      html: template, // html body
      attachments: [
        {
          filename: "logo.svg",
          path: path.resolve(__dirname, "../resources/logo.svg"),
          cid: "logo.svg" //same cid value as in the html img src
        }
      ]
    });
  }

  /**
   * PushPlus推送
   * @param options
   */
  async pushplus(options: PushPlusOptions) {
    const token: string | undefined = env.PUSHPLUS_TOKEN;
    if (typeof token !== "string") {
      throw new Error("未配置PushPlus Token。");
    }

    const config = {
      token,
      title: options.title,
      content: options.content,
      topic: "",
      template: "html",
      channel: "wechat",
      webhook: "",
      callbackUrl: "",
      timestamp: ""
    };

    return axios.post("http://www.pushplus.plus/send", config, {
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  /**
   * 钉钉Webhook
   * @param options
   */
  async dingtalkWebhook(options: DingTalkOptions) {
    const url: string | undefined = env.DINGDING_WEBHOOK;
    if (typeof url !== "string") {
      throw new Error("未配置钉钉Webhook。");
    }

    return axios.post(url, {
      msgtype: "text",
      text: {
        content: `${options.title}\n${options.content}`
      }
    });
    // .then(res => console.log(JSON.stringify(res.data)));
  }

  /**
   * 企业微信Webhook
   * @param options
   */
  async wecomWebhook(options: WeComOptions) {
    const url: string | undefined = env.WEIXIN_WEBHOOK;
    if (typeof url !== "string") {
      throw new Error("未配置企业微信Webhook。");
    }

    return axios.post(url, {
      msgtype: "text",
      text: {
        content: `${options.title}\n${options.content}`
      }
    });
  }

  async weixinWebhook(options: WeiXinOptions) {
    return this.wecomWebhook(options);
  }

  async pushMessage(options: NotificationOptions) {
    const trycatch = async (name: string, fn: Function) => {
      try {
        await fn(options);
        console.log(`[${name}]: 消息推送成功!`);
      } catch (e: any) {
        console.log(`[${name}]: 消息推送失败! 原因: ${e.message}`);
      }
    };

    await trycatch("邮件", this.email.bind(this));
    await trycatch("PushPlus", this.pushplus.bind(this));
    await trycatch("钉钉", this.dingtalkWebhook.bind(this));
    await trycatch("微信", this.wecomWebhook.bind(this));
  }
}

export default new NotificationKit();
