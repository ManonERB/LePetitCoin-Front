import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import MapView, { Marker } from "react-native-maps";
import { getDistance } from "geolib";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { Dimensions } from "react-native";
import { addToFavorites } from "../reducers/favorites";
import { removeFromFavorites } from "../reducers/favorites";

export default function ToiletPage({ route, navigation }) {
  const [toilet, setToilet] = useState(null);
  const [review, setReview] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [isHeartSolid, setIsHeartSolid] = useState(false);
  const mapViewRef = useRef(null); // Create a ref for the MapView to recenter map on change
  const dispatch = useDispatch();
  const { toiletId } = route.params;
  const favorites = useSelector((state) => state.favorites.toilet);

  const isFavorite =
    toilet &&
    toilet.id &&
    favorites &&
    favorites.some((favoriteToilet) => favoriteToilet.id === toilet.id);

  const rotationValue = new Animated.Value(isFavorite ? 1 : 0);

  //add to favorites function
  const addToFavoritesHandler = () => {
    if (toilet) {
      // Dispatch the addToFavorites action with the toilet data
      dispatch(addToFavorites(toilet));
      rotationValue.setValue(1); // Set the rotation value to 1 (fully rotated)
    }
  };

  //remove from favorites fonction
  const removeFromFavoritesHandler = () => {
    if (toilet) {
      // Dispatch the removeFromFavorites action with the toilet ID
      dispatch(removeFromFavorites({ toiletId: toilet.id }));
      setIsHeartSolid(false); 
      rotationValue.setValue(2);
    }
  };

  // Rotate animation
  const rotateHeart = () => {
    Animated.timing(rotationValue, {
      toValue: 1,
      duration: 400,
      easing: Easing.circle,
      useNativeDriver: true,
    }).start(() => {
      // Change color to white and set heart to solid after rotation animation is complete
      setIsHeartSolid(true);
      addToFavoritesHandler();
    });
  };

  
//rotation animation for heart
  const rotateStyle = {
    transform: [
      {
        rotate: rotationValue.interpolate({
          inputRange: [0, 1],
          outputRange: ["-540deg", "0deg"],
        }),
      },
    ],
  };

  useEffect(() => {
    // Check if the favorites array exists and is not empty
    if (toilet && toilet.id) {
      // If toilet exists and has an id, check if it's a favorite
      const isFavorite =
        favorites &&
        favorites.some((favoriteToilet) => favoriteToilet.id === toilet.id);

      if (isFavorite) {
        setIsHeartSolid(true);
        rotationValue.setValue(1);
      }
    }
  }, [toiletId, favorites]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status) {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentPosition(location.coords);
        console.log("ma position mise à jour", location);
        console.log(location);
        setInitialRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          setCurrentPosition(location.coords);
        });
      }
    })();
    //  console.log("coucou", route)
    //  console.log("id", toiletId);
    fetch(`http://${process.env.EXPO_PUBLIC_IP}/toilet/${toiletId}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log("data", data.toilets.point_geo.lat);
        setToilet(data.toilets);
      });

    fetch(`http://${process.env.EXPO_PUBLIC_IP}/review/${toiletId}`)
      .then((response) => response.json())
      .then((data) => {
        setReview(data);
        // Calculate the average rating
        const totalRating = data.reduce(
          (acc, review) => acc + review.rating,
          0
        );
        const avgRating = totalRating / data.length;
        setAverageRating(avgRating);
      });
  }, [toiletId]);

  if (toilet?.tags) {
    //parse car dans le bdd c'est en string transform en objet
    const amenity = JSON.parse(toilet.tags);
    // console.log("toutou", amenity.amenity)
  }

  const recenterMap = () => {
    if (initialRegion && mapViewRef.current) {
      mapViewRef.current.animateCamera({
        center: {
          latitude: initialRegion.latitude,
          longitude: initialRegion.longitude,
        },
      });
    }
  };

  console.log("toilet", toilet);
  return (
    <ScrollView>
      <View>
        <Image source={require("../assets/TP-mars.png")} style={styles.img} />
        <View style={styles.plusButton} activeOpacity={0.8}>
          <TouchableOpacity onPress={rotateHeart} activeOpacity={0.8}>
            <View style={styles.plusPic}>
              {isFavorite ? (
                <Animated.View style={rotateStyle}>
                  <TouchableOpacity
                    onPress={removeFromFavoritesHandler}
                    activeOpacity={0.8}
                  >
                    <FontAwesome name="heart" size={20} solid color={"white"} />
                  </TouchableOpacity>
                </Animated.View>
              ) : (
                <Animated.View style={rotateStyle}>
                  <TouchableOpacity onPress={rotateHeart} activeOpacity={0.8}>
                    <FontAwesome name="heart" size={20} color={"white"} />
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text style={styles.title}>
          {toilet?.commune} {toilet?.code_postal}
        </Text>
        <View style={styles.header}>
          <View style={styles.list}>
            <Text style={styles.text}>
              Horaires :{" "}
              {`${
                toilet?.tags_opening_hours
                  ? toilet.tags_opening_hours
                  : "Info indisponible"
              }`}
            </Text>
            <Text style={styles.text}>
              Gratuité :{" "}
              {`${toilet?.tags_fee ? toilet.tags_fee : "Info indisponible"}`}
            </Text>
            <Text style={styles.text}>
              Type : {`${toilet?.title ? toilet.title : "Info indisponible"}`}
            </Text>
          </View>
        </View>
      </View>
      <View>
        <Text style={styles.subTitleOU}>Où se situe ce petit coin ? </Text>
        {currentPosition && (
          <MapView
            ref={mapViewRef} // Store a reference to the MapView
            initialRegion={initialRegion}
            style={styles.map}
          >
            <Marker
              pinColor="#fecb2d"
              title="My location"
              coordinate={{
                latitude: initialRegion?.latitude,
                longitude: initialRegion?.longitude,
              }}
            />
            {toilet && (
              <Marker
                pinColor="red"
                coordinate={{
                  latitude: toilet?.point_geo?.lat,
                  longitude: toilet?.point_geo?.lon,
                }}
                title={toilet.title}
              />
            )}
          </MapView>
        )}
        <TouchableOpacity style={styles.recenterButton} onPress={recenterMap}>
          <View style={styles.recenter}>
            <FontAwesome name="crosshairs" />
            <Text style={{ color: "#A86B98" }}>Recentrer</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.subTitleEQUIP}>
        Les équipements royaux de ce trône
      </Text>
      <View style={styles.equipement}>
        <View>
          <Text style={styles.text}>
            Description :{" "}
            {`${toilet?.title ? toilet.title : "Info indisponible"}`}
          </Text>
          <Text style={styles.text}>
            Eau potable :{" "}
            {`${
              toilet?.drinking_water
                ? toilet.drinking_water
                : "Info indisponible"
            }`}
          </Text>
          <Text style={styles.text}>
            Table-à-langer :{" "}
            {`${
              toilet?.changing_table
                ? toilet.changing_table
                : "Info indisponible"
            }`}
          </Text>
        </View>
        <View></View>
      </View>
      <View>
        <View style={styles.reviewContainer}>
          <View style={styles.barReview}>
            <Text style={styles.barReviewText}> Ce qu'ils en disent</Text>
            <Text style={styles.averageRating}>
              Note global : {averageRating.toFixed(2)}{" "}
              {/* Format the rating to 2 decimal places */}
            </Text>
          </View>

          {review.map((data, i) => {
            // console.log(data);
            return (
              <View key={i} style={styles.cardReview}>
                <View style={styles.cardText}>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.titleReview}>{data.title} </Text>
                    <View style={styles.starNote}>
                      <FontAwesome
                        name="star"
                        size={16}
                        color="#ffb300"
                        solid
                      />
                      <Text style={styles.titleRating}>{data.rating}/5</Text>
                    </View>
                  </View>
                  <View style={styles.cardReviewText}>
                    <Text style={styles.textReview}>{data.text}</Text>
                    <Text style={styles.userName}>- {data.user.userName}</Text>
                  </View>
                </View>
                <View style={styles.cardReviewImg}>
                  {data.pictures[0] ? (
                    <Image
                      source={{ uri: data.pictures[0] }}
                      style={styles.cardimg}
                    />
                  ) : (
                    <Image
                      source={require("../assets/Placeholder_view.png")} // Use your placeholder image source
                      style={styles.cardimg}
                    />
                  )}
                </View>
              </View>
            );
          })}
          <View style={styles.avisButton}>
            <TouchableOpacity
              style={styles.review}
              onPress={() => navigation.navigate("Review", { toiletId })}
            >
              <Text style={styles.reviewButtonText}>Donnez votre avis</Text>
              <FontAwesome
                style={styles.pen}
                name="pen"
                size={18}
                color="white"
                paddingLeft={20}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  map: {
    // flex:1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    height: 220,
  },
  recenterButton: {
    position: "absolute",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    top: "20%",
    right: "5%",
  },
  recenter: {
    flexDirection: "row",
    width: 80,
    height: 30,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  img: {
    width: 380,
    height: 250,
  },
  plusPic: {
    width: 40,
    height: 40,
    flexDirection: "row",
    backgroundColor: "#A86B98",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 20,
    marginLeft: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 9,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 5,
  },
  plusButton: {
    position: "absolute",
    bottom: "8%",
    right: "8%",
  },
  favoriteText: {
    color: "white",
    width: "50%",
  },
  title: {
    fontSize: 25,
    color: "#A86B98",
    fontWeight: "bold",
    textAlign: "left",
    padding: 15,
  },
  list: {
    flexDirection: "column",
    width: "100%",
    textAlign: "left",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 5,
  },
  review: {
    flexDirection: "row-reverse",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "90%",
    height: 50,
    borderRadius: 12,
  },
  text: {
    marginLeft: 15,
    fontSize: 16,
    textAlign: "left",
  },
  subTitleOU: {
    textAlign: "center",
    padding: 15,
    fontSize: 20,
    fontStyle: "italic",
    fontWeight: "500",
  },
  subTitleEQUIP: {
    textAlign: "left",
    color: "#A86B98",
    padding: 15,
    fontSize: 20,
    fontStyle: "italic",
    fontWeight: "500",
  },
  equipement: {
    marginBottom: 30,
    alignItems: "flex-start",
  },
  barReview: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#B08BBB",
    width: "100%",
    color: "white",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: 35,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  barReviewText: {
    paddingHorizontal: 10,
    fontSize: 20,
    textAlignVertical: "center",
    textAlign: "center",
    color: "white",
  },
  averageRating: {
    fontSize: 16,
    textAlignVertical: "center",
    textAlign: "center",
    color: "white",
    paddingRight: 10,
  },
  reviewContainer: {
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "rgba(176, 139, 187, 0.7)",
  },
  cardReview: {
    width: "95%",
    borderRadius: 12,
    backgroundColor: "white",
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    shadowColor: "grey",
    shadowOffset: {
      width: 1,
      height: 5,
    },
    shadowOpacity: 0.39,
    shadowRadius: 0.15,
    elevation: 7,
  },
  cardReviewImg: {
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  cardimg: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  cardHeaderText: {
    width: 250,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 10,
    paddingBottom: 10,
    flexWrap: "wrap",
    alignItems: "center",
  },
  cardReviewText: {
    flexWrap: "no-wrap",
  },
  userName: {
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    textAlign: "right",
    fontSize: 16,
    fontStyle: "italic",
  },
  titleReview: {
    fontSize: 20,
    paddingLeft: 15,
    fontWeight: "bold",
  },
  textReview: {
    width: 250,
    fontSize: 16,
    paddingLeft: 15,
    paddingRight: 5,
    flexWrap: "nowrap",
  },
  starNote: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleRating: {
    color: "#A86B98",
    fontSize: 20,
    paddingLeft: 5,
  },
  avisButton: {
    backgroundColor: "#B08BBB",
    margin: 40,
    width: "50%",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 12,
  },
  reviewButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    paddingRight: 20,
  },
  pen: {
    margin: 0,
    padding: 15,
  },
});
