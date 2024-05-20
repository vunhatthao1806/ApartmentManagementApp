import { Image, Text, View } from "react-native";
import MyStyles from "../../../styles/MyStyles";
import Styles from "../Styles";
import { useContext } from "react";
import Context from "../../../configs/Context";
import moment from "moment";

const AccountInfo = () => {
  const [user, dispatch] = useContext(Context);
  const userInfo = user;
  return (
    <View
      style={[MyStyles.container, { backgroundColor: "rgba(60, 32, 22, 0.5)" }]}
    >
      <View>
        <Image
          style={Styles.accountinfoImage}
          source={
            userInfo.avatar ? { uri: userInfo.avatar } : require("./avatar.jpg")
          }
        />
        <Text
          style={{
            textAlign: "center",
            marginTop: 10,
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Ảnh đại diện
        </Text>
        <Text style={[Styles.subject, { marginTop: 70, marginLeft: 10 }]}>
          Thông tin tài khoản
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
          }}
        >
          <Text style={{ fontSize: 20 }}>Họ</Text>
          <Text style={{ fontSize: 20 }}>{userInfo.first_name}</Text>
        </View>
        <View
          style={{
            marginTop: 5,
            borderBottomWidth: 1,
            borderBottomColor: "white",
            width: "95%",
            alignSelf: "center",
          }}
        ></View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginLeft: 10,
            marginRight: 10,
            marginTop: 20,
          }}
        >
          <Text style={{ fontSize: 20 }}>Họ</Text>
          <Text style={{ fontSize: 20 }}>{userInfo.last_name}</Text>
        </View>
        <View
          style={{
            marginTop: 5,
            borderBottomWidth: 1,
            borderBottomColor: "white",
            width: "95%",
            alignSelf: "center",
          }}
        ></View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginLeft: 10,
            marginRight: 10,
            marginTop: 20,
          }}
        >
          <Text style={{ fontSize: 20 }}>Email</Text>
          <Text style={{ fontSize: 20 }}>{userInfo.email}</Text>
        </View>
        <View
          style={{
            marginTop: 5,
            borderBottomWidth: 1,
            borderBottomColor: "white",
            width: "95%",
            alignSelf: "center",
          }}
        ></View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginLeft: 10,
            marginRight: 10,
            marginTop: 20,
          }}
        >
          <Text style={{ fontSize: 20 }}>Ngày tham gia</Text>
          <Text style={{ fontSize: 20 }}>
            {moment(userInfo.date_joined).format(" Do MMMM YYYY")}
          </Text>
        </View>
        <View
          style={{
            marginTop: 5,
            borderBottomWidth: 1,
            borderBottomColor: "white",
            width: "95%",
            alignSelf: "center",
          }}
        ></View>
      </View>
    </View>
  );
};
export default AccountInfo;
