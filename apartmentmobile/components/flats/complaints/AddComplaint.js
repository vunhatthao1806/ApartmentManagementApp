import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Checkbox,
  Chip,
  Icon,
  TextInput,
  ToggleButton,
  TouchableRipple,
} from "react-native-paper";
import Style from "./Style";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import MyStyles from "../../../styles/MyStyles";
import Styles from "../profiles/Styles";
import APIs, { authAPI, endpoints } from "../../../configs/APIs";

const AddComplaint = ({ navigation }) => {
  const [checkedStatus, setCheckedStatus] = useState(false);
  const [checkedComplaint, setCheckedComplaint] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState({
    status: "",
    complaint: "",
  });

  const [complaints, setComplaints] = useState([]);
  const [complaint_tagId, setComplaint_tagId] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  const chooseAvatar = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") alert("Từ chối quyền truy cập");
    else {
      let res = await ImagePicker.launchImageLibraryAsync();
      if (!res.canceled) {
        setSelectedImage(res.assets[0]);
        // console.log(res.assets[0]);
      }
    }
  };

  const loadTags = async () => {
    try {
      let res = await APIs.get(endpoints["tags"]);
      setTags(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  const loadComplaints = async () => {
    try {
      let url = `${endpoints["complaints"]}?complaint_tag_id=${complaint_tagId}`;

      let res = await APIs.get(url);
      setComplaints(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  const loadCreatComplaint = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("status_tag", checkedStatus);
      formData.append("complaint_tag", checkedComplaint);
      console.log(formData);

      const filename = selectedImage.uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const fileType = match ? `image/${match[1]}` : `image`;

      console.log(fileType);
      console.log(filename);
      console.log(selectedImage);

      formData.append("image", {
        uri: selectedImage.uri,
        type: fileType, // hoặc type phù hợp với file của bạn
        name: filename,
      });

      // Gửi dữ liệu form lên server
      let accessToken = await AsyncStorage.getItem("access-token");
      let res = await authAPI(accessToken).post(
        endpoints["add_complaint"],
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Xử lý kết quả trả về từ server
      Alert.alert("Thông báo", "Đăng ký thành công!!!");
    } catch (ex) {
      console.error(ex);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const createComplaint = async () => {
    const statusTag = tags.find((t) => t.id == checkedStatus);
    const complaintTag = tags.find((t) => t.id == checkedComplaint);
    setSelectedTags({
      status: statusTag ? statusTag.id : null,
      complaint: complaintTag ? complaintTag.id : null,
    });
    loadComplaints();
    await loadCreatComplaint();
  };

  const StatusTags = tags.filter((t) => t.id === 4 || t.id === 7);
  const ComplaintTags = tags.filter((t) => t.id >= 1 && t.id <= 3);

  return (
    <ScrollView>
      <View>
        <View style={Styles.uploadImage}>
          <TouchableOpacity onPress={chooseAvatar}>
            {selectedImage === null ? (
              <View>
                <View style={Styles.iconupimage}>
                  <Icon source={"tray-arrow-up"} size={30} />
                </View>
              </View>
            ) : (
              <Image
                source={{ uri: selectedImage.uri }}
                width={100}
                height={100}
                borderRadius={10}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={[Style.margin, Style.container]}>
        <View style={MyStyles.row}>
          <Icon source="pen" color={"#937DC2"} size={28} />
          <Text style={Style.titleComplaint}>Tiêu đề bài viết</Text>
        </View>
        <TextInput
          style={Style.TextInputComplaint}
          value={title}
          onChangeText={(title) => setTitle(title)}
          multiline={true}
        />
      </View>

      <View style={[Style.margin, Style.container]}>
        <View style={MyStyles.row}>
          <Icon source="book-open-variant" color={"#937DC2"} size={28} />
          <Text style={[Style.titleComplaint]}>Nội dung</Text>
        </View>

        <TextInput
          label=""
          value={content}
          onChangeText={(content) => setContent(content)}
          multiline={true}
          style={Style.TextInputComplaint}
        />
      </View>

      <View
        style={[
          Style.margin,
          Style.container,
          MyStyles.row,
          Style.justifyContent,
        ]}
      >
        <View>
          <Text style={[Style.titleComplaint, Style.titleTag]}>Status tag</Text>
          {StatusTags === null ? (
            <ActivityIndicator />
          ) : (
            <>
              {StatusTags.map((c) => (
                <Chip
                  mode={checkedStatus === c.id ? "flat" : "outlined"}
                  key={c.id}
                  onPress={() => {
                    setCheckedStatus(checkedStatus === c.id ? null : c.id);
                  }}
                  style={Style.tags}
                  icon="shape-plus"
                >
                  {c.name}
                </Chip>
              ))}
            </>
          )}
        </View>

        <View>
          <Text style={[Style.titleComplaint, Style.titleTag]}>
            Complaint tag
          </Text>
          {ComplaintTags === null ? (
            <ActivityIndicator />
          ) : (
            <>
              {ComplaintTags.map((c) => (
                <Chip
                  mode={checkedComplaint === c.id ? "flat" : "outlined"}
                  key={c.id}
                  onPress={() => {
                    setCheckedComplaint(
                      checkedComplaint === c.id ? null : c.id
                    );
                  }}
                  style={Style.tags}
                  icon="shape-plus"
                >
                  {c.name}
                </Chip>
              ))}
            </>
          )}
        </View>
      </View>

      <View>
        <TouchableOpacity style={Style.buttonCreate} onPress={createComplaint}>
          <Text style={Style.textCreate}>Create</Text>
        </TouchableOpacity>
      </View>

      {selectedTags.status || selectedTags.complaint ? (
        <View style={[Style.margin, Style.container]}>
          <Text>Selected Tags:</Text>
          {selectedTags.status && <Text>Status: {selectedTags.status}</Text>}
          {selectedTags.complaint && (
            <Text>Complaint: {selectedTags.complaint}</Text>
          )}
        </View>
      ) : null}
    </ScrollView>
  );
};

export default AddComplaint;
