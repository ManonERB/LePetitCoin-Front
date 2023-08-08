import { Text, View, TouchableOpacity, Image } from 'react-native';
import { StyleSheet } from 'react-native';



export default function FavoriteToilets () {




        return (
        <View style={styles.container}>
          <View style={styles.topLogo}>
              <Image style={styles.logo} source={require('../assets/logo.jpg')}></Image>
          </View>
          <View>
            <Text style={styles.title}>Il n'y a rien dans ta cuvette...</Text>
          </View>
        </View>

    )
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'space-evenly',
},
topLogo: {
  width: 200,
  flexDirection: "row",
  justifyContent: 'center',
  alignItems: 'center',

},
logo: {
  width: '155%',
  resizeMode: 'contain',
  position: 'absolute',
},
title: {
fontSize: 24
},

});
  