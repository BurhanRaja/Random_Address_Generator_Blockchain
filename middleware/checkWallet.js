const jwt = require("jsonwebtoken");
const { secretJwtKey } = require("../config/config")

exports.checkWallet = async (req, res, next) => {
  let success = false;
  try {
    if (!req.headers.authorization) {
      return res.status(403).send({
        success,
        message: "No Token found.",
      });
    }

    const token = req?.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        status: 401,
        success,
        message: "Please authenticate with valid token",
      });
    }

    const data = jwt.verify(token, secretJwtKey);

    req.wallet = data;
    next();
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
};
