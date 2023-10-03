import { Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { useSelector } from "react-redux";

export default function FavoriteToilets({ navigation }) {
  const favorites = useSelector((state) => state.favorites.toilet);
  const USER = useSelector((state) => state.user.value.username);
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.topLogo}>
          <Image
            style={styles.logo}
            source={require("../assets/Favoris2.jpg")}
          ></Image>
        </View>
      </View>
      <ScrollView>
        {favorites.length === 0 ? (
          <View style={styles.placeholder}>
            <Text style={styles.title}>
              Il n'y a rien dans votre cuvette...
            </Text>
            <View style={styles.titleTwo}>
              <Text style={styles.title}>N'hésitez pas à liker ! </Text>
              <FontAwesome5Icon
                name="heart"
                size={24}
                solid
                color={"red"}
                style={{ transform: [{ rotateZ: "180deg" }] }}
              />
            </View>
          </View>
        ) : (
          // Render the favorite toilets here using map
          <View style={styles.favContainer}>
            <View style={styles.reviewCounter}>
              <Text style={styles.reviewText}> Waow {USER}, vous avez : </Text>
              <View>
                <Text style={styles.reviewText}>
                  {favorites.length} favoris
                </Text>
              </View>
            </View>
            <ScrollView>
              {favorites.map((favoriteToilet, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.cardToilet}
                  onPress={() =>
                    navigation.navigate("ToiletPage", {
                      toiletId: favoriteToilet._id,
                    })
                  }
                >
                  <Image
                    style={styles.image}
                    source={require("../assets/TP-mars.png")}
                  />
                  <View style={styles.textCard}>
                    <Text style={styles.commune}>{favoriteToilet.commune}</Text>
                    <Text>{favoriteToilet.title}</Text>
                    <Text> {favoriteToilet.tags_opening_hours}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topLogo: {
    width: 180,
    marginTop: 50,
    marginBottom: 50,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  logo: {
    width: "175%",
    resizeMode: "contain",
  },
  placeholder: {
    marginTop: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    alignItems: "center",
  },
  titleTwo: {
    flexDirection: "row",
  },
  favContainer: {
    alignItems: "center",
  },
  reviewCounter: {
    alignItems: 'center',
    flexDirection: "row",
  },
  reviewText: {
    fontSize: 24,
  },
  cardToilet: {
    flexDirection: "row",
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: 300,
    height: 150,
    borderRadius: 15,
    padding: 10,
    backgroundColor: "#A86B98",
    marginVertical: 10,
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 6,
  },
  image: {
    width: 150,
    height: 130,
    marginHorizontal: 10,
    borderRadius: 12,
  },
  textCard: {
    flexDirection: "column",
    alignItems: 'center',
    width: "50%",
  },
  commune: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 6,
  },
});
