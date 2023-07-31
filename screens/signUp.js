import {useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faGoogle, faApple, faFacebook } from '@fortawesome/free-solid-svg-icons/faMugSaucer'

const signUp = () => {

    // useState pour les changement d'état des inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    // dispatch(updateNickname(nickname));

    //redirige au click de l'input a la Home
    navigation.navigate('TabNavigator');
  };

  return (
    <SafeAreaView>
        {/* creation des inputs*/}
      <TextInput
        style={styles.input}
        //changeText avec le changement d'etat
        onChangeText={setUsername}
        //la valeur de l'input
        value={username}
        placeholder='username'
      />
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder='email'
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder='password'
      />
       <TouchableOpacity onPress={() => handleSubmit()} style={styles.button} activeOpacity={0.8}>
        <Text style={styles.textButton}>Submit</Text>
      </TouchableOpacity>
      <View>
            <TouchableOpacity><FontAwesome style={styles.google} icon={faGoogle} /></TouchableOpacity>
            <TouchableOpacity><FontAwesome style={styles.apple} icon={faApple} /></TouchableOpacity>
            <TouchableOpacity><FontAwesome style={styles.facebook} icon={faFacebook} /></TouchableOpacity>
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
});

export default signUp;