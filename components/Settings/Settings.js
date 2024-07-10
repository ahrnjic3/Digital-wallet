import React, { useState } from 'react';
import { StyleSheet, Pressable , View, Text} from 'react-native';
import { Divider } from 'react-native-paper';

const Settings = ({navigation}) => {


  const navigateToSyncScreen = () => {
    navigation.navigate('Sync'); // Navigate to Screen2
  };

  const navigateToAboutScreen = () => {
    navigation.navigate('About'); // Navigate to Screen2
  };

  return(
    <View
    style={styles.body}
    >
      <Pressable 
        style = {styles.button}
       onPress={navigateToSyncScreen}
      >
        <Text style={styles.text}>Sync</Text>
      </Pressable >
      <Divider />

      <Pressable 
        style = {styles.button}
       onPress={navigateToAboutScreen}
      >
        <Text style={styles.text}>About</Text>
      </Pressable >
      <Divider />
    </View>
  )
}

const styles = StyleSheet.create({
  body : {
    paddingTop: 5,
    fontSize: 25,
    backgroundColor:'#fff',
    flex:1
  },
  button : {
    paddingTop: 5,
    backgroundColor: 'transparent',
    paddingLeft: '20',
    paddingVertical: '5'
  },
  
  text: {
    fontSize: 20,
    color: 'black',
  }
});

export default Settings