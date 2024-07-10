import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from './SignUpScreen'
import SyncScreen from './SyncScreen';
import { Text, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

const SignUpNavigator = () => {
  return(
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Sign up">
            <Stack.Screen
             name = "Sign up"
             component={SignUpScreen}
             options={{
              headerShown: false
            }}
           />
            <Stack.Screen
             name = "Sync"
             component={SyncScreen}
           />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default SignUpNavigator