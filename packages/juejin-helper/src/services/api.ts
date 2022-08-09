import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.juejin.cn",
  headers: {
    referer: "https://juejin.cn/"
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
    if (response.data.err_no) {
      throw new Error(response.data.err_msg);
    }
    return response.data.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
