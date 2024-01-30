const express = require("express");
const axios = require("axios")
const TronWeb = require("tronweb");

const app = express();
const port = 8000;

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Welcome to Blockchain Wallet"
  })
});

app.post("/createwallet");

app.get("/recoveryphase");

app.get("/transactionhistory")

app.get("/balance");

app.post("/createaccount");

app.listen(port, () => {
  console.log(`Listening to the http://localhost:${port}`)
})