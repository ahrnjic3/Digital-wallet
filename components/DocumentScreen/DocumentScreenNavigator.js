import React, { useContext, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import dbContext from '../../DbContext';
import DocumentItem from './Document/DocumentItem';
import { createStackNavigator } from '@react-navigation/stack';
import DocumentsScreen from './DocumentsScreen';
import navigationContext from '../../NavigationContext';
import Document from './Document/Document';
import claimContext from './ClaimContext';
import usedVcsContext from './UsedVcsContext';
import Presentation from '../PresentationsScreen/Presentation/Presentation';

const Stack = createStackNavigator();

const DocumentsScreenNavigator = () => {  

  return(
      <navigationContext.Provider value = {navigator} style = {styles.container}>
        <Stack.Navigator initialRouteName="Docs"
          options={{unmountOnBlur: true}}
        >
            <Stack.Screen
              name = "Docs"
              component={DocumentsScreen}
            />
            <Stack.Screen
              name = "Document"
              component={Document}
            />
            <Stack.Screen
              name = "Presentation"
              component={Presentation}
          />
        </Stack.Navigator>
      </navigationContext.Provider>
  )
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    paddingTop: 5,
    fontSize: 25,
    backgroundColor:'#fff',
  }
});

export default DocumentsScreenNavigator