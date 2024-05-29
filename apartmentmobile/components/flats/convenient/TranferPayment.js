import { Alert, Image, View } from "react-native";
import MyStyles from "../../../styles/MyStyles";
import Style from "./Style";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Icon, Text } from "react-native-paper";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI, endpoints } from "../../../configs/APIs";

const TranferPayment = () => {
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const chooseImage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") alert("Từ chối quyền truy cập");
    else {
      let res = await ImagePicker.launchImageLibraryAsync();
      if (!res.canceled) {
        const image = res.assets[0];
        setImage(image);
      }
    }
  };
  const confirm = async () => {
    const filename = image.uri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const fileType = match ? `image/${match[1]}` : `image`;
    if (image) {
      const form = new FormData();
      form.append("avatar", {
        uri: image.uri,
        type: fileType,
        name: filename,
      });
      console.log(image.uri);
      console.log(fileType);
      console.log(filename);
      try {
        let accessToken = await AsyncStorage.getItem("access-token");
        let res = await authAPI(accessToken).patch(
          endpoints["tranferpayment"],
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        Alert.alert("Thông báo", "Xác nhận thành công!!!");
      } catch (ex) {
        console.error(ex);
      }
    }
  };
  return (
    <View style={MyStyles.container}>
      <View style={Style.backgroundtranfer}>
        <View style={Style.uploadImage}>
          <TouchableOpacity onPress={chooseImage}>
            {image ? (
              <Image source={{ uri: image.uri }} />
            ) : (
              <View>
                <View style={Style.iconupimage}>
                  <Icon source={"tray-arrow-up"} size={30} />
                </View>

                <View>
                  <Text style={Style.textupload}>
                    {"Upload màn hình \n chuyển khoản thành công"}
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Button
            mode="contained"
            style={{ width: "90%", alignSelf: "center" }}
            buttonColor="#40A578"
          >
            Xác nhận
          </Button>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default TranferPayment;
