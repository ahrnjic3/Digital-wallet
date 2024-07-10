import { MerkleTree}  from 'merkletreejs';
import sha256 from 'crypto-js/sha256.js';

function generateProofsForRevealedClaims(claimsData, revealedClaims) {
  // Convert the claims object into an array of strings (key:value) for the leaves
   // Read claims JSON file

   // Convert the claims object into an array of strings (key:value) for the leaves
   const leaves = Object.entries(claimsData).map(([key, value]) =>
     sha256(`${value}`)
   );

  // Create the Merkle tree
  const tree = new MerkleTree(leaves, sha256, { sortPairs: true });

  // Generate proofs for the revealed claims
  const proofs = revealedClaims.reduce((acc, claimKey) => {
    const claimValue = claimsData[claimKey];
    const claimString = sha256(`${claimValue}`);
    const proof = tree.getProof(claimString).map(p => ({
      position: p.position,
      data: p.data.toString('hex')
    }));

    // Store the claim and its proof
    acc[claimKey] = {
      value: claimValue,
      proof
    };

    return acc;
  }, {});

  // Prepare the output object
  const output = {
    revealedClaims: proofs
  };
  return output
}


export default generateProofsForRevealedClaims;