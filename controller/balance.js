const {
  polygonMainContractAddress,
  tronMainContractAddress,
  bscMainContractAddress,
  ethereumTestContractAddress,
  polygonTestContractAddress,
  bscTestContractAddress,
  tronTestContractAddress,
  ethereumMainContractAddress,
  tronMainApiUrl,
  tronTestApiUrl,
} = require("../config/config");
const TronWeb = require("tronweb");
const { getTestBalance, getMainBalance } = require("../utils/balance");
const { address } = require("../db/db");

const Address = address;

exports.getTestBalanceFromAddress = async (req, res) => {
  let success = false;
  try {
    const { type, chain, address } = req.query;

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

    const HttpProvider = TronWeb.providers.HttpProvider;
    const fullNode = new HttpProvider(tronTestApiUrl);
    const solidityNode = new HttpProvider(tronTestApiUrl);
    const eventServer = tronTestApiUrl;
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);

    const balance = await getTestBalance(
      type,
      chain,
      address,
      contractAddress,
      tronWeb
    );

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      data: {
        balance,
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

exports.getMainBalanceFromAddress = async (req, res) => {
  let success = false;
  try {
    const { type, chain, address } = req.query;

    const addressCheck = await Address.findOne({
      where: {
        address,
        walletId: req.wallet.id,
      },
    });

    if (!addressCheck) {
      return res.status(400).send({
        status: 400,
        success,
        message: "Address not found in Wallet.",
      });
    }

    let contractAddress = "";

    if (type === "token") {
      contractAddress =
        chain === "ethereum"
          ? ethereumMainContractAddress
          : chain === "polygon"
          ? polygonMainContractAddress
          : chain === "bsc"
          ? bscMainContractAddress
          : chain === "tron"
          ? tronMainContractAddress
          : "";
    }

    const HttpProvider = TronWeb.providers.HttpProvider;
    const fullNode = new HttpProvider(tronMainApiUrl);
    const solidityNode = new HttpProvider(tronMainApiUrl);
    const eventServer = tronMainApiUrl;
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);

    const balance = await getMainBalance(type, chain, address, contractAddress, tronWeb);

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
};
