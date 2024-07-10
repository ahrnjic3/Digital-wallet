import { G2Element, AugSchemeMPL } from 'react-native-bls-signatures';


function aggregateClaimsAndSignatures(claimsData, rootSignatureData) {
  // Initialize the BLS library
  
  let aggregatedClaims = [];
  let signatures = [];

  // Process disclosed claims and proofs
  claimsData.forEach(data => {
    aggregatedClaims.push(data.revealedClaims);
  });

  // Process roots and signatures, and collect signatures for aggregation
  rootSignatureData.forEach(data => {
    signatures.push(data);
  });

  // Convert signatures from hex to Signature objects
  signatures = signatures.map(sigHex => G2Element.fromHex(sigHex));

  // Aggregate the signatures
  const aggregatedSignature = AugSchemeMPL.aggregate(signatures);

  // Prepare the output object
  const output = {
    aggregatedClaims,
    aggregatedSignature: aggregatedSignature.toHex()
  };

  // Write the aggregated data to a JSON file
    return output
}

// Example usage
export default aggregateClaimsAndSignatures;