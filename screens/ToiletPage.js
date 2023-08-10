import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import MapView, { Marker } from "react-native-maps";
import { getDistance } from 'geolib';
import * as Location from "expo-location";

import {Dimensions} from 'react-native';


export default function ToiletPage ({route, navigation}) {
    
  const [toilet, setToilet] = useState(null);
  const [review, setReview] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);

  const {toiletId} = route.params

  // setCurrentPosition(location.coords);
  // setInitialRegion({
  //   latitude: location.coords.latitude,
  //   longitude: location.coords.longitude,
  //   latitudeDelta: 0.04,
  //   longitudeDelta: 0.02,
  // });

    useEffect(() => {

      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
  
        if (status) {
          const location = await Location.getCurrentPositionAsync({});
          setCurrentPosition(location.coords);
          console.log("ma position mise à jour", location)
        console.log(location);
          setInitialRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
            setCurrentPosition(location.coords);
          });
        }
      })();
    //  console.log("coucou", route)
    //  console.log("id", toiletId);
    fetch(`http://${process.env.EXPO_PUBLIC_IP}/toilet/${toiletId}`)
    .then(response => response.json())
    .then((data) => {
      // console.log("data", data.toilets.point_geo.lat);
      setToilet(data.toilets)
    });

    fetch(`http://${process.env.EXPO_PUBLIC_IP}/review/${toiletId}`)
    .then(response => response.json())
    .then((data) => {
      // console.log(data);
      setReview(data)
    });

    

   }, [toiletId]);

   if(toilet?.tags) {
    //parse car dans le bdd c'est en string transform en objet
    const amenity=JSON.parse(toilet.tags)
    // console.log("toutou", amenity.amenity)
   }

  
  // useEffect(() => {
  //   if (currentPosition) { // Check if currentPosition is not null
  //     fetch(`http://${process.env.EXPO_PUBLIC_IP}/toilet/map`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         // console.log('data', data.toilets);
          
  //         const filteredToilets = data.toilets.filter((toiletData) => {
  //           const distance = getDistance(
  //             {
  //               latitude: currentPosition.latitude,
  //               longitude: currentPosition.longitude,
  //             },
  //             {
  //               latitude: toiletData?.point_geo?.lat,
  //               longitude: toiletData?.point_geo?.lon,
  //             }
  //             );
  //             return distance <= 1000; // Filter toilets within 1km distance
  //         })

  //       });
  //   }
  //   // {console.log(coordinate)}

  // }, [currentPosition]);


  //  useEffect(() => {
  //   if (currentPosition) { // Check if currentPosition is not null
  //     fetch(`http://${process.env.EXPO_PUBLIC_IP}/toilet/map`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         // console.log('data', data.toilets);
  
  //         const filteredToilets = data.toilets.filter((toiletData) => {
  //           const distance = getDistance(
  //             {
  //               latitude: currentPosition.latitude,
  //               longitude: currentPosition.longitude,
  //             },
  //           );
  //           return distance <= 1000; // Filter toilets within 1km distance
  //         });
  
  //         setToilet(filteredToilets);
  //       });
  //   }
  // }, [currentPosition]);

    // const cardReview = 
  //  console.log(review);


  // const distance = getDistance(
  //   {
  //     latitude: currentPosition.latitude,
  //     longitude: currentPosition.longitude,
  //   },
  //   {
  //     latitude: toilet.point_geo?.lat,
  //     longitude: toilet.point_geo?.lon,
  //   }
