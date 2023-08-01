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
import SignUp from './SignUp';


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
      <View style={styles.topLogo}>
          <Text style={styles.logoText}>LE PETIT C</Text>              
              <FontAwesome  name="toilet-paper" color="#B08BBB" size={34} style={styles.toilet}/>
          <Text style={styles.logoText}>IN</Text>
      </View>
    
      <View style={styles. inputHolder}>
          <View style={styles.label}>
              <Text style={styles.placeholders}>Mail</Text>
              <TextInput
                // onChangeText={(value) => setNickname(value)}
                style={styles.input} placeholder="john@gmail.com" 
                textColor = '#51bc8a'
                baseColor = '#FFFFFF'
                />
          </View>
          
          <View style={styles.label}>
            <Text style={styles.placeholders}>Mot de Passe</Text>
            <TextInput
              // onChangeText={(value) => setNickname(value)}
              style={styles.input} placeholder="***********" 
            />
          </View>
      </View>
      <TouchableOpacity
        onPress={() => handleSubmit()}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.textButton}>Sign in</Text>
        </TouchableOpacity>
        <View style={styles.media}>
          <TouchableOpacity>
            <FontAwesome style={styles.icon} name="google" color="#263238" size={34} />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome style={styles.icon} name="apple" color="#263238" size={34} />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome style={styles.icon} name="facebook" color="#263238" size={34} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate(SignUp)}>
          <Text style={styles.signUp} >pas de compte?</Text>
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
  },
  logoText: {
  fontSize: 38,
  color: "#B08BBB",
  },
  placeholders: {
    padding: 0,
    position: "relative",
  },
  toilet: {
    marginTop: 12,
    marginLeft: 2,
    marginRight: 3,

  },
  input: {
    width: 230,
    height: 45,
    borderColor: "#B08BBB",
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 18,
    padding: 10,
    zIndex: 0,
  },
  inputHolder: {
    display: 'flex',
    height: '18%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    textAlign: 'center',
    margin: 30,
  },
  labelContainer: {
    backgroundColor: "white", // Same color as background
    alignSelf: "flex-start", // Have View be same width as Text inside
    paddingHorizontal: 3, // Amount of spacing between border and first/last letter
    marginStart: 10, // How far right do you want the label to start
    zIndex: 1, // Label must overlap border
    elevation: 1, // Needed for android
    shadowColor: "black", // Same as background color because elevation: 1 creates a shadow that we don't want
    position: "absolute", // Needed to be able to precisely overlap label with border
    top: -12
  },
  button: {
    display: 'flex',
    alignItems: "center",
    justifyContent: 'center',
    paddingTop: 8,
    width: "65%",
    height: 70,
    marginTop: 20,
    borderRadius: 10,
    shadowColor: "red",
    // shadowOffset: {
	  //   width: 5,
    //   height: -2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4.84,
  },
  media: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "space-around",
    width: '65%',
    marginTop: 40,

  },
  textButton: {
    height: 38,
    fontWeight: "600",
    fontSize: 20,
    width: 230,
    textAlign: 'center',  
    textAlignVertical: 'center',
    backgroundColor: "#B08BBB",
    borderRadius: 8,
  },
  icon: {

  },
  signUp: {
    marginTop: '20%',
    fontSize: 22,

  }

});
