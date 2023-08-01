import { useState } from "react";

import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  KeyboardAvoidingView
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import SignIn from './SignIn'

const SignUp = ({ navigation }) => {
  // useState pour les changement d'état des inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inputEmpty, setInputEmpty] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  const handleSubmit = () => {

      fetch(`http://${process.env.EXPO_PUBLIC_IP}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({userName: username, email, password})
    })
    .then(response => response.json())
    .then(data => {
      if(EMAIL_REGEX.test(email)){
        if(data.result){
            //redirige au click de l'input a la Home
            navigation.navigate("TabNavigator");
        }else{
            setInputEmpty(true)
          }
        }else{
          setEmailError(true)
          
        }
    });
  };

  return (
    
    <View
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
         <Text style={styles.placeholders}>Username</Text>
           {/* <TextInput */}
           <TextInput
                // onChangeText={(value) => setNickname(value)}
                style={styles.input} 
                placeholder="Username" 
                textColor = '#51bc8a'
                onChangeText={(value) => setUsername(value)}
                baseColor = '#FFFFFF'
                value={username}
                />
        </View>

          <View style={styles.label}>
              <Text style={styles.placeholders}>Mail</Text>
              <TextInput
                // onChangeText={(value) => setNickname(value)}
                style={styles.input} 
                placeholder="john@gmail.com" 
                textColor = '#51bc8a'
                baseColor = '#FFFFFF' 
                onChangeText={(value)=>setEmail(value)}
                value={email}
                />
          </View>
          
          <View style={styles.label}>
            <Text style={styles.placeholders}>Mot de Passe</Text>
            <TextInput
              // onChangeText={(value) => setNickname(value)}
              style={styles.input} 
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={(value) => setPassword(value)}
              value={password}
            />
          </View>
      </View>
      <TouchableOpacity
        onPress={() => handleSubmit()}
        style={styles.button}
        activeOpacity={0.8}
      >
        {inputEmpty && <Text style={styles.error}>Veuillez remplir tout les champs de saisie</Text>}

       {emailError && <Text style={styles.error}>email incorrect</Text>}

        <Text style={styles.textButton}>Sign Up</Text>
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
        <TouchableOpacity onPress={() => navigation.navigate(SignIn)}>
          <Text style={styles.signUp} >Se connecter ?</Text>
        </TouchableOpacity>
      
    </View>
  );
};

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
        marginBottom:10,
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
    
      },
    error:{
      color:'red',
      padding:30,
      fontWeight:'bold'
  }

});

export default SignUp;
