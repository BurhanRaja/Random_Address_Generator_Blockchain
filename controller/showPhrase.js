const { wallet } = require("../db/db");
const bcrypt = require("bcrypt");
const { secretKeys } = require("../config/config");
const { decryptAES } = require("../utils/aes");

const Wallet = wallet;

module.exports = async (req, res) => {
  let success = false;
  try {
    const { password } = req.body;

    let wallet = await Wallet.findOne({
      where: {
        id: req.wallet.id,
      },
    });

    const checkPassword = await bcrypt.compare(password, wallet.password);

    if (!checkPassword) {
      return res.status(400).send({
        status: 200,
        success,
        message: "Invalid Password",
      });
    }

    const seedPhrase = await decryptAES(
      wallet.seedphrase,
      Uint8Array.from(secretKeys[wallet.encryption].split(",").map((e) => parseInt(e, 10)))
    );

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      data: {
        seedPhrase: seedPhrase,
      },
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
};
