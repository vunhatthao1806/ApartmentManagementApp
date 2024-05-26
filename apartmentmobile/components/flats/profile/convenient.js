import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import MyStyles from "../../../styles/MyStyles";
import Styles from "../Styles";
import { Avatar, IconButton, Searchbar } from "react-native-paper";
import { useContext } from "react";
import Context from "../../../configs/Context";

const Convenient = ({ navigation }) => {
  const [user, dispatch] = useContext(Context);
  const userAvatar = user ? user.avatar : null;
  return (
    <View style={MyStyles.container}>
      <View>
        <ImageBackground style={Styles.image} source={require("./home.jpg")}>
          <View>
            <Searchbar
              style={Styles.searchbar}
              placeholder="Tìm kiếm"
              iconColor="white"
              placeholderTextColor="white"
              color="white"
            />
          </View>
          <View>
            <Avatar.Image
              style={Styles.avatarconvenient}
              source={
                userAvatar ? { uri: userAvatar } : require("./avatar.jpg")
              }
              size={130}
            />
          </View>
        </ImageBackground>
        <View>
          <Text style={[Styles.subject, { marginTop: 80 }, { marginLeft: 10 }]}>
            Dịch vụ & Tiện ích
          </Text>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={Styles.row}>
            <TouchableOpacity onPress={() => navigation.navigate("Payment")}>
              <View style={{ alignItems: "center" }}>
                <IconButton
                  icon="receipt"
                  size={50}
                  iconColor="rgba(60,32,22,0.8)"
                />
                <Text
                  style={{
                    textAlign: "center",
                    color: "#212121",
                    fontSize: 20,
                  }}
                >
                  Thanh toán
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Cabinet")}>
              <View style={{ alignItems: "center" }}>
                <IconButton
                  icon="file-cabinet"
                  size={50}
                  iconColor="rgba(60,32,22,0.8)"
                />
                <Text
                  style={{
                    textAlign: "center",
                    color: "#212121",
                    fontSize: 20,
                  }}
                >
                  Tủ đồ điện tử
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={Styles.row}>
            <TouchableOpacity onPress={() => navigation.navigate("Carcard")}>
              <View style={{ alignItems: "center" }}>
                <IconButton
                  icon="car"
                  size={50}
                  iconColor="rgba(60,32,22,0.8)"
                />
                <Text
                  style={{
                    textAlign: "center",
                    color: "#212121",
                    fontSize: 20,
                  }}
                >
                  Thẻ xe
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Survey")}>
              <View style={{ alignItems: "center" }}>
                <IconButton
                  icon="form-select"
                  size={50}
                  iconColor="rgba(60,32,22,0.8)"
                />
                <Text
                  style={{
                    textAlign: "center",
                    color: "#212121",
                    fontSize: 20,
                  }}
                >
                  Khảo sát
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
export default Convenient;
