import { Text, StyleSheet, View, TextInput, Image, TouchableOpacity, Switch, ScrollView, SafeAreaView } from 'react-native';
import { useState } from 'react';
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Home from "./Home"


export default function AddToilet ({navigation}) {
    // const [title, setTitle] = useState('');
    const [commune, setCommune] = useState('');
    const [lon, setLon] = useState(0);
    const [lat, setLat] = useState(0);
    const [availability, setAvailability] = useState('');

    // gestion des switch

    
    const [fee, setFee] = useState(false);
    const [publicToilet, setPublic] = useState(false);
    const [handicapAccess, setHandicapAccess] = useState(false);
    const [coatHanger, setCoatHanger] = useState(false);
    const [changingTable, setChangingTable] = useState(false);
    const [soap, setSoap] = useState(false);
    const [toiletPaper, setToiletPaper] = useState(false);
    const [cleanliness, setCleanliness] = useState(false);
    const [feminineHygieneProduct, setFeminineHygieneProduct] = useState(false);
    
    const toggleSwitchFee = () => setFee(previousState => !previousState);
    const toggleSwitchHandicapAccess = () => setHandicapAccess(previousState => !previousState);
    const toggleSwitchCoatHanger = () => setCoatHanger(previousState => !previousState);
    const toggleSwitchChangingTable = () => setChangingTable(previousState => !previousState);
    const toggleSwitchSoap = () => setSoap(previousState => !previousState);
    const toggleSwitchToiletPaper = () => setToiletPaper(previousState => !previousState);
    const toggleSwitchCleanliness = () => setCleanliness(previousState => !previousState);
    const toggleSwitchFeminineHygieneProduct = () => setFeminineHygieneProduct(previousState => !previousState);
    const toggleSwitchpublic = () => setPublic(previousState => !previousState);

    const handleSubmit = () => {

      const numericLon = parseFloat(lon);
      const numericLat = parseFloat(lat);

      fetch(`http://${process.env.EXPO_PUBLIC_IP}/toilet`, {
  
      method: 'POST',
  
      headers: { 'Content-Type': 'application/json' },
  
      body: JSON.stringify({
        commune,
        lon: numericLon, // Use the converted numericLon
        lat: numericLat, // Use the converted numericLat
        type: publicToilet,
        availability,
        fee,
        handicapAccess,
        coatHanger,
        changingTable,
        soap,
        toiletPaper,
        cleanliness,
        feminineHygieneProduct
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.result){
        console.log(data);
        navigation.navigate(Home)
      }else{
        return
      }
    });

    }
  
    return (
        <SafeAreaView>
    <ScrollView  style={styles.container}>
        <View>
            <Text style={styles.title}>
                Ajouter un coin
            </Text>
            <Image source={require('../assets/Placeholder_view.png')} style={styles.img} />
             <View 
                style={styles.plusButton}       
                activeOpacity={0.8}
            >
                <TouchableOpacity 
                style={styles.plusPic}>
                <FontAwesome name="plus" size={18} color="white" 
                />
                </TouchableOpacity>
             </View>
        </View>
     
     
       <View style={styles.container2}>
      {/* <View style={styles.inputContainer}>
        <Text style={styles.label}>Title :</Text> */}
        {/* <TextInput
          style={styles.input}
          placeholder="Entrez votre nom"
          onChangeText={setTitle}
          value={title}

        /> 
      </View>*/}
      <View style={styles.inputContainer}>
      <Text style={styles.label}>Commune :</Text>
        <TextInput
        style={styles.input}
        onChangeText={setCommune}
        value={commune}
        placeholder='ex: "Marseille 5e"'
      />
      </View>
      <View style={styles.inputContainerLonLat}>
        <View style={styles.LonLat}>
        <Text style={styles.label}>longitude :</Text>
          <TextInput
          style={styles.input}
          onChangeText={setLon}
          value={lon}
          placeholder="5.367855"
          maxLength={8}
        />
        <Text style={styles.label}>latitude :</Text>
          <TextInput
          style={styles.input}
          onChangeText={setLat}
          value={lat}
          placeholder="42.367855"
          maxLength={9}
        />
        </View>
      </View>
      <View style={styles.inputContainer}>
      <Text style={styles.label}>Disponibilité :</Text>
        <TextInput
        style={styles.input}
        onChangeText={setAvailability}
        value={availability}
        placeholder="ex: Lun-Ven 6h-18h"
      />
      </View>
    </View>

        

    <Text style={styles.title2}>Caractéristiques</Text>

            <View style={styles.containerForm}>
                <Text style={styles.containerCharacteristics}>Gratuit ?</Text>
                <Switch
                    trackColor={{false: '#767577', true: 'lightgrey'}}
                    thumbColor={fee ? '#a86b98' : '#f4f3f4'}
                    iolightgreylightgreys_backgroundColor="lightgrey"
                    onValueChange={toggleSwitchFee}
                    value={fee}
                    style={styles.switch}
                    />
            </View>
          
            <View style={styles.containerForm}>
                <Text style={styles.containerCharacteristics}>Publique ?</Text>
                <Switch
                    trackColor={{false: '#767577', true: 'lightgrey'}}
                    thumbColor={publicToilet ? '#a86b98' : '#f4f3f4'}
                    ios_backgroundColor="lightgrey"
                    onValueChange={toggleSwitchpublic}
                    value={publicToilet}
                    style={styles.switch}
                    />
            </View>

            <View style={styles.containerForm}>
                <Text style={styles.containerCharacteristics}>Acces Handicapé ?</Text>
                <Switch
                    trackColor={{false: '#767577', true: 'lightgrey'}}
                    thumbColor={handicapAccess ? '#a86b98' : '#f4f3f4'}
                    ios_backgroundColor="lightgrey"
                    onValueChange={toggleSwitchHandicapAccess}
                    value={handicapAccess}
                    style={styles.switch}
                    
                    />
            </View>

            <View style={styles.containerForm}>
                <Text style={styles.containerCharacteristics}>Porte-manteau ?</Text>
                <Switch
                    trackColor={{false: '#767577', true: 'lightgrey'}}
                    thumbColor={coatHanger ? '#a86b98' : '#f4f3f4'}
                    ios_backgroundColor="lightgrey"
                    onValueChange={toggleSwitchCoatHanger}
                    value={coatHanger}
                    style={styles.switch}
                    
                    />
            </View>

            <View style={styles.containerForm}>
                <Text style={styles.containerCharacteristics}>Table à langer ?</Text>
                <Switch
                    trackColor={{false: '#767577', true: 'lightgrey'}}
                    thumbColor={changingTable ? '#a86b98' : '#f4f3f4'}
                    ios_backgroundColor="lightgrey"
                    onValueChange={toggleSwitchChangingTable}
                    value={changingTable}
                    style={styles.switch}

                />
            </View>

            <View style={styles.containerForm}>
                <Text style={styles.containerCharacteristics}>Savon ?</Text>
                <Switch
                    trackColor={{false: '#767577', true: 'lightgrey'}}
                    thumbColor={soap ? '#a86b98' : '#f4f3f4'}
                    ios_backgroundColor="lightgrey"
                    onValueChange={toggleSwitchSoap}
                    value={soap}
                    style={styles.switch}
                    
                    />
            </View>

            <View style={styles.containerForm}>
                <Text style={styles.containerCharacteristics}>Papier toilettes ?</Text>
                <Switch
                    trackColor={{false: '#767577', true: 'lightgrey'}}
                    thumbColor={toiletPaper ? '#a86b98' : '#f4f3f4'}
                    ios_backgroundColor="lightgrey"
                    onValueChange={toggleSwitchToiletPaper}
                    value={toiletPaper}
                    style={styles.switch}
                    
                    />
            </View>

            <View style={styles.containerForm}>
                <Text style={styles.containerCharacteristics}>Propreté ?</Text>
                <Switch
                    trackColor={{false: '#767577', true: 'lightgrey'}}
                    thumbColor={cleanliness ? '#a86b98' : '#f4f3f4'}
                    ios_backgroundColor="lightgrey"
                    onValueChange={toggleSwitchCleanliness}
                    value={cleanliness}
                    style={styles.switch}

                />
            </View>

            <View style={styles.containerForm}>
                <Text style={styles.containerCharacteristics}>Produit d'hygiéne feminine ?</Text>
                <Switch
                    trackColor={{false: '#767577', true: 'lightgrey'}}
                    thumbColor={feminineHygieneProduct ? '#a86b98' : '#f4f3f4'}
                    ios_backgroundColor="lightgrey"
                    onValueChange={toggleSwitchFeminineHygieneProduct}
                    value={feminineHygieneProduct}
                    style={styles.switch}
                    
                    />
          </View>
          <View style={styles.btn}>
              <TouchableOpacity style={styles.btnAnnuler}
                onPress={()=>navigation.navigate(Home)}
                >
                  <Text 
                  style={styles.txtAnnuler}
                  >
                    Annuler
                    </Text>
              </TouchableOpacity>
              <TouchableOpacity 
              style={styles.btnAjouter}
              onPress={()=>handleSubmit()}
              
              >
                <Text style={styles.txtAjouter}>Ajouter</Text> 
              </TouchableOpacity>
          </View>
    </ScrollView>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        width:"100%",
        paddingBottom:20,
      
    },
    title: {
        textAlign:"center",
        fontSize: 25,
        fontWeight:"bold",
        padding:20,

    },
    title2: {
        fontSize: 25,
        fontStyle:'italic',
        padding:20,
  },

  inputDescription:{
    flex: 1,
    height: 70,
    borderRadius:12,
  },
  img: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    padding:20,
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
    paddingRight: "95%",
    paddingTop: "50%",
  },
//   map: {
//     width: "45%",
//     height: "85%",
//     alignContent: "center",
//     alignItems: "center",
//     justifyContent: "flex-end",
//     marginTop: 10,
//   },
  containerOptions:{
    width:"100%",
    height:"100%",
    flexDirection:"row",
    justifyContent:"space-around"
  },
  containerCharacteristics:{
    // width:"100%",
    fontSize:20,
    margin:10,
  },
  containerSwitch:{
    width:"25%",
  },
switch:{
    margin:10,
},
containerForm:{
    flexDirection:"row",
    justifyContent:"space-between",
    paddingLeft:20,
    paddingRight:20,

},
container2: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
  },
  inputContainerLonLat: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
  },
  LonLat: {
  flexDirection: 'row',
  alignItems: 'center'
  },
  label: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius:12,
  },
  btn:{
    flexDirection:"row",
    justifyContent:"space-around",
    borderRadius:20,
    paddingTop:15,
  },
  btnAnnuler:{
    width:"40%",
    borderWidth: 2,
    borderColor: "#B08BBB",
    borderRadius:15

  },
  btnAjouter:{
    width:"40%",
    backgroundColor:'#b08bbb',
    borderRadius:15
  },
  txtAnnuler:{
    textAlign:"center",
    padding:"10%",
    alignItems:'center',
  },
  txtAjouter:{
    textAlign:"center",
    padding:"10%",
    alignItems:'center'
  }

 
  });
  