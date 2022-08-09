import Cookie from "./cookie";

function parseCookieTokens(cookie: Cookie) {
  const cookieTokens = {
    aid: "",
    uuid: "",
    user_unique_id: "",
    web_id: ""
  };

  const tokensReg = /^__tea_cookie_tokens_(\d+)$/;
  // @ts-ignore
  for (const [key, value] of cookie.entries()) {
    if (tokensReg.test(key)) {
      cookieTokens.aid = key.match(tokensReg)[1];
      const json = JSON.parse(decodeURIComponent(decodeURIComponent(value)));
      cookieTokens.uuid = json.user_unique_id;
      cookieTokens.user_unique_id = json.user_unique_id;
      cookieTokens.web_id = json.web_id;
      break;
    }
  }

  return cookieTokens;
}

export { parseCookieTokens };
