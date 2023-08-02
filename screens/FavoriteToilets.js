import { Text, View, TextInput } from 'react-native';
import { StyleSheet } from 'react-native';



export default function FavoriteToilets () {


/*    const getToilets = fetch('https://data.ampmetropole.fr/api/records/1.0/search/?dataset=fr-toilettes-publiques&q=marseille&facet=commune&facet=tags_source')
            .then(response => response.json())
            .then(data => {
            console.log(data);
            return data;
            });

    
    
            <View style={styles.inputContainer}>
        <TextInput
          placeholder="search"
          onChangeText={(value) => setCity(value)}
          value={toilet}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => handleSubmit()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>Add</Text>
        </TouchableOpacity>
        </View>*/


        
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
  