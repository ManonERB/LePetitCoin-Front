import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';



export default function ToiletPage ({navigation}) {
    return (
        <Text style={styles.title}>
            Hello
        <TouchableOpacity style={styles.reviewButton} onPress={() => navigation.navigate('Review')}>

        </TouchableOpacity>
        </Text>

    )
}

const styles = StyleSheet.create({
    title: {
      flex: 1,
      backgroundColor: '#fff',
      color: "black",
      alignItems: 'center',
      justifyContent: 'center',
  },
  reviewButton: {
 width: 120,
 height: 60,
 backgroundColor: 'red',

  },
});
  