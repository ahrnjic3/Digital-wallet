import React, { useContext, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import dbContext from '../../DbContext';
import PresentationItem from './Presentation/PresentationItem';
import refreshContext from '../../refreshContext';

const PresentationScreen = () => {


    const[presentations, setPresentations] = useState([]);
    const[db, setDb] = useContext(dbContext);
    const[refresh, setRefresh] = useContext(refreshContext);
    const showPresentation = () => {
      return presentations.map((object, index) => {
        return (
          <PresentationItem
            key = {index}
            document = {JSON.parse(object.object)}
          >
          </PresentationItem>
        );
      });
    };
  
    const [Refreshing, setRefreshing] = useState(false);
  
    const onRefresh = () => {
      setRefreshing(true);
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM presentations',
        null,
        (txObject, resultSet) => {setPresentations(resultSet.rows._array)},
        (txObject, error) => console.log(error))
      });
      setRefreshing(false);
    }
  
  
    useEffect(() => {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM presentations',
        null,
        (txObject, resultSet) => {setPresentations(resultSet.rows._array)},
        (txObject, error) => console.log(error))
      });
    }, [refresh])
  
    return(
      <ScrollView
      style={styles.body}
      refreshControl={
        <RefreshControl
        refreshing={Refreshing}
        onRefresh={onRefresh}
        colors={['#516fe4']}
      />
      }>
        {showPresentation()}
      </ScrollView>
    )
  }
  
  const styles = StyleSheet.create({
    body : {
      paddingTop: 5,
      fontSize: 25,
      backgroundColor:'#fff',
    }
  });
  
  export default PresentationScreen