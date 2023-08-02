import { Text, View, TouchableOpacity, TextInput, Image, } from 'react-native';
import { StyleSheet } from 'react-native';



export default function Profile () {
    return (
        <View style={styles.container}>
            <View>
                <Image style={styles.avatar} source={require('../assets/avatar-vide.png')} />
            </View>
            <Text style={styles.title}>
                Hello
            </Text>
        </View>

    )
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    justifyContent: 'center'
},
title: {
  flex: 1,
  backgroundColor: '#fff',
  color: "black",
  alignItems: 'center',
  justifyContent: 'center',
  },
  avatar: {
    width: '20%',
    height: '20%',
  },
});
  