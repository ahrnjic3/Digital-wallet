import React from 'react';
import {StyleSheet} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Settings from './Settings';
import SyncScreen from './SyncScreen';
import { NavigationContainer } from '@react-navigation/native';
import AboutScreen from './About';

const Stack = createStackNavigator();
const SettingsNavigator = () => {
  return(
    <NavigationContainer
        independent={true}
    >
        <Stack.Navigator initialRouteName="Settings">
            <Stack.Screen
             name = "Settings"
             component={Settings}
             options={{
              headerShown: false
            }}
           />
            <Stack.Screen
             name = "Sync"
             component={SyncScreen}
           />
            <Stack.Screen
             name = "About"
             component={AboutScreen}
           />

           
        </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  body : {
    paddingTop: 5,
    fontSize: 25,
    backgroundColor:'#fff',
  }
});

export default SettingsNavigator