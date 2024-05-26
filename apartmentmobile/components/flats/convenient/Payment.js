import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { authAPI, endpoints } from "../../../configs/APIs";
import MyStyles from "../../../styles/MyStyles";
import Style from "./Style";
import { Icon, List } from "react-native-paper";

const Payment = () => {
  const [status, setStatus] = useState("False");
  const [receipts, setReceipts] = useState([]);
  const loadReceipts = async () => {
    try {
      let accessToken = await AsyncStorage.getItem("access-token");
      let url = `${endpoints["receipts"]}?status=${status}`;
      let res = await authAPI(accessToken).get(url);
      setReceipts(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };
  useEffect(() => {
    loadReceipts();
  }, [status]);
  const getIcon = (tagName) => {
    switch (tagName.toLowerCase()) {
      case "điện":
        return "home-lightning-bolt";
      case "nước":
        return "water";
      case "phí quản lý":
        return "wallet";
      default:
        return "receipt";
    }
  };

  const getBackgroundColor = (tagName) => {
    switch (tagName.toLowerCase()) {
      case "điện":
        return { backgroundColor: "yellow" };
      case "nước":
        return { backgroundColor: "blue" };
      case "phí quản lý":
        return { backgroundColor: "green" };
      default:
        return { backgroundColor: "white" };
    }
  };
  return (
    <ScrollView>
      <View style={MyStyles.container}>
        <View style={Style.tiltepayment}>
          <TouchableOpacity onPress={() => setStatus("False")}>
            <Text style={Style.titletextpayment}>Hóa Đơn</Text>
          </TouchableOpacity>

          <Text style={{ borderLeftWidth: 2 }}></Text>
          <TouchableOpacity onPress={() => setStatus("True")}>
            <Text style={Style.titletextpayment}>Lịch sử</Text>
          </TouchableOpacity>
        </View>
        {receipts.map((r) => (
          <TouchableOpacity>
            <View style={[Style.ecabinetStyle, getBackgroundColor(r.tag.name)]}>
              <List.Item
                key={r.id}
                title={r.title}
                left={() => (
                  <Icon source={getIcon(r.tag.name)} size={40} color="black" />
                )}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};
export default Payment;
