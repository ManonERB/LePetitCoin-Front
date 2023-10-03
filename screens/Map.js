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
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { getDistance } from "geolib";

export default function Map({ navigation }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [rechercherUnCoin, setRechercherUnCoin] = useState("");
  const [toilet, setToilet] = useState([]);
  const [searchedToilets, setSearchedToilets] = useState([]);
  const [filteredToilets, setFilteredToilets] = useState([]);
  const [initialRegion, setInitialRegion] = useState(null);
  const [lastPressedMarkerId, setLastPressedMarkerId] = useState(null);

  //add loading function to avoid crash due to current position not being loaded before map
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
        // set user's current location and set initial map region
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentPosition(location.coords);
        setInitialRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.02,
        });
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          setCurrentPosition(location.coords);
        });
        setLoading(false);
      }
    })();
  }, []);
  
  // Fetch toilets around user's current position
  useEffect(() => {
    if (currentPosition) {
      // Check if currentPosition is not null
      fetch(`http://${process.env.EXPO_PUBLIC_IP}/toilet/map`)
        .then((response) => response.json())
        .then((data) => {
          // console.log('data', data.toilets);

          const filteredToilets = data.toilets.filter((toiletData) => {
            const distance = getDistance(
              {
                latitude: currentPosition.latitude,
                longitude: currentPosition.longitude,
              },
              {
                latitude: toiletData.point_geo.lat,
                longitude: toiletData.point_geo.lon,
              }
            );
            return distance <= 1000; // Filter toilets within 1km distance
          });

          setToilet(filteredToilets);
        });
    }
  }, [currentPosition]);

  const handleSearchByCommune = () => {
    if (rechercherUnCoin === "") {
      // If search term is empty, show toilets around current position
      setSearchedToilets([]);
    } else {
      // Fetch toilets based on commune search term
      fetch(`http://${process.env.EXPO_PUBLIC_IP}/toilet/recherche`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commune: rechercherUnCoin }),
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log('data', data.toilets[0].commune)
          setRechercherUnCoin("");
          if (data.result) {
            setSearchedToilets(data.toilets);
          } else {
            setSearchedToilets([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching toilets:", error);
        });
    }
  };

  const handleMarkerPress = (toiletId) => {
    navigation.navigate("ToiletPage", { toiletId });
  };
  
  return (
    <View style={styles.mapContainer}>
      <View style={styles.InputPlaceholder}>
        <TextInput
          placeholder="Recherche ton petit coin idéal..."
          style={styles.placeholder}
          onChangeText={(value) => setRechercherUnCoin(value)}
          value={rechercherUnCoin}
        />
        <FontAwesome
          name="search"
          onPress={handleSearchByCommune}
          size={25}
          color="#B08BBB"
          style={styles.searchIcon}
        />
      </View>
      <View style={styles.containerButtons}>
        <TouchableOpacity
          style={styles.buttonAddToilet}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("AddToilet")}
        >
          <Text style={styles.textButton}>Un petit coin à ajouter ?</Text>
        </TouchableOpacity>
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
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        currentPosition && (
          <MapView
            initialRegion={initialRegion}
            mapType="roadmap"
            style={styles.map}
          > 
            <Marker
              pinColor="#fecb2d"
              title="My location"
              coordinate={{
                latitude: currentPosition.latitude,
                longitude: currentPosition.longitude,
              }}
            />
            {(searchedToilets.length > 0 ? searchedToilets : toilet).map(
              (toiletData, i) => {
                const distance = getDistance(
                  {
                    latitude: currentPosition.latitude,
                    longitude: currentPosition.longitude,
                  },
                  {
                    latitude: toiletData.point_geo.lat,
                    longitude: toiletData.point_geo.lon,
                  }
                );

                return (
                  <Marker
                  key={i}
                  pinColor="tomato"
                  coordinate={{
                    latitude: toiletData.point_geo.lat,
                    longitude: toiletData.point_geo.lon,
                  }}
                  title={toiletData.title}
                  description={`Distance: ${distance} meters`}
                  onPress={() => handleMarkerPress(toiletData._id)} // Pass the toilet ID
                />
                );
              }
            )}
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
    width: "90%",
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
    padding: 10,
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
