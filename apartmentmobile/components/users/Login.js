import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MyStyles from "../../styles/MyStyles";
import Style from "./Style";
import { Avatar, Button, TextInput } from "react-native-paper";
import { useContext, useState } from "react";
import Context from "../../configs/Context";
import APIs, { authAPI, endpoints } from "../../configs/APIs";
import qs from "qs";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Login = () => {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [user, dispatch] = useContext(Context);
  const login = async () => {
    try {
      const data = qs.stringify({
        grant_type: "password",
        client_id: "njQeHngjlC4qlGmjiLDmQ2dRnnRfsdHY3SPvrNrA",
        client_secret:
          "XKHvWtBtIhkaKM2pf3gdGVi0SWxKgdobW4ArAJ00fi7fiYLl7tPcYoZQ6fZoeKGkiAx04cHmSCq9aQJUbGyr8sKLAEPSJbZBFvLxngkdulMIZ4Y1X3JGrMdnQCEY4TKr",
        username: username,
        password: password,
      });
      const res = await APIs.post(endpoints["login"], data);
      console.info(res.data);
      await AsyncStorage.setItem("access-token", res.data.access_token);
      let user = await authAPI(res.data.access_token).get(
        endpoints["current-user"]
      );
      dispatch({
        type: "login",
        payload: user.data,
      });
    } catch (ex) {
      console.error(
        "Error response:",
        ex.response ? ex.response.data : ex.message
      );
      Alert.alert("Cảnh báo", "Tên đăng nhập hoặc mật khẩu không hợp lệ!!!", [
        {
          text: "OK",
          onPress: () => {},
        },
      ]);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={Style.containerKeyBo}
      >
        <ScrollView
          contentContainerStyle={Style.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <Image
              source={require("./apartment.webp")}
              style={Style.imageOnTop}
            />
          </View>
          <View style={Style.containerLogin}>
            <Text style={Style.titleLogin}>Đăng nhập</Text>
            <Avatar.Image
              style={Style.logo}
              source={require("./TT.png")}
              size={100}
            />
            <TextInput
              style={Style.textInput}
              label={<Text style={Style.textLabel}>Tên đăng nhập</Text>}
              value={username}
              onChangeText={setusername}
              placeholder="Nhập tên..."
              placeholderTextColor="white"
              textColor="black"
              cursorColor="black"
              underlineStyle={{ backgroundColor: "rgba(60,32,22,0.8)" }}
            />
            <TextInput
              style={Style.textInput}
              label={<Text style={Style.textLabel}>Mật khẩu</Text>}
              value={password}
              onChangeText={setPassword}
              placeholder="Nhập mật khẩu..."
              placeholderTextColor="white"
              textColor="black"
              cursorColor="black"
              secureTextEntry
              underlineStyle={{ backgroundColor: "rgba(60,32,22,0.8)" }}
            />
            <TouchableOpacity onPress={login}>
              <Button
                mode="contained"
                buttonColor="rgba(60, 32, 22, 1)"
                style={Style.buttonLogin}
                labelStyle={Style.buttonText}
              >
                Đăng nhập
              </Button>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
export default Login;
