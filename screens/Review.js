import {
  StyleSheet,
  TextInput,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  View,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { launchCameraAsync } from "expo-image-picker";
import Home from "./Home";

export default function Review({ navigation }) {
  
  const [starRating, setStarRating] = useState(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [review, setReview] = useState({});
  const [image, setImage] = useState(null);

  const [heartRating, setHeartRating] = useState(false);
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

  const pickImage = async () => {
    // Check for media library permissions
    const hasMediaLibraryPermission = await getMediaLibraryPermission();
  
    if (!hasMediaLibraryPermission) {
      return;
      let data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:ImagePicker.MediaTypeOptions.Images,
        allowsEditing:true,
        aspect:[1,1],
        quality:0.5
      });
      if(!data.canceled){
        let newFile = {
          uri:data.uri,
          type:`test/${data.uri.split(".")[1]}`,
          name:`test.${data.uri.split(".")[1]}`};
          handleUpload(newFile);
        }
      } else {  Alert.alert('Siz bu funksiyani isletmek ucun icaze vermelisiz'); 
    }
  };

  
    // Check for camera permissions
  const takePicture = async () => {  
    const hasCameraPermission = await getCameraPermission();
  
    if (!hasCameraPermission) {
      return;
    }
  
    // Launch the image library
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    console.log(result);
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
    );
  };
  

  //animation for touchable icons
  const animatedButtonScale = new Animated.Value(1);
  const animatedHeartScale = new Animated.Value(1);
  const animatedHeartRotation = new Animated.Value(0);
  const animatedHeartStyle = {
    transform: [
      { scale: animatedHeartScale },
      {
        rotate: animatedHeartRotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'], // You can adjust the range as needed
        }),
      },
    ],
  };

  // minimized functions that handle in  & out animations
  const handleHeartPressIn = () => {
    Animated.parallel([
      Animated.spring(animatedHeartScale, {
        toValue: 1.2,
        useNativeDriver: true,
        speed: 50,
        bounciness: 1,
      }),
      Animated.timing(animatedHeartRotation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
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
    if (review.length === 0) {
      consoleLog('error')
      return;
    }
    fetch(`http://${process.env.EXPO_PUBLIC_IP}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        rating: starRating,
        text: text,
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
          <KeyboardAvoidingView style={styles.reviewParts}>
            <Text style={styles.titleHolder}>Donner votre avis</Text>
            <TextInput
              style={styles.reviewTitle}
              placeholder="Canaliser le poète en vous"
              mode="outlined"
              value={title}
              onChangeText={setTitle}
            ></TextInput>
            <View style={styles.bottomContainer}>
              <TextInput
                style={styles.reviewText}
                placeholder="Rédiger une ode aux petits coins"
                mode="outlined"
                value={text}
                onChangeText={setText}
                multiline
                numberOfLines={6}
                maxLength={250}
              ></TextInput>
            </View>
          </KeyboardAvoidingView>
          <View style={styles.bottomBoxes}>
            <View style={styles.bottomBoxLeft}>
              <Text style={styles.headingFav}>Ajouter aux favoris</Text>
              <TouchableOpacity
                onPressIn={handleHeartPressIn}
                onPressOut={handleHeartPressOut}
                onPress={handleHeartFlip}
              >
                <Animated.View style={[animatedHeartScaleStyle, animatedHeartStyle]}>
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
          <Text style={styles.submitText} onPress={() => handleSubmitReview({setReview})}>
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
  },
  titleHolder: {
    padding: 0,
    position: "relative",
    marginBottom: -7,
    marginLeft: 10,
    backgroundColor: "white",
    zIndex: 1,
    textAlign: "center",
    width: 100,
  },
  reviewTitle: {
    width: "98%",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "left",
    borderTopWidth: 1,
    borderColor: "#A86B98",
    paddingLeft: 10,
    paddingTop: 15,
    paddingBottom: 8,
    zIndex: 0,
  },
  reviewText: {
    marginHorizontal: 10,
    height: '90%',
    fontSize: 18,
    textAlign: 'left',
    textAlignVertical: 'top'
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
