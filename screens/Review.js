import {
  StyleSheet,
  TextInput,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  View,
} from "react-native";
import React, { useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome5";

export default function Review({ navigation }) {
  //add state for stars
  const [starRating, setStarRating] = useState(null);
  //animation for touchable icons
  const animatedButtonScale = new Animated.Value(1);

  //3 functions that handle in  & out animations
  const handlePressIn = () => {
    Animated.spring(animatedButtonScale, {
      toValue: 1.2,
      useNativeDriver: true,
      speed: 50,
      bounciness: 1,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(animatedButtonScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 1,
    }).start();
  };
  const animatedScaleStyle = {
    transform: [{ scale: animatedButtonScale }],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evaluer ce coin</Text>
      <View style={styles.boxContainer}>
        <View style={styles.leftBox}>
          <View>
            <Image
              style={styles.images}
              source={require("../assets/Placeholder_view.png")}
            />
          </View>
          <View style={styles.plusButton} activeOpacity={0.8}>
            <TouchableOpacity style={styles.plusPic}>
              <FontAwesome name="plus" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.rightBox}>
          <View style={styles.rightBoxTop}>
            <Text>Ajouter aux favoris</Text>
            <TouchableOpacity>
              <FontAwesome name="heart" size={30} solid color="#CCCCCC" />
            </TouchableOpacity>
          </View>
          <View style={styles.rightBoxBottom}>
            <Text style={styles.heading}>
              {starRating ? `${starRating}` : "Tap to rate"}
            </Text>
            <View style={styles.stars}>
              <TouchableWithoutFeedback
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => setStarRating(1)}
              >
                <Animated.View style={animatedScaleStyle}>
                  <FontAwesome
                    name={"star"}
                    size={28}
                    style={
                      starRating >= 1
                        ? styles.starSelected
                        : styles.starUnselected
                    }
                    solid
                  />
                </Animated.View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => setStarRating(2)}
              >
                <Animated.View style={animatedScaleStyle}>
                  <FontAwesome
                    name={"star"}
                    size={28}
                    style={
                      starRating >= 2
                        ? styles.starSelected
                        : styles.starUnselected
                    }
                    solid
                  />
                </Animated.View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => setStarRating(3)}
              >
                <Animated.View style={animatedScaleStyle}>
                  <FontAwesome
                    name={"star"}
                    size={28}
                    style={
                      starRating >= 3
                        ? styles.starSelected
                        : styles.starUnselected
                    }
                    solid
                  />
                </Animated.View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => setStarRating(4)}
              >
                <Animated.View style={animatedScaleStyle}>
                  <FontAwesome
                    name={"star"}
                    size={28}
                    style={
                      starRating >= 4
                        ? styles.starSelected
                        : styles.starUnselected
                    }
                    solid
                  />
                </Animated.View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => setStarRating(5)}
              >
                <Animated.View style={animatedScaleStyle}>
                  <FontAwesome
                    name={"star"}
                    size={28}
                    style={
                      starRating >= 5
                        ? styles.starSelected
                        : styles.starUnselected
                    }
                    solid
                  />
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  title: {
    fontSize: 48,
    marginTop: 30,
    height: 80,
  },
  images: {
    width: 180,
    height: 140,
    borderRadius: 12,
  },
  boxContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  leftBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  rightBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  rightBoxTop: {
    flexDirection: "column",
    borderBottomColor: "#A86B98",
    alignItems: "center",
    borderBottomWidth: 2,
    justifyContent: "space-evenly",
    width: "90%",
  },
  rightBoxBottom: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "90%",
  },
  plusPic: {
    width: 40,
    height: 40,
    backgroundColor: "#A86B98",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginLeft: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 9,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 5,
  },
  plusButton: {
    position: "absolute",
    paddingRight: "80%",
    paddingTop: "30%",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  stars: {
    display: "flex",
    flexDirection: "row",
  },
  starUnselected: {
    color: "#aaa",
  },
  starSelected: {
    color: "#ffb300",
  },
});
