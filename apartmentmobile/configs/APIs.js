import axios from "axios";
const BASE_URL = "http://192.168.1.7:8000/";
export const endpoints = {
  login: "/o/token/",
};

export default axios.create({
  baseURL: BASE_URL,
});
