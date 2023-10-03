import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Switch,
  Alert,
} from "react-native";
import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { logout } from '../reducers/user';


export default function Profile({ navigation }) {
  const username = useSelector ((state) => state.user.value.username)
  const favorites = useSelector ((state) => state.favorites.toilet);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("")
  
  const [darkMode, setDarkMode] = useState(false);
  const toggledarkMode = () => setDarkMode((previousState) => !previousState);

  const [notifications, setNotifications] = useState(false);
  const toggleNotifications = () =>
    setNotifications((previousState) => !previousState);

  const [updates, setUpdates] = useState(true);
  const toggleUpdates = () => setUpdates((previousState) => !previousState);


  const handleLogout = () => {
    // demander la confirmation
    Alert.alert(
      "Confirmer Deconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ? Vous perdrez vos favoris :(",
      [
        {
          text: "Annuler",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Confirmer",
          onPress: () => {
            // Perform logout action and navigate to the sign-in screen
            dispatch(logout());
            navigation.navigate("SignIn");
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View><Image style={styles.titleProfil}source={require('../assets/Profil.jpg')}></Image></View>
      <View style={styles.topBox}>
        <View style={styles.avatar}>
          <View style={styles.userCircle}></View>
            <FontAwesome5Icon style={styles.user} name="user"></FontAwesome5Icon>
          <View style={styles.plusButton} activeOpacity={0.8}>
            <TouchableOpacity style={styles.plusPic} >
              <FontAwesome5Icon name="plus" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.usernameBox}>
          <Text style={styles.usernameLabel}>Pseudo</Text>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.changeName}>changez votre pseudo</Text>
        </View>
      </View>
      <View style={styles.statBar}>
        <View style={styles.avis}>
          <Text style={styles.Title}>2</Text>
          <Text style={styles.Text}>avis</Text>
        </View>
        <View style={styles.favoris}>
          <Text style={styles.Title}>{favorites.length}</Text>
          <Text style={styles.Text}>favoris</Text>
        </View>
        <View style={styles.points}>
          <Text style={styles.Title}>10</Text>
          <Text style={styles.Text}>coin points</Text>
        </View>
      </View>
      <View style={styles.midBox}>
        <View style={styles.toggleBox}>
          <Text style={styles.toggleText}>Dark mode</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#B08BBB" }}
            thumbColor={darkMode ? "#A86B98" : "#A86B98"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggledarkMode}
            value={darkMode}
            transparent
          />
        </View>
        <View style={styles.toggleBox}>
          <Text style={styles.toggleText}>Afficher notifications</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#B08BBB" }}
            thumbColor={darkMode ? "#A86B98" : "#A86B98"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleNotifications}
            value={notifications}
            transparent
          />
        </View>
        <View style={styles.toggleBox}>
          <Text style={styles.toggleText}>Mise à jour automatique</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#B08BBB" }}
            thumbColor={darkMode ? "#A86B98" : "#A86B98"}
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
          <Text>Achetez du PQ</Text>
          <FontAwesome5Icon name="toilet-paper" size={22} color="#484848" />
        </View>
        <View style={styles.eachBar}>
          <Text>Paramètres</Text>
          <FontAwesome5Icon name="cog" size={22} color="#484848" />
        </View>
      </View>
      <View style={styles.signOut}>
        <View style={styles.eachBar}>
          <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.signOutText}>Tirez la chaise d'eau, et se deconnecter..</Text>
          </TouchableOpacity>
         
        </View>
      </View>
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
  titleProfil: {
    marginTop: 10,
    width: 100,
    objectFit: 'contain'
  },
  topBox: {
    marginBottom: 20,
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
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
    alignItems: "center",
    flexDirection: "row"

  },
  userCircle: {
    width: 120,
    height: 120,
    backgroundColor: "#D9D9D9",
    borderRadius: 60,
  },
  plusPic: {

  },
  plusButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: "#A86B98",
    justifyContent: 'center',
    alignItems: 'center',
  },
  user: {
    fontSize: 68,
    position: "absolute",
  },
  username: {
    borderWidth: 1,
    borderColor: "#A86B98",
    borderRadius: 12,
    padding: 5,
    height: 40,
    width: 160,
    fontSize: 24,
    textAlignVertical: 'center',
    textAlign: 'center'
  },
  usernameLabel: {
    padding: 0,
    width: "30%",
    marginBottom: -8,
    marginLeft: 10,
    color: "#A86B98",
    backgroundColor: "white",
    zIndex: 1,
    textAlign: "center",
  },
  changeName: {
    width: '100%',

    marginTop: 15,
    textAlign: 'center',
    textDecorationLine: 'underline'
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
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  Title: {
    fontSize: 32,
    textAlign: "center",
  },
  Text: {
    fontSize: 18,
    textAlign: "center",

  },
  favoris: {
    height: "100%",
    borderColor: "#A86B98",
    borderRightWidth: 1,
    width: "33.3%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  points: {
    height: "100%",
    width: "33.3%",
    width: "33.3%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  midBox: {
    marginTop: 10,
  },
  toggleBox: {
    flexDirection: "row",
    width: 320,
    height: 35,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    borderRadius: 12,
    margin: 10,
    paddingLeft: 15,
  },
  toggleText: {
    textAlign: "left",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 35,
    marginVertical: 10,
    borderLeftWidth: 1,
    borderColor: "#A86B98",
    paddingLeft: 10,
  },
  signOut: {
    width: "100%",
    paddingLeft: "8%",
    borderTopColor: "#A86B98",
    borderTopWidth: 1,
  },

  signOutText: {
    color: "#A86B98",
    fontWeight: "bold",
    textAlign: "right",
    textDecorationLine: 'underline',
  },
});
