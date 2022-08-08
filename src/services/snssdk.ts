import axios from "axios";

const instance = axios.create({
  baseURL: "",
  headers: {
    // "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36",
    referer: "https://juejin.cn/",
    origin: "https://juejin.cn",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site"
  }
});

instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    const res = response.data;
    if ("e" in res) {
      return res;
    }
    if (res.errno !== 200) {
      throw new Error(res.message);
    }
    return res.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
