import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Switch,

} from "react-native";
import { StyleSheet } from "react-native";
import Review from "./Review";
import { useState } from "react";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

export default function Profile({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);
  const toggledarkMode = () => setDarkMode(previousState => !previousState);

  const [notifications, setNotifications] = useState(false);
  const toggleNotifications = () => setNotifications(previousState => !previousState);

  const [updates, setUpdates] = useState(true);
  const toggleUpdates = () => setUpdates(previousState => !previousState);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <View style={styles.topBox}>
        <View style={styles.avatar}>
            <View style={styles.userCircle}>
            </View>
            <FontAwesome5Icon style={styles.user} name="user"></FontAwesome5Icon>
            <View style={styles.plusButton} activeOpacity={0.8}>
              <TouchableOpacity style={styles.plusPic}>
                <FontAwesome5Icon name="plus" size={18} color="white" />
              </TouchableOpacity>
            </View>
        </View>
        <View style={styles.usernameBox}>
          <Text style={styles.usernameLabel}>Username</Text>
          <TextInput style={styles.username}></TextInput>
        </View>
      </View>
      <View style={styles.statBar}>
        <View style={styles.avis}>
          <Text style={styles.Title}>5</Text>
          <Text style={styles.Text}>avis</Text>
        </View>
        <View style={styles.favoris}>
          <Text style={styles.Title}>12</Text>
          <Text style={styles.Text}>favoris</Text>
        </View>
        <View style={styles.points}>
          <Text style={styles.Title}>0</Text>
          <Text style={styles.Text}>coin points</Text>
        </View>
      </View>
      <View style={styles.midBox}>
        <View style={styles.toggleBox}>
          <Text style={styles.toggleText}>Dark mode</Text>
          <Switch
            trackColor={{false: '#767577', true: '#B08BBB'}}
            thumbColor={darkMode ? '#A86B98' : '#A86B98'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggledarkMode}
            value={darkMode}
            transparent
          />
        </View>
        <View style={styles.toggleBox}>
          <Text style={styles.toggleText}>Afficher notifications</Text>
          <Switch
            trackColor={{false: '#767577', true: '#B08BBB'}}
            thumbColor={darkMode ? '#A86B98' : '#A86B98'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleNotifications}
            value={notifications}
            transparent
          />
        </View>
        <View style={styles.toggleBox}>
          <Text style={styles.toggleText}>Mise à jour automatique</Text>
          <Switch
            trackColor={{false: '#767577', true: '#B08BBB'}}
            thumbColor={darkMode ? '#A86B98' : '#A86B98'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleUpdates}
            value={updates}
            transparent
          />
        </View>
        

      </View>
      <View style={styles.bottomBars}>
        <View style={styles.eachBar}>
          <Text>Parlez-en à un ami</Text>
          <FontAwesome5Icon name="share-alt" size={22} color="#484848" />
        </View>
        <View style={styles.eachBar}>
          <Text>Acheter PQ</Text>
          <FontAwesome5Icon name="toilet-paper" size={22} color="#484848" />
        </View>
        <View style={styles.eachBar}>
          <Text>Parametres</Text>
          <FontAwesome5Icon name="cog" size={22} color="#484848" />
        </View>
      </View>
      <View style={styles.signOut}>
          <View style={styles.eachBar}>
            <Text style={styles.signOutText}>Deconnexion</Text>
            {/* <FontAwesome5Icon name="power-off" size={22} color="#484848" /> */}
          </View>
      </View>
      <TouchableOpacity
        style={styles.buttonReview}
        onPress={() => navigation.navigate(Review)}
      >
        <Text>temp access to Review</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
  },
  topBox: {
    marginTop: 20,
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: 'center',
    flexDirection: "row",

  },
  title: {
    backgroundColor: "#fff",
    color: "black",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 44,
    marginTop: 50,
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  userCircle: {
    width: 120,
    height: 120,
    backgroundColor: '#D9D9D9',
    borderRadius: 60,
  },
  user: {
    fontSize: 68, 
    position: "absolute"
  },
  username: {
    borderWidth: 1,
    borderColor: "#A86B98",
    borderRadius: 12,
    height: 40,
    width: 160,
  },
  usernameLabel: {
    padding: 0,
    width: '40%',
    marginBottom: -8,
    marginLeft: 10,
    backgroundColor: 'white',
    zIndex: 1,
    textAlign: 'center'
  },
  statBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    height: "12%",
    width: "100%",
    borderColor: "#A86B98",
    borderWidth: 1,
  },
  avis: {
    height: "100%",
    borderColor: "#A86B98",
    borderRightWidth: 1,
    width: "33.3%",
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
Title: {
    fontSize: 32,
    textAlign: 'center',
  },
  Text: {
    fontSize: 18,
    textAlign: 'center',
  },
  favoris: {
    height: "100%",
    borderColor: "#A86B98",
    borderRightWidth: 1,
    width: "33.3%",
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  points: {
    height: "100%",
    width: "33.3%",
    width: "33.3%",
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  midBox: {
    marginTop: 10,

  },
  toggleBox: {
    flexDirection: 'row',
    width: 320,
    height: 35,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
    margin: 10,
    paddingLeft: 15,
  },
  toggleText: {
    textAlign: 'left'
  },
  bottomBars: {
    width: 320,
    marginBottom: 10,
    paddingBottom: 10,
  },
  buttonReview: {
    backgroundColor: "yellow",
    marginBottom: 40,
    width: "30%",
  },
  eachBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 35,
    marginVertical: 10,
    borderLeftWidth: 1,
    borderColor: "#A86B98",
    paddingLeft: 10,
  },
  signOut: {
    width: '100%',
    paddingLeft: '8%',
    borderTopColor: "#A86B98",
    borderTopWidth: 1,
  },

  signOutText: {
    color: "#A86B98",
    fontWeight: 'bold',
    textAlign: 'right'
  },
});
