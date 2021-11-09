const nodemailer = require("nodemailer");

async function main({ subject, text, html }) {
  const env = require("./env");

  const auth = {
    user: env.EMAIL_USER, // generated ethereal user
    pass: env.EMAIL_PASS, // generated ethereal password
  };

  const transporter = nodemailer.createTransport({
    host: "smtp." + auth.user.match(/@(.*)/)[1],
    secure: true,
    auth
  });

  await transporter.sendMail({
    from: `稀土掘金助手 <${auth.user}>`, // sender address（'"Fred Foo 👻" <foo@example.com>'）
    to: env.EMAIL_TO, // list of receivers
    subject, // Subject line
    text, // plain text body
    html // html body
  });

  console.log("已通知订阅人！");
}

module.exports = main;

// main().catch(console.error);
