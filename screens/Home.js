        import { Text, TouchableOpacity, View, TextInput, Image, StyleSheet, Modal } from 'react-native';
        import { useDispatch, useSelector } from 'react-redux';
        import { useState, useEffect } from 'react';
        import { NavigationContainer } from '@react-navigation/native';
        import { createNativeStackNavigator } from '@react-navigation/native-stack';
        import FontAwesome from "react-native-vector-icons/FontAwesome5";
        import AddToilet from './AddToilet';
        import MapView, { Marker } from 'react-native-maps';
        import * as Location from 'expo-location';
    
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
            const [modalVisible, setModalVisible] = useState(true);

            // const handleModalRecherche = () => {
            //     setModalVisible(true);
            //   };    
            const form = () => {
                const [checkForm, setCheckForm] = useState ([])
                //rajouter distance dans les options voire toilettes turques/normales
                //gérer les availability en fonction de l'heure de son téléphone
                // propreté : "peu importe" "tres" "pas du tout"
            const options = 
                ["fee", "handicapAccess", "changingTable"]
            
            function pickOptions(selectionCheckForm) {

                if(checkForm.includes(selectionCheckForm)) {
                    setCheckForm(checkForm.filter(optionWC => optionWC !== selectionCheckForm))
                return
                }
                setCheckForm(checkForm=>checkForm.concat(selectionCheckForm))
            }
                return (
                    <View style={styles.containerOptions}>
                        {/* //texte à changer */}
                        <Text style={styles.titleList}>Sélectionner vos équipements royaux</Text> 
                        <View style={styles.optionsOptions}>
                            {options.map(option => (
                            <View key={option} style={styles.list}>
                                <TouchableOpacity style={styles.checkBox} onPress={() => pickOptions(optionWC)}>
                                { checkForm.includes(optionWC) && <Text style={styles.check}>X</Text> }
                                    </TouchableOpacity>
                                <Text style={styles.listText}>{option}</Text>
                            </View>))}
                        </View>
                    </View>
                )
            }

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
                    
                } else {
                    setModalVisible(true);

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
        //   <View key={i} style={styles.cardToilet}>
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
                    <TextInput placeholder="Recherchez votre petit coin idéal..." 
                    style={styles.placeholder}
                        onChangeText={(value) => setRechercherUnCoin(value)} 
                        value={rechercherUnCoin}  /> 
                        {/* en value l'état "rechercherUnCoin', au clic, déclenchement de la fonction handleSubmit, et ... interrogation de l'API ? + filtre de la recherche*/}
                        <FontAwesome name='search' 
                            onPress={() => handleSubmit(/*data.records[0].fields.commune*/)} size={25} color='#B08BBB' 
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
                    {/* {toilet} */}
            <Modal visible={modalVisible} animationType="fade" >
            <View style={styles.modalViewContainer}>
            <View style={styles.modalView}>
            <View style={styles.InputPlaceholderModal}>
                <View style={styles.textModal}>
                    <Text style={styles.titleModal}>Partons en quête de votre trône...</Text>
                    <TextInput placeholder='Entrez la ville de votre recherche' style={styles.placeholderModal}/>
                
                {/* // mon icone ne s'affiche pas  */}
                    <FontAwesome name='search' size={25} color='#B08BBB'
                    onPress={() => handleSubmit() 
                        // Ajoutez la fonction que vous souhaitez appeler lorsque l'icône de recherche est cliqué à l'intérieur de la modal
                    }
                    />              
                    </View>
                {form()}
            </View>
            </View>
            </View>
            </Modal>

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
            width : 120,
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
    textModal : {
        // flexWrap : "wrap",
    },
    titleModal : { 
        color : "white",
        textAlign : "center",
        fontWeight : "bold",
        textAlign : "center",
        paddingTop : 25,

    },
    modalView: {
        backgroundColor: '#B08BBB',
        borderRadius: 20,
        flexDirection : "column",
        padding: 30,
        fontSize : 12,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width : '90%',
        height: 300,
        alignContent: "center",
        alignItems : "center",
        justifyContent: "flex-start",
        marginTop: 10,
    },
    modalViewContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        paddingTop: 40,
        flexDirection : "column",

    },
    placeholderModal : {
        color : '#B08BBB',
        fontWeight : "bold",
        alignItems : "center",
        alignContent : "center",
        justifyContent : "center",
        height : 40,
        width : 240,
        padding : 10,
        fontSize : 12,
        backgroundColor: "white",
        marginTop : 18,
        borderRadius: 8,
        flexDirection : "row",
    },
    InputPlaceholderModal : {
        width: "90%",
        height: 50,
        // alignContent: "center",
        // alignItems : "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    containerOptions : {
        flex : 1,
        justifyContent : "center",
        alignItems : "center",
    },
    titleOptions : {
        fontSize: 18,
        fontWeight : "bold",
    },
    titleList : {
        alignSelf : "flex-start"
    },
    list : {
        flexDirection : "row",
        marginVertical : "7"
    },
    checkBox : {
        width : 25,
        height : 25,
        borderWidth : 2,
        borderColor : '#B08BBB',
        marginRight : "5",
    },
    listText : {
        fontSize : "16"
    },
    check : {
        alignSelf : "center"
    }
    });
