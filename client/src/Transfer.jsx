import { useState } from "react";
import server from "./server";
import {secp256k1 } from "ethereum-cryptography/secp256k1"
import { keccak256 } from "ethereum-cryptography/keccak"
//add a field for public key
//change sender address into a signature created from 

//quick fix for serialization
BigInt.prototype.toJSON = function() { return this.toString() }

function Transfer({ privateKey, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);
  const hashMessage = message => keccak256(Uint8Array.from(message));

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const publicKey = secp256k1.getPublicKey(privateKey);
      const msg = {amount: parseInt(sendAmount), recipient };
      const senderSignature = secp256k1.sign(hashMessage(msg), privateKey);
      
      //test recovery
      //const { r, s, recovery } = senderSignature;
      //const sig = new secp256k1.Signature(r, s, recovery);
      //const publicKey2 = sig.recoverPublicKey(hashMessage(msg)).toHex();
      //console.log(senderSignature);
      
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: senderSignature,
        msg: msg
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
