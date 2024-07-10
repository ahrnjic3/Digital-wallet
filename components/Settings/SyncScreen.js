import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View} from 'react-native';
// import QRCode from 'react-native-qrcode-svg';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import CryptoES from 'crypto-es';
// import QRCodeGenerator from '../QRGenerator/QRCodeGenerator';
import QRCode from '../QRGenerator/QRCodeGenJS';

const SyncScreen = () => {

  function generateSixDigitCode() {
    let randomNum = Math.floor(Math.random() * 1000000);
    let sixDigitCode = randomNum.toString().padStart(6, '0');
    return sixDigitCode.toString();
  }

  const [number, setNumber] = useState(generateSixDigitCode())
  
  const [key, setKey] = useState(encryptKey())

  function  encryptKey(){
    let data = {
      privatekey: null,
      publickey : null,
      name: null,
      UUID: null,
      secret: 'secretTag'
    }


    data.privatekey = SecureStore.getItem('privateKey');
    data.publickey = SecureStore.getItem('publicKey');
    data.name = SecureStore.getItem('UUID');
    data.UUID = SecureStore.getItem('Name');


    const message = JSON.stringify(data);
    const result =  CryptoES.AES.encrypt( message, number);

    return JSON.stringify(result)
  }

  const [isPressed, setIsPressed] = useState(false);

  const setPressed = () => {
    setIsPressed(true)
  }

  return(
    <View
    style={styles.body}
    >
      <View style={styles.stringContainer}>
        <QRCode value= {key}
                errorCorrection = "LOW"
        size = '350' />
      </View>
      <Text style={styles.header}>Sync Code:</Text>
        <View style={styles.stringContainer}>
            <Text style={styles.sixDigit}>{number}</Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  body : {
    flex:1,
    paddingTop: 5,
    fontSize: 25,
    backgroundColor:'#fff',
    justifyContent: 'center',
        alignItems: 'center'
  },
  header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
  },
  stringContainer: {
      backgroundColor: '#ffffff',
      paddingVertical: 20,
      paddingHorizontal: 40,
      borderRadius: 10,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
  },
  hideContainer: {
    backgroundColor: '#eeeeee',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
},
  sixDigit: {
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#333333',
  },
  regenerate: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  button: {
      backgroundColor: '#007bff',
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 8,
  },
  buttonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: 'bold',
  }
});

export default SyncScreen