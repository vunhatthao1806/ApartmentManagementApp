import {
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Text,
  Image,
} from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";

import AsyncStorage from "@react-native-async-storage/async-storage";
import MyStyles from "../../../../styles/MyStyles";
import { useState } from "react";
import Styles from "../../Styles";
import { authAPI, endpoints } from "../../../../configs/APIs";

const ChangePass = () => {
  const [usercurrent, setCurrentUser] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const fields = [
    {
      label: "Mật khẩu hiện tại",
      icon: passwordVisible ? "eye-off" : "eye",
      secureTextEntry: !passwordVisible,
      name: "currentpassword",
      onPressIcon: () => setPasswordVisible(!passwordVisible),
    },
    {
      label: "Mật khẩu mới",
      icon: newPasswordVisible ? "eye-off" : "eye",
      secureTextEntry: !newPasswordVisible,
      name: "password",
      onPressIcon: () => setNewPasswordVisible(!newPasswordVisible),
    },
    {
      label: "Xác nhận mật khẩu",
      icon: confirmPasswordVisible ? "eye-off" : "eye",
      secureTextEntry: !confirmPasswordVisible,
      name: "confirm",
      onPressIcon: () => setConfirmPasswordVisible(!confirmPasswordVisible),
    },
  ];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const changepass = async () => {
    if (
      usercurrent?.password !== usercurrent?.confirm ||
      usercurrent?.password === usercurrent.currentpassword
    ) {
      setError(true);
      return;
    } else setError(false);

    setLoading(true);
    try {
      let form = new FormData();
      for (let key in usercurrent)
        if (key === "password") form.append(key, usercurrent[key]);
      let accessToken = await AsyncStorage.getItem("access-token");
      let res = await authAPI(accessToken).patch(
        endpoints["current-user"],
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200) {
        Alert.alert("Thông báo", "Thay đổi mật khẩu thành công!!!");
      }
    } catch (ex) {
      console.log(ex);
    } finally {
      setLoading(false);
    }
  };
  const updateState = (field, value) => {
    setCurrentUser((current) => {
      return { ...current, [field]: value };
    });
  };
  return (
    <View style={MyStyles.container}>
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Image
            style={Styles.imageOnTop}
            source={require("../../../users/apartment.webp")}
          />
          <View style={Styles.input}>
            {fields.map((f) => (
              <TextInput
                value={usercurrent[f.name]}
                onChangeText={(t) => updateState(f.name, t)}
                key={f.label}
                label={
                  <Text style={{ color: "#CCCCCC", fontSize: 20 }}>
                    {f.label}
                  </Text>
                }
                secureTextEntry={f.secureTextEntry}
                style={{ marginTop: 10, backgroundColor: "rgba(60,32,22,0.5)" }}
                right={<TextInput.Icon icon={f.icon} onPress={f.onPressIcon} />}
                placeholderTextColor="white"
                textColor="black"
                cursorColor="black"
                underlineStyle={{ backgroundColor: "rgba(60,32,22,0.8)" }}
              />
            ))}

            <HelperText type="error" visible={error}>
              Mật khẩu không hợp lệ!
            </HelperText>
            <Button
              loading={loading}
              icon="lock"
              mode="contained"
              onPress={changepass}
              buttonColor="rgba(60,32,22,0.8)"
              style={{ width: "80%", alignSelf: "center" }}
            >
              Xác nhận
            </Button>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default ChangePass;
