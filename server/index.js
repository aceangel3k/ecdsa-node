const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");

const hashMessage = message => keccak256(Uint8Array.from(message));

app.use(cors());
app.use(express.json());

const balances = {
  "0389638d550da2b75ffa6ae2a4388827a8e3adff2241f131d1caae5642cfb77138": 100,
  "0324b5927685faa4a36d31afc8e4352820aedd9d43cc3a94d990331c76cee20718": 75,
  "0366b8ee02a57e086be48bfebe7812a0b5c9b5a86aa1ab6ba6e929505bfea04b6d": 50,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, msg } = req.body;
  const { amount, recipient } = msg;
  const { r, s, recovery } = signature;
  const sig = new secp256k1.Signature(BigInt(r), BigInt(s), recovery);
  const publicKey = sig.recoverPublicKey(hashMessage(msg)).toHex();
  const isSigned = secp256k1.verify(sig, hashMessage(msg), publicKey);
  
  if (!isSigned) {
    res.status(400).send({ message: "Signature not signed!" });
  }
  const sender = publicKey;
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
