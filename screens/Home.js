import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  Switch,
} from "react-native";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import SelectMultiple from "react-native-select-multiple";

//create the stack navigator
const Stack = createNativeStackNavigator();
// store configuré dans App.js - sert pour récupérer les cards avec infos des toilets dans la BDD

export default function Home({ navigation }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [toilet, setToilet] = useState([]);
  const [filteredToilets, setFilteredToilets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [handicapAccess, setHandicapAccess] = useState(false); // état = pour les toogles
  const [tableALanger, setTableALanger] = useState(false);
  const [proprete, setProprete] = useState([0, 5]);
  const [selectedGratuite, setSelectedGratuite] = useState([]); // plusieurs options possibles
  const [rechercherUnCoin, setRechercherUnCoin] = useState("");
  const [communesFiltrees, setCommunesFiltrees] = useState([]);
  const [noResultsMessageVisible, setNoResultsMessageVisible] = useState(false);
  const [modalFiltersVisible, setModalFiltersVisible] = useState(false);
  const [filtersActive, setFiltersActive] = useState(false);

  const [searchedToilets, setSearchedToilets] = useState([]);
  const [sortByDistance, setSortByDistance] = useState(true); // Initial sort by distance

  const gratuiteOptions = ["Gratuites ?", "Payantes ?"];
  const onGratuiteSelectionsChange = (selectedItems) => {
    setSelectedGratuite(selectedItems);
  };

  const user = useSelector((state) => state.user.value);

  const handleValuesChange = (values) => {
    const [minValue, maxValue] = values;
    // Vérifier si le min et le max ont la même valeur
    if (minValue === maxValue) {
      setProprete([minValue, maxValue + 1]);
    } else {
      setProprete(values);
    }
  };

  const handleSearchAndCloseFilters = () => {
    handleSearchByCommune();
    setModalFiltersVisible(false);
  };

  const handleOpenModalFilters = () => {
    setModalFiltersVisible(true);
  };

  const toggleSwitchHandicapAccess = () =>
    setHandicapAccess((previousState) => !previousState); // previousState = initialisation (false ou true)
  const toggleSwitchTableALanger = () =>
    setTableALanger((previousState) => !previousState);

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleSearchAndClose = () => {
    handleSearchByCommune();
    if (rechercherUnCoin !== "") {
      setSelectedGratuite([...selectedGratuite, { label: rechercherUnCoin }]);
    }
    setModalVisible(false);
    setFiltersActive(false);
  };

  const handleSubmit = () => {
    setModalVisible(false);
    setRechercherUnCoin("");
    setCommunesFiltrees([]);
  };

  // Fetch user's current location and update state
  useEffect(() => {
    (async () => {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setModalVisible(true);
      } else {
        // Watch user's position and update state
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          setCurrentPosition(location.coords);
        });
      }
      try {
        // Spécial pour le tel de MANON
      } catch (e) {
        console.log("erreur", e);
        setModalVisible(true);
      }
    })();
  }, []);

  // Fetch nearby toilets when currentPosition changes
  useEffect(() => {
    if (currentPosition) {
      // Check if currentPosition is not null
      fetch(`http://${process.env.EXPO_PUBLIC_IP}/toilet`)
        .then((response) => response.json())
        .then((data) => {
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
            toiletData.distance = distance;
            return distance <= 1000; // Filter toilets within 1km distance
          });
          console.log("Filtered toilets:", filteredToilets.length);

          setToilet(filteredToilets);
        }) // display an error message to the user
        .catch((error) => {
          console.error("Error fetching toilets data:", error);
        });
    }
  }, [currentPosition]);

  //Fetch toilets with search query and update list
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
          setRechercherUnCoin("");
          if (data.result) {
            const filteredByHandicapAccess = data.toilets.filter(
              (toiletData) => {
                if (handicapAccess) {
                  return toiletData.handicapAccess === true;
                }

                return true; // Return all toilets if handicapAccess toggle is off
              }
            );

            setSearchedToilets(filteredByHandicapAccess);
          } else {
            setSearchedToilets([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching toilets:", error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.InputPlaceholder}>
        <TextInput
          placeholder="Recherchez la ville de votre petit coin idéal..."
          style={styles.placeholder}
          onChangeText={(value) => setRechercherUnCoin(value)}
          value={rechercherUnCoin}
        />
        {/* en value l'état "rechercherUnCoin', au clic, déclenchement de la fonction handleSubmit, et ... interrogation de l'API ? + filtre de la recherche*/}
        <TouchableOpacity>
          <FontAwesome
            name="search"
            onPress={() => handleSearchByCommune()}
            size={25}
            color="#B08BBB"
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => handleOpenModalFilters()}
        style={styles.buttonFiltres}
        activeOpacity={0.8}
      >
        <Text style={styles.textButtonFiltres}>Filtres </Text>
      </TouchableOpacity>
      <Modal
        visible={modalFiltersVisible}
        animationType="slide"
        transparent={true}
      >
        <ScrollView style={styles.scroll}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.containerTogglesGeneral}>
                <Text style={styles.rechercheText}>
                  Niveau de propreté souhaité :
                </Text>
                <View style={styles.containerToggles}>
                  <View style={styles.containerMinMax}>
                    <Text style={styles.MinMax}>Min : {proprete[0]} </Text>
                    <Text style={styles.MinMax}>Max : {proprete[1]} </Text>
                  </View>
                  <MultiSlider
                    style={styles.multiSlider}
                    trackColor={{ false: "#767577", true: "#B08BBB" }}
                    thumbColor={handicapAccess ? "#A86B98" : "#A86B98"}
                    ios_backgroundColor="#3e3e3e"
                    values={proprete}
                    max={5}
                    trackStyle={{
                      height: 2,
                      backgroundColor: "#767577", // Couleur pour la barre du curseur
                    }}
                    selectedStyle={{ backgroundColor: "#B08BBB" }} // Couleur pour la plage sélectionnée
                    unselectedStyle={{ backgroundColor: "#767577" }} // Couleur pour la plage non sélectionnée
                    markerStyle={{ backgroundColor: "#A86B98" }} // Couleur pour les pouces
                    onValuesChange={handleValuesChange} // Gérer les changements de valeurs
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <Text style={styles.rechercheText}>
                    Souhaitez-vous des toilettes :
                  </Text>
                  <SelectMultiple
                    checkboxStyle={{ tintColor: "#A86B98" }}
                    labelStyle={{ color: "#767577" }}
                    selectedCheckboxStyle={{ backgroundColor: "white" }}
                    items={gratuiteOptions}
                    selectedItems={selectedGratuite}
                    onSelectionsChange={onGratuiteSelectionsChange}
                  />
                </View>
                <View style={styles.containerToggles}>
                  <Text style={styles.rechercheText}>
                    Souhaitez-vous un accès handicapé ?
                  </Text>
                  <View style={styles.toggles}>
                    <Switch
                      trackColor={{ false: "#767577", true: "#B08BBB" }}
                      thumbColor={handicapAccess ? "#A86B98" : "#A86B98"}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitchHandicapAccess}
                      value={handicapAccess}
                      transparent
                    />
                  </View>
                </View>
              </View>
              <View style={styles.containerButtonsAddClose}>
                <TouchableOpacity
                  onPress={() => handleSearchAndCloseFilters()}
                  style={styles.buttonAdd}
                  activeOpacity={0.8}
                >
                  <Text style={styles.textButtonAdd}>Rechercher</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* {noResultsMessageVisible ? (
        <Text style={styles.noResultsText}>Aucun résultat trouvé.</Text>
      ) : null} */}
        </ScrollView>
      </Modal>

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
        <ScrollView style={styles.scroll}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.InputPlaceholderModal}>
                <TextInput
                  placeholder="Recherchez la ville de votre futur trône royal..."
                  style={styles.placeholderModal}
                  onChangeText={(value) => setRechercherUnCoin(value)}
                  // Mettre à jour recherche dans le state
                  value={rechercherUnCoin} // Utiliser la valeur du state pour le contenu du champ
                />
                <FontAwesome
                  name="search"
                  onPress={() => handleSearchByCommune()} // Appel de la fonction pour filtrer les toilettes
                  size={20}
                  color="#B08BBB"
                  style={styles.searchIconModal}
                />
              </View>
              <View style={styles.containerTogglesGeneral}>
                <Text style={styles.rechercheText}>
                  Niveau de propreté souhaité :
                </Text>
                <View style={styles.containerToggles}>
                  <View style={styles.containerMinMax}>
                    <Text style={styles.MinMax}>Min : {proprete[0]} </Text>
                    <Text style={styles.MinMax}>Max : {proprete[1]} </Text>
                  </View>
                  <MultiSlider
                    style={styles.multiSlider}
                    trackColor={{ false: "#767577", true: "#B08BBB" }}
                    thumbColor={handicapAccess ? "#A86B98" : "#A86B98"}
                    ios_backgroundColor="#3e3e3e"
                    values={proprete}
                    max={5}
                    trackStyle={{
                      height: 2,
                      backgroundColor: "#767577", // Couleur pour la barre du curseur
                    }}
                    selectedStyle={{ backgroundColor: "#B08BBB" }} // Couleur pour la plage sélectionnée
                    unselectedStyle={{ backgroundColor: "#767577" }} // Couleur pour la plage non sélectionnée
                    markerStyle={{ backgroundColor: "#A86B98" }} // Couleur pour les pouces
                    onValuesChange={handleValuesChange} // Gérer les changements de valeurs
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <Text style={styles.rechercheText}>
                    Souhaitez-vous des toilettes :
                  </Text>
                  <SelectMultiple
                    checkboxStyle={{ tintColor: "#A86B98" }}
                    labelStyle={{ color: "#767577" }}
                    selectedCheckboxStyle={{ backgroundColor: "white" }}
                    items={gratuiteOptions}
                    selectedItems={selectedGratuite}
                    onSelectionsChange={onGratuiteSelectionsChange}
                  />
                </View>
                <View style={styles.containerToggles}>
                  <Text style={styles.rechercheText}>
                    Souhaitez-vous un accès handicapé ?
                  </Text>
                  <View style={styles.toggles}>
                    <Switch
                      trackColor={{ false: "#767577", true: "#B08BBB" }}
                      thumbColor={handicapAccess ? "#A86B98" : "#A86B98"}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitchHandicapAccess}
                      value={handicapAccess}
                      transparent
                    />
                  </View>
                </View>
                {/* <View style={styles.containerToggles}>
          <Text style={styles.rechercheText}>
            Souhaitez-vous une table à langer ? 
          </Text>
          <View style = {styles.toggles}>
          <Switch
            trackColor={{false: '#767577', true: '#B08BBB'}}
            thumbColor={handicapAccess ? '#A86B98' : '#A86B98'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitchTableALanger}
            value={tableALanger}
            transparent
          />
          </View>
        </View> */}
              </View>
              <View style={styles.containerButtonsAddClose}>
                {/* <TouchableOpacity onPress={() => handleClose()} style={styles.button} activeOpacity={0.8}>
              <Text style={styles.textButtonClose}>Close</Text>
          </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => handleSearchAndClose()}
                  style={styles.buttonAdd}
                  activeOpacity={0.8}
                >
                  <Text style={styles.textButtonAdd}>Rechercher</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {noResultsMessageVisible ? (
            <Text style={styles.noResultsText}>Aucun résultat trouvé.</Text>
          ) : null}
        </ScrollView>
      </Modal>
      {noResultsMessageVisible ? (
        <Text style={styles.noResultsText}>Aucun résultat trouvé.</Text>
      ) : null}
      <ScrollView style={styles.scroll}>
        {(searchedToilets.length > 0 ? searchedToilets : toilet)
          .sort((a, b) => (sortByDistance ? a.distance - b.distance : 0)) // Sort by distance
          .map((data, i) => (
            <TouchableOpacity
              key={i}
              style={styles.cardToilet}
              onPress={() =>
                navigation.navigate("ToiletPage", { toiletId: data._id })
              }
            >
              <Image
                style={styles.image}
                source={require("../assets/TP-mars.png")}
              />
              <View style={styles.textCard}>
                <Text style={styles.title}>{data.commune}</Text>
                <View style={styles.caracteristiques}>
                  <Text>
                    Gratuit :{" "}
                    {data.fee !== undefined ? `${data.fee}` : "non renseigné"}
                  </Text>
                  <Text>
                    Horaires :{" "}
                    {data.tags_opening_hours !== null
                      ? `${data.tags_opening_hours}`
                      : "non renseigné"}
                  </Text>
                </View>
                <View style={styles.distanceEtAvis}>
                  <Text style={styles.distance}>
                    {data.distance !== undefined
                      ? data.distance >= 1
                        ? `${data.distance.toFixed(0)} m`
                        : `Distance: ${(data.distance * 1000).toFixed(0)} m`
                      : "Distance: -"}
                  </Text>
                  <View style={styles.avisContainer}>
                    <Text style={styles.avis}>Etoiles{data.rating}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
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
    // marginRight : 20
  },
  searchIconModal: {
    color: "#A86B98",
    marginRight: 20,
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
    justifyContent: "center",
    width: "95%",
    height: 140,
    borderRadius: 15,
    padding: 10,
    backgroundColor: "white",
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 4,
    marginLeft: 10,
    marginVertical: 5,
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
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.29,
    // shadowRadius: 4.65,
    // elevation: 7,
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
    borderRadius: 12,
    paddingLeft: 10,
  },
  caracteristiques: {
    flexDirection: "column",
  },
  textCard: {
    flexDirection: "column",
    paddingLeft: 8,
    width: "60%",
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
  centeredView: {
    paddingTop: 97,
    alignItems: "center",
    justifyContent: "center",
    // alignContent : 'center'
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 50,
    width: "95%",
    height: "95%",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  InputPlaceholderModal: {
    padding: 10,
    flexDirection: "row",
    marginBottom: 10,
    borderRadius: 12,
    width: 300,
    height: 50,
    paddingLeft: 10,
    // alignContent: "space-between",
    alignItems: "center",
    justifyContent: "center",
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
  placeholderModal: {
    flexDirection: "row",
    borderRadius: 8,
    paddingLeft: 25,
    fontWeight: "bold",
    color: "#B08BBB",
    fontSize: 13,
    alignContent: "space-between",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: "100%",
  },
  input: {
    width: 150,
    borderBottomColor: "white",
    borderBottomWidth: 1,
    fontSize: 16,
  },
  button: {
    width: 100,
    marginTop: 20,
    height: 40,
    backgroundColor: "white",
    borderColor: "#B08BBB",
    borderWidth: 2,
    borderRadius: 10,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  buttonFiltres: {
    width: 100,
    height: 40,
    borderWidth: 2,
    borderColor: "#B08BBB",
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonAdd: {
    width: 100,
    marginTop: 20,
    height: 40,
    backgroundColor: "#A86B98",
    borderRadius: 10,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  containerButtonsAddClose: {
    flexDirection: "row",
    alignItems: "space-between",
    alignContent: "space-between",
    marginBottom: 10,
  },
  containerTogglesGeneral: {
    marginTop: 20,
  },
  containerToggles: {
    flexDirection: "column",
    alignItems: "center",
  },
  textButtonClose: {
    color: "#B08BBB",
    justifyContent: "center",
    height: 24,
    fontWeight: "600",
    fontSize: 15,
  },
  textButtonFiltres: {
    color: "#B08BBB",
    fontWeight: "bold",
  },
  textButtonAdd: {
    color: "white",
    justifyContent: "center",
    height: 24,
    fontWeight: "600",
    fontSize: 15,
    textAlignVertical: "center",
  },
  MinMax: {
    marginTop: 10,
    color: "#767577",
  },
  containerMinMax: {
    flexDirection: "row",
  },
  checkboxContainer: {
    padding: 10,
    height: 150,
    marginBottom: 10,
  },

  button: {
    width: 100,
    marginTop: 20,
    height: 40,
    backgroundColor: "white",
    borderColor: "#B08BBB",
    borderWidth: 2,
    borderRadius: 10,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  buttonFiltres: {
    width: 100,
    height: 40,
    borderWidth: 2,
    borderColor: "#B08BBB",
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonAdd: {
    width: 100,
    marginTop: 20,
    height: 40,
    backgroundColor: "#A86B98",
    borderRadius: 10,
    alignItems: "center",

    justifyContent: "center",
  },
  containerButtonsAddClose: {
    flexDirection: "row",
    alignItems: "space-between",
    alignContent: "space-between",
    marginBottom: 10,
  },
  containerTogglesGeneral: {
    marginTop: 20,
  },
  containerToggles: {
    flexDirection: "column",
    alignItems: "center",
  },
  textButtonClose: {
    color: "#B08BBB",
    justifyContent: "center",
    height: 24,
    fontWeight: "600",
    fontSize: 15,
  },
  textButtonFiltres: {
    color: "#B08BBB",
    fontWeight: "bold",
  },
  MinMax: {
    marginTop: 10,
    color: "#767577",
  },
  containerMinMax: {
    flexDirection: "row",
  },
  checkboxContainer: {
    padding: 10,
    height: 150,
    marginBottom: 10,
  },
});
