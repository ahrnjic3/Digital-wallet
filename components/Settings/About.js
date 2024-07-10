import React from 'react';
import { StyleSheet, Text, View} from 'react-native';

const AboutScreen = () => {

  return(
    <View
    style={styles.body}
    >
      <Text> Version 1.0.0</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  body : {
    paddingTop: 5,
    fontSize: 25,
    backgroundColor:'#fff',
  }
});

export default AboutScreen