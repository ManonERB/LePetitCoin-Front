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
  FlatList,
  ScrollView
} from "react-native";
import React, { useState, useEffect } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import Home from "./Home";
import { useSelector } from "react-redux";

export default function Review({ navigation, route }) {
  
  const [starRating, setStarRating] = useState(null);
  const [cleanliness, setCleanliness] = useState(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [review, setReview] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [heartRating, setHeartRating] = useState(false);
  const user = useSelector((state) => state.user.value);

  const CLOUD_URL = process.env.CLOUDINARY_URL;

  useEffect(() => {
    // Vérifier et demander la permission d'accéder à la galerie
    (async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const removeImage = (imageUri) => {
    setSelectedImages(selectedImages.filter((image) => image.uri !== imageUri));
  };

  const SelectedImageItem = ({ item }) =>
  (
    <View style={styles.selectedImageItem}>
    <Image source={{ uri: item }} style={styles.selectedImage} />
    <TouchableOpacity
      onPress={() => removeImage(item)}
      style={styles.deleteIconContainer}
      >
      <FontAwesome
        name="times"
        size={20}
        color="#A86B98"
        style={styles.deleteIcon}
        />
    </TouchableOpacity>
  </View>
  );

  const handleUpload = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "ml_default");
    data.append("cloud-name", "dipkmwqfj");
    fetch("https://api.cloudinary.com/v1_1/dipkmwqfj/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then(async (data) => {
        console.log(data);

    if (data) {
      setSelectedImages([...selectedImages, data.url]);
    } else {
      alert("Erreur lors du téléchargement de l'image sur Cloudinary");
    }
  });
  };

  const pickImage = async () => {
    let data = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [3, 4],
      quality: 1,
      // allowsMultipleSelection: true,
    });

  if (!data.canceled) {
    let newFile = {
      uri: data.uri,
      type: `test/${data.uri.split(".")[1]}`,
      name: `test.${data.uri.split(".")[1]}`,
    };
    handleUpload(newFile);
  }
  };

  const takePhoto = async () => {
    let data = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [3, 4],
      quality: 1,
    });

if (!data.canceled) {
  let newFile = {
    uri: data.uri,
    type: `test/${data.uri.split(".")[1]}`,
    name: `test.${data.uri.split(".")[1]}`,
  };
  handleUpload(newFile);
}
  };

  const handleSubmitReview = () => {
    const {toiletId} = route.params
    const token = user.token
    
    if (review.length === 0) {
      console.Log('error')
      return;
    }
    fetch(`http://${process.env.EXPO_PUBLIC_IP}/review/${token}/${toiletId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        rating: starRating,
        text: text,
        pictures: selectedImages,
        // cleanliness: 
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data)
        if (data.result) {
          alert("Votre annonce a été publiée avec succès !");
      navigation.navigate("Home");
      setTitle("");
      setText("");
      setSelectedImages([]);
    } else {
      alert("Une erreur est survenue lors de la publication de l'annonce.");
    }
  })
  .catch((error) => {
    console.error("Erreur lors de la publication de l'annonce :", error);
    
  });
  };


  if (galleryPermission === false) {
    return <Text>Pas d'accès au stockage interne</Text>;
  }

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



  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Evaluer ce coin</Text>
      <View style={styles.boxContainer}>
        <View style={styles.topBox}>
          <View style={styles.images}>
              <FlatList
                  data={selectedImages}
                  renderItem={SelectedImageItem}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  style={styles.imageView}
                />
          </View>
            <View style={styles.iconSpacing}>
              <View style={styles.plusButton} activeOpacity={0.8}>
                <TouchableOpacity style={styles.plusPic}>
                  <FontAwesome name="plus" size={18} color="white" onPress={() => pickImage()} />
                  <Text style={styles.buttonLabels}>gallery</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.cameraButton} activeOpacity={0.8}>
                <TouchableOpacity style={styles.cameraPic}>
                  <FontAwesome name="camera" size={18} color="white" onPress={() => takePhoto()}/>
                  <Text style={styles.buttonLabels}>camera</Text>
                </TouchableOpacity>
              </View>
            </View>
        </View>
        <View>
          <KeyboardAvoidingView style={styles.reviewParts}>
            <Text style={styles.titleHolder}>Donner votre avis</Text>
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
                <Animated.View >
                  <FontAwesome
                    name="heart"
                    size={24}
                    solid={heartRating}
                    color={heartRating ? "red" : "#CCCCCC"}
                    style={{ transform: [{rotateZ: '180deg'}]}}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    width: "100%",
    height: '100%',
    backgroundColor: "#fff",
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 48,
    marginTop: 30,
    height: 80,
  },
  images: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  selectedImage: {
    flexWrap: "wrap",
    width: 130,
    height: 250,
    resizeMode: "cover",
    borderRadius: 4,
    margin: 5,
    justifyContent: 'center',
  },
  deleteIconContainer: {
    position: "absolute",
    top: 18,
    right: 55,
    width: 26,
    height: 26,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 100,
    alignItems: 'center',
    padding: 3,
  },
  boxContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignContent: "center",
    height: "80%",
    width: "100%",
  },
  topBox: {
    alignItems: "center",
    zIndex: -1,
  },
  bottomBoxes: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#A86B98",
    height: "16%",
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
    margin: 10,
    flexDirection: "row",
  },
  plusPic: {
    width: 90,
    height: 50,
    backgroundColor: "#B08BBB",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
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
    paddingRight: 40,
  },
  cameraPic: {
    width: 90,
    height: 50,
    backgroundColor: "#B08BBB",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
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
    paddingLeft: 40,
  },
  buttonLabels: {
    color: 'white',
  },
  selectedImageItem: {
    marginRight: 10,
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
    height: "52%",
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
