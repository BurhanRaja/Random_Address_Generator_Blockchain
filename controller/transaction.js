const {
  polygonMainContractAddress,
  tronMainContractAddress,
  bscMainContractAddress,
  ethereumTestContractAddress,
  polygonTestContractAddress,
  bscTestContractAddress,
  tronTestContractAddress,
  ethereumMainContractAddress,
} = require("../config/config");
const { getTestTransactions, getMainTransactions } = require("../utils/transaction");

exports.getTestTransactionHistory = async (req, res) => {
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
};


exports.getMainTransactionHistory = async (req, res) => {
    let success = false;
    try {
      const { type, chain, address, page, offset } = req.query;
  
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
  
      const transactions = await getMainTransactions(
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
  };
  