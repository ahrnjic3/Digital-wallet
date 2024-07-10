import { createStackNavigator } from '@react-navigation/stack';
import navigationContext from '../../NavigationContext';
import { TouchableOpacity, StyleSheet, Text, View} from 'react-native'
import PresentationScreen from './PresentationScreen';
import Presentation from './Presentation/Presentation';

const Stack = createStackNavigator();
const PresentationScreenNavigator = () => {
  return(
    <navigationContext.Provider value = {navigator} style = {styles.container}>
      <Stack.Navigator>
          <Stack.Screen
            name = "Presentations"
            component={PresentationScreen}
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
  body : {
    paddingTop: 5,
    fontSize: 25,
    backgroundColor:'#fff',
  }
});

export default PresentationScreenNavigator