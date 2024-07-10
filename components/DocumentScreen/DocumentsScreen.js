import React, { useContext, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View, Pressable} from 'react-native';
import dbContext from '../../DbContext';
import DocumentItem from './Document/DocumentItem';
import claimContext from './ClaimContext';
import usedVcsContext from './UsedVcsContext';
import * as SecureStore from 'expo-secure-store';
import generateProofsForRevealedClaims from '../../Encryption/generateProofsForRevealedClaims';
import aggregateClaimsAndSignatures from '../../Encryption/aggregateClaimsAndSignatures';
import { useNavigation } from '@react-navigation/native';
import refreshContext from '../../refreshContext';

const DocumentsScreen = () => {

  const navigation = useNavigation();

  const[documents, setDocuments] = useState([]);
  const[db, setDb] = useContext(dbContext);
  const[refresh,setRefresh] = useContext(refreshContext)
  const { VcClaims, updateClaims } = useContext(claimContext);
  const { usedVCs, updateUsedVcs } = useContext(usedVcsContext);
  const [Refreshing, setRefreshing] = useState(false);
  const[presentedDocuments, setPresentedDocuments] = useState([]);

  
  function showDocs (){
    return documents.map((object) => {
      return (
        <DocumentItem
          key = {object.id}
          uniqueKey = {object.id}
          document = {JSON.parse(object.object)}
          documentString = {object.object}
        >
        </DocumentItem>
      );
    });
  };

  const setupContext = (docs) => {
  
    // if (Object.keys(VcClaims).length !== 0)
    //   return;
    const tempVCs = {}
    const tempClaims = {}
    docs.forEach( doc => {
      const docObj = JSON.parse(doc.object);
      tempClaims[doc.id] = {}
      Object.keys(docObj.claims).forEach((key)=>{
        tempClaims[doc.id][key] = false;
        tempVCs[doc.id] = false;
      })
    })
    updateClaims(tempClaims);
    updateUsedVcs(tempVCs);
  }

  const onRefresh = () => {
    setRefreshing(true);
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM documents;',
      null,
      (txObject, resultSet) => {setDocuments(resultSet.rows._array);
        setupContext(resultSet.rows._array)
        setRefreshing(false);
      },
      (txObject, error) => console.log(error))
    });
  }

  const  filterKeys = (obj) => {
    return Object.entries(obj)
        .filter(([key, value]) => value === true)
        .map(([key, value]) => key);
  }



  const showPresentation = () =>{
    const idArray = filterKeys(usedVCs)
    const idString = idArray.join(',');
    db.transaction(tx => {
      tx.executeSql(`SELECT * FROM documents WHERE id IN (${idString});`,
      null,
      (txObject, resultSet) => {
        setPresentedDocuments(prevDocuments => {
            const newDocuments = resultSet.rows._array;

            const presentation = {
              "@context" : "https://www.w3.org/2018/credentials/v1",
              type: ["VerifiablePresentation"],
              issuers: [],
              credentialTypes: [],
              id: [],
              credentialSubject:  {
                id: SecureStore.getItem("UUID"),
                name: SecureStore.getItem("Name")
              },
              claims: [],
              proof: {
                type: "BlsSignature2020",
                created: new Date().toISOString(),
                proofPurpose: "assertionMethod",
                verificationMethod: "did:example:1234567890#keys-1",
                aggregatedSignature: null 

              }
            } 
            const generatedProofs = []
            const proofs = [];
            newDocuments.forEach( doc =>{
              const DocObj = JSON.parse(doc.object)
              const claimKeys = filterKeys(VcClaims[doc.id]);
              const selectedClaims = {}
              claimKeys.forEach( key =>{
                selectedClaims[key] = DocObj.claims[key]
              })
              if(Object.keys(selectedClaims).length > 0) {
                
                // for aggregation
                generatedProofs.push(generateProofsForRevealedClaims(DocObj.claims,Object.keys(selectedClaims)));
                proofs.push(DocObj.proof.signature);

                // rest of the data
                if(presentation.issuers.indexOf(DocObj.issuer) === -1)
                  presentation.issuers.push(DocObj.issuer)

                // presentation.claims.push(selectedClaims)

                const types = []
                DocObj.type.forEach(type => {
                    types.push(type)
                })
                presentation.credentialTypes.push(types)

                presentation.id.push(DocObj.id)

              }
            })
            const aggregate = aggregateClaimsAndSignatures(generatedProofs,proofs)
            presentation.claims = aggregate.aggregatedClaims;
            presentation.proof.aggregatedSignature = aggregate.aggregatedSignature;

            const document = presentation;
            navigation.navigate ("Presentation", {document})
            return;
        });
    },
      (txObject, error) => console.log(error))
    });
  }



  
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM documents',
      null,
      (txObject, resultSet) => {
        setDocuments(resultSet.rows._array);
        setupContext(resultSet.rows._array)
      },
      (txObject, error) => console.log(error))
    });
  }, [db,refresh])

  return (
    <View style={styles.container}>
        <ScrollView
            style={styles.body}
            refreshControl={
                <RefreshControl
                    refreshing={Refreshing}
                    onRefresh={onRefresh}
                    colors={['#516fe4']}
                />
            }>
            {showDocs()}
        </ScrollView>

        <Pressable
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: pressed ? '#2e64e5' : '#007bff',
                    borderRadius: 8,
                }
            ]}
            onPress={showPresentation}>
            <Text style={styles.buttonText}>Present</Text>
        </Pressable>
    </View>
);
};

const styles = StyleSheet.create({
container: {
    flex:1,
    backgroundColor: '#f0f0f0',
},
body: {
    flex: 9, // Take 90% of the available space
    padding: 10,
    backgroundColor: '#fff',
    flexGrow: 8
},
text: {
    fontSize: 16,
    lineHeight: 24,
},
button: {
    flex: 1, // Take 10% of the available space
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    margin: 10,
    borderRadius: 8,
},
buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
},
});
export default DocumentsScreen