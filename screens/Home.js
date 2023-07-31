import { Text, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { useState } from 'react';



export default function Home () {
    const dispatch = useDispatch();

    const [rechercherUnCoin, setRechercherUnCoin] = useState('');

// mettre sa fonction avec un dispatch (updateRechercheUnCoin(rechercheUnCoin))
    // const handleSubmit = () => {
    //     dispatch(sdfsf ( dsfsdfv ));
    //   };

    return (
    <View>
      <TextInput placeholder="Recherche ton petit coin idéal..." 
      style={styles.placeholder}
        onChangeText={(value) => setRechercherUnCoin(value)} 
        value={rechercherUnCoin}  /> 
        {/* en value l'état "rechercherUnCoin', au clic, déclenchement de la fonction hangleSubmit, et ... interrogation de l'API ? + filtre de la recherche*/}
        <FontAwesome name='MagnifyingGlass' 
            // onPress={() => handleSubmit(data.records[0].fields.commune)} size={25} color='#ec6e5b' 
            // à vérifier le chemin pour aller chercher le nom de la commune
            />
        <TouchableOpacity style={styles.buttonAddToilet}
        // onPress={() => handleAddToilet()}  activeOpacity={0.8} // mettre fonction handleAddToilet en haut pour déclencher route vers page "Ajout toilette"
        >
            <Text style={styles.textButton}>Vous souhaitez ajouter un petit coin ?  +</Text>
        </TouchableOpacity>
   
    </View>
    )
}

const styles = StyleSheet.create({
    title: {
      flex: 1,
      backgroundColor: '#fff',
      color: "black",
      alignItems: 'center',
      justifyContent: 'center',
  },
  placeholder : {
    backgroundColor : "red",
  },
  buttonAddToilet : {
    backgroundColor : "#B08BBB",
    color : "#ffffff",
    fontWeight: '600',
    width : "70%",
    heigth : 20,
    padding : 20
  }
});
