import axios from "axios";
import Cookies from "universal-cookie";

const { Config } = require("../components/common/AppConfig");
const config = Config();

const cookies = new Cookies();
const customConfig = JSON.parse(sessionStorage.getItem("custom-config"));
export default () => {
  return axios.create({
    baseURL: `${window.location.origin}/emailbrowserapi/api/v1`,
    // baseURL: `${customConfig?.LLMApiHostName}/api/v1`,
    // withCredentials: false
    headers: {
      Authorization: `Bearer ${cookies.get("otsession")}`, // Replace with your token if needed
    },
  });
};
