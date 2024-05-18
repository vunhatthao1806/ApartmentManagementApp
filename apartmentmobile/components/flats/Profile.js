import { TouchableOpacity, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { Avatar, Button, List } from "react-native-paper";
import Styles from "./Styles";
import { useContext } from "react";
import Context from "../../configs/Context";
const Profile = ({ navigation }) => {
  const [user, dispatch] = useContext(Context);
  const logout = () => {
    dispatch({
      type: "logout",
    });
  };
  return (
    <View style={MyStyles.container}>
      <View style={Styles.avatarbackground}>
        <Avatar.Image
          style={Styles.avatarprofile}
          source={require("./avatar.jpg")}
          size={150}
        />
        <Button
          icon="camera"
          mode="contained"
          style={{
            width: 50,
            position: "absolute",
            top: 110,
            left: 230,
          }}
          buttonColor="rgba(60, 32, 22, 1)"
        >
          +
        </Button>
      </View>
      <View style={{ marginTop: 100 }}>
        <List.Section>
          <List.Subheader style={Styles.subject}>Setting</List.Subheader>
          <View style={Styles.item}>
            <TouchableOpacity
              onPress={() => navigation.navigate("AccountInfo")}
            >
              <List.Item
                title="Thông tin tài khoản"
                titleStyle={{ fontSize: 20 }}
                left={() => (
                  <List.Icon icon="account" color="rgba(60,32,22,0.8)" />
                )}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("ChangePass")}>
              <List.Item
                title="Thay đổi mật khẩu"
                titleStyle={{ fontSize: 20 }}
                left={() => (
                  <List.Icon icon="shield" color="rgba(60,32,22,0.8)" />
                )}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Convenient")}>
              <List.Item
                title="Tiện ích"
                titleStyle={{ fontSize: 20 }}
                left={() => (
                  <List.Icon icon="star" color="rgba(60,32,22,0.8)" />
                )}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={logout}>
              <List.Item
                title="Đăng xuất"
                titleStyle={{ fontSize: 20 }}
                left={() => (
                  <List.Icon icon="logout" color="rgba(60,32,22,0.8)" />
                )}
              />
            </TouchableOpacity>
          </View>
        </List.Section>
      </View>
    </View>
  );
};
export default Profile;
