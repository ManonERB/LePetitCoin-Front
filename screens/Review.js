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
import React, { useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";

export default function Review({ navigation }) {
  const [review, setReview] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
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
  const [starRating, setStarRating] = useState(null);
  const [heartRating, setHeartRating] = useState(false);
  //animation for touchable icons
  const animatedButtonScale = new Animated.Value(1);
  const animatedHeartScale = new Animated.Value(1);

  // functions that handle in  & out animations
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evaluer ce coin</Text>
      <View style={styles.boxContainer}>
        <View style={styles.leftBox}>
          <View>
            <Image
              style={styles.images}
              source={require("../assets/Placeholder_view.png")}
            />
          </View>
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
        <View style={styles.rightBox}>
          <View style={styles.rightBoxTop}>
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
          <View style={styles.rightBoxBottom}>
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
      <View>
        <View style={styles.reviewParts}>
          <TextInput
            style={styles.reviewTitle}
            placeholder="Canaliser le poète en vous"
          ></TextInput>

          <View>
            <TextInput
              style={styles.reviewText}
              placeholder="Rédiger une ode aux toilettes"
            ></TextInput>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  title: {
    fontSize: 48,
    marginTop: 60,
    height: 80,
  },
  images: {
    width: 180,
    height: 140,
    borderRadius: 12,
  },
  boxContainer: {
    flexDirection: "row",
    justifyContent: "start",
    borderBottomColor: "#A86B98",
    borderBottomWidth: 2,
    paddingBottom: 40,
    height: "25%",
  },
  leftBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rightBox: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  rightBoxTop: {
    flexDirection: "column",
    borderBottomColor: "#A86B98",
    alignItems: "center",
    borderBottomWidth: 2,
    justifyContent: "space-evenly",
    width: "90%",
    height: 70,
  },
  rightBoxBottom: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: 70,
  },
  plusPic: {
    width: 60,
    height: 40,
    backgroundColor: "#A86B98",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginLeft: 30,
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
    paddingRight: "70%",
    paddingTop: "30%",
  },
  cameraPic: {
    width: 60,
    height: 40,
    backgroundColor: "#A86B98",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginLeft: 30,
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
    position: "absolute",
    paddingLeft: "44%",
    paddingTop: "48%",
  },
  headingRate: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  headingFav: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
    width: '100%',
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
    height: "53%",
    width: 310,
    justifyContent: "flex-start",
    margin: 10,
  },
  reviewTitle: {
    width: "100%",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "left",
    marginTop: 15,
  },
  reviewText: {},
});
