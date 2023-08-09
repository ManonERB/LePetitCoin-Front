import {
  StyleSheet,
  TextInput,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  View,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import Home from "./Home";

export default function Review({ navigation }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");

  const [heartRating, setHeartRating] = useState(false);
  const [starRating, setStarRating] = useState(null);
  // const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);

  // Create a reference to the camera
  // let cameraRef = useRef(null);

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Camera.requestCameraPermissionsAsync();
  //     setHasPermission(status === "granted");
  //   })();
  // }, []);

  // const takePicture = async () => {
  //   const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
  //   const formData = new FormData();

  //   formData.append("photoFromFront", {
  //     uri: photo.uri,
  //     name: "photo.jpg",
  //     type: "image/jpeg",
  //   });

  //   fetch("http://10.20.2.181:3000/upload", {
  //     method: "POST",
  //     body: formData,
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       //add to redux store if upload is successful
  //       dispatch(addPhoto(data.url));
  //     });
  // };

  // if (!hasPermission || !isFocused) {
  //   return <View />;
  // }

  //add state for stars and heart

  //animation for touchable icons
  const animatedButtonScale = new Animated.Value(1);
  const animatedHeartScale = new Animated.Value(1);

  // minimized functions that handle in  & out animations
  const handleHeartPressIn = () => {
    Animated.spring(animatedHeartScale, {
      toValue: 1.2,
      useNativeDriver: true,
      speed: 50,
      bounciness: 1,
    }).start();
  };
  const handleHeartPressOut = () => {
    Animated.spring(animatedHeartScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 1,
    }).start();
  };
  const handlePressIn = () => {
    Animated.spring(animatedButtonScale, {
      toValue: 1.2,
      useNativeDriver: true,
      speed: 50,
      bounciness: 1,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(animatedButtonScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 1,
    }).start();
  };
  const handleHeartFlip = () => {
    setHeartRating(!heartRating); // Toggle the heart rating state
    animatedHeartScale.setValue(1); // Set the scale value to 1 for the initial state
  };

  //styles for the animation
  const animatedHeartScaleStyle = {
    transform: [{ scale: animatedHeartScale }],
  };
  const animatedScaleStyle = {
    transform: [{ scale: animatedButtonScale }],
  };

  // if (!hasPermission || !useIsFocused) {
  //   return <View />;
  // }

  const handleSubmitReview = () => {
    fetch("http://10.20.2.181:3000/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        rating: rating,
        review: review,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log(data);
        }
      });
  };

  return (
    <View style={styles.container}>
      <Camera type={type}></Camera>
      <Text style={styles.title}>Evaluer ce coin</Text>
      <View style={styles.boxContainer}>
        <View style={styles.topBox}>
          <Image
            style={styles.images}
            source={require("../assets/Placeholder_view.png")}
          />
          <View style={styles.iconSpacing}>
            <View style={styles.plusButton} activeOpacity={0.8}>
              <TouchableOpacity style={styles.plusPic}>
                <FontAwesome name="plus" size={18} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.cameraButton} activeOpacity={0.8}>
              <TouchableOpacity style={styles.cameraPic}>
                <FontAwesome name="camera" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View>
          <View style={styles.reviewParts}>
            <Text style={styles.titleHolder}>Titre</Text>
            <TextInput
              style={styles.reviewTitle}
              placeholder="Canalisez le poète en vous"
              mode="outlined"
              value={title}
              onChangeText={setTitle}
            ></TextInput>
            <View style={styles.bottomContainer}>
              <TextInput
                style={styles.reviewText}
                placeholder="Rédigez une ode aux petits coins"
                mode="outlined"
                value={review}
                onChangeText={setReview}
              ></TextInput>
            </View>
          </View>
          <View style={styles.bottomBoxes}>
            <View style={styles.bottomBoxLeft}>
              <Text style={styles.headingFav}>Ajouter aux favoris</Text>
              <TouchableOpacity
                onPressIn={handleHeartPressIn}
                onPressOut={handleHeartPressOut}
                onPress={handleHeartFlip}
              >
                <Animated.View style={[animatedHeartScaleStyle]}>
                  <FontAwesome
                    name="heart"
                    size={24}
                    solid={heartRating}
                    color={heartRating ? "red" : "#CCCCCC"}
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
            <View style={styles.bottomBoxRight}>
              <Text style={styles.headingRate}>
                {starRating ? `${starRating}` : "Taper pour noter"}
              </Text>
              <View style={styles.stars}>
                <TouchableWithoutFeedback
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={() => setStarRating(1)}
                >
                  <Animated.View style={animatedScaleStyle}>
                    <FontAwesome
                      name={"star"}
                      size={22}
                      style={
                        starRating >= 1
                          ? styles.starSelected
                          : styles.starUnselected
                      }
                      solid
                    />
                  </Animated.View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={() => setStarRating(2)}
                >
                  <Animated.View style={animatedScaleStyle}>
                    <FontAwesome
                      name={"star"}
                      size={22}
                      style={
                        starRating >= 2
                          ? styles.starSelected
                          : styles.starUnselected
                      }
                      solid
                    />
                  </Animated.View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={() => setStarRating(3)}
                >
                  <Animated.View style={animatedScaleStyle}>
                    <FontAwesome
                      name={"star"}
                      size={22}
                      style={
                        starRating >= 3
                          ? styles.starSelected
                          : styles.starUnselected
                      }
                      solid
                    />
                  </Animated.View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={() => setStarRating(4)}
                >
                  <Animated.View style={animatedScaleStyle}>
                    <FontAwesome
                      name={"star"}
                      size={22}
                      style={
                        starRating >= 4
                          ? styles.starSelected
                          : styles.starUnselected
                      }
                      solid
                    />
                  </Animated.View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={() => setStarRating(5)}
                >
                  <Animated.View style={animatedScaleStyle}>
                    <FontAwesome
                      name={"star"}
                      size={22}
                      style={
                        starRating >= 5
                          ? styles.starSelected
                          : styles.starUnselected
                      }
                      solid
                    />
                  </Animated.View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.buttonCancel}>
          <Text
            style={styles.cancelText}
            onPress={() => navigation.navigate(Home)}
          >
            Annuler
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSubmit}>
          <Text style={styles.submitText} onPress={() => handleSubmitReview()}>
            Ajouter
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  title: {
    fontSize: 48,
    marginTop: 30,
    height: 80,
  },
  images: {
    width: 350,
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  boxContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignContent: "center",
    paddingBottom: 40,
    height: "80%",
    width: "100%",
  },
  topBox: {
    alignItems: "center",
    marginTop: 10,
    zIndex: -1,
  },
  bottomBoxes: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#A86B98",
    height: "16%",
    marginBottom: -20,
  },
  bottomBoxLeft: {
    flexDirection: "column",
    borderRightColor: "#A86B98",
    alignItems: "center",
    borderRightWidth: 1,
    justifyContent: "center",
    width: "50%",
    height: 60,
  },
  bottomBoxRight: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    height: 60,
  },
  iconSpacing: {
    position: "absolute",
    marginTop: "35%",
    flexDirection: "row",
  },
  plusPic: {
    width: 50,
    height: 50,
    backgroundColor: "#B08BBB",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
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
    paddingRight: 70,
  },
  cameraPic: {
    width: 50,
    height: 50,
    backgroundColor: "#B08BBB",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 9,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 5,
  },
  cameraButton: {
    paddingLeft: 70,
  },
  headingRate: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  headingFav: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  stars: {
    display: "flex",
    flexDirection: "row",
  },
  starUnselected: {
    color: "#aaa",
  },
  starSelected: {
    color: "#ffb300",
  },
  reviewParts: {
    height: "67%",
    width: 370,
    justifyContent: "flex-start",
    padding: 10,
    // borderWidth: 1,
    // borderRadius: 12,
    // borderColor: "#A86B98",
  },
  titleHolder: {
    padding: 0,
    position: "relative",
    marginBottom: -7,
    marginLeft: 10,
    backgroundColor: "white",
    zIndex: 1,
    textAlign: "center",
    width: 33,
  },
  reviewTitle: {
    width: "98%",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "left",
    borderTopWidth: 1,
    borderColor: "#A86B98",
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    zIndex: 0,
  },
  reviewText: {
    display: "flex",
    marginLeft: 10,
    flexWrap: "wrap",
  },
  bottomRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  buttonCancel: {
    borderWidth: 2,
    borderColor: "#B08BBB",
    width: "35%",
    height: 45,
    justifyContent: "center",
    borderRadius: 12,
  },
  buttonSubmit: {
    backgroundColor: "#B08BBB",
    width: "35%",
    height: 45,
    justifyContent: "center",
    borderRadius: 12,
  },
  submitText: {
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  cancelText: {
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#B08BBB",
  },
});
