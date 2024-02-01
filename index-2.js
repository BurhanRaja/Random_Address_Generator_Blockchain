const bip39 = require("bip39");
const ecc = require("tiny-secp256k1");
const { BIP32Factory } = require("bip32");
const ethers = require("ethers");
const bitcoin = require("bitcoinjs-lib");
const { ECPairFactory } = require("ecpair");
const secp256k1 = require('secp256k1');
const axios = require("axios")
const TronWeb = require("tronweb");

const bip32 = BIP32Factory(ecc);

const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider('https://nile.trongrid.io/');
const solidityNode = new HttpProvider('https://nile.trongrid.io/');
const eventServer = 'https://nile.trongrid.io/';
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);


// console.log(tronWeb);

function generateMnemonicPhrase() {
  return bip39.generateMnemonic();
}

// function generateBNBKeysFromMnemonic(mnemonic) {
//   const path = "m/44'/60'/0'/0/1"; // BIP-44 path for BNB
//   const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonic, path);

//   return {
//     privateKey: wallet.privateKey,
//     publicKey: wallet.publicKey,
//     address: wallet.address,
//   };
// }

async function generateTronAccount(mnemonic) {

  const path = "m/44'/195'/0'/0/1";
  const data = tronWeb.fromMnemonic(mnemonic, path);

  return {
    address: data.address,
    privateKey: data.privateKey,
    publicKey: data.publicKey
  }
}

async function getTronTransactionHistory(address) {
  try {
    const data = await axios.get(`https://nile.trongrid.io/v1/accounts/${address}/transactions`)
    const trc20Data = await axios.get(`https://nile.trongrid.io/v1/accounts/${address}/transactions/trc20?limit=100&contract_address=TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj`)
    return {
      normalTransaction: data.data,
      trc20TransactionData: trc20Data.data
    };
  } catch (error) {
    throw error;
  }
}

async function getTokenBalance(address) {
  try {

    tronWeb.setAddress("TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj");
    const contract = await tronWeb.contract().at("TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj");
    const balance = await contract.balanceOf(address).call();

    return balance.toNumber();
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return 0;
  }
}

async function getTronAccountBalance(address) {
  try {
    const response = await tronWeb.trx.getBalance(address);

    return (tronWeb.BigNumber(response)).toNumber();
  } catch (err) {
    throw err;
  }
}

// function generateEthereumFromMnemonic(mnemonic) {
//   const masterNode = ethers.HDNodeWallet.fromMnemonic(mnemonic);
//   const childNode = masterNode.derivePath("m/0");

//   return {
//     privateKey: childNode.privateKey,
//     publicKey: childNode.publicKey,
//     address: childNode.address,
//   };
// }

function generateBitcoinAddressFromMnemonic(mnemonic) {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const bip32 = BIP32Factory(ecc);

  const rootNode = bip32.fromSeed(seed);
  const childNode = rootNode.derivePath("m/0/0"); // Derive a specific child node (change as needed)

  const ECPair = ECPairFactory(ecc);

  const privateKey = childNode.privateKey.toString("hex");
  const publicKey = ECPair.fromPrivateKey(
    childNode.privateKey
  ).publicKey.toString("hex");
  const address = bitcoin.payments.p2pkh({
    pubkey: childNode.publicKey,
  }).address;

  return {
    privateKey,
    publicKey,
    address,
  };
}

const mnemonic = generateMnemonicPhrase();
console.log(mnemonic);

// const seed = ethers.Mnemonic.fromPhrase(
//   "end tonight viable energy mother keep one phrase excite evolve exclude carbon"
// );
// const bnbKeys = generateBNBKeysFromMnemonic(seed);
// console.log(bnbKeys);

// const bitcoinKeys = generateBitcoinAddressFromMnemonic("end tonight viable energy mother keep one phrase excite evolve exclude carbon");
// console.log(bitcoinKeys);

// const ethreumKeys = generateEthereumFromMnemonic(seed);
// console.log(ethreumKeys);

// console.log(seed);
// generateTronAccount("end tonight viable energy mother keep one phrase excite evolve exclude carbon").then((data) => console.log(data));
// getTronTransactionHistory("TSVfvUWaX8BRyuXAT7hHAAQkXPEHjFWKNT").then((data) => {
  // console.log(data)
  // for (let i = 0; i < data["normalTransaction"]['data'].length; i++) {
  //   console.log(data["normalTransaction"]['data'][i]);
  //   console.log(data["normalTransaction"]['data'][i]["raw_data"]);
  //   console.log(data["normalTransaction"]['data'][i]["raw_data"]["contract"][0]["parameter"]);
  // }
  // console.log(data["trc20TransactionData"]['data'])
  // for (let i = 0; i < data["trc20TransactionData"]['data'].length; i++) {
    // console.log(data["trc20TransactionData"]['data'][i]["raw_data"]);
    // console.log(data["trc20TransactionData"]['data'][i]["raw_data"]["contract"][0]["parameter"]);
  // }
// });
// getTronAccountBalance("TSVfvUWaX8BRyuXAT7hHAAQkXPEHjFWKNT").then((data) => console.log("Balance", data)).catch((err) => console.log(err));
// console.log(tronWeb.address.toHex("TSVfvUWaX8BRyuXAT7hHAAQkXPEHjFWKNT"));

// (async() => {
//   const data = await getTokenBalance("TSVfvUWaX8BRyuXAT7hHAAQkXPEHjFWKNT")
//   console.log(data);
// })()