import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "./components/flats/profile/Profile";
import Chat from "./components/flats/Chat";
import { Icon } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Context from "./configs/Context";
import { useContext, useEffect, useReducer, useState } from "react";
import MyUserReducer from "./reducers/MyUserReducer";
import Login from "./components/users/Login";
import Logo from "./components/users/Logo";
import "moment/locale/vi";
import Convenient from "./components/flats/profile/convenient";
import AccountInfo from "./components/flats/profile/AccountInfo";
import ChangePass from "./components/flats/profile/ChangePass";
import Payment from "./components/flats/convenient/Payment";
import Survey from "./components/flats/convenient/Survey";
import Carcard from "./components/flats/convenient/Carcard";

import Complaint from "./components/flats/complaints/Complaint";
import Notifiaction from "./components/flats/notifications/Notification";
import ComplaintDetail from "./components/flats/complaints/ComplaintDetail";
import Ecabinet from "./components/flats/convenient/ECabinet";
const Stack = createStackNavigator();
const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerTitleAlign: "center" }}
        name="Tài khoản"
        component={Profile}
      />
      <Stack.Screen
        name="Convenient"
        component={Convenient}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="AccountInfo"
        component={AccountInfo}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="ChangePass"
        component={ChangePass}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        options={{ headerShown: true }}
        name="Payment"
        component={Payment}
      />
      <Stack.Screen
        name="Cabinet"
        component={Ecabinet}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Survey"
        component={Survey}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Carcard"
        component={Carcard}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};
const LoginStack = ({ user }) => {
  return (
    <Stack.Navigator>
      {user === null ? (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="MyTab"
            component={MyTab}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
const ComplaintStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ComplaintStack"
        component={Complaint}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ComplaintDetail"
        component={ComplaintDetail}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};
const Tab = createBottomTabNavigator();
const MyTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "rgba(60, 32, 22, 1)",
          width: "97%",
          marginLeft: 6,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
        },
      }}
    >
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          title: "Tin nhắn",
          tabBarIcon: () => <Icon source="chat" size={30} color="white" />,
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="Notification"
        component={Notifiaction}
        options={{
          title: "Thông báo",
          tabBarIcon: () => <Icon source="bell" size={30} color="white" />,
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="Compaint"
        component={ComplaintStack}
        options={{
          title: "Phản ánh",
          tabBarIcon: () => <Icon source="newspaper" size={30} color="white" />,
          headerTitleAlign: "center",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          title: "Tài khoản",
          tabBarIcon: () => <Icon source="account" size={30} color="white" />,
          headerTitleAlign: "center",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};
const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);
  return (
    <Context.Provider value={[user, dispatch]}>
      <NavigationContainer>
        {loading ? (
          <Stack.Navigator>
            <Stack.Screen
              name="Logo"
              options={{ headerShown: false }}
              component={Logo}
            />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen name="LoginStack" options={{ headerShown: false }}>
              {() => <LoginStack user={user} />}
            </Stack.Screen>
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </Context.Provider>
  );
};
export default App;
