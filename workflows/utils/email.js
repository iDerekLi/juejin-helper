const nodemailer = require("nodemailer");
const path = require("path");

async function main({ subject, text, html }) {
  const env = require("./env");

  const auth = {
    user: env.EMAIL_USER, // generated ethereal user
    pass: env.EMAIL_PASS // generated ethereal password
  };

  if (!auth.user || !auth.pass) {
    console.warn("邮箱功能不可用, 请先配置邮箱用户和密码");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp." + auth.user.match(/@(.*)/)[1],
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
        ${html ? html : `<pre style="margin: 0;">${text}</pre>`}
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
    subject, // Subject line
    // text, // plain text body
    html: template, // html body
    attachments: [
      {
        filename: "logo.svg",
        path: path.resolve(__dirname, "../../resources/logo.svg"),
        cid: "logo.svg" //same cid value as in the html img src
      }
    ]
  });

  console.log("已通知订阅人！");
}

module.exports = main;

// main().catch(console.error);
