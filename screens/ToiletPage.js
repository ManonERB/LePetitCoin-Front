import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from "react-native-vector-icons/FontAwesome5";



export default function ToiletPage ({route, navigation}) {
    
    const [toilet, setToilet] = useState({});
    const [review, setReview] = useState([]);

    useEffect(() => {
    //  console.log("coucou", route)
     const {toiletId} = route.params
    fetch(`http://${process.env.EXPO_PUBLIC_IP}/toilet/${toiletId}`)
    .then(response => response.json())
    .then((data) => {
      // console.log(data.data);
      setToilet(data)
    });

    fetch(`http://${process.env.EXPO_PUBLIC_IP}/review/${toiletId}`)
    .then(response => response.json())
    .then((data) => {
      // console.log(data);
      setReview(data)
    });
   }, []);

   if(toilet?.data?.tags) {
    //parse car dans le bdd c'est en string transform en objet
    const amenity=JSON.parse(toilet.data.tags)
    // console.log("toutou", amenity.amenity)
   }

    // const cardReview = 
  //  console.log(review);
    return (
        <SafeAreaView>
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
              {toilet.data?.commune} {toilet.data?.code_postal} 
            </Text>
            <View style={styles.header}>
              <View style={styles.list}>
                <Text style={styles.text}>{`\u2022 ${toilet.data?.tags_opening_hours ? toilet.data.tags_opening_hours : "aucune information disponible"}`}</Text> 
                <Text style={styles.text}>{`\u2022 ${toilet.data?.tags_opening_hours ? toilet.data.tags_opening_hours : "aucune information disponible"}`}</Text>
                <Text style={styles.text}>{`\u2022 ${toilet.data?.title ? toilet.data.title : "aucune information disponible"}`}</Text>           
              </View>
              <TouchableOpacity 
              style={styles.review}
              onPress={()=>navigation.navigate('Review')}
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
          <View>
            <Text style={styles.subTitle}>Où ce situe ce petit coin ? </Text>
          </View>
              <Text style={styles.subTitle}>Les équipements royaux de ce trône</Text>
          <View style={styles.equipement}> 
            
            <View>
              <Text style={styles.text}>
              {`\u2022 ${toilet.data?.tags_opening_hours ? toilet.data.tags_opening_hours : "aucune information disponible"}`}</Text> 
                  <Text style={styles.text}>{`\u2022 ${toilet.data?.drinking_water ? toilet.data.drinking_water : "aucune information disponible"}`}</Text>
                  <Text style={styles.text}>{`\u2022 ${toilet.data?.title ? toilet.data.title : "aucune information disponible"}`}</Text>
            </View>
            <View>
  
              <Text style={styles.text}>
              {`\u2022 ${toilet.data?.tags_opening_hours ? toilet.data.tags_opening_hours : "aucune information disponible"}`}</Text> 
                  <Text style={styles.text}>{`\u2022 ${toilet.data?.drinking_water ? toilet.data.drinking_water : "aucune information disponible"}`}</Text>
                  <Text style={styles.text}>{`\u2022 ${toilet.data?.title ? toilet.data.title : "aucune information disponible"}`}</Text>
            </View>
          </View>
          <View>
            <View style={styles.reviewContainer}>
            <Text style={styles.titleReview}> Ce qu'ils disent</Text>
            </View>
            {review.map((data,i) => {
              // console.log(da);
              <View key={i} style={styles.cardReview}>
                <View>
                  <Text>title:{data.title}</Text>
                  <Text>{data.rating}</Text>
                </View>
                <View>
                  {data.review}
                </View>
              </View>
            })}
          </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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
    color:"#b08bbb",
    fontWeight:"bold",
    textAlign:"center",
    padding:10,
  },
  list:{
    flexDirection:"column",
    paddingLeft:10,
    
 },
 header:{
  flexDirection:"row",
  justifyContent:"space-between",
  paddingRight:5,
},
review:{
  backgroundColor:"#b08bbb",
  flexDirection:'row-reverse',
  justifyContent:"space-between",
  alignItems:"center",
  width:130,
  borderRadius:5,
},
textReview:{
   fontSize:20,
   paddingLeft:15,
   paddingRight:5,
   color:"white"

 },
 text:{
  fontSize:15,
 },
 subTitle:{
  color:"#b08bbb",
  padding:15,
  fontSize:20,
  fontStyle:'italic'
 },
 equipement:{
  flexDirection:"row",
 },
 titleReview:{
  fontSize:25,
  backgroundColor:"#b08bbb",
  width:"50%",
  color:"white",
  borderRadius:15,
},
reviewContainer:{
  paddingTop:15,
  
 },
 cardReview:{
  backgroundColor:"red",
  width:"100%",
  height:300,
 }

});
  