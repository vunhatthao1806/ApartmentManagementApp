import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import APIs, { authAPI, endpoints } from "../../../configs/APIs";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Chip,
  List,
  TextInput,
} from "react-native-paper";
import Style from "./Style";
import MyStyles from "../../../styles/MyStyles";
import moment from "moment";
import RenderHTML from "react-native-render-html";
import { isCloseToBottom } from "../../utils/Utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ComplaintDetail = ({ route }) => {
  const [complaint, setComplaint] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [content, setContent] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const complaintId = route.params?.complaintId;
  const { width } = useWindowDimensions();

  const loadComplaint = async () => {
    try {
      let res = await APIs.get(endpoints["complaint-detail"](complaintId));
      setComplaint(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  const loadLike = async () => {
    try {
      accessToken = await AsyncStorage.getItem("access-token");
      let response = await authAPI(accessToken).post(
        endpoints["liked"](complaintId)
      );
      setLiked(response.data.liked);
      console.log(response.data);
      setLikeCount(response.data.likeCount);
    } catch (ex) {
      console.error(ex);
    }
  };

  const loadLikeCount = async () => {
    try {
      let res = await APIs.get(endpoints["get_likes"](complaintId));
      setLikeCount(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  const loadComments = async () => {
    try {
      let res = await APIs.get(endpoints["comments"](complaintId));
      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (ex) {
      console.error(ex);
    }
  };

  const loadAddComment = async () => {
    try {
      accessToken = await AsyncStorage.getItem("access-token");
      let response = await authAPI(accessToken).post(
        endpoints["add_comment"](complaintId),
        {
          content: comment,
        }
      );
      loadComments();
      setComment("");
    } catch (ex) {
      console.error(ex);
    }
  };

  const handleLike = async () => {
    await loadLike();
    await loadLikeCount();
  };

  const handleComment = async () => {
    await loadAddComment();
  };

  useEffect(() => {
    loadComplaint();
  }, [complaintId]);

  useEffect(() => {
    loadLikeCount();
  }, [complaintId]);

  const loadMoreInfo = ({ nativeEvent }) => {
    if (isCloseToBottom(nativeEvent)) {
      loadComments();
    }
  };

  return (
    <View>
      <ScrollView onScroll={loadMoreInfo}>
        {complaint === null ? (
          <ActivityIndicator />
        ) : (
          <>
            <Card style={Style.marginbot}>
              <Text style={Style.title}>{complaint.title}</Text>

              <View style={[MyStyles.row, MyStyles.wrap, MyStyles.margin]}>
                <Avatar.Image
                  style={Style.marginbot}
                  size={43}
                  source={{ uri: complaint.user.avatar }}
                />
                <View>
                  <Text style={Style.username}>{complaint.user.username}</Text>
                  <Text style={Style.createdDate}>
                    {moment(complaint.created_date).format("DD/MM/YYYY HH:mm")}
                  </Text>
                </View>
              </View>

              <Card.Cover source={{ uri: complaint.image }} />
              <View style={[MyStyles.row, MyStyles.wrap, MyStyles.margin]}>
                {complaint.complaint_tag && (
                  <Chip
                    key={complaint.complaint_tag.id}
                    style={MyStyles.margin}
                    icon="vacuum"
                  >
                    {complaint.complaint_tag.name}
                  </Chip>
                )}
                {complaint.status_tag && (
                  <Chip
                    key={complaint.status_tag.id}
                    style={[MyStyles.margin, MyStyles.statustag]}
                    selectedColor="white"
                  >
                    {complaint.status_tag.name}
                  </Chip>
                )}
              </View>
              <Card.Content>
                <RenderHTML
                  contentWidth={width}
                  source={{ html: complaint.content }}
                />
              </Card.Content>
            </Card>
          </>
        )}

        <View
          style={[
            Style.commentStyle,
            MyStyles.row,
            { justifyContent: "space-between" },
          ]}
        >
          <View style={Style.buttonContainer}>
            <Button
              icon="thumb-up-outline"
              mode="outlined"
              onPress={handleLike}
            >
              Like
            </Button>
          </View>
          <View style={Style.tags}>
            <Text>Lượt thích: {likeCount}</Text>
          </View>
        </View>

        <View style={[MyStyles.row, { justifyContent: "space-between" }]}>
          <TextInput
            style={Style.textInput}
            multiline={true}
            label={"Suy nghĩ của bạn là gì"}
            value={comment}
            onChangeText={setComment}
          />
          <View style={Style.buttonContainer}>
            <Button
              style={Style.button}
              icon="send-circle"
              mode="contained"
              onPress={handleComment}
            />
          </View>
        </View>

        <View style={Style.commentsContainer}>
          {comments.length > 0 ? (
            comments.map((c) => (
              <List.Item
                style={Style.commentStyle}
                key={c.id}
                title={c.user.username}
                description={c.content}
                left={() => (
                  <Avatar.Image size={43} source={{ uri: c.user.avatar }} />
                )}
                right={() => <Text>{moment(c.created_date).fromNow()}</Text>}
              />
            ))
          ) : (
            <View style={Style.noCommentContainer}>
              <Text style={Style.noCommentText}>Chưa có bình luận nào!</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ComplaintDetail;
