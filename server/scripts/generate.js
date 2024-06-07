const { secp256k1 } = require("ethereum-cryptography/secp256k1")
const { toHex, hexToBytes } = require("ethereum-cryptography/utils")
const {keccak256} = require("ethereum-cryptography/keccak")
/*TEST PRIVATEKEYS
 09d1e9a38fcee1a1e9bacd52a6f5e92dc7858622fc6fd7d7377895d6481ec9de
 15c31e8c86119f8c6e6a5a16accdea1bd2e721ae8af2a06fd58d545399ea62b6
 67f3a33dba5c44aa003f458488f6e0aa090c773671533bd56ffc3f43524f63ee
 cc00b3da2365d87658ef714111716f4657c2c20c626bfc7e7f13d23b347b101d

 ACCOMPANYING PUBLIC KEYS
 0389638d550da2b75ffa6ae2a4388827a8e3adff2241f131d1caae5642cfb77138
 0324b5927685faa4a36d31afc8e4352820aedd9d43cc3a94d990331c76cee20718
 0366b8ee02a57e086be48bfebe7812a0b5c9b5a86aa1ab6ba6e929505bfea04b6d
 024e5592808175a7c3b79845be9eb0927a39a3ce94f4d0b3866e49bbfc45299808
 */
 const hashMessage = message => keccak256(Uint8Array.from(message));

//const privateKey = secp256k1.utils.randomPrivateKey(); //byteArray
const privateKey = "09d1e9a38fcee1a1e9bacd52a6f5e92dc7858622fc6fd7d7377895d6481ec9de";
const publicKey = secp256k1.getPublicKey(privateKey);
const msg = {hi:"hello"}; //test message to sign
const signature = secp256k1.sign(hashMessage(msg), privateKey);
console.log("raw signature: ", signature)
//recover the public key
const { r, s, recovery } = signature;
const secpSig = new secp256k1.Signature(r,s, recovery);
console.log("Hashed Message: ", hashMessage(msg))
const recoveredPublicKey = secpSig.recoverPublicKey(hashMessage(msg)).toHex();
const isSigned = secp256k1.verify(signature, hashMessage(msg), recoveredPublicKey);
const recoveryBit = true;
console.log("New keys");
console.log("Private Key: ", privateKey);   
console.log("Public Key: ", toHex(publicKey));
console.log("Recovered Public Key: ", recoveredPublicKey);
console.log("Is Signed: ", isSigned);
console.log("")