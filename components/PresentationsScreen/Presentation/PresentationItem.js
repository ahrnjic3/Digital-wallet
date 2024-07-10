import React, {useContext, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PresentationItem = (props) => {

  const navigation = useNavigation();
  const[document, setDocument] = useState(props.document);


  openItem = () => {
    navigation.navigate("Presentation", {document})
  }
  
  const renderFristTwoClaims = () =>  {
    return Object.keys(document.claims[0]).slice(0, 2).map((key) => {
      return (
        <View key = {key}>
          <View style = {styles.text_row}>
            <Text style = {styles.body_label}>
              {key + ': '}
            </Text>
            <Text style = {styles.body_text}>
              {document.claims[0][key].value}
            </Text>
          </View>
        </View>
      );
    });
}

  return(
    <TouchableOpacity onPress={this.openItem}> 
      <View  style= {styles.doc_container}>
          <View style= {styles.header}>
            <Text style= {styles.header_text}> Presentation </Text>
          </View>
          <View style = {styles.body}>
            {/* <View style = {styles.text_row}>
              <Text style = {styles.body_label}>
                {'Date: '}
              </Text>
              <Text style = {styles.body_text}>
                {document.Name + " " + document.Surname}
              </Text>
            </View> */}
            {renderFristTwoClaims()}
          </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  body : {
    flex: 5 ,
    paddingTop:15,
    paddingBottom: 15,
    paddingHorizontal: 25,
  },
  doc_container: {
    marginTop: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: 130,
    backgroundColor:'#e1e1e1',
    overflow: 'hidden'
  },
  header: {
    flex: 3,
    width: '100%',
    backgroundColor:'#121E2A',
    paddingVertical: 5,
    paddingStart: 10,
    borderBottomColor:"#516fe4",
    borderBottomWidth: 1,
  },
  header_text:{
    fontSize: 20,
    color: '#fff'
  },
  body_text:{
    fontSize: 16,
    color: '#111',
    marginBottom: 10
  },
  body_label:{
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 10
  },
  text_row:{
    flexDirection: 'row'
  }
});
export default PresentationItem