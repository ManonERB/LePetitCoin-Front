import { Text, View, Image, SafeAreaView, ScrollView, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import React, { useState, useEffect } from 'react';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { recupeFunFact } from '../reducers/funfact';
import funfact from '../reducers/funfact';
import imageNames from './ImagesArray';
//     // Combinaison des reducers en utilisant combineReducers
//     const rootReducer = combineReducers({
//     funFact: funfact.reducer,
//   });
    const store = configureStore({
        reducer: funfact,
      });


      export default function FunFacts () {
          const [refreshing, setRefreshing] = useState(false);
          const dispatch = useDispatch()
          //state.funFact.value = acéder aux valeurs du reducer funfact
          const funFact = useSelector((state) => state.funfact.value)

          const [randomIndex, setRandomIndex] = useState(0); // useState pour gérer l'état de l'index de l'image aléatoire à afficher.

          const getRandomImage =() => {
          const randomImageIndex = Math.floor(Math.random() * 66);
            console.log(randomImageIndex)
        return imageNames[randomImageIndex];
    };    

        useEffect(() => { // chaque rechargement du composant, va sortir une image
            setRandomIndex(getRandomImage); 
         }, []); // Utilisation d'un tableau vide pour exécuter useEffect une seule fois
                     

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchFunFact()
    })
    //     setTimeout(() => {
        //     }, 2000);
        // }, []);
        
        const handleReload = () => {
        fetchFunFact();
    }; 
    
    const fetchFunFact = () => {
        fetch(`http://${process.env.EXPO_PUBLIC_IP}/funFacts`)
          .then ((res) => res.json())
          .then((data) => {
            dispatch(recupeFunFact(data)); // RecupeFunfact met à jour le store avec les données récupérées

          });
      };
   
      useEffect(() => {
        fetchFunFact();
      }, []);

    return (
<Provider store={store}>
    <SafeAreaView style={styles.container}>
        <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.imageTitleAndText}>
        <View style={styles.TitleBox}><Image style={styles.titleFacts} source={require('../assets/FunFacts.jpg')}></Image></View>
          <View style={styles.containerImage}>
            <Image style={styles.image}
            source={getRandomImage()}
            />
          </View>
          <View style={styles.titleAndText}>
            <Text style={styles.title}>
            {funFact.title}
            </Text>
            <Text style={styles.text}>
            {funFact.text}
            </Text>

          </View>                
          <TouchableOpacity style={styles.buttonRefresh} onPress={() => handleReload()}>
                <FontAwesome name='redo-alt' size={22} solid color='#A86B98' />      
            </TouchableOpacity>
        </View>
        </ScrollView>
    </SafeAreaView>
</Provider>

    )
}
    

const styles = StyleSheet.create({
container : {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    alignContent : "center",
    justifyContent : "center",
    textAlign : "center",
    paddingTop: 40,
    width : '100%',
    height : '100%',
    },
imageTitleAndText : {
    width : "100%",
    alignContent : "center",
    alignItems : "center",

    },
containerImage : {
    marginTop: 30,
    },
titleFacts: {
    width: 180,
    objectFit: 'contain'
    },
image : {
    width : 300,
    height : 350,
    borderRadius : 10,
    objectFit: 'fill'
    // backgroundColor : "blue"
    },
    Title: {
    width: '90%',
    objectFit: 'fill',

    },
titleAndText : {
    alignItems : "center",
    alignContent : "center",
    justifyContent : "center",
    borderBottomColor : "#A86B98",
    width : '85%',
    marginTop : 5
    },        
title: {
    backgroundColor: '#fff',
    textAlign: 'justify',
    paddingLeft : 20,
    paddingTop : 10,
    fontSize: 18,
    color : "#A86B98",
    fontWeight: 'bold',
    borderTopColor : "#A86B98",
    borderStyle : 'solid',
    borderBottomWidth : 2,
    width : "100%",
    borderBottomColor : "#A86B98",
    paddingBottom : 20,
    lineHeight: 25,
    },
text : {
    color : "black",
    fontSize : 15,
    textAlign : "center",
    justifyContent : "center",
    textAlign : "justify",
    padding : 20,
    borderBottomColor : "#A86B98",
    borderStyle : 'solid',
    borderBottomWidth : 2,
    width : "100%",
    lineHeight: 22,

},
buttonRefresh : {
    width : 50,
    height : 50,
    alignItems : "center",
    alignContent : "center",
    justifyContent : "center",
    marginTop : 20,
    backgroundColor : "white"
},


    });
