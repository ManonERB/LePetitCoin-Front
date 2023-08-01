import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { StyleSheet, TextInput, View } from 'react-native';
import { useState, useEffect } from 'react';
import {Dimensions} from 'react-native';



export default function Map () {
    const [currentPosition, setCurrentPosition] = useState(null);

//     const location = await Location.getCurrentPositionAsync({});
//         setLivePosition(location.coords);
//         setInitialRegion({
//             latitude: location.coords.latitude,
//             longitude: location.coords.longitude,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.005,
// });
    useEffect(() => {
        (async () => {
          const { status } = await Location.requestForegroundPermissionsAsync();
     
          if (status === 'granted') {
            Location.watchPositionAsync({ distanceInterval: 10 },
              (location) => {
                console.log('ici', location); // vérifier que l'on reçoit bien ma location
                setCurrentPosition(location.coords); // mettre quoi renvoyer. pas forcément location.coords
              });
          }
        })();
      }, []);
    return (
        <View   >

        <MapView 
// Obtient la position de l'utilisateur au chargement de l'application
 
        mapType="hybrid" style={styles.map}>
                {currentPosition && <Marker coordinate={currentPosition} title="My position"  />} 
                {/* mettre des pins pour les wc */}
        </MapView>
        </View>
   ); 
}


  const styles = StyleSheet.create({
    map: {
        display : "flex",
        // flex: 1,
        // position: 'absolute',
        width: "100%",
        height: "85%",
        alignContent : "center",
        alignItems : "center",
        justifyContent : "flex-end"
      },
    })