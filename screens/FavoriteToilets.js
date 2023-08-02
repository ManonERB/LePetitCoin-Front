import { Text, View, TextInput } from 'react-native';
import { StyleSheet } from 'react-native';



export default function FavoriteToilets () {

        return (
        <View>
            <Text style={styles.title}>Hello</Text>
        </View>

    )
}

const styles = StyleSheet.create({
    title: {
      flex: 1,
      backgroundColor: '#fff',
      color: "black",
      alignItems: 'center',
      justifyContent: 'center',
  }
});
  