import React, { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { CameraView , useCameraPermissions} from 'expo-camera';
import CryptoES from 'crypto-es';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import keyContext from '../../keyContext';

const SyncScreen = () => {
  const [scanData, setScanData] = useState(null);
  const [key, setKey] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const [syncCode, setSyncCode] = useState('');
  const [hasKey, setHasKey] = useContext(keyContext);
  const [ toggleUserMsg, setToggleUserMsg ] = useState(false);
  const [errorMessage, setEerrorMEssage] = useState("Invalid input!");

  function ErrorPrompt  ()  {
    return (
      <Modal
      style = {styles.modal}
      animationType="fade"
      transparent={true}
      visible={toggleUserMsg}
      onRequestClose={() => setToggleUserMsg(false)}
      >
      <View style={styles.prompt_container}>
        <View style={styles.prompt}>
          <Text style={styles.promptText}>{errorMessage}</Text>
          <TouchableOpacity style={styles.button} onPress={() => setToggleUserMsg(false)}>
            <Text style={styles.buttonText}>Ok</Text>
          </TouchableOpacity>
        </View>
      </View>
      </Modal>
    );
  };


  const characterWidth = Dimensions.get('window').width * 0.06; // 6% of window width
  const inputWidth = characterWidth * 6; // Enough width for 6 digits

  const handleBarCodeScanned = ({type, data}) => {
    setScanData(data)
  };

  const handleInputChange = (text) => {
    // Validate input to allow only 6 digits
    if (/^\d{0,6}$/.test(text)) {
        setInputValue(text);
    }
  };
  const handleConcatenate = () => {
    if (inputValue.length === 6) {
        setSyncCode(inputValue);
    }
    decryptKey(inputValue);

  };

  function decryptKey(inputValue){

    let dataNotValid = true
    try {
      const passedData = JSON.parse(scanData);
      dataNotValid = false;
    } catch (error) {
      setEerrorMEssage("Invalid QR code!")
      setToggleUserMsg(true)
    }
    
    if(dataNotValid){
      return;
    }
    const passedData = JSON.parse(scanData)
  
    let decryptedText = null
    dataNotValid = true
    try {
      const decrypted = CryptoES.AES.decrypt(passedData,inputValue);
       decryptedText = decrypted.toString(CryptoES.enc.Utf8);
       const data = JSON.parse(decryptedText);
       dataNotValid = false;
    } catch (error) {
      setEerrorMEssage("Invalid Input!")
      setToggleUserMsg(true)
    }

    if(dataNotValid){
      return;
    }

    console.log("OG MEssage: " + decryptedText)
    const data = JSON.parse(decryptedText);

    SecureStore.setItem('privateKey', data.privatekey);
    SecureStore.setItem('publicKey', data.publickey);
    SecureStore.setItem('UUID', data.UUID);
    SecureStore.setItem('Name', data.name);

    setHasKey(true);
  }

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Please grant camera permissions to app.</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    
    <View style={styles.container}>
      <View style={styles.cam_container}>
       <CameraView
        onBarcodeScanned={scanData ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
      {toggleUserMsg && ErrorPrompt()}
      <View
      style={styles.code_container}
      >
         {scanData && <Button title='Scan Again?' onPress={() => setScanData(undefined)} />}
        <Text style={styles.label}>Enter Sync Code:</Text>
            <TextInput
                 style={[styles.input, { width: inputWidth }]}
                keyboardType="numeric"
                maxLength={6}
                value={inputValue}
                onChangeText={handleInputChange}
            />
                <Button
          title="Sync"
          onPress={handleConcatenate}
          disabled={inputValue.length !== 6 && scanData != undefined}
      />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cam_container: {
    flex: 7,
    width: '100%',
    aspectRatio: 4/3
  },
  code_container: {
    flex: 3,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width:'50%'
  },
  label: {
      fontSize: 18,
      marginBottom: 10,
  },
  input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 20,
      fontSize: 18,
      textAlign: 'center'
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 10
  },
  prompt_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust opacity as needed
  },
  prompt: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  promptText: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modal: {
    marginVertical: 'auto'
  }
});
export default SyncScreen