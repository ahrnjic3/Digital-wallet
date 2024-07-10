import React, {useEffect, useState, useContext } from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, Text, View} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Switch } from 'react-native-paper';
import claimContext from '../ClaimContext';

const Document = ({route}) => {

  const[document, setDocument] = useState(route.params.document);
  const[uniqueKey, setUniqueKey] = useState(route.params.uniqueKey)
  const[selectedKeys, setSelectedKeys] = useState({});
  const {VcClaims, updateClaims } = useContext(claimContext);
  
  const  changeSelectedKey = (newKey) => {
    let newObject = {}
    Object.keys(selectedKeys).forEach((key)=>{
      newObject[key] = newKey == key ?  !selectedKeys[key] : selectedKeys[key]
    })

    setSelectedKeys(newObject)
    const newVCClaims = {...VcClaims, [uniqueKey]: newObject};

    updateClaims(newVCClaims);
  }
  
  useEffect(() => {
    setSelectedKeys(VcClaims[uniqueKey]);
  }, [VcClaims]);
  
  const  renderRow = (key) => {
    return(
      <View key = {key} style = {styles.row_item}>
        <View style = {styles.stick_left}> 
          <Text style = {styles.body_label}>
                {key +": "}
          </Text>
          <Text style = {styles.body_text}>
            {document.claims[key]}
          </Text>
        </View>
        <View style = {styles.stick_right}> 
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={false ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange=  {
              () => {
                changeSelectedKey(key);
              }}
            value={selectedKeys[key]}
            style = {styles.switch}
          />
        </View>
      </View>
    )
  }

  
  const showDocs = () =>  {
        return Object.keys(document.claims).map((key) => {
      return (
        <View
        key = {key}
        style = {styles.body}
        >
            {renderRow(key)}
        </View>
      );
    });
  };
  return(
    <ScrollView style= {styles.container}>
      {showDocs()}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  body : {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 5,
    flexDirection: 'column'
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
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
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
  }
});
export default Document