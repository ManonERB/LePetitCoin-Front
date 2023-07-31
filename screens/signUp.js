import { useState } from "react";

import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const SignUp = ({ navigation }) => {
  // useState pour les changement d'état des inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);


  
  const handleSubmit = () => {

      fetch('http://10.20.2.189:3000/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({userName: username, email, password})
    })
    .then(response => response.json())
    .then(data => {
        if(data.result){
            //redirige au click de l'input a la Home
            navigation.navigate("TabNavigator");
        }else{
            setEmailError(true)
        }
    });
  };

  return (
    
    <SafeAreaView>
        <Text>SignUp</Text>
      {/* creation des inputs*/}
      <TextInput
        style={styles.input}
        //changeText avec le changement d'etat
        onChangeText={setUsername}
        //la valeur de l'input
        value={username}
        placeholder="username"
      />
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="email"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="password"
      />
      <TouchableOpacity
        onPress={() => handleSubmit()}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.textButton}>Submit</Text>
      </TouchableOpacity>
      {emailError && <Text style={styles.error}>email ou isername déja existant</Text>}

      <View style={styles.icons}>
        <TouchableOpacity>
          <FontAwesome style={styles.google} name="google" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome style={styles.apple} name="apple" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome style={styles.facebook} name="facebook" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  icons:{
    height:50,
  },
  google: {
    size:30,
    color:"red"
  },
  facebook: {
    width:10,
    color:"black"
  },
  apple: {
    width:10,
    color:"grey"
  },error:{
      color:'red'
  }

});

export default SignUp;
