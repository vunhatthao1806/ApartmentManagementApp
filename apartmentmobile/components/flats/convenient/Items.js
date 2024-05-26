import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { authAPI, endpoints } from "../../../configs/APIs";
import { Card, Chip, List } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import Style from "./Style";

const Items = ({ route }) => {
  const [items, setItems] = useState([]);
  const ecabinetId = route.params?.ecabinetId;

  const loadItems = async () => {
    try {
      accessToken = await AsyncStorage.getItem("access-token");
      let res = await authAPI(accessToken).get(endpoints["items"](ecabinetId));
      setItems(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  useEffect(() => {
    loadItems();
  }, [ecabinetId]);

  return (
    <ScrollView contentContainerStyle={Style.container}>
      {items.map((item) => (
        <View key={item.id} style={Style.cardContainer}>
          <Card style={Style.card}>
            <Card.Cover source={{ uri: item.image }} />

            <Text style={[Style.titleItem, Style.alignSelf]}>{item.name}</Text>
            <Text style={[Style.alignSelf]}>
              {moment(item.created_date).format("DD/MM/YYYY")}
            </Text>
            <View style={[Style.tagItem, Style.alignSelf]}>
              {item.status_tag && (
                <Chip
                  key={item.status_tag.id}
                  icon="minus-box-outline"
                  style={{
                    backgroundColor:
                      item.status_tag.name === "Chưa nhận hàng"
                        ? "#FF8F8F"
                        : "#B0EBB4",
                  }}
                >
                  {item.status_tag.name}
                </Chip>
              )}
            </View>
          </Card>
        </View>
      ))}
    </ScrollView>
  );
};

export default Items;
