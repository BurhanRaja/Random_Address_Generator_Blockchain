const express = require("express");
const TronWeb = require("tronweb");
const { getTestTransactions } = require("./utils/transaction");
const {
  ethereumTestContractAddress,
  polygonMainContractAddress,
  tronMainContractAddress,
  bscMainContractAddress,
  polygonTestContractAddress,
  bscTestContractAddress,
  tronTestContractAddress,
  tronTestApiUrl
} = require("./config/config");
const { getTestBalance } = require("./utils/balance");
const {
  generateEthereumFromMnemonic,
  generateBitcoinAddressFromMnemonic,
  generateBNBKeysFromMnemonic,
  generateTronAccount,
} = require("./utils/account");
const db = require("./db/db");

// API Functions
const createWallet = require("./controller/createWallet");
const showPhrase = require("./controller/showPhrase");
const login = require("./controller/login");
const { getTestTransactionHistory, getMainTransactionHistory } = require("./controller/transaction");

const app = express();
const port = 8080;

// DB Sync
db.sequelize.sync().then(() => {
  console.log("Database Connected.");
});

app.use(express.json());

const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider(tronTestApiUrl);
const solidityNode = new HttpProvider(tronTestApiUrl);
const eventServer = tronTestApiUrl;
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Welcome to Blockchain Wallet",
  });
});


app.post("/createwallet", createWallet);

app.post("/login", login);

app.post("/showphrase", showPhrase);

app.get("/test/transactionhistory", getTestTransactionHistory);

app.get("/transactionhistory", getMainTransactionHistory);

app.get("/test/balance", async (req, res) => {
  let success = false;
  try {
    const { type, chain, address } = req.query;

    if (type === "token") {
      contractAddress =
        chain === "ethereum"
          ? ethereumTestContractAddress
          : chain === "polygon"
          ? polygonTestContractAddress
          : chain === "bsc"
          ? bscTestContractAddress
          : chain === "tron"
          ? tronTestContractAddress
          : "";
    }

    const balance = await getTestBalance(type, chain, address, contractAddress);

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      data: {
        balance,
      },
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error",
    });
  }
});

app.post("/createaccount/:keytype/:chain", async (req, res) => {
  let success = false;

  try {
    const { mnemonic } = req.body;
    const { keytype, chain } = req.params;

    let address = "";

    if (chain === "ethereum") {
      address = generateEthereumFromMnemonic(mnemonic, 2);
      console.log(address);
    }
    if (chain === "bitcoin") {
      address = generateBitcoinAddressFromMnemonic(mnemonic, 2);
    }
    if (chain === "bsc") {
      address = generateBNBKeysFromMnemonic(mnemonic, 2);
    }
    if (chain === "tron") {
      address = generateTronAccount(mnemonic, 2, tronWeb);
    }

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      data: {
        address,
      },
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error",
    });
  }
});

app.post("/withdraw/:currency/:chain", async (req, res) => {});

app.listen(port, () => {
  console.log(`Listening to the http://localhost:${port}`);
});
