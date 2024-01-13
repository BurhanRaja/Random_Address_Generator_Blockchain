const bip39 = require("bip39");
const ecc = require("tiny-secp256k1");
const { BIP32Factory } = require("bip32");
const ethers = require("ethers");
const bitcoin = require("bitcoinjs-lib");
const { ECPairFactory } = require("ecpair");

function generateMnemonicPhrase() {
  return bip39.generateMnemonic();
}

function generateBNBKeysFromMnemonic(mnemonic) {
  const path = "m/44'/60'/0'/0/1"; // BIP-44 path for BNB
  const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonic, path);

  return {
    privateKey: wallet.privateKey,
    publicKey: wallet.publicKey,
    address: wallet.address,
  };
}

function generateEthereumFromMnemonic(mnemonic) {
  const masterNode = ethers.HDNodeWallet.fromMnemonic(mnemonic);
  const childNode = masterNode.derivePath("m/0");

  return {
    privateKey: childNode.privateKey,
    publicKey: childNode.publicKey,
    address: childNode.address,
  };
}

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
const seed = ethers.Mnemonic.fromPhrase(
  "end tonight viable energy mother keep one phrase excite evolve exclude carbon"
);
const bnbKeys = generateBNBKeysFromMnemonic(seed);
console.log(bnbKeys);

const bitcoinKeys = generateBitcoinAddressFromMnemonic(mnemonic);
console.log(bitcoinKeys);

const ethreumKeys = generateEthereumFromMnemonic(seed);
console.log(ethreumKeys);
