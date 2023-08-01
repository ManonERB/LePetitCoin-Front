import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import SignUp from "./SignUp";

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inputEmpty, setInputEmpty] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const handleSubmit = () => {
    fetch(`http://${process.env.EXPO_PUBLIC_IP}/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (EMAIL_REGEX.test(email)) {
          if (data.result) {
            //redirige au click de l'input a la Home
            navigation.navigate("TabNavigator");
          } else {
            setInputEmpty(true);
          }
        } else {
          setEmailError(true);
        }
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.topLogo}>
        <Text style={styles.logoText}>LE PETIT C</Text>
        <FontAwesome
          name="toilet-paper"
          color="#B08BBB"
          size={34}
          style={styles.toilet}
        />
        <Text style={styles.logoText}>IN</Text>
      </View>

      <View style={styles.inputHolder}>
        <View style={styles.label}>
          <Text style={styles.placeholders}>Mail</Text>
          <TextInput
            //changeText avec le changement d'etat
            onChangeText={(value) => setEmail(value)}
            //la valeur de l'input
            value={email}
            style={styles.input}
            
                placeholder="john@gmail.com"
            textColor="#51bc8a"
            baseColor="#FFFFFF"
          />
        </View>
        <View style={styles.label}>
          <Text style={styles.placeholders}>Mot de Passe</Text>
          <TextInput
            //changeText avec le changement d'etat
            onChangeText={(value) => setPassword(value)}
            //la valeur de l'input
            value={password}
            style={styles.input}
            
              placeholder="Password"
              secureTextEntry={true}
          />
        </View>
        {inputEmpty && (
          <Text style={styles.error}>
            Veuillez remplir tout les champs de saisie
          </Text>
        )}
        {emailError && <Text style={styles.error}>email incorrect</Text>}
      </View>

      <View style={styles.shadow}>
        <TouchableOpacity
          onPress={() => handleSubmit()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>Sign in</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.media}>
        <TouchableOpacity>
          <FontAwesome
            style={styles.icon}
            name="google"
            color="#263238"
            size={34}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome
            style={styles.icon}
            name="apple"
            color="#263238"
            size={34}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome
            style={styles.icon}
            name="facebook"
            color="#263238"
            size={34}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate(SignUp)}>
        <Text style={styles.signUp}>pas de compte?</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  topLogo: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 80,
  },
  logoText: {
    fontSize: 38,
    color: "#B08BBB",
  },
  placeholders: {
    padding: 0,
    position: "relative",
    zIndex: 5,
  },
  toilet: {
    marginTop: 12,
    marginLeft: 2,
    marginRight: 3,
  },
  input: {
    width: 250,
    height: 45,
    borderColor: "#B08BBB",
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 18,
    padding: 10,
    zIndex: 0,
  },
  inputHolder: {
    display: "flex",
    height: "18%",
    justifyContent: "space-between",
    alignItems: "flex-start",
    textAlign: "center",
    margin: 30,
  },
  button: {

  },
  shadow: {
    alignItems: "center",
    justifyContent: "center",
    width: "65%",
    height: 50,
    marginTop: 20,
    borderRadius: 20,
    backgroundColor : "white",
    borderRadius: 10,
    marginBottom : 10,
    // borderStyle : "solid",
    // borderColor : "black",
    // borderWidth : 1,
    shadowColor: "grey",
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  media: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "65%",
    marginTop: 50,
  },
  textButton: {
    height: 38,
    fontWeight: "600",
    fontSize: 20,
    width: 230,
    textAlign: "center",
    textAlignVertical: "center",
    color: "#B08BBB",
    borderRadius: 8,
  },
  icon: {},
  signUp: {
    marginTop: "15%",
    fontSize: 22,
    color: "#B08BBB",
  },
});
