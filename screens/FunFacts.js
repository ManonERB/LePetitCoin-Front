    import { Text, View, SafeAreaView, ScrollView, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
    import FontAwesome from 'react-native-vector-icons/FontAwesome5';
    import React, { useState, useEffect } from 'react';



    export default function FunFacts () {
        const [refreshing, setRefreshing] = useState(false);
        const [funFact, setFunFact] = useState({ title: '', text: '' });

        const onRefresh = React.useCallback(() => {
            setRefreshing(true);
            setTimeout(() => {
            setRefreshing(false);
            }, 2000);
        }, []);

        const handleReload = () => {
            onRefresh();
        }; 
        
        const fetchFunFact = () => {
            // Supposons que vous utilisez la fonction fetch pour faire des requêtes HTTP
            // // doit peut-être y avoir la const onRefresh ou Reload... à voir
            fetch(`http://${process.env.EXPO_PUBLIC_IP}//funFacts`)
              .then(response => response.json())
              .then(data => {
                setFunFact(data);
              })
              .catch(error => {
                console.error('Erreur lors de la récupération du fun fact :', error);
              });
          };
        
          useEffect(() => {
            fetchFunFact();
          }, []);

    //rotate-rigth : nom icône
        return (
        <SafeAreaView style={styles.container}>
            <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={styles.titleAndText}>
                <Text style={styles.title}>
                {funFact.title}
                </Text>
                <Text style={styles.text}>
                {funFact.text}
                </Text>
                <TouchableOpacity style={styles.buttonRefresh} onPress={() => handleReload()}>
                    <FontAwesome name='redo-alt' size={18} solid color='#A86B98' />      
                </TouchableOpacity>
            </View>
            </ScrollView>
        </SafeAreaView>
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
    titleAndText : {
        width : "90%",
        height : "60%",
        alignItems : "center",
        alignContent : "center",
        justifyContent : "center",
        borderTopColor : "#A86B98",
        borderBottomColor : "#A86B98",

    },
    title : {
        color : "#A86B98",
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        justifyContent : "center"
    },
    text : {
        color : "B08BBB",
        fontSize : 12,
        textAlign : "center",
        justifyContent : "center",
    },
    buttonRefresh : {
        width : "25%",
        alignItems : "flex-end",
        justifyContent : "flex-end",
        paddingRight : 15,
        paddingBottom : 15
    },
    });
    