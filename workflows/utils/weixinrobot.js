const axios = require('axios');

const env = require("./env");

async function weixinrobot({ subject, text, html }) {
    axios.post(env.WEIXIN_WEBHOOK,{
        "msgtype": "text",
        "text": {
            "content": `${subject}\n${text || html}`
        }
    })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error)
        })

}
module.exports = weixinrobot;
