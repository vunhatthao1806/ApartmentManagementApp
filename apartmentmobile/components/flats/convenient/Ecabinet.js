import { useContext, useEffect, useState } from "react";
import { List } from "react-native-paper";
import { authAPI, endpoints } from "../../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native";

const Ecabinet = () => {
  const [ecabinets, setEcabinets] = useState([]);
  const loadEcabinets = async () => {
    try {
      accessToken = await AsyncStorage.getItem("access-token");
      let res = await authAPI(accessToken).get(endpoints["ecabinet"]);
      setEcabinets(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  useEffect(() => {
    loadEcabinets();
  }, []);

  return (
    <ScrollView>
      {ecabinets.map((c) => (
        <List.Item key={c.id} title={c.name} />
      ))}
    </ScrollView>
  );
};
export default Ecabinet;
