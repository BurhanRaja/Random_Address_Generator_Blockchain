const express = require("express");
const TronWeb = require("tronweb");
const { hashPassword, generateMnemonicPhrase } = require("./utils/wallet");
const { encryptAES } = require("./utils/aes");
const { Web3 } = require("web3");
const { getTestTransactions } = require("./utils/transaction");
const {
  ethereumTestContractAddress,
  polygonMainContractAddress,
  tronMainContractAddress,
  bscMainContractAddress,
  polygonTestContractAddress,
  bscTestContractAddress,
  tronTestContractAddress,
  secretKeyOne,
  secretKeyTwo,
  secretKeyThree,
  tronTestApiUrl
} = require("./config/config");
const { getTestBalance } = require("./utils/balance");
const {
  generateEthereumFromMnemonic,
  generateBitcoinAddressFromMnemonic,
  generateBNBKeysFromMnemonic,
  generateTronAccount,
} = require("./utils/account");

const app = express();
const port = 8000;

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

app.post("/createwallet", async (req, res) => {
  let success = false;
  try {
    const { password } = req.body;

    const securePassword = await hashPassword(password);
    console.log(securePassword);

    const seedPhrase = generateMnemonicPhrase();

    console.log(seedPhrase);
    
    const encryptedSeed = await encryptAES(seedPhrase, Uint8Array.from(secretKeyOne.split(",").map((e) => parseInt(e, 10))));
    console.log(encryptedSeed);

    // add To Database - Remaining

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      walletSeed: seedPhrase,
      message: "Wallet created Successfully.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
});

app.post("/showphrase", async (req, res) => {});

app.get("/test/transactionhistory", async (req, res) => {
  let success = false;
  try {
    const { type, chain, address, page, offset } = req.query;

    let contractAddress = "";

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

    const transactions = await getTestTransactions(
      type,
      chain,
      address,
      page,
      offset,
      contractAddress
    );

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      data: transactions,
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
});

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

    console.log(chain);

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
