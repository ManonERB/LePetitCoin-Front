import { Text, View, TextInput } from 'react-native';
import { StyleSheet } from 'react-native';



export default function FavoriteToilets () {



        
       /* router.get('/toilets/:commune', (req, res) => {
          const commune = req.params.commune;
        
          db.collection('toilets')
            .find({ commune })
            .toArray((err, result) => {
              if (err) {
                console.error('Error querying MongoDB:', err);
                res.status(500).json({ error: 'Internal Server Error' });
              } else {
                res.json(result);
              }
            });
        }); */



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
  