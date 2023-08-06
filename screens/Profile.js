import { Text, View, TouchableOpacity, TextInput, Image } from "react-native";
import { StyleSheet } from "react-native";
import Review from "./Review";

export default function Profile({ navigation }) {
  return (
    <View style={styles.container}>
      <View>
        <Image
          style={styles.avatar}
          source={require("../assets/avatar-vide.png")}
        />
      </View>
      <Text style={styles.title}>Hello</Text>
      <TouchableOpacity
        style={styles.buttonReview}
        onPress={() => navigation.navigate(Review)}
      >
        <Text>temp access to Review</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {

    backgroundColor: "#fff",
    color: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: "20%",
    height: "20%",
  },
  buttonReview: {
    backgroundColor: "yellow",
    marginBottom: 40,
    width: "30%",
  },
});
