const express = require("express");
const axios = require("axios");
const TronWeb = require("tronweb");
const { hashPassword, generateMnemonicPhrase } = require("./utils/wallet");
const { encryptAES } = require("./utils/aes");

const app = express();
const port = 8000;

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Welcome to Blockchain Wallet",
  });
});

app.post("/createwallet", async (req, res) => {
  let success = false;
  try {
    
    const { password } = req.body;

    const securePassword = await hashPassword(password);
    const seedPhrase = generateMnemonicPhrase();

    const encryptedSeed = await encryptAES(seedPhrase);

    // add To Database - Remaining
    
    success = true;
    return res.status(200).send({
      status: 200,
      success,
      walletSeed: seedPhrase,
      message: "Wallet created Successfully."
    })
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
});

app.post("/showphrase", async (req, res) => {

});

app.get("/transactionhistory", async (req, res) => {

});

app.get("/balance", async (req, res) => {});

app.post("/createaccount/:keytype/:chain", async (req, res) => {
  
});

app.post("/withdraw/:currency/:chain", async (req, res) => {});


app.listen(port, () => {
  console.log(`Listening to the http://localhost:${port}`);
});
