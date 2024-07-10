import 'react-native-gesture-handler';
import * as SQLite from 'expo-sqlite/legacy';
import React, { useEffect, useState } from 'react';
import {AppState, StyleSheet, Text, View} from 'react-native';
import  { NavigationContainer } from '@react-navigation/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import dbContext from './DbContext';
import { DeviceName } from "expo-device";
import DocumentsScreenNavigator from './components/DocumentScreen/DocumentScreenNavigator';
import QRScreen from './components/QRScreen/QRSCreen';
import FontAwesome from '@expo/vector-icons/Ionicons';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import SignUpNavigator from './components/LoginScreen/SignUpNavigator';
import keyContext from './keyContext';
import SettingsNavigator from './components/Settings/SettingsNavigator';
import PresentationScreenNavigator from './components/PresentationsScreen/PresentationScreenNavigator';
import refreshContext from './refreshContext';
import claimContext from './components/DocumentScreen/ClaimContext';
import usedVcsContext from './components/DocumentScreen/UsedVcsContext';


function App() {
  const [db, setDb] = useState(SQLite.openDatabase('masterDb.db'));
  const [appState, setAppState] = useState(null);
  const [hasKey, setHasKey] = useState(SecureStore.getItem('privateKey') != null);
  const [refresh, setRefresh] = useState(true);
  const [VcClaims, setVcClaims] = useState({})
  const [usedVCs, setUsedVCs] = useState({})

  const updateClaims = (newClaims) => {
    setVcClaims(newClaims);
  };
  const updateUsedVcs = (newUsedVCs) => {
    setUsedVCs(newUsedVCs);
  };
  
  const Tab = createMaterialBottomTabNavigator();

  const onAppStateChange = async (nextAppState) => {
    console.log(`onAppStateChange: appState from ${appState} to ${nextAppState}`);
    // cold start
    if (appState === null) {
      await LocalAuthentication.authenticateAsync();
    }
    // come to foreground from background
    else if (appState.match(/inactive|background/) && nextAppState === 'active') {
      await LocalAuthentication.authenticateAsync();
    }
    setAppState(nextAppState);
  };

  function Screen_C(){
    return(
      <View style={styles.body}>
        <Text>
          Screen_C
        </Text>
      </View>
    )
  }


    const onPressActionA = () => {
    let a = {
        "Name": "Dino",
        "Surname": "Salkovic",
        "Degree": "BSc"
    }
    let b = { 
        "Name": "Amer",
        "Surname": "Hrnjic",
        "Degree": "MSc"
    }

    console.log('INSERT INTO documents (object, lastChange) VALUES (\'' + JSON.stringify(a) + '\', date(\'now\'))')
  
    db.transaction(tx => {
      tx.executeSql('INSERT INTO documents (object, lastChange) VALUES (\'' + JSON.stringify(a) + '\', date(\'now\'))')
    });
  
    db.transaction(tx => {
      tx.executeSql('INSERT INTO documents (object, lastChange) VALUES (\'' + JSON.stringify(b) + '\', date(\'now\'))')
    });

    db.transaction(tx => {
      tx.executeSql('INSERT INTO presentations (object, lastChange) VALUES (\'' + JSON.stringify(a) + '\', date(\'now\'))')
    });

  }

  useEffect(() => {
    // db.transaction(tx => {
    //   tx.executeSql('DROP TABLE IF EXISTS documents');
    // });
    // db.transaction(tx => {
    //   tx.executeSql('DROP TABLE IF EXISTS presentations');
    // });
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS documents ( id INTEGER PRIMARY KEY AUTOINCREMENT , object TEXT NOT NULL , lastChange DATE)');
      tx.executeSql('CREATE TABLE IF NOT EXISTS presentations ( id INTEGER PRIMARY KEY AUTOINCREMENT , object TEXT NOT NULL , lastChange DATE)');
    });
    const changeListener = AppState.addEventListener('change', onAppStateChange);
    if (appState === null) {
      // The event is not triggered on cold start since the change has already taken place
      // therefore we need to call it manually.
      onAppStateChange(AppState.currentState);
    }
    // onPressActionA();
    return () => {
      changeListener.remove();
    };
    // onPressActionA();
  }, [appState, hasKey])



  return (
      <dbContext.Provider value = {[db,setDb]} style = {styles.container}>
        { hasKey && <View style = {styles.header}>
          <Text style = {styles.header_text}>
            { "Hi, " + (DeviceName ? DeviceName : "User")}
          </Text>
        </View>
        }

        <usedVcsContext.Provider value = {{usedVCs, updateUsedVcs}}>
        <claimContext.Provider value = {{VcClaims, updateClaims}}>
        <refreshContext.Provider value = {[refresh, setRefresh]} >
        <keyContext.Provider value = {[hasKey, setHasKey]}  style = {styles.container}>
        <View style = {styles.navigation}>
        {!hasKey && < SignUpNavigator></SignUpNavigator> }
        {hasKey &&
          <NavigationContainer style = {styles.navigation}>
            <Tab.Navigator
              screenOptions={{
                unmountOnBlur:true
              }}
            >
                <Tab.Screen
                name="Documents"
                component={DocumentsScreenNavigator}
                options={{
                  title: 'Documents',
                  tabBarIcon: ({ color }) => <FontAwesome size={24} name='document' color={color} />,
                  unmountOnBlur:true
                }}
                />

                <Tab.Screen
                name="Scan"
                component={QRScreen}
                options={{
                  title: 'Scan',
                  tabBarIcon: ({ color }) => <FontAwesome size={24} name='scan' color={color} />,
                  unmountOnBlur: true
                }} />

                <Tab.Screen name="PresentationsScreen"
                component={PresentationScreenNavigator}
                options={{
                  title: 'Presentation',
                  tabBarIcon: ({ color }) => <FontAwesome size={24} name='list' color={color} />,
                  unmountOnBlur: true
                }} />

                <Tab.Screen name="Settings"
                component={SettingsNavigator}
                options={{
                  title: 'Settings',
                  tabBarIcon: ({ color }) => <FontAwesome size={24} name='cog' color={color} />,
                  unmountOnBlur: true
                }} />
            </Tab.Navigator>
          </NavigationContainer>
        }
        </View>
        </keyContext.Provider> 
        </refreshContext.Provider>
        </claimContext.Provider>
        </usedVcsContext.Provider>
      </dbContext.Provider>
  );
};

const styles = StyleSheet.create({
  body : {
    justifyContent: 'center', //Centered vertically
    alignItems: 'center', //Centered horizontally
    flex:2,
    fontSize: 25,
    height: '100%',
    backgroundColor:'#ff1',
  },
  navigation: {
    flex: 10
  },
  header : {
    flex: 1,
    backgroundColor: '#121E2A',
    paddingVertical: 5,
    paddingStart: 10,
    flexDirection: 'column-reverse',
    borderBottomColor:"#516fe4",
    borderBottomWidth: 2,
  },
  header_text:{
    fontSize: 20,
    color: '#fff'
  },
  container:{
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column'
  }
});

export default App;


