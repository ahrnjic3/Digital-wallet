import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useContext} from 'react';
import dbContext from '../../DbContext';
import { CameraView , useCameraPermissions} from 'expo-camera';
import refreshContext from '../../refreshContext';
import claimContext from '../DocumentScreen/ClaimContext'
import usedVcsContext from '../DocumentScreen/UsedVcsContext';

const QRSCreen = () => {
  const [scanData, setScanData] = useState(undefined);
  const [permission, requestPermission] = useCameraPermissions();
  const[db, setDb] = useContext(dbContext);
  const[refresh, setRefresh] = useContext(refreshContext);
  const { VcClaims, updateClaims } = useContext(claimContext);
  const { usedVCs, updateUsedVcs } = useContext(usedVcsContext);
  const [ toggleErrorMsg, setToggleErrorMsg ] = useState(false);
  const [ toggleUserMsg, setToggleUserMsg ] = useState(false);


  const ErrorPrompt = () => {
    return (
      <View style={styles.prompt_container}>
        <View style={styles.prompt}>
          <Text style={styles.promptText}>Invalid QR code!</Text>
          <TouchableOpacity style={styles.button} onPress={() => setToggleErrorMsg(false)}>
            <Text style={styles.buttonText}>Ok</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const UserPrompt = () => {
    return (
      <View style={styles.prompt_container}>
        <View style={styles.prompt}>
          <Text style={styles.promptText}>Document succesfully added!</Text>
          <TouchableOpacity style={styles.button} onPress={() => setToggleUserMsg(false)}>
            <Text style={styles.buttonText}>Ok</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };


  function setupContext(docs){
    if (Object.keys(VcClaims).length !== 0)
      return;
    const tempVCs = ({})
    const tempClaims = ({})
    docs.forEach( doc => {
      const docObj = JSON.parse(doc.object);
      tempClaims[doc.id] = {}
      Object.keys(docObj.claims).forEach((key)=>{
        tempClaims[doc.id][key] = false;
        tempVCs[doc.id] = false;
      })
    })
    updateClaims(tempClaims);
    updateUsedVcs(tempVCs);
  }
  
  const handleBarCodeScanned = ({type, data}) => {
    setScanData(data);

    try {
      let jsonObject = JSON.parse(data);
      let obj = jsonObject.type.includes("VerifiableCredential")
      obj = jsonObject.type.includes("VerifiablePresentation")
    } catch (error) {
      setToggleErrorMsg(true);
      return;
    }
    let JSONdata = JSON.parse(data);
    if(JSONdata.type.includes("VerifiableCredential")){
      db.transaction(tx => {
        tx.executeSql('INSERT INTO documents (object, lastChange) VALUES (\'' + data + '\', date(\'now\'));'),
        null,
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            db.transaction(tx => {
              tx.executeSql('SELECT * FROM documents',
              null,
              (txObject, resultSet) => {
                setupContext(resultSet.rows._array);
                setRefresh(!refresh);
              },
              (txObject, error) => console.log(error))
            });
          } else {
            console.log(`Inserting ${name} into the database failed.`);
          }},
          (txObj, error) => console.error(`Error inserting ${name}:`, error)
        });
        setToggleUserMsg(true);
    }

    if(JSONdata.type.includes("VerifiablePresentation")){
      db.transaction(tx => {
        tx.executeSql('INSERT INTO presentations (object, lastChange) VALUES (\'' + data + '\', date(\'now\'));'),
        null,
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            setRefresh(!refresh);
          } else {
            console.log(`Inserting ${name} into the database failed.`);
          }
        },
        (txObj, error) => console.error(`Error inserting ${name}:`, error)
      });
      setToggleUserMsg(true);
    }

  };

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
       <CameraView
        onBarcodeScanned={scanData ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {toggleErrorMsg && ErrorPrompt()}
      {toggleUserMsg && UserPrompt()}
      {scanData && <Button title='Scan Again?' onPress={() => setScanData(undefined)} />}
      <StatusBar style="auto" />
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
  prompt_container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default QRSCreen