// );
console.log("toilet",toilet)
    return (
        <ScrollView>
          <View>      
            <Image 
              source={require('../assets/Placeholder_view.png')}
              style={styles.img}
            />
            <View 
              style={styles.plusButton}       
              activeOpacity={0.8}
            >
                <TouchableOpacity 
                  style={styles.plusPic}>
                  <FontAwesome name="heart" size={18} color="white" 
                  />
                </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text style={styles.title}>
              {toilet?.commune} {toilet?.code_postal} 
            </Text>
            <View style={styles.header}>
              <View style={styles.list}>
                <Text style={styles.text}>Horaires : {`${toilet?.tags_opening_hours ? toilet.tags_opening_hours : "Info indisponible"}`}</Text> 
                <Text style={styles.text}>Gratuité : {`${toilet?.tags_fee ? toilet.tags_fee : "Info indisponible"}`}</Text>
                <Text style={styles.text}>Type : {`${toilet?.title ? toilet.title : "Info indisponible"}`}</Text>           
              </View>
              

            </View>
          </View>
          <View>
        <Text style={styles.subTitle}>Où ce situe ce petit coin ? </Text>
        {currentPosition && (
          <MapView initialRegion={initialRegion} style={styles.map}>
            <Marker
              pinColor="#fecb2d"
              title="My location"
              coordinate={{
                latitude: initialRegion?.latitude,
                longitude: initialRegion?.longitude,
              }}
            />
            {toilet &&

                <Marker
                  pinColor="red"
                  coordinate={{
                    latitude: toilet?.point_geo?.lat,
                    longitude: toilet?.point_geo?.lon,
                  }}
                  title={toilet.title}
                />
              }
          </MapView>
        )}
        </View>
              <Text style={styles.subTitle}>Les équipements royaux de ce trône</Text>
          <View style={styles.equipement}> 
            
            <View>
              <Text style={styles.text}>
          {`${toilet?.tags_opening_hours ? toilet.tags_opening_hours : "aucune information disponible"}`}</Text>  
              <Text style={styles.text}>Description : {`\u2022 ${toilet?.title ? toilet.title : "Info indisponible"}`}</Text>
              <Text style={styles.text}>Eau potable : {`\u2022 ${toilet?.drinking_water ? toilet.drinking_water : "Info indisponible"}`}</Text>
              <Text style={styles.text}>Table-à-langer :{`\u2022 ${toilet?.changing_table ? toilet.changing_table : "Info indisponible"}`}</Text>
            </View>
            <View>
            </View>
          </View>
          <View>
            <View style={styles.reviewContainer}>
            <Text style={styles.barReview}> Ce qu'ils disent</Text>
            </View>
            {review.map((data,i) => {
              // console.log(data);
              return(
              <View key={i} style={[styles.cardReview, styles.shadowProp]}>
                <View style={styles.cardText}>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.titleReview}>{data.title} </Text>
                    <Text style={styles.titleRating}>note: {data.rating}/5</Text>
                  </View>
                  <View style={styles.cardReviewText}>
                    <Text style={styles.textReview}>{data.text}</Text>
                    <Text style={styles.userName}>- {data.user.userName}</Text>
                  </View>
                </View>
                <View style={styles.cardReviewImg}>
                    {data.pictures[0] ? (
                      <Image 
                        source={{ uri: data.pictures[0] }}
                        style={styles.cardimg}
                      />
                    ) : (
                      <Image 
                        source={require('../assets/Placeholder_view.png')} // Use your placeholder image source
                        style={styles.cardimg}
                      />
                    )}
                  </View>
                
              </View>

              )
              
            })}
            <View style={styles.avisButton}>
              <TouchableOpacity 
                style={styles.review}
                onPress={()=>navigation.navigate('Review', {toiletId})}
                >
                  <Text style={styles.textReview}>Donner votre avis</Text>
                  <FontAwesome 
                    name="pen"
                  size={18} 
                  color="white"
                  paddingLeft={20} 
                        />
                </TouchableOpacity>
              </View>
          </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
  map: {
    // flex:1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    // height: 200
},
img:{
    width: 380,
    height: 250,
},
plusPic: {
    width: 40,
    height: 40,
    backgroundColor: "#A86B98",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginLeft: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 9,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 5,
  },
  plusButton: {
    position: "absolute",
    top: "10%",
  },
  title:{
    fontSize:25,
    color:"#A86B98",
    fontWeight:"bold",
    textAlign:"center",
    padding:10,
  },
  list:{
    flexDirection:"column",
    width: '100%',
    paddingLeft:10,
    textAlign: 'left',

 },
 header:{
  flexDirection:"row",
  justifyContent:"space-between",
  paddingRight:5,
},
review:{
  backgroundColor:"#b08bbb",
  flexDirection:'row-reverse',
  justifyContent:"space-evenly",
  alignItems:"center",
  width: '50%',
  height: 50,
  borderRadius:12,
  margin: 10,
},
textReview:{
   fontSize:20,
   paddingLeft:15,
   paddingRight:5,
   color:"white"
 },
 text:{
  fontSize:16,
  textAlign: 'center',
 },
 subTitle:{
  color:"#A86B98",
  padding:15,
  fontSize:20,
  fontStyle:'italic',
  fontWeight: '500'
 },
 equipement:{

 },
 barReview:{
  fontSize:25,
  backgroundColor:"#b08bbb",
  width:"50%",
  color:"white",
  borderTopRightRadius: 12,
  borderBottomRightRadius: 12,
  height: 35,

  textAlign: 'center',
},
reviewContainer:{
  paddingTop:15,
 },
cardReview:{
  width: '95%',
  flexDirection:"row",
  alignItems: 'center',
  justifyContent:"center",
  margin: 10,

  shadowColor: 'grey',
  shadowOffset: {
    width: 1,
    height: 3,
  },
  shadowOpacity: 0.29,
  shadowRadius: 4.65,
  elevation: 7,
},
cardimg:{
  width:100,
  height:100,
  borderRadius:12,
},
cardHeaderText:{
  width:250,
  flexDirection:"row",
  justifyContent:"space-between",
  paddingRight:10,
  paddingBottom:10,
},
userName:{
  paddingTop:10,
  paddingRight:10,
  textAlign:"right",
  fontSize: 16,
},
titleReview: {
  fontSize: 20,
},
textReview: {
  fontSize: 16,
},
titleRating: {
  color: "#A86B98",
  fontSize: 20,
},
avisButton: {
alignItems: 'center',
},

});
  