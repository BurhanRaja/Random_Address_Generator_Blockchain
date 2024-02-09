const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { wallet } = require("../db/db");
const { secretJwtKey } = require("../config/config");

const Wallet = wallet;

module.exports = async (req, res) => {
  let success = false;
  try {
    const { crmname, password } = req.body;

    const wallet = await Wallet.findOne({
      where: {
        crmname,
      },
    });

    if (!wallet) {
      return res.status(404).send({
        status: 404,
        success,
        message: "Wallet not found",
      });
    }

    let checkPassword = await bcrypt.compare(password, wallet?.password);

    if (!checkPassword) {
      return res.status(400).send({
        status: 400,
        success,
        message: "Invalid Password.",
      });
    }

    const data = {
      id: wallet.id,
      crmname: wallet.crmname,
    };

    const token = jwt.sign(data, secretJwtKey);

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      data: {
        token,
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
