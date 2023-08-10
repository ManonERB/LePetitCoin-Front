import { Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';



export default function FavoriteToilets () {




        return (
        <View style={styles.container}>
          <View>
            <View style={styles.topLogo}>
                <Image style={styles.logo} source={require('../assets/Favoris.jpg')}></Image>
            </View>
          </View>
          <View style={styles.placeholder}>
            <Text style={styles.title}>Il n'y a rien dans votre cuvette...</Text>
          </View>
          
          <ScrollView style={styles.cardFavorite}>

          </ScrollView>
        </View>

    )
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  height: '100%',
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
},
topLogo: {
  width: 180,
  height: 200,
  marginTop: 40,
  justifyContent: 'flex-start',
  alignItems: 'center',
},
logo: {
  width: '155%',
  resizeMode: 'contain',
},
placeholder: {
  marginTop: 100,
  alignItems: 'center',
  justifyContent: 'center'
},
title: {
fontSize: 24,
alignItems: 'center'
},

});
  