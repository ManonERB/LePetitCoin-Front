import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  Modal, 
  Switch 
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import AddToilet from "./AddToilet";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import user, { recupeToilet } from "../reducers/user";
import { configureStore } from "@reduxjs/toolkit";

const Stack = createNativeStackNavigator();

// store configuré dans App.js - sert pour récupérer les cards avec infos des toilets dans la BDD

export default function Home({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [currentPosition, setCurrentPosition] = useState(null);
  const [rechercherUnCoin, setRechercherUnCoin] = useState("");
  const [toilet, setToilet] = useState([]);
  const [filteredToilets, setFilteredToilets] = useState([]);
  const [modalVisible, setModalVisible] = useState (false) // passer à false
  const [handicapAccess, setHandicapAccess] = useState(false); // état = pour les toogles
  const [tableALanger, setTableALanger] = useState (false)
  const [cleanliness, setCleanliness] = useState (0)
  const toggleSwitchHandicapAccess = () => setHandicapAccess(previousState => !previousState); // previousState = initialisation (false ou true)
  const toggleSwitchTableALanger = () => setTableALanger(previousState => !previousState)

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("j'ai dit non")
        setModalVisible(true);
      } else {
          Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
            setCurrentPosition(location.coords);
          })
        };
      try {
        // Spécial pour le tel de MANON, on essaie de faire qqch avec la localisation, SI ça ne fonctionne pas on en déduit qu'on n'a pas l'autorisation. Donc on en rajoute une couche avec un try, on rajoute la localisation (négative) et donc on en rajoute une couche dans le catch avec "setModalVisible (true)"
          let location = await Location.getCurrentPositionAsync()
      }catch(e) {
        console.log("erreur",e);
        setModalVisible(true);
      }
    }
  )();
  
  }, []);
  
  const handleClose = () => {
    setModalVisible(false);
  };
  // Fetch toilets within 1km of the current position

  // Fetch toilets within 1km of the current position
  useEffect(() => {
    if (currentPosition) {
      fetchToiletsNearby(currentPosition);
    }
  }, [currentPosition]);

  const fetchToiletsNearby = async (coords) => {
    const latitude = coords.latitude;
    const longitude = coords.longitude;

    // Fetch data from collection and filter it
    const response = await fetch(
      `http://${process.env.EXPO_PUBLIC_IP}/toilet?latitude=${latitude}&longitude=${longitude}&distance=1`
    );

    if (response.ok) {
      const data = await response.json();
      // Log the response data to see if it contains the expected toilets
      // Assuming the response contains an array of toilets, update the state
      const toiletsWithDistance = data.toilets.map((toiletData) => {
        const distance = getDistanceInKm(
          longitude,
          latitude,
          toiletData.point_geo.lon,
          toiletData.point_geo.lat
        );
        return { ...toiletData, distance: distance };
      });
      setToilet(toiletsWithDistance);
    } else {
      console.error("Error fetching toilets data");
    }
  };

  const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    // Calculate distance using Haversine formula
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const toRad = (value) => (value * Math.PI) / 180;

  const handleSearchByCommune = () => {
    const searchResults = toilet.filter(
      (data) => data.commune.toLowerCase() === rechercherUnCoin.toLowerCase()
    );
    setFilteredToilets(searchResults);
  };

  return (
    <View style={styles.container}>
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
          onPress={() => handleSearchByCommune()}
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
            onPress={() => navigation.navigate("Map")}
          >
            <FontAwesome name="map" size={18} solid color="#A86B98" />
            <Text style={styles.textMap}>Map</Text>
          </TouchableOpacity>
        </View>
      </View>
  <Modal visible={modalVisible} animationType="fade" transparent>
   <View style={styles.centeredView}>
      <View style={styles.modalView}>
       <View style={styles.InputPlaceholderModal}>
        <TextInput placeholder="Recherchez votre trône royal..." style={styles.placeholderModal} />
        <FontAwesome
          name="search"
          onPress={() => handleSearchByCommune()}
          size={20}
          color="#B08BBB"
          // à vérifier le chemin pour aller chercher le nom de la commune
        />
       </View>
       <View style={styles.containerTogglesGeneral}>
         {/* <View style={styles.containerToggles}>

         <Text style = {styles.rechercheText}>Propreté :</Text>
         <MultiRangeSlider
          min={1}
          max={5}
          onChange={({ min, max }) => console.log(`min = ${min}, max = ${max}`)}   
          />
         </View> */}

         <View style={styles.containerToggles}>
          <Text style={styles.rechercheText}>
            Accès handicapé :
          </Text>
          <View style = {styles.toggles}>
          <Switch
            trackColor={{false: '#767577', true: '#B08BBB'}}
            thumbColor={handicapAccess ? '#A86B98' : '#A86B98'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitchHandicapAccess}
            value={handicapAccess}
            transparent
          />
          </View>
         </View>
        <View style={styles.containerToggles}>
          <Text style={styles.rechercheText}>
            Table à langer :
          </Text>
          <View style = {styles.toggles}>
          <Switch
            trackColor={{false: '#767577', true: '#B08BBB'}} 
            thumbColor={tableALanger ? '#A86B98' : '#F4F3F4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitchTableALanger}
            value={tableALanger}
            transparent
          />
          </View>
        </View>
  
      </View>
      <TouchableOpacity onPress={() => handleClose()} style={styles.button} activeOpacity={0.8}>
          <Text style={styles.textButton}>Close</Text>
       </TouchableOpacity>
    </View>
   </View>
  </Modal>
      <ScrollView style={styles.scroll}>
        {/* If there are filtered toilets, show them; otherwise, show all toilets */}
        {filteredToilets.length > 0
          ? filteredToilets.map((data, i) => (
              <View key={i} style={styles.cardToilet}>
                <Image
                  style={styles.image}
                  source={require("../assets/LeSplendido.jpg")}
                />
                <View style={styles.textCard}>
                  <Text style={styles.title}>{data.commune}</Text>
                  <View style={styles.caracteristiques}>
                    <Text>
                      Gratuit : {data.fee !== undefined ? `${data.fee}` : "- -"}
                    </Text>
                    <Text>
                      Horaires:
                      {data.tags_opening_hours !== null
                        ? `${data.tags_opening_hours}`
                        : "- -"}
                    </Text>
                  </View>
                  <View style={styles.distanceEtAvis}>
                    <Text style={styles.distance}>
                      {data.distance !== undefined
                        ? `Distance: ${data.distance.toFixed(1)} km`
                        : "-"}
                    </Text>
                    <View style={styles.avisContainer}>
                      <Text style={styles.avis}>Etoiles</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          : toilet.map((data, i) => (
              <View key={i} style={styles.cardToilet}>
                <Image
                  style={styles.image}
                  source={require("../assets/LeSplendido.jpg")}
                />
                <View style={styles.textCard}>
                  <Text style={styles.title}>{data.commune}</Text>
                  <View style={styles.caracteristiques}>
                    <Text>
                      Gratuit : {data.fee !== undefined ? `${data.fee}` : "- -"}
                    </Text>
                    <Text>
                      Horaires:
                      {data.tags_opening_hours !== null
                        ? `${data.tags_opening_hours}`
                        : "- -"}
                    </Text>
                  </View>
                  <View style={styles.distanceEtAvis}>
                    <Text style={styles.distance}>
                      {data.distance !== undefined
                        ? `Distance: ${data.distance.toFixed(1)} km`
                        : "-"}
                    </Text>
                    <View style={styles.avisContainer}>
                      <Text style={styles.avis}>Etoiles</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingTop: 40,
  },

  title: {
    color: "#A86B98",
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 12,
  },
  placeholder: {
    color: "#B08BBB",
    fontWeight: "bold",
    alignItems: "center",
    height: 50,
    width: "90%",
  },
  containerButtons: {
    flexDirection: "row",
  },
  InputPlaceholder: {
    flexDirection: "row",
    width: "90%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 10,
    // rajouter ombre
    backgroundColor: "white",
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    padding: 10,
  },
  searchIcon: {
    color: "#A86B98",
  },
  containerButtons: {
    flexDirection: "row",
    height: 50,
  },
  scroll: {
    marginTop: 7,
  },
  cardToilet: {
    flexDirection: "row",
    alignItems: "center",
    width: "95%",
    height: 140,
    borderRadius: 15,
    padding: 5,
    backgroundColor: "white",
    borderStyle: "solid",
    borderColor: "black",
    borderWeight: 1,
    shadowOffset: {
      width: 0,
      height: 3,
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
    },
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
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
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
  image: {
    width: 140,
    height: 110,
    borderRadius: 15,
    paddingLeft: 10,
  },
  caracteristiques: {
    flexDirection: "column",
  },
  textCard: {
    flexDirection: "column",
    paddingLeft: 8,
  },
  distanceEtAvis: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  distance: {
    color: "#B08BBB",
    fontSize: 14,
    fontWeight: "bold",
  },
  avis: {
    color: "#B08BBB",
    fontSize: 14,
    fontWeight: "bold",
    paddingRight: 10,
    paddingLeft: 60,
  },
  avisContainer: {
    alignItems: "flex-end",
  },
  centeredView : {
    alignItems : 'center',
    justifyContent : 'center',
    // alignContent : 'center'
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width : '90%',
    height : '80%',
    alignItems: 'center',
    alignContent : 'center',
    justifyContent : 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  
  InputPlaceholderModal : {
    flexDirection: "row",
    marginBottom: 10,
    borderRadius : 8,
    width: "90%",
    height: 50,
    paddingLeft : 10,
    alignContent: "space-between",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#white",
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  placeholderModal: {
    flexDirection : 'row',
    borderRadius: 8,
    marginBottom: 10,
    paddingLeft : 10,
    fontWeight : "bold",
    color : '#B08BBB',
    fontSize : 13,
    alignContent: "space-between",
    alignItems: "center",
    justifyContent: "center",
    height : 50,
    width : "100%",
  },
  input: {
    width: 150,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    fontSize: 16,
  },
  button: {
    width: 150,
    marginTop: 20,
    height : '10%',
    backgroundColor: '#A86B98',
    borderRadius: 10,
    alignItems: 'center',
    alignContent : "center",
    justifyContent : 'center',
  },
  containerTogglesGeneral : {
    marginTop : 20,
  },
  containerToggles : {
    flexDirection : "column",
    alignItems : "center",
  },
  textButton: {
    color: '#ffffff',
    justifyContent : 'center',
    height: 24,
    fontWeight: '600',
    fontSize: 15,
  },
  rechercheText : {
    fontSize : 12,
    color : "#A86B98",
    fontWeight : 'bold'
  }
});
