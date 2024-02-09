const bip39 = require("bip39");
const ecc = require("tiny-secp256k1");
const { BIP32Factory } = require("bip32");
const ethers = require("ethers");
const bitcoin = require("bitcoinjs-lib");
const { ECPairFactory } = require("ecpair");

// BNB Chain Create Account
exports.generateBNBKeysFromMnemonic = (mnemonic, index) => {
  const seed = ethers.Mnemonic.fromPhrase(mnemonic);
  const path = `44'/714'/0'/0/0/${index}`;
  const wallet = ethers.HDNodeWallet.fromMnemonic(seed, path);

  return {
    privateKey: wallet.privateKey,
    publicKey: wallet.publicKey,
    address: wallet.address,
  };
};

// Ethereum Create Account
exports.generateEthereumFromMnemonic = (mnemonic, index) => {
    const seed = ethers.Mnemonic.fromPhrase(mnemonic);
    const masterNode = ethers.HDNodeWallet.fromMnemonic(seed);
    const childNode = masterNode.derivePath(`m/${index}`);
    
    return {
        privateKey: childNode.privateKey,
        publicKey: childNode.publicKey,
        address: childNode.address,
    };
};

// Bitcoin Create Account
exports.generateBitcoinAddressFromMnemonic = (mnemonic, index) => {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const bip32 = BIP32Factory(ecc);

  const rootNode = bip32.fromSeed(seed);
  const childNode = rootNode.derivePath(`m/0/${index}`);

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
};

// Tron Create Account
exports.generateTronAccount = (mnemonic, index, tronWeb) => {
  const path = `m/44'/195'/0'/0/${index}`;
  const data = tronWeb.fromMnemonic(mnemonic, path);

  return {
    address: data.address,
    privateKey: data.privateKey,
    publicKey: data.publicKey,
  };
};
