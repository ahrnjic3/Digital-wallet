import React, {useEffect, useState } from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, Text, View} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Switch } from 'react-native-paper';
import QRCode from '../../QRGenerator/QRCodeGenJS';

const Presentation = ({route}) => {

  const[document, setDocument] = useState(route.params.document);
  
  function renderRow(key, claim){
    return(
      <View key = {key} style = {styles.row_item}>
        <View style = {styles.stick_left}> 
          <Text style = {styles.body_label}>
                {key +": "}
          </Text>
          <Text style = {styles.body_text}>
            {document.claims[claim][key].value}
          </Text>
        </View>
      </View>
    )
  }

  function renderRowsForClaim(claim){
    return Object.keys(document.claims[claim]).map((key) =>{
        return renderRow(key,claim)
    })
  }

  function renderClaims(){
    console.log(document.claims);
    return Object.keys(document.claims).map((claim, index) =>{
        return <React.Fragment key={claim}>
            {renderRowsForClaim(claim)}
            {index !== Object.keys(document.claims).length - 1 && <View style={styles.divider}></View>}
        </React.Fragment>
    })
  }

  return(
    <View style= {styles.container}>
        <View style={styles.qrcode}>
            <QRCode 
            value= {JSON.stringify(document)}
            size = "400"
            errorCorrection = "LOW"
            />
        </View>
        <ScrollView style = {styles.body}>
        {renderClaims()}
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  qrcode : {
    flex: 2,
    alignContent: 'center',
    justifyContent: 'center'
  },
  body : {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 5,
    flexDirection: 'column',
    backgroundColor: 'white',
    borderTopColor: '#ccc',
    borderTopWidth: 1
  },
  container : {
    flex: 1,
    paddingHorizontal: 5,
    flexDirection: 'column',
  },
  header: {
    flex: 3,
    width: '100%',
    backgroundColor:'#121E2A',
    paddingVertical: 5,
    paddingStart: 10,
    borderBottomColor:"#516fe4",
    borderBottomWidth: 1
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
  },
  row_item: {
    flexDirection:'row',
    width: '100%',
    paddingLeft: 10
  },
  stick_left:{
    flex: 1,
    marginRight:'auto'
  },
  stick_right:{
    flex: 1,
    marginLeft:'auto',
    width: '100%'
  },
  switch: {
    transform:[{ scaleX: 1 }, { scaleY: 1 }],
    marginLeft: 'auto'
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
},
});
export default Presentation