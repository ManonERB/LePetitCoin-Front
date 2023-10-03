import { StyleSheet, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import { LogBox } from "react-native";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import Home from "./screens/Home";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/signUp";
import FavoriteToilets from "./screens/FavoriteToilets";
import FunFacts from "./screens/FunFacts";
import Profile from "./screens/Profile";
import ToiletPage from "./screens/ToiletPage";
import Review from "./screens/Review";
import AddToilet from "./screens/AddToilet";
import Map from "./screens/Map";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import user from "./reducers/user";
import funfact from "./reducers/funfact";
import favorites from "./reducers/favorites";

LogBox.ignoreAllLogs();

//les differents types de navigation utilise
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
//le store du redux
const reducers = combineReducers({ user, funfact, favorites });
const persistConfig = { key: "LePetitCoin", storage };
const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
const persistor = persistStore(store);

// Composant personnalisé pour les icônes de l'onglet
const TabIcon = ({ iconName, size, color, isActive }) => {
  const shouldRotate = iconName === "heart" && isActive;
  const rotationDegree = shouldRotate ? "180deg" : "0deg";
  const transformStyle = { transform: [{ rotate: rotationDegree }] };

  return (
    <View
      style={[
        styles.tabIconContainer,
        isActive
          ? styles.activeTabIconContainer
          : styles.inactiveTabIconContainer,
      ]}
    >
      <FontAwesome
        name={iconName}
        size={size}
        color={color}
        solid
        style={transformStyle}
      />
    </View>
  );
};
// Configuration de la navigation tab
const TabNavigator = () => {
  return (
    <Tab.Navigator
      // couleur de fond violette ou blanc en fonction de l'activité
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: "#B08BBB" },
        tabBarLabelStyle: { color: "black" },
        tabBarActiveTintColor: "#A86B98",
        tabBarInactiveTintColor: "white",
        tabBarActiveBackgroundColor: "rgba(255, 255, 255, 0.9)",
        tabBarIcon: ({ color, size, focused }) => {
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
            <TabIcon
              iconName={iconName}
              size={size}
              color={color}
              isActive={focused}
            />
          );
        },

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
// Configuration de la navigation stack
export default function App( { Component, pageProps}) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          {/* Toutes les screens vers lesquelles nous voulons naviguer */}
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="AddToilet" component={AddToilet} />
            <Stack.Screen name="Map" component={Map} />
            <Stack.Screen name="Review" component={Review} />
            <Stack.Screen name="FavoriteToilets" component={FavoriteToilets} />
            <Stack.Screen name="FunFacts" component={FunFacts} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="ToiletPage" component={ToiletPage} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
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
  activeTabIconContainer: {
    // Add your drop shadow styles here when the tab is active
    ...Platform.select({
      ios: {
        shadowColor: "grey",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
      },
      android: {
        shadowColor: "grey",
        shadowOffset: {
          width: 0,
          height: 9,
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 7,
      },
    }),
  },
  inactiveTabIconContainer: {
    // Add any styles here for when the tab is inactive
  },
});
