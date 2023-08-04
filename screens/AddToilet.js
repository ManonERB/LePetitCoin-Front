import { Text, StyleSheet, View, TextInput, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import FontAwesome from "react-native-vector-icons/FontAwesome5";

export default function AddToilet () {
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');

    return (
    <View>
        <View>
            
        <Image source={require('../assets/Placeholder_view.png')} style={styles.img} />
        <Text style={styles.title}>
            Ajouter un coin
        </Text>
        <Text>Title :</Text>
        <TextInput
        style={styles.input}
        onChangeText={setTitle}
        value={title}
        placeholder="Titre"
        />
         <View 
        style={styles.plusButton}       activeOpacity={0.8}
        >
                <TouchableOpacity 
                style={styles.plusPic}>
                <FontAwesome name="plus" size={18} color="white" 
                />
                </TouchableOpacity>
        </View>
          </View>
      <Text>Adress :</Text>
        <TextInput
        style={styles.input}
        onChangeText={setAddress}
        value={address}
        placeholder="Adress"
      />

      <Text>Description :</Text>
        <TextInput
        style={styles.input}
        onChangeText={setDescription}
        value={description}
        placeholder="Description"
        multiline={true}
        numberOfLines={4}
      />
  
    </View>

    )
}

const styles = StyleSheet.create({
    title: {
        textAlign:"center",
        fontSize: 25,
        fontWeight:"bold"
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  img: {
    width:"100%",
    height:"40%"
  }
  });
  