const express = require("express");
const db = require("./db/db");
const fs = require("fs");

// API Functions
const createWallet = require("./controller/createWallet");
const showPhrase = require("./controller/showPhrase");
const login = require("./controller/login");
const { getTestTransactionHistory, getMainTransactionHistory } = require("./controller/transaction");
const { checkWallet } = require("./middleware/checkWallet");
const { getTestBalanceFromAddress, getMainBalanceFromAddress } = require("./controller/balance");
const { createAccount } = require("./controller/createAccount");
const path = require("path");

const app = express();
const port = 8080;

// DB Sync
db.sequelize.sync().then(() => {
  console.log("Database Connected.");
});

app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Welcome to Blockchain Wallet",
  });
});

app.post("/createwallet", createWallet);

app.get("/supportedcoins", async (req, res) => async (req, res) => {
  let success = false;
  try {
    const filedata = fs.readFileSync(path(__dirname + "/supportedCoins.json"));
    const data = JSON.parse(filedata);

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      data
    })
    
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error."
    })
  }
})

app.post("/login", login);

app.post("/showphrase", checkWallet, showPhrase);

app.get("/test/transactionhistory", getTestTransactionHistory);

app.get("/transactionhistory", checkWallet, getMainTransactionHistory);

app.get("/test/balance", getTestBalanceFromAddress);

app.get("/balance", checkWallet, getMainBalanceFromAddress);

app.post("/createaccount/:keytype/:chain", checkWallet, createAccount);

app.post("/withdraw/:currency/:chain", async (req, res) => {
  
});

app.listen(port, () => {
  console.log(`Listening to the http://localhost:${port}`);
});
