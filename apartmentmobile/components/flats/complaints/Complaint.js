import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Avatar,
  Card,
  Chip,
  List,
  Searchbar,
} from "react-native-paper";
import Style from "./Style";
import moment from "moment";
import RenderHTML from "react-native-render-html";
import MyStyles from "../../../styles/MyStyles";
import APIs, { endpoints } from "../../../configs/APIs";
const Complaint = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const [complaint_tagId, setComplaint_tagId] = useState("");
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();
  const [showFullContent, setShowFullContent] = useState({});
  const [tags, setTags] = useState([]);

  const loadTags = async () => {
    try {
      let res = await APIs.get(endpoints["tags"]);
      setTags(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const loadComplaints = async () => {
    try {
      let url = `${endpoints["complaints"]}?complaint_tag_id=${complaint_tagId}`;

      let res = await APIs.get(url);
      setComplaints(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  const handleToggleContent = (id) => {
    setShowFullContent((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const maxContentLength = 100; // Giới hạn số lượng ký tự để hiển thị trước khi bấm "Đọc thêm"

  useEffect(() => {
    loadComplaints();
  }, [complaint_tagId]);

  const search = (value, callback) => {
    callback(value);
  };
  const ComplaintTags = tags.filter((t) => t.id >= 1 && t.id <= 3);

  return (
    <View style={[MyStyles.containercomplaint]}>
      <Text style={[Style.cates, Style.margin]}>Bản tin góp ý</Text>

      <View style={[MyStyles.row, MyStyles.wrap]}>
        <Chip
          mode={!complaint_tagId ? "flat" : "outlined"}
          onPress={() => search("", setComplaint_tagId)}
          style={Style.tags}
          icon="shape-plus"
        >
          Tất cả
        </Chip>

        {ComplaintTags === null ? (
          <ActivityIndicator />
        ) : (
          <>
            {ComplaintTags.map((c) => (
              <Chip
                mode={c.id === complaint_tagId ? "flat" : "outlined"}
                key={c.id}
                onPress={() => search(c.id, setComplaint_tagId)}
                style={Style.tags}
                icon="shape-plus"
              >
                {c.name}
              </Chip>
            ))}
          </>
        )}
      </View>

      <ScrollView>
        {complaints === null ? (
          <ActivityIndicator />
        ) : (
          <>
            {complaints.map((c) => (
              <TouchableOpacity
                key={c.id}
                onPress={() =>
                  navigation.navigate("ComplaintDetail", { complaintId: c.id })
                }
              >
                <Card key={c.id} style={Style.marginbot}>
                  <View style={[MyStyles.row, MyStyles.wrap, MyStyles.margin]}>
                    <Avatar.Image size={43} source={{ uri: c.user.avatar }} />
                    <View>
                      <Text style={Style.username}>{c.user.username}</Text>
                      <Text style={Style.createdDate}>
                        {moment(c.created_date).format("DD/MM/YYYY HH:mm")}
                      </Text>
                    </View>
                  </View>

                  <Text style={Style.title}>{c.title}</Text>

                  <Card.Cover source={{ uri: c.image }} />
                  <View style={[MyStyles.row, MyStyles.wrap, MyStyles.margin]}>
                    {c.complaint_tag && (
                      <Chip
                        key={c.complaint_tag.id}
                        style={MyStyles.margin}
                        icon="vacuum"
                      >
                        {c.complaint_tag.name}
                      </Chip>
                    )}
                    {c.status_tag && (
                      <Chip
                        key={c.status_tag.id}
                        style={[MyStyles.margin, MyStyles.statustag]}
                        selectedColor="white"
                      >
                        {c.status_tag.name}
                      </Chip>
                    )}
                  </View>
                  <Card.Content style={Style.cardContent}>
                    <RenderHTML
                      contentWidth={width}
                      //source={{html: c.content}}
                      source={{
                        html: showFullContent[c.id]
                          ? c.content
                          : `${c.content.slice(0, maxContentLength)}...`,
                      }}
                      // defaultTextProps={{ style: Style.text }}
                    />

                    {!showFullContent[c.id] &&
                      c.content.length > maxContentLength && (
                        <TouchableOpacity
                          onPress={() => handleToggleContent(c.id)}
                        >
                          <Text style={Style.readMore}>Đọc thêm</Text>
                        </TouchableOpacity>
                      )}
                    {showFullContent[c.id] && (
                      <TouchableOpacity
                        onPress={() => handleToggleContent(c.id)}
                      >
                        <Text style={Style.readMore}>Thu gọn</Text>
                      </TouchableOpacity>
                    )}
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default Complaint;
