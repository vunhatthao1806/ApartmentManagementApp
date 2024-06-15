import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Chat from "./components/flats/Chat";
import { NavigationContainer } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Context from "./configs/Context";
import { useContext, useEffect, useReducer, useState } from "react";
import MyUserReducer from "./reducers/MyUserReducer";
import Login from "./components/users/Login";
import Logo from "./components/users/Logo";
import "moment/locale/vi";
import convenient from "./components/flats/profiles/profile/convenient";
import AccountInfo from "./components/flats/profiles/profile/AccountInfo";
import ChangePass from "./components/flats/profiles/profile/ChangePass";
import Payment from "./components/flats/convenient/Payment";
import Survey from "./components/flats/convenient/Survey";
import Carcard from "./components/flats/convenient/Carcard";

import Complaint from "./components/flats/complaints/Complaint";
import ComplaintDetail from "./components/flats/complaints/ComplaintDetail";
import Items from "./components/flats/convenient/Items";
import ECabinet from "./components/flats/convenient/ECabinet";
import CarcardDetail from "./components/flats/convenient/CarcarDetail";
import CarcardRegister from "./components/flats/convenient/CarcardRegister";
import PaymentDetail from "./components/flats/convenient/PaymentDetail";
import PaymentHistory from "./components/flats/convenient/PaymentHistory";
import AddComplaint from "./components/flats/complaints/AddComplaint";
import TranferPayment from "./components/flats/convenient/TranferPayment";
import EditComment from "./components/flats/complaints/EditComment";
import Services from "./components/flats/admin/profiles/Services";
import ProfileAmin from "./components/flats/admin/profiles/ProfileAdmin";
import ItemCreate from "./components/flats/admin/creations/ItemCreate";
import SurveyCreate from "./components/flats/admin/creations/SurveyCreate";
import Profile from "./components/flats/profiles/profile/Profile";
import LoginFirst from "./components/flats/profiles/profile/LoginFirst";
import ItemUpdate from "./components/flats/admin/creations/ItemUpdate";
import { Icon } from "react-native-paper";
import LockAccount from "./components/flats/admin/creations/LockAccount";
import LockAccountDetail from "./components/flats/admin/creations/LockAccountDetail";
import Surveys from "./components/flats/admin/creations/Surveys";
import SurveyQuestion from "./components/flats/admin/creations/SurveyQuestion";
import QuestionCreate from "./components/flats/admin/creations/QuestionCreate";
const Stack = createStackNavigator();
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        options={{ headerTitleAlign: "center" }}
        name="Tài khoản"
        component={Profile}
      />
      <Stack.Screen
        name="Convenient"
        component={convenient}
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
        component={ECabinet}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Items"
        component={Items}
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
      <Stack.Screen
        name="CarcardDetail"
        component={CarcardDetail}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="CarcardRegister"
        component={CarcardRegister}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="PaymentDetail"
        component={PaymentDetail}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="PaymentHistory"
        component={PaymentHistory}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="TranferPayment"
        component={TranferPayment}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};
const LoginStack = ({ user, onInitialSetupComplete }) => {
  return (
    <Stack.Navigator>
      {user === null ? (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
      ) : user.first_login ? (
        <Stack.Screen name="LoginFirst" options={{ headerShown: false }}>
          {(props) => (
            <LoginFirst
              {...props}
              onInitialSetupComplete={onInitialSetupComplete}
            />
          )}
        </Stack.Screen>
      ) : user.is_staff ? (
        <Stack.Screen
          name="AdminTab"
          component={AdminTab}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="MyTab"
          component={MyTab}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};
const ComplaintStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        name="ComplaintStack"
        component={Complaint}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ComplaintDetail"
        component={ComplaintDetail}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="AddComplaint"
        component={AddComplaint}
        options={{ headerShown: true, tabBarVisible: false }}
      />
      <Stack.Screen
        name="EditComment"
        component={EditComment}
        options={{ headerShown: true, tabBarVisible: false }}
      />
    </Stack.Navigator>
  );
};
const AdminStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        options={{ headerTitleAlign: "center" }}
        name="Tài khoản"
        component={ProfileAmin}
      />
      <Stack.Screen
        name="Services"
        component={Services}
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
        name="ItemCreate"
        component={ItemCreate}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="LockAccount"
        component={LockAccount}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="ItemUpdate"
        component={ItemUpdate}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="LockAccountDetail"
        component={LockAccountDetail}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};
const SurveyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Surveys"
        component={Surveys}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SurveyCreate"
        component={SurveyCreate}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="SurveyQuestion"
        component={SurveyQuestion}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="QuestionCreate"
        component={QuestionCreate}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
//const Tab = createBottomTabNavigator();
const Tab = createMaterialBottomTabNavigator();
const MyTab = () => {
  return (
    <Tab.Navigator
      shifting={true}
      activeColor="#F8F4E1"
      inactiveColor="white"
      barStyle={{
        backgroundColor: "#74512D",
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
const AdminTab = () => {
  return (
    <Tab.Navigator
      shifting={true}
      activeColor="#F8F4E1"
      inactiveColor="white"
      barStyle={{
        backgroundColor: "#74512D",
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
        name="SurveyStack"
        component={SurveyStack}
        options={{
          title: "Khảo sát",
          tabBarIcon: () => (
            <Icon source="playlist-edit" size={30} color="white" />
          ),
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
        component={AdminStack}
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
  const [isInitialSetupComplete, setIsInitialSetupComplete] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);
  const handleInitialSetupComplete = () => {
    setIsInitialSetupComplete(true);
    dispatch({ type: "updateFirstLogin" });
    console.log(user.is_staff);
  };
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
              {() => (
                <LoginStack
                  user={user}
                  onInitialSetupComplete={handleInitialSetupComplete}
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </Context.Provider>
  );
};
export default App;
