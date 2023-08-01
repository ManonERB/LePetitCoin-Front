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
  // useState pour les changements d'état des inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inputEmpty, setInputEmpty] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  const handleSubmit = () => {

      fetch('http://10.20.2.189:3000/users/signup', {
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
    
    <SafeAreaView style={styles.container}>
        <Text style={styles.title}>SignUp</Text>
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
        <Text style={styles.textButton}>Sign Up</Text>
      </TouchableOpacity>
      {inputEmpty && <Text style={styles.error}>Veuillez remplir tout les champs de saisie</Text>}
      {emailError && <Text style={styles.error}>email incorrect</Text>}

      <View style={styles.icons}>
        <TouchableOpacity>
          <FontAwesome style={styles.google} name="google" size={34} />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome style={styles.apple} name="apple" size={34} />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome style={styles.facebook} name="facebook" size={34} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
    },  
    title: {
        fontSize:30,
        textAlign:"center",
        paddingTop:40,
        paddingBottom:50,
    },
  input: {
    width:"60%",
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor:"#B08BBB",
    borderTopLeftRadius:5,
    borderTopRightRadius:5,
    borderBottomLeftRadius:5,
    borderBottomRightRadius:5,
  },
  button:{
    width:"65%",
    justifyContent:"center",
    alignItems:"center",
    padding:30,
  },
  textButton:{
    backgroundColor:'#b08bbb',
    width:"65%",
    height:38,
    textAlign:"center",
    textAlignVertical:"center",
    color:"white",
  },
  icons:{
    
    width:"65%",
    flexDirection:"row",
    justifyContent:"space-around",
    alignItems:"center"
    
  },
//   google: {
//     size:30,
//     color:"red"
//   },
//   facebook: {
//     width:10,
//     color:"black"
//   },
//   apple: {
//     width:10,
//     color:"grey"
//   },
error:{
      color:'red',
      paddingBottom:30,
      fontWeight:'bold'
  }

});

export default SignUp;
