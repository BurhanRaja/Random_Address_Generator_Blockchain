const {
  generateEthereumFromMnemonic,
  generateTronAccount,
  generateBitcoinAddressFromMnemonic,
  generateBNBKeysFromMnemonic,
} = require("../utils/account");
const TronWeb = require("tronweb");
const { address, wallet } = require("../db/db");
const { decryptAES, encryptAES } = require("../utils/aes");
const { secretKeys, tronMainApiUrl } = require("../config/config");
const { v4: uuid } = require("uuid");

const Address = address;
const Wallet = wallet;

exports.createAccount = async (req, res) => {
  let success = false;

  try {
    const { keytype, chain } = req.params;

    let wallet = await Wallet.findOne({
      where: {
        id: req.wallet.id,
      },
    });

    let mnemonic = await decryptAES(
      wallet.seedphrase,
      Uint8Array.from(
        secretKeys[wallet.encryption].split(",").map((e) => parseInt(e, 10))
      )
    );

    let address = "";

    let ethereumIdx = 0;
    let bitcoinIdx = 0;
    let bscIdx = 0;
    let tronIdx = 0;

    if (chain === "ethereum" || chain === "polygon") {
      address = generateEthereumFromMnemonic(mnemonic, wallet.ethereumIdx);
      ethereumIdx = wallet.ethereumIdx;
    }
    if (chain === "bitcoin") {
      address = generateBitcoinAddressFromMnemonic(mnemonic, wallet.bitcoinIdx);
      bitcoinIdx = wallet.bitcoinIdx;
    }
    if (chain === "bsc") {
      address = generateBNBKeysFromMnemonic(mnemonic, wallet.bscIdx);
      bscIdx = wallet.bscIdx;
    }
    if (chain === "tron") {
      const HttpProvider = TronWeb.providers.HttpProvider;
      const fullNode = new HttpProvider(tronMainApiUrl);
      const solidityNode = new HttpProvider(tronMainApiUrl);
      const eventServer = tronMainApiUrl;
      const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);
      address = generateTronAccount(mnemonic, wallet.tronIdx, tronWeb);
      tronIdx = wallet.tronIdx;
    }

    await Wallet.update(
      {
        ethereumIdx: chain === "ethereum" || chain === "polygon" ? ethereumIdx + 1 : ethereumIdx,
        tronIdx: chain === "tron" ? tronIdx + 1 : tronIdx,
        bitcoinIdx: chain === "bitcoin" ? bitcoinIdx + 1 : bitcoinIdx,
        bscIdx: chain === "bsc" ? bscIdx + 1 : bscIdx,
      },
      {
        where: {
          id: req.wallet.id,
        },
      }
    );

    const randomSecretNumber = Math.floor(Math.random() * 2);
    const secretKey = secretKeys[randomSecretNumber];

    const encryptedPrivateKey = await encryptAES(
      address?.privateKey,
      Uint8Array.from(secretKey.split(",").map((e) => parseInt(e, 10)))
    );

    await Address.create({
      id: uuid(),
      address: address?.address,
      publicKey: address?.publicKey,
      privateKey: encryptedPrivateKey,
      index:
        chain === "ethereum" || chain === "polygon"
          ? ethereumIdx
          : chain === "bitcoin"
          ? bitcoinIdx
          : chain === "bsc"
          ? bscIdx
          : tronIdx,
      type: keytype,
      chain,
      walletId: wallet.id,
      encryption: randomSecretNumber,
    });

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      data: {
        address: address?.address,
        type: keytype,
        chain,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error",
    });
  }
};
