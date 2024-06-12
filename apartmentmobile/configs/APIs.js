import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const BASE_URL = "http://192.168.1.8:8000/";
export const endpoints = {
  get_user: "/users/",
  login: "/o/token/",
  "current-user": "/users/current-user/",
  complaints: "/complaints/",
  "complaint-detail": (complaintId) => `/complaints/${complaintId}/`,
  comments: (complaintId) => `/complaints/${complaintId}/comments/`,
  ecabinet: "/users/ecabinets/",
  ecabinets: "/ecabinets/",
  carcard: "/users/carcards",
  add_item: "/additem/",
  get_items: "/items/",
  update_item: (itemId) => `/additem/${itemId}/`,
  lock: (userId) => `/admins/${userId}/update_active/`,
  "user-detail": (userId) => `/admins/${userId}`,
  phone_number: "/phonenumbers/",
  items: (ecabinetId) => `/ecabinets/${ecabinetId}/items/`,
  liked: (complaintId) => `/complaints/${complaintId}/like/`,
  get_likes: (complaintId) => `/complaints/${complaintId}/get_likes/`,
  add_comment: (complaintId) => `/complaints/${complaintId}/add_comment/`,
  update_comment: (commentId) => `/comments/${commentId}/`,
  delete_comment: (commentId) => `/comments/${commentId}/`,
  carcards: "/carcards/",
  "carcard-detail": (carcardid) => `/carcards/${carcardid}/`,
  tags: "/tags/",
  receipts: "/receipts/",
  "receipt-detail": (receiptid) => `/receipts/${receiptid}`,
  "create-payment": "/payments/create-payment/",
  add_complaint: "/addcomplaints/",
  tranferpayment: "/paymentdetails/",
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
