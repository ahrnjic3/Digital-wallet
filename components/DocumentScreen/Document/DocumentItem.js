import React, {useContext, useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import { Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import usedVcsContext from '../UsedVcsContext';


const DocumentItem = (props) => {

  const navigation = useNavigation();
  const openItem = () => {;
    navigation.navigate("Document", {document, uniqueKey})
  }
  const[document, setDocument] = useState(props.document);
  const[uniqueKey, setUniqueKey] = useState(props.uniqueKey);
  const[documentString, setDocumentString] = useState(props.documentString);
  const { usedVCs, updateUsedVcs } = useContext(usedVcsContext);
  const[selectedKeys, setSelectedKeys] = useState({});

  const  changeSelectedKey = (newKey) => {
    let newObject = {}
    Object.keys(selectedKeys).forEach((key)=>{
      newObject[key] = newKey == key ?  !selectedKeys[key] : selectedKeys[key]
    })

    setSelectedKeys(newObject)
    const newUsedVCs = {...usedVCs, [uniqueKey]: newObject[uniqueKey]};

    updateUsedVcs(newUsedVCs)
  }

  useEffect(() => {
    setSelectedKeys(usedVCs);
  }, [usedVCs]);

  const renderFristTwoClaims = () =>  {
      return Object.keys(document.claims).slice(0, 2).map((key) => {
        return (
          <View key = {key}>
            <View style = {styles.text_row}>
              <Text style = {styles.body_label}>
                {key + ': '}
              </Text>
              <Text style = {styles.body_text}>
                {document.claims[key]}
              </Text>
            </View>
          </View>
        );
      });
  }
  return(
    <TouchableOpacity onPress={openItem}> 
      <View  style= {styles.doc_container}>
          <View style= {styles.header}>
            <Text style= {styles.header_text}> Diploma </Text>
            <View style = {styles.stick_right}> 
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={false ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange=  {
                  () => {
                    changeSelectedKey(uniqueKey);
                  }}
                value={selectedKeys[uniqueKey]}
                style = {styles.switch}
              />
          </View>
          </View>
          <View style = {styles.body}>
            {renderFristTwoClaims()}
          </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  stick_right:{
    flex: 1,
    marginLeft:'auto',
    width: '100%',
    paddingRight: '4%'
  },
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
  switch: {
    transform:[{ scaleX: 1.5 }, { scaleY: 1.5 }],
    marginLeft: 'auto'
  }
});
export default DocumentItem