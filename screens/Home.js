    import { Text, TouchableOpacity, View, TextInput, Image } from 'react-native';
    import { StyleSheet } from 'react-native';
    import { useDispatch } from 'react-redux';
    import { useState } from 'react';
    import { NavigationContainer } from '@react-navigation/native';
    import { createNativeStackNavigator } from '@react-navigation/native-stack';
    import FontAwesome from "react-native-vector-icons/FontAwesome5";
    import AddToilet from './AddToilet';

    const Stack = createNativeStackNavigator();


    export default function Home ({navigation}) {
        const dispatch = useDispatch();

        const [rechercherUnCoin, setRechercherUnCoin] = useState('');

    // mettre sa fonction avec un dispatch (updateRechercheUnCoin(rechercheUnCoin))
        // const handleSubmit = () => {
        //     dispatch(sdfsf ( dsfsdfv ));
        //   };

        return (
        
        <View style={styles.container}>
        <View style={styles.InputPlaceholder}>
            <TextInput placeholder="Recherche ton petit coin idéal..." 
            style={styles.placeholder}
                onChangeText={(value) => setRechercherUnCoin(value)} 
                value={rechercherUnCoin}  /> 
                {/* en value l'état "rechercherUnCoin', au clic, déclenchement de la fonction hangleSubmit, et ... interrogation de l'API ? + filtre de la recherche*/}
                <FontAwesome name='MagnifyingGlass' 
                    // onPress={() => handleSubmit(data.records[0].fields.commune)} size={25} color='#ec6e5b' 
                    // à vérifier le chemin pour aller chercher le nom de la commune
                    // affiche un ? au lieu d'une loupe
                    />
        </View>
        <View style={styles.containerButtons}>
                    
      {/* Utilisez les props de navigation pour naviguer vers "AddToilet" */}
            {/* <Stack.Navigator initialRouteName='Home'>
              <Stack.Screen > */}
                <TouchableOpacity style={styles.buttonAddToilet}
                activeOpacity={0.8} 
                onPress={() => navigation.navigate('AddToilet')}
                >
                <Text style={styles.textButton} >Un petit coin à ajouter ?        </Text>
                </TouchableOpacity>
              {/* </Stack.Screen>
            </Stack.Navigator> */}
                <TouchableOpacity style={styles.buttonMap} >
                    <Text style={styles.textMap} >Map</Text> 
                    
                </TouchableOpacity>
        </View>
        <View style={styles.cardToilet}>
        <Image style={styles.image} source={require('../assets/LeSplendido.jpg')} />
            <View style={styles.textCard}>
                <Text style={styles.title}>
                    Adresse
                </Text>
                <View style={styles.caracteristiques}>
                    <Text>Gratuit</Text>
                    <Text>Horaires</Text>
                    <Text>Disponibilité</Text>
                </View>
                <View style={styles.distanceEtAvis}>
                    <Text style={styles.distance}>150m</Text>
                    <View style={styles.avisContainer}>
                    <Text style={styles.avis}>Etoiles</Text>
                    </View>
                </View>
            </View>
        </View>
        </View>
        )
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems : "center",
            backgroundColor: '#ffffff',
            paddingTop : 50,
        },

        title: {
        color: "#B08BBB",
        fontSize : 16,
        fontWeight : "bold",
        paddingBottom : 12, 
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
        // borderRadius : 15,
        // backgroundColor : 'transparent',
    },
    InputPlaceholder : { // rajouter ombre
        flexDirection : "row",
        borderRadius : 10,
        width : "85%",
        height : 50,
        alignContent : "space-between",
        alignItems : "center",
        justifyContent : "center",
        paddingRight : 10,
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
    cardToilet : {
        marginTop : 10,
        flexDirection : "row",
        alignItems : "center",
        backgroundColor : "white",
        width : 310,
        height : 140,
        borderRadius : 15,
        padding : 10, 
        borderStyle : "solid",
        borderColor : "black",
        borderWeight : 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    containerButtons : {
        flexDirection : "row",
        height : 50,

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
    },
    buttonMap : {  // rajouter ombre
        marginStart : 10,
        borderTopStartRadius: 12,
        borderBottomLeftRadius : 12,
        width : "35%",
        alignItems : "center",
        alignContent : "center",
        justifyContent : "center",
        borderWidth: 1,
        borderStyle : 'solid',

    },
    //ici
    image : { 
        width : 100,
        height : 120,
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
    textMap : {  
        color : "#B08BBB",
        fontWeight: 'bold',
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
    avisContainer : {
        alignItems: 'flex-end',
    }
    });
