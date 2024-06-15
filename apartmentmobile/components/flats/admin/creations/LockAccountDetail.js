import { Alert, Image, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";
import MyStyles from "../../../../styles/MyStyles";
import { useEffect, useState } from "react";
import Style from "../../convenient/Style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI, endpoints } from "../../../../configs/APIs";
import moment from "moment";

const LockAccountDetail = ({ route }) => {
  const [user, setUser] = useState();
  const userid = route.params?.userid;
  const [isactive, setIsActive] = useState();
  const loadUser = async () => {
    try {
      let accessToken = await AsyncStorage.getItem("access-token");
      let res = await authAPI(accessToken).get(
        endpoints["user-detail"](userid)
      );
      setUser(res.data);
      //console.log(res.data);
      //console.log(res.data.is_active);
    } catch (ex) {
      console.log(ex);
    }
  };
  const update_active = async () => {
    try {
      const newIsActive = user.is_active ? "False" : "True";
      const formData = new FormData();
      formData.append("is_active", newIsActive);
      let accessToken = await AsyncStorage.getItem("access-token");
      let res = await authAPI(accessToken).patch(
        endpoints["lock"](userid),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUser((prevUser) => ({ ...prevUser, is_active: !prevUser.is_active }));
      Alert.alert("Thành công!!!");
    } catch (ex) {
      console.error(ex);
    }
  };
  useEffect(() => {
    loadUser();
  }, [userid]);
  return (
    <View style={[MyStyles.container, { backgroundColor: "#F8F4E1" }]}>
      {user && (
        <View
          style={[
            Style.ecabinetStyle,
            { marginTop: 50, backgroundColor: "#AF8F6F" },
          ]}
        >
          <View style={{ flexDirection: "row", margin: 10 }}>
            <Image
              source={
                user.avatar ? { uri: user.avatar } : require("./default.png")
              }
              style={{ width: 100, height: 100, borderRadius: 100 }}
            />
            <View style={{ marginLeft: 10, marginTop: 30 }}>
              <Text style={{ fontSize: 17 }}>
                Tên người dùng: {user.username}
              </Text>
              <Text style={{ fontSize: 17 }}>
                Ngày đăng ký: {moment(user.date_joined).format("DD/MM/YYYY")}{" "}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 10,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Họ</Text>
            <Text style={{ fontSize: 20 }}>{user.first_name}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 10,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Tên</Text>
            <Text style={{ fontSize: 20 }}>{user.last_name}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 10,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Email</Text>
            <Text style={{ fontSize: 20 }}>{user.email}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 10,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Trạng thái tài khoản
            </Text>
            <Text style={{ fontSize: 20 }}>
              {user.is_active === false ? "Đang khóa" : "Hoạt động"}
            </Text>
          </View>
          <TouchableOpacity>
            {user.is_active === true ? (
              <Button
                onPress={update_active}
                mode="contained"
                style={{ width: "70%", alignSelf: "center", margin: 10 }}
                buttonColor="#FF8F8F"
                textColor="black"
              >
                Khóa tài khoản
              </Button>
            ) : (
              <Button
                onPress={update_active}
                mode="contained"
                style={{ width: "70%", alignSelf: "center", margin: 10 }}
                buttonColor="#A1DD70"
                textColor="black"
              >
                Kích hoạt tài khoản
              </Button>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
export default LockAccountDetail;
