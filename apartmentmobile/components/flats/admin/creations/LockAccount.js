import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { List, Searchbar } from "react-native-paper";
import Style from "../../convenient/Style";
import Styles from "../../profiles/Styles";
import { useEffect, useState } from "react";
import APIs, { endpoints } from "../../../../configs/APIs";
import moment from "moment/moment";
import { isCloseToBottom } from "../../../utils/Utils";

const LockAccount = ({ navigation }) => {
  const [user, setUser] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const loadUser = async () => {
    if (page > 0) {
      setLoading(true);
      try {
        let url = `${endpoints["get_user"]}?q=${q}&page=${page}`;

        let res = await APIs.get(url);

        if (res.data.next === null) setPage(0);

        if (page === 1) setUser(res.data.results);
        else
          setUser((current) => {
            return [...current, ...res.data.results];
          });
        //console.log(res.data);
      } catch (ex) {
        console.error(ex);
      } finally {
        setLoading(false);
      }
    }
  };

  const loadMore = ({ nativeEvent }) => {
    if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
      setPage(page + 1);
    }
  };

  const search = (value, callback) => {
    setPage(1);
    callback(value);
  };

  useEffect(() => {
    loadUser();
  }, [q, page]);

  return (
    <View
      style={{ marginBottom: 60, marginTop: 10, backgroundColor: "#F8F4E1" }}
    >
      <Searchbar
        placeholder="Nhập từ khóa"
        style={{ backgroundColor: "#74512D" }}
        onChangeText={(q) => search(q, setQ)}
        value={q}
        placeholderTextColor={"white"}
        inputStyle={{ color: "white" }}
        iconColor="white"
      />
      <ScrollView style={{ marginTop: 10 }} onScroll={loadMore}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <>
            {user && user.length > 0 ? (
              user.map((u) => (
                <View
                  style={[Style.ecabinetStyle, { backgroundColor: "#AF8F6F" }]}
                  key={u.id}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("LockAccountDetail", { userid: u.id })
                    }
                  >
                    <List.Item
                      key={u.id}
                      title={u.username}
                      description={moment(u.date_joined).format("DD/MM/YYYY")}
                      left={() => (
                        <Image
                          style={Styles.imageEca}
                          source={
                            u.avatar
                              ? { uri: u.avatar }
                              : require("./default.png")
                          }
                        />
                      )}
                    />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text>No users found</Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default LockAccount;
