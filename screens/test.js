import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Calendar } from "react-native-calendars";
const BACK_URL = process.env.EXPO_PUBLIC_BACK_URL;

// const CLOUDINARY_URL = https://api.cloudinary.com/v1_1/do7vfvt5l;
// const CLOUDINARY_UPLOAD_PRESET = 'iyp6ovfi';
// const CLOUDINARY_API_KEY = '974414836328966';

export default function AddScreenCompany({ navigation }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Vetement");
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    // Vérifier et demander la permission d'accéder à la galerie
    (async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const onDayPress = (day) => {
    console.log(day);
    setSelectedDate(day.dateString);
    setAvailability(day.dateString);
  };

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
        color="#EDFC92"
        style={styles.deleteIcon}
      />
    </TouchableOpacity>
  </View>
  );

  const handleUpload = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "iyp6ovfi");
    data.append("cloud-name", "do7vfvt5l");
    fetch("https://api.cloudinary.com/v1_1/do7vfvt5l/image/upload", {
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

if (!data.cancelled) {
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

if (!data.cancelled) {
  let newFile = {
    uri: data.uri,
    type: `test/${data.uri.split(".")[1]}`,
    name: `test.${data.uri.split(".")[1]}`,
  };
  handleUpload(newFile);
}
  };

  const handleSubmit = () => {
    if (
      !title ||
      !description ||
      !category ||
      !selectedImages.length ||
      !quantity ||
      !availability
    ) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

const newPostData = {
  title,
  description,
  category,
  photo: selectedImages,
  quantity,
  availability_date: availability,
};

fetch(`${BACK_URL}:3000/posts/company/publish/${user.token}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(newPostData),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("from front", user.token);

    if (data.result) {
      alert("Votre annonce a été publiée avec succès !");
      navigation.navigate("Accueil");
      setTitle("");
      setDescription("");
      setCategory("Vetement"); // Set the initial category
      setQuantity("");
      setAvailability("");
      setSelectedImages([]);
    } else {
      alert("Une erreur est survenue lors de la publication de l'annonce.");
    }
  })
  .catch((error) => {
    console.error("Erreur lors de la publication de l'annonce :", error);
    alert("Une erreur est survenue lors de la publication de l'annonce.");
  });
  };

  const customTheme = {
    todayTextColor: "#EDFC92",
    arrowColor: "#EDFC92",
  };

  if (galleryPermission === false) {
    return <Text>Pas d'accès au stockage interne</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.mainContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.topContainer}>
          <Text style={styles.title}>
            Postez votre <Text style={styles.zero}>annonce</Text>
          </Text>
        </View>
        <ScrollView style={styles.bottomContainer}>
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Titre</Text>
              <TextInput
                style={styles.input}
                multiline={true}
                textAlignVertical="top"
                onChangeText={(value) => setTitle(value)}
                value={title}
                placeholder="Quel est le titre de votre annonce?"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Catégorie</Text>
              <Picker
                selectedValue={category}
                style={styles.input}
                mode={"dialog"}
                onValueChange={(itemValue) => setCategory(itemValue)}
              >
                <Picker.Item label="Vetement" value="Vetement" />
                <Picker.Item label="Meubles" value="Meuble" />
                <Picker.Item label="High-Tech" value="High-Tech" />
                <Picker.Item label="Electroménager" value="Electroménager" />
                <Picker.Item label="Jeux" value="Jeux" />
                <Picker.Item label="Enfants" value="Enfants" />
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                multiline={true}
                textAlignVertical="top"
                onChangeText={(value) => setDescription(value)}
                value={description}
                placeholder="Dites nous pourquoi vous n'en voulez plus"
              />
            </View>
            <View style={styles.imagePickerContainer}>
              <Text style={styles.label}>Ajouter des photos</Text>
              <View style={styles.cameraIconContainer}>
                <TouchableOpacity
                  onPress={() => pickImage()}
                  style={styles.imagePickerButton}
                >
                  <Text style={styles.imagePickerButtonText}>
                    Sélectionner dans la galerie ou
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => takePhoto()}
                  style={styles.cameraIcon}
                >
                  <AntDesign
                    name="camera"
                    size={20}
                    color="#EDFC92"
                    backgroundColor="#274539"
                  />
                </TouchableOpacity>
              </View>
              <FlatList
                data={selectedImages}
                renderItem={SelectedImageItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Quantité</Text>
              <TextInput
                style={styles.input}
                multiline={true}
                textAlignVertical="top"
                onChangeText={(value) => setQuantity(value)}
                value={quantity}
                placeholder="Combien de pièces?"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Disponibilité</Text>
              <Calendar
                style={{ fontFamily: "Poppins" }}
                onDayPress={onDayPress}
                markedDates={{
                  [selectedDate]: { selected: true, selectedColor: "#274539" },
                }}
                theme={customTheme}
              />
            </View>
            <TouchableOpacity style={styles.btnLogin} onPress={handleSubmit}>
              <Text style={styles.login}>Publiez votre annonce</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <StatusBar style="auto" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainContainer: {
    flex: 1,
  },
  topContainer: {
    backgroundColor: "#274539",
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 30,
    fontFamily: "MontserratBold",
    color: "white",
  },
  bottomContainer: {
    padding: 20,
  },
  form: {
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontFamily: "Poppins",
  },
  input: {
    backgroundColor: "#F6F8F7",
    padding: 13,
    borderRadius: 4,
    width: "100%",
    fontFamily: "Poppins",
  },
  imagePickerContainer: {
    flex: 1,
    marginBottom: 20,
  },
  cameraIconContainer: {
    flex: 1,
    backgroundColor: "#F6F8F7",
    borderRadius: 4,
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  imagePickerButton: {
    backgroundColor: "#F6F8F7",
    padding: 13,
    borderRadius: 4,
    justifyContent: "center",
  },
  imagePickerButtonText: {
    fontFamily: "Poppins",
    color: "#555",
  },
  selectedImageItem: {
    marginRight: 10,
  },
  selectedImage: {
    flexWrap: "wrap",
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 4,
    margin: 5,
  },
  btnLogin: {
    backgroundColor: "#EDFC92",
    padding: 10,
    borderRadius: 4,
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  login: {
    fontSize: 15,
    fontFamily: "Poppins",
  },
  zero: {
    color: "#EDFC92",
  },
  deleteIconContainer: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(39, 69, 57, 0.7)",
    borderRadius: 100,
    padding: 3,
  },
});
// pour cloudinary avec imagePicker