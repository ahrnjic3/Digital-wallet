import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import generateAndSaveKeys from '../../Encryption/generateAndSaveKeys';
import keyContext from '../../keyContext';

const SignUpScreen = ({ navigation }) => {
  const [hasKey, setHasKey] = useContext(keyContext);
  const generateKeys = () => {
    generateAndSaveKeys();
    setHasKey(true);
  }

  const navigateToSyncScreen = () => {
    navigation.navigate('Sync'); // Navigate to Screen2
  };

  return (
    <View style={styles.container}>
      <View style={styles.body_top}>
      </View>

      <View style={styles.body}>
        <Button
          style={styles.button}
          onPress={generateKeys}
        >
          <Text style={styles.button_text} >Register</Text>
        </Button>

        <View style={styles.text_view}>
          <Text style={styles.flavor_text}> Or Sync with an existing profile</Text>
          <Button
            style={styles.button}
            onPress={navigateToSyncScreen}
          >
            <Text Text style={styles.button_text}>Sync</Text>
          </Button >
        </View>
      </View>
    </View>
  )
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body_top: {
    flex: 3,
    backgroundColor: '#516fe4',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  body: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  button: {
    width: '50%',
    backgroundColor: '#516fe4',
  },
  button_text: {
    color: '#fff',
    textAlign: 'center',
  },
  flavor_text: {
    textAlign: 'center',
    fontSize: 12,
    color: '#555',
    marginBottom: 15,
  },
  text_view: {
    alignItems: 'center',
    marginTop: 15,
    width: '100%'
  }
});
export default SignUpScreen