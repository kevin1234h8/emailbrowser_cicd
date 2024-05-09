import axios from "axios";

const { Config } = require("../components/common/AppConfig");
const config = Config();
const customConfig = JSON.parse(sessionStorage.getItem("custom-config"));
export default () => {
  return axios.create({
    baseURL: `${window.location.origin}/emailbrowserapi/api/v1`,
    // baseURL: `${customConfig?.LLMApiHostName}/api/v1`,
    // withCredentials: false
  });
};
