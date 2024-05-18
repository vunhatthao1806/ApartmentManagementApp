import { Alert, Text, TouchableOpacity, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import Style from "./Style";
import { Avatar, Button, TextInput } from "react-native-paper";
import { useContext, useState } from "react";
import Context from "../../configs/Context";
import APIs, { endpoints } from "../../configs/APIs";
const Login = () => {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [user, dispatch] = useContext(Context);
  const login = async () => {
    try {
      let res = await APIs.post(endpoints["login"], {
        username: username,
        password: password,
        client_id: "njQeHngjlC4qlGmjiLDmQ2dRnnRfsdHY3SPvrNrA",
        client_secret:
          "XKHvWtBtIhkaKM2pf3gdGVi0SWxKgdobW4ArAJ00fi7fiYLl7tPcYoZQ6fZoeKGkiAx04cHmSCq9aQJUbGyr8sKLAEPSJbZBFvLxngkdulMIZ4Y1X3JGrMdnQCEY4TKr",
        grant_type: "password",
      });
      console.info(res.data);
    } catch (ex) {
      console.error(ex);
    }
    // console.info(res.data);
    // if (username === "admin" && password === "123") {
    //   dispatch({
    //     type: "login",
    //     payload: {
    //       username: "admin",
    //     },
    //   });
    // } else {
    //   Alert.alert("Cảnh báo", "Tên đăng nhập hoặc mật khẩu không hợp lệ!!!", [
    //     {
    //       text: "OK",
    //       onPress: () => {},
    //     },
    //   ]);
    // }
  };
  return (
    <View style={MyStyles.container}>
      <View>
        <Text style={Style.subject}>Đăng nhập</Text>
      </View>
      <View style={Style.container}>
        <Avatar.Image
          style={Style.logo}
          source={require("./TT.png")}
          size={100}
        ></Avatar.Image>
        <TextInput
          style={{
            marginBottom: 20,
            backgroundColor: "rgba(60,32,22,0.5)",
          }}
          label={
            <Text style={{ color: "#CCCCCC", fontSize: 20 }}>
              Tên đăng nhập
            </Text>
          }
          value={username}
          onChangeText={(username) => setusername(username)}
          placeholder="Nhập tên..."
          placeholderTextColor="white"
          textColor="black"
          cursorColor="black"
          underlineStyle={{ backgroundColor: "rgba(60,32,22,0.8)" }}
        />
        <TextInput
          style={{
            marginBottom: 20,
            backgroundColor: "rgba(60,32,22,0.5)",
          }}
          label={
            <Text style={{ color: "#CCCCCC", fontSize: 20 }}>Mật khẩu</Text>
          }
          value={password}
          onChangeText={(password) => setPassword(password)}
          placeholder="Nhập mật khẩu..."
          placeholderTextColor="white"
          textColor="black"
          cursorColor="black"
          secureTextEntry={true}
          underlineStyle={{ backgroundColor: "rgba(60,32,22,0.8)" }}
        />
        <TouchableOpacity onPress={login}>
          <Button
            mode="contained"
            buttonColor="rgba(60, 32, 22, 1)"
            style={{ width: "60%", alignSelf: "center" }}
          >
            Đăng nhập
          </Button>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Login;
