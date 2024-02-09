const { withdrawEthCoin, withdrawEthToken } = require("../utils/withdraw");
const { address, withdraw } = require("../db/db");
const {
  ethereumMainTransactionUrl,
  ethereumTestTransactionUrl,
  bscMainTransactionUrl,
  bscTestTransactionUrl,
  polygonMainTransactionUrl,
  polygonTestTransactionUrl,
  secretKeys,
} = require("../config/config");
const { decryptAES } = require("../utils/aes");
const Address = address;
const Withdraw = withdraw;

exports.withdrawTestCoin = async (req, res) => {
  let success = false;
  try {
    const { toAddress, fromAddress, amount, type, chain } = req.body;

    let address = await Address.findOne({
      where: {
        address: fromAddress,
        type,
        chain,
      },
    });

    if (!address) {
      return res.status(400).send({
        status: 400,
        success,
        message: "Address does not exist",
      });
    }

    const privateKey = await decryptAES(
      address.privateKey,
      Uint8Array.from(
        secretKeys[address.encryption].split(",").map((el) => parseInt(el, 10))
      )
    );

    if (chain === "ethereum") {
      const trxReciept = await withdrawEthCoin(
        ethereumTestTransactionUrl,
        toAddress,
        fromAddress,
        amount,
        privateKey
      );

      await Withdraw.create({
        from: fromAddress,
        to: toAddress,
        amountDecimal: amount,
        amountBigNumber: amount * 10 ** 18,
        type,
        chain,
        trxhash: trxReciept?.transactionHash,
        status: "test",
      });

      success = true;
      return res.status(200).send({
        status: 200,
        success,
        message: "Withdraw Done successfully",
        data: {
          trxhash: trxReciept?.transactionHash,
        },
      });
    }

    if (chain === "bsc") {
      let trxReciept = await withdrawEthCoin(
        bscTestTransactionUrl,
        toAddress,
        fromAddress,
        amount,
        privateKey
      );

      await Withdraw.create({
        from: fromAddress,
        to: toAddress,
        amountDecimal: amount,
        amountBigNumber: amount * 10 ** 18,
        type,
        chain,
        trxhash: trxReciept?.transactionHash,
        status: "test",
      });

      success = true;
      return res.status(200).send({
        status: 200,
        success,
        message: "Withdraw Done successfully",
        data: {
          trxhash: trxReciept.transactionHash,
        },
      });
    }

    if (chain === "polygon") {
      let trxReciept = await withdrawEthCoin(
        polygonTestTransactionUrl,
        toAddress,
        fromAddress,
        amount,
        privateKey
      );

      await Withdraw.create({
        from: fromAddress,
        to: toAddress,
        amountDecimal: amount,
        amountBigNumber: amount * 10 ** 18,
        type,
        chain,
        trxhash: trxReciept.transactionHash,
        status: "test",
      });

      success = true;
      return res.status(200).send({
        status: 200,
        success,
        message: "Withdraw Done successfully",
        data: {
          trxhash: trxReciept.transactionHash,
        },
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
};

exports.withdrawMainCoin = async (req, res) => {
  let success = false;
  try {
    const { toAddress, fromAddress, amount, type, chain } = req.body;

    let address = await Address.findOne({
      where: {
        address: fromAddress,
        type,
        chain,
      },
    });

    if (!address) {
      return res.status(400).send({
        status: 400,
        success,
        message: "Address does not exist",
      });
    }

    const privateKey = await decryptAES(
      address.privateKey,
      Uint8Array.from(
        secretKeys[address.encryption].split(",").map((el) => parseInt(el, 10))
      )
    );

    if (chain === "ethereum") {
      const trxReciept = await withdrawEthCoin(
        ethereumMainTransactionUrl,
        toAddress,
        fromAddress,
        amount,
        privateKey
      );

      await Withdraw.create({
        from: fromAddress,
        to: toAddress,
        amountDecimal: amount,
        amountBigNumber: amount * 10 ** 18,
        type,
        chain,
        trxhash: trxReciept?.transactionHash,
        status: "main",
      });

      success = true;
      return res.status(200).send({
        status: 200,
        success,
        message: "Withdraw Done successfully",
        data: {
          trxhash: trxReciept?.transactionHash,
        },
      });
    }

    if (chain === "bsc") {
      let trxReciept = await withdrawEthCoin(
        bscMainTransactionUrl,
        toAddress,
        fromAddress,
        amount,
        privateKey
      );

      await Withdraw.create({
        from: fromAddress,
        to: toAddress,
        amountDecimal: amount,
        amountBigNumber: amount * 10 ** 18,
        type,
        chain,
        trxhash: trxReciept?.transactionHash,
        status: "main",
      });

      success = true;
      return res.status(200).send({
        status: 200,
        success,
        message: "Withdraw Done successfully",
        data: {
          trxhash: trxReciept.transactionHash,
        },
      });
    }

    if (chain === "polygon") {
      let trxReciept = await withdrawEthCoin(
        polygonMainTransactionUrl,
        toAddress,
        fromAddress,
        amount,
        privateKey
      );

      await Withdraw.create({
        from: fromAddress,
        to: toAddress,
        amountDecimal: amount,
        amountBigNumber: amount * 10 ** 18,
        type,
        chain,
        trxhash: trxReciept.transactionHash,
        status: "main",
      });

      success = true;
      return res.status(200).send({
        status: 200,
        success,
        message: "Withdraw Done successfully",
        data: {
          trxhash: trxReciept.transactionHash,
        },
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
};
