import { StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SignUp from './screens/SignUp';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const store = configureStore({
  reducer: {} ,
});

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = '';

        // si la route est home, alors petit icône maison
        if (route.name === 'Home') {
          iconName = 'house'
        } else if (route.name === 'FavoriteToilets') {
          iconName = 'heart'
        } else if (route.name === 'FunFacts') {
          iconName = 'toilet-paper'
        } else if (route.name === 'Profile') {
          iconName = 'user'
        }
       
        return <FontAwesome name={iconName} size={size} color={color} />;
      },
      // couleur de fond violette ou blanc en fonction de l'activité
      tabBarActiveTintColor: '#B08BBB',
      tabBarInactiveTintColor: '#ffffff',
      headerShown: false,
    })}>
    
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
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
