
// import loadBls from "bls-signatures";
import * as crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { AugSchemeMPL, getRandomSeed, toHex } from 'react-native-bls-signatures';
import * as Crypto from 'expo-crypto';

function generateAndSaveKeys() {

  // Generate a private key
  const seed = new Uint8Array(getRandomSeed()).buffer;
  const privateKey = AugSchemeMPL.keyGen(seed);
  // const privateKey = AugSchemeMPL.keyGen(crypto.getRandomBytes(32));
  // Get the public key from the private key
  const publicKey = privateKey.getG1();

  // Convert keys to hexadecimal strings for storage
  const privateKeyHex = toHex(privateKey.toBytes());
  const publicKeyHex = toHex(publicKey.toBytes());

  // Prepare objects to write to JSON, including the issuer name
  const privateKeyObj = { issuer: 'issuer', privateKey: privateKeyHex };
  const publicKeyObj = { issuer: 'issuer', publicKey: publicKeyHex };

  // Write the private key to a JSON file
  
   SecureStore.setItem('privateKey', JSON.stringify(privateKeyObj));
  SecureStore.setItem('publicKey', JSON.stringify(publicKeyObj));
  SecureStore.setItem('UUID', Crypto.randomUUID());
  SecureStore.setItem('Name', "Username");

}

export default generateAndSaveKeys;
