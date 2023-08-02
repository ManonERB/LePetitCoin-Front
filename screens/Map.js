import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Dimensions } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import AddToilet from "./AddToilet";

export default function Map({ navigation }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [rechercherUnCoin, setRechercherUnCoin] = useState("");
  //add loading function to avoid crash due to current position not being loaded before map
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          console.log("ici", location); // vérifier que l'on reçoit bien ma location
          setCurrentPosition(location.coords); // mettre quoi renvoyer. pas forcément location.coords
          setLoading(false); // Set loading to false when location data is available
        });
      }
    })();
  }, []);

  return (
    <View style={styles.mapContainer}>
      <View style={styles.InputPlaceholder}>
        <TextInput
          placeholder="Recherche ton petit coin idéal..."
          style={styles.placeholder}
          onChangeText={(value) => setRechercherUnCoin(value)}
          value={rechercherUnCoin}
        />
        {/* en value l'état "rechercherUnCoin', au clic, déclenchement de la fonction handleSubmit, et ... interrogation de l'API ? + filtre de la recherche*/}
        <FontAwesome
          name="search"
          // onPress={() => handleSubmit(data.records[0].fields.commune)} size={25} color='#ec6e5b'
          // à vérifier le chemin pour aller chercher le nom de la commune
        />
      </View>
      <View style={styles.containerButtons}>
        {/* Utilisez les props de navigation pour naviguer vers "AddToilet" */}
        {/* <Stack.Navigator initialRouteName='Home'>
                <Stack.Screen > */}
        <TouchableOpacity
          style={styles.buttonAddToilet}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("AddToilet")}
        >
          <Text style={styles.textButton}>Un petit coin à ajouter ?</Text>
        </TouchableOpacity>
        {/* </Stack.Screen>
                </Stack.Navigator> */}
        <View style={styles.buttonShadow}>
          <TouchableOpacity
            style={styles.buttonMap}
            onPress={() => navigation.navigate("Home")}
          >
            <FontAwesome name="list-ul" size={18} solid color="#A86B98" />
            <Text style={styles.textMap}>List</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Conditional rendering: Show loading indicator while fetching location */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        /* only Show MapView when currentPosition is available */
        currentPosition && (
          <MapView
            initialRegion={{
              latitude: currentPosition.latitude,
              longitude: currentPosition.longitude,
              latitudeDelta: 0.04,
              longitudeDelta: 0.02,
            }}
            mapType="hybrid"
            style={styles.map}
          >
            <Marker coordinate={currentPosition} title="My position" />
            {/* Add more markers for WC locations */}
          </MapView>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "85%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  mapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingTop: 40,
  },
  placeholder: {
    display: "flex",
    color: "#B08BBB",
    fontWeight: "bold",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    height: 50,
    width: "90%",
    padding: 10,
  },
  InputPlaceholder: {
    // rajouter ombre
    flexDirection: "row",
    width: "85%",
    height: 50,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "white",
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  containerButtons: {
    flexDirection: "row",
    height: 50,
  },
  buttonAddToilet: {
    backgroundColor: "#B08BBB",
    width: "65%",
    padding: 5,
    borderTopEndRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  textButton: {
    color: "white",
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
    width: "100%",
  },
  buttonMap: {
    borderTopStartRadius: 12,
    borderBottomLeftRadius: 12,
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  textMap: {
    color: "#A86B98",
    fontWeight: "bold",
    fontSize: 28,
    marginLeft: 15,
  },
  buttonShadow: {
    // rajouter ombre
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "grey",
    width: 140,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    marginLeft: 10,
  },
});
