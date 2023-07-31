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
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SignUp from "../screens/SignUp";


export default function SignIn({ navigation }) {
  const dispatch = useDispatch();

  // const [nickname, setNickname] = useState('');
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    // dispatch(updateNickname(nickname));
    navigation.navigate("TabNavigator");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}></Text>
      <View>
        <TextInput
          // onChangeText={(value) => setNickname(value)}
        
          style={styles.input}
        />
        <Text style={styles.placeholders}>Email</Text>
        <TextInput
          // onChangeText={(value) => setNickname(value)}
          
          style={styles.input}
        />
        <Text style={styles.placeholders}>Password</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleSubmit()}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.textButton}>Sign in</Text>
          <View>
            <TouchableOpacity>
              <FontAwesome style={styles.google} name="google" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome style={styles.apple} icon="apple" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome style={styles.facebook} icon="facebook" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate(SignUp)}>
            <Text style={styles.signUp}>No account yet?</Text>
          </TouchableOpacity>
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
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    width: "70%",
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    width: "70%",
    marginTop: 25,
    borderColor: "#B08BBB",
    borderWidth: 1,
    fontSize: 18,
  },
  button: {
    alignItems: "center",
    paddingTop: 8,
    width: "70%",
    marginTop: 30,
    backgroundColor: "#ec6e5b",
    borderRadius: 10,
    marginBottom: 80,
  },
  textButton: {
    color: "#B08BBB",
    height: 38,
    fontWeight: "600",
    fontSize: 20,
  },
  google: {

  }, 
  facebook: {

  },
  apple: {

  }
});
