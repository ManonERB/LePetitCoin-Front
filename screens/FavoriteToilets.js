import { Text } from 'react-native';
import { StyleSheet } from 'react-native';



export default function FavoriteToilets () {
    return (
        <Text style={styles.title}>
            Hello
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
  }
});
  