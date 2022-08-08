import axios from "axios";
import JuejinHelper from "../index";

const instance = axios.create({
  baseURL: "https://api.juejin.cn",
  headers: {
    referer: "https://juejin.cn/"
  }
});

let juejin: JuejinHelper | null = null;

instance.interceptors.request.use(
  function (config) {
    if (!juejin) config;
    // @ts-ignore
    config.headers.cookie = juejin?.getCookie();

    if ((juejin as JuejinHelper).user) {
      const tokens = (juejin as JuejinHelper).getCookieTokens();
      // @ts-ignore
      config.url += `${config.url.indexOf("?") === -1 ? "?" : "&"}aid=${tokens.aid}&uuid=${tokens.uuid}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    if (response.data.err_no) {
      throw new Error(response.data.err_msg);
    }
    return response.data.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export function setJuejin(context: JuejinHelper) {
  juejin = context;
}

export default instance;
