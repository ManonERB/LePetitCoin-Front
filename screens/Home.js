    import { Text, TouchableOpacity, View, TextInput, Image, StyleSheet } from 'react-native';
    import { useDispatch, useSelector } from 'react-redux';
    import { useState, useEffect } from 'react';
    import { NavigationContainer } from '@react-navigation/native';
    import { createNativeStackNavigator } from '@react-navigation/native-stack';
    import FontAwesome from "react-native-vector-icons/FontAwesome5";
    import AddToilet from './AddToilet';
    import MapView, { Marker } from 'react-native-maps';
    import * as Location from 'expo-location';
    import Map from './Map';
    import user, { recupeToilet } from '../reducers/user';
    import { configureStore } from '@reduxjs/toolkit';

    const Stack = createNativeStackNavigator();

// store configuré dans App.js - sert pour récupérer les cards avec infos des toilets dans la BDD 

    export default function Home ({navigation}) {

        const dispatch = useDispatch(); // va chercher les données
        const user = useSelector ((state) => state.user.value)

        const [currentPosition, setCurrentPosition] = useState(null);
        const [rechercherUnCoin, setRechercherUnCoin] = useState('');
        const [toilet, setToilet] = useState([])

        useEffect(() => {
            (async () => {
              const { status } = await Location.requestForegroundPermissionsAsync();
         
              if (status === 'granted') {
                Location.watchPositionAsync({ distanceInterval: 10 },
                  (location) => {
                      // vérifier que l'on reçoit bien ma location
                    //console.log('ici', location); 
                    setCurrentPosition(location.coords); // mettre quoi renvoyer. pas forcément location.coords
                  });
              }
            })();
          }, []);
     
  // mettre sa fonction avec un dispatch (updateRechercheUnCoin(rechercheUnCoin))
  const handleSubmit = () => {
   

  // fetch(`http://${process.env.EXPO_PUBLIC_IP}/toilet`)
  // .then((response) => response.json())
  // .then((data) => {   
  //     //si data.result est vrai
  //     // console.log(user)
 
  //     if(data.result){
  //         const cards = data.toilets.map((data, i) =>{
            //  console.log(data)
      //  return (
      //   <View style={styles.cardToilet}>
      //       <Image style={styles.image} source={require('../assets/LeSplendido.jpg')} />

      //   <View style={styles.textCard}>
      //       <Text style={styles.title}>
      //           {data.commune}
      //       </Text>
      //       <View style={styles.caracteristiques}>
      //           <Text>Gratuit : {data.fee !== undefined ? `${data.fee}` : "- -"}</Text>
      //           <Text>Horaires:{data.tags_opening_hours !== null ? `${data.tags_opening_hours}` : "- -"}</Text>
      //       </View>
      //       <View style={styles.distanceEtAvis}>
      //           <Text style={styles.distance}>150m</Text>
      //           <View style={styles.avisContainer}>
      //           <Text style={styles.avis}>Etoiles</Text>
      //       </View>
      //       </View>
      //       </View>
      //   </View>
      //        )
             
    //      }); 
    //     setToilet(cards)
    //   }
      
    // })
 
  };

        return (
        
        <View style={styles.container}>
            <View style={styles.InputPlaceholder}>
                <TextInput placeholder="Recherche ton petit coin idéal..." 
                style={styles.placeholder}
                    onChangeText={(value) => setRechercherUnCoin(value)} 
                    value={rechercherUnCoin}  /> 
                    {/* en value l'état "rechercherUnCoin', au clic, déclenchement de la fonction handleSubmit, et ... interrogation de l'API ? + filtre de la recherche*/}
                    <FontAwesome name='search' 
                        // onPress={() => handleSubmit(data.records[0].fields.commune)} size={25} color='#ec6e5b' 
                        // à vérifier le chemin pour aller chercher le nom de la commune
                        />
            </View>
            <View style={styles.containerButtons}>
                    <TouchableOpacity style={styles.buttonAddToilet}
                    activeOpacity={0.8} 
                    onPress={() => navigation.navigate('AddToilet')}
                    >
                    <Text style={styles.textButton}>Un petit coin à ajouter ?</Text>
                    </TouchableOpacity>
                    <View style={styles.buttonShadow}>
                        <TouchableOpacity style={styles.buttonMap} onPress={() => navigation.navigate('Map')}>
                            <FontAwesome name='map' size={18} solid color='#A86B98' />
                            <Text style={styles.textMap}>Map</Text> 
                        </TouchableOpacity>
                    </View>
            </View>
                {toilet}
            
        </View>
        )
    }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingTop: 40,
},

  title: {
    color: "#A86B98",
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 12,
},
  reviewButton: {
    width: 120,
    height: 60,
    backgroundColor: 'red',
   
},
placeholder : { 
    color : '#B08BBB',
    fontWeight : "bold",
    alignItems : "center",
    alignContent : "center",
    justifyContent : "center",
    height : 50,
    width : "90%",
    padding : 10,
},
containerButtons: {
flexDirection: 'row',
},
InputPlaceholder: {
    flexDirection: "row",
    width: "90%",
    height: 50,
    alignContent: "space-between",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 10,
    // rajouter ombre
    backgroundColor: "white",
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
},
searchIcon: {
    marginRight: 10,
},
cardToilet: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    width: "90%",
    height: 140,
    borderRadius: 15,
    padding: 10,
    borderStyle: "solid",
    borderColor: "black",
    borderWeight: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
  }
},
buttonAddToilet : {
    backgroundColor : "#B08BBB",
    width : "65%",
    padding : 5,
    borderTopEndRadius: 12,
    borderBottomRightRadius : 12,
    alignItems : "center",
    alignContent : "center",
    justifyContent : "center",
},
textButton : { 
    color : "white",
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    width: "100%"
},
buttonMap : {  
    borderTopStartRadius: 12,
    borderBottomLeftRadius : 12,
    width : "45%",
    alignItems : "center",
    justifyContent : "center",
    flexDirection: 'row',
},
textMap : {  
    color : "#A86B98",
    fontWeight: 'bold',
    fontSize: 28,
    marginLeft: 15,
},
buttonShadow: { // rajouter ombre
    alignItems : "center",
    justifyContent : "center",
    borderRadius: 8,
    backgroundColor : "white",
    shadowColor: "grey",
    width: 140,
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    marginLeft: 10,
},
image : { 
    width : 100,
    height : 100,
    borderRadius : 15,
    paddingLeft : 10
},
caracteristiques : { 
    flexDirection : "column"
},
textCard : {
    flexDirection : 'column',
    paddingLeft : 8,
},
distanceEtAvis : { 
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
},
distance : {
    color: "#B08BBB",
    fontSize : 14,
    fontWeight : "bold",
},
avis : { 
    color: "#B08BBB",
    fontSize : 14,
    fontWeight : "bold",
    paddingRight : 10,
    paddingLeft : 60,
},
avisContainer: {
    alignItems: 'flex-end',
},
});
