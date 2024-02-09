const { hashPassword } = require("../utils/wallet");
const { encryptAES } = require("../utils/aes");
const { secretKeys } = require("../config/config");
const { wallet } = require("../db/db");
const { v4: uuid } = require("uuid");
const { generateMnemonicPhrase } = require("../utils/wallet")

const Wallet = wallet;

module.exports = async (req, res) => {
  let success = false;
  try {
    const { crmname, password } = req.body;

    let checkWalletForCrmName = await Wallet.findOne({
      where: {
        crmname,
      },
    });

    if (checkWalletForCrmName) {
      return res.status(400).send({
        status: 400,
        success,
        message: "Wallet with this name already exists.",
      });
    }

    const securePassword = await hashPassword(password);

    const seedPhrase = generateMnemonicPhrase();

    if (!seedPhrase) {
      return res.status(400).send({
        status: 400,
        success,
        message: "Some Error Occurred. Please Try Again.",
      });
    }

    const randomSecretNumber = Math.floor(Math.random() * 3);
    const secretKey = secretKeys[randomSecretNumber];

    const encryptedSeed = await encryptAES(
      seedPhrase,
      Uint8Array.from(secretKey.split(",").map((e) => parseInt(e, 10)))
    );

    const wallet = await Wallet.create({
      id: uuid(),
      seedphrase: encryptedSeed,
      crmname,
      password: securePassword,
      ethereumIdx: 0,
      tronIdx: 0,
      bitcoinIdx: 0,
      bscIdx: 0,
      encryption: randomSecretNumber,
    });

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
};
