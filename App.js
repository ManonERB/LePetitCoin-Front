import { StyleSheet, BlurView } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Home from "./screens/Home";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import FavoriteToilets from "./screens/FavoriteToilets";
import FunFacts from "./screens/FunFacts";
import Profile from "./screens/Profile";
import ToiletPage from "./screens/ToiletPage";
import AddToilet from "./screens/AddToilet";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import user from './reducers/user'


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const store = configureStore({
  reducer: {user} ,
});

const TabNavigator = () => {
  return (
    <Tab.Navigator

      screenOptions={({ route }) => ({
        tabBarStyle: {backgroundColor: "#B08BBB", borderRadius: 8 },
        tabBarLabelStyle: {color: "black"},
        tabBarActiveTintColor: "#A86B98",
        tabBarInactiveTintColor: "white",
        tabBarActiveBackgroundColor: "white",
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          // selon la route, les icones va s'afficher.
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Favoris") {
            iconName = "heart";
          } else if (route.name === "Fun facts") {
            iconName = "toilet-paper";
          } else if (route.name === "Profil") {
            iconName = "user-alt";
          }

          return (
            <FontAwesome name={iconName} size={size} color={color} solid />
          );
        },
        // couleur de fond violette ou blanc en fonction de l'activité
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Favoris" component={FavoriteToilets} />
      <Tab.Screen name="Fun facts" component={FunFacts} />
      <Tab.Screen name="Profil" component={Profile} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: true }}>
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="AddToilet" component={AddToilet} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  tabs: {
    
  },
});
