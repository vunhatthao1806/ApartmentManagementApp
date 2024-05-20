import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const BASE_URL = "http://10.17.64.253:8000/";
export const endpoints = {
  login: "/o/token/",
  "current-user": "/users/current-user/",
  complaints: "/complaints/",
  "complaint-detail": (complaintId) => `/complaints/${complaintId}/`,
  comments: (complaintId) => `/complaints/${complaintId}/comments/`,
  ecabinet: "/users/ecabinets/",
};
export const authAPI = (accessToken) =>
  axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `bearer ${
        accessToken === null
          ? AsyncStorage.getItem("access-token")
          : accessToken
      }`,
    },
  });
export default axios.create({
  baseURL: BASE_URL,
});
