import { StyleSheet } from "react-native";

export default StyleSheet.create({
  avatarprofile: {
    position: "absolute",
    left: 115,
    top: 20,
  },
  avatarbackground: {
    backgroundColor: "rgba(60,32,22,0.7)",
    width: "100%",
    height: 100,
    position: "relative",
  },
  subject: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#212121",
  },
  item: {
    marginLeft: 25,
    color: "#212121",
  },
  image: {
    width: "100%",
    height: 200,
  },
  searchbar: {
    position: "absolute",
    width: 300,
    top: 70,
    left: 60,
    height: 60,
    backgroundColor: "rgba(60, 32, 22, 0.8)",
  },
  imagecontainer: {
    position: "relative",
  },
  avatarconvenient: {
    position: "absolute",
    left: 130,
    top: 140,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
