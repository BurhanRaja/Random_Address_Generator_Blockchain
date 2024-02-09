// const { address } = require("../db/db");
const { Web3 } = require("web3");
const path = require("path");
const fs = require("fs");
const Tx = require("ethereumjs-tx").Transaction;
const TronWeb = require("tronweb");

exports.withdrawEthCoin = async (
  url,
  toAddress,
  fromAddress,
  amount,
  privateKey
) => {
  const provider = new Web3.providers.HttpProvider(url);
  const web3 = new Web3(provider);
  const gasPrice = await web3.eth.getGasPrice(); // on going gas price
  const amountWei = web3.utils.toWei(amount, "ether");
  const nonce = await web3.eth.getTransactionCount(fromAddress, "latest");

  // privateKey = web3.utils.toHex(privateKey);

  // Create Transaction Obj
  const txObj = {
    from: fromAddress,
    to: toAddress,
    value: amountWei,
    gasLimit: 21000,
    gasPrice: gasPrice,
    nonce: nonce,
  };

  const signedTransaction = await web3.eth.accounts.signTransaction(
    txObj,
    privateKey
  );

  // Get Transaction Reciept
  let receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

  return receipt;
};

(async () => {
  // let reciept = await with 
})();

exports.withdrawEthToken = async (
  url,
  type,
  chain,
  toAddress,
  fromAddress,
  amount,
  contractAddress,
  privateKey
) => {
  const provider = new Web3.providers.HttpProvider(url);
  const web3 = new Web3(provider);

  let fileData = "";

  if (chain === "ethereum") {
    if (type === "test") {
      const file = fs.readFileSync(
        path.join(
          __dirname + "../../" + "abis/test/ethereumTestTetherUsdAbi.json"
        )
      );
      fileData = JSON.parse(file);
    } else {
      const file = fs.readFileSync(
        path.join(__dirname + "../../" + "abis/ethereumTetherUsdAbi.json")
      );
      fileData = JSON.parse(file);
    }
  }
  if (chain === "polygon") {
    if (type === "test") {
      const file = fs.readFileSync(
        path.join(
          __dirname + "../../" + "abis/test/polygonTestTetherUsdAbi.json"
        )
      );
      fileData = JSON.parse(file);
    } else {
      const file = fs.readFileSync(
        path.join(__dirname + "../../" + "abis/polygonTetherUsdAbi.json")
      );
      fileData = JSON.parse(file);
    }
  }
  if (chain === "bsc") {
    if (type === "test") {
      const file = fs.readFileSync(
        path.join(__dirname + "../../" + "abis/test/bscTestTetherUsdAbi.json")
      );
      fileData = JSON.parse(file);
    } else {
      const file = fs.readFileSync(
        path.join(__dirname + "../../" + "abis/bscTetherUsdAbi.json")
      );
      fileData = JSON.parse(file);
    }
  }

  const tokenContract = new web3.eth.Contract(fileData, contractAddress);
  let tokenDecimals = await tokenContract.methods.decimals().call();
  const gasPrice = await web3.eth.getGasPrice(); // on going gas price
  const nonce = await web3.eth.getTransactionCount(fromAddress, "latest");

  tokenDecimals = parseInt(tokenDecimals);

  const transferAbi = await tokenContract.methods
    .transfer(
      toAddress,
      amount *
        parseInt(10 ** tokenDecimals).toLocaleString("fullwide", {
          useGrouping: false,
        })
    )
    .encodeABI();

  let txObj = {
    from: fromAddress,
    to: contractAddress,
    data: transferAbi,
    gasLimit: 70000, // Adjust the gas limit as needed
    gasPrice,
    nonce,
  };

  const signedTransaction = await web3.eth.accounts.signTransaction(
    txObj,
    privateKey
  );

  // Get Transaction Reciept
  let receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)

  return receipt;
};

exports.withdrawTronToken = async (
  url,
  toAddress,
  fromAddress,
  type,
  amount,
  contractAddress,
  privateKey
) => {
  try {
    if (type === "test") {
      const file = fs.readFileSync(
        path.join(
          __dirname + "../../" + "abis/test/ethereumTestTetherUsdAbi.json"
        )
      );
      fileData = JSON.parse(file);
    } else {
      const file = fs.readFileSync(
        path.join(__dirname + "../../" + "abis/ethereumTetherUsdAbi.json")
      );
      fileData = JSON.parse(file);
    }

    let pKey = privateKey.replace("0x", "");

    const HttpProvider = TronWeb.providers.HttpProvider;
    const fullNode = new HttpProvider(url);
    const solidityNode = new HttpProvider(url);
    const eventServer = new HttpProvider(url);
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, pKey);

    console.log(tronWeb.toSun(1000));
    tronWeb.setAddress(fromAddress);

    let contract = await tronWeb.contract().at(contractAddress);

    let decimal = await contract.decimals().call();

    let result = await contract
      .transferFrom(fromAddress, toAddress, amount * 10 ** decimal)
      .send({
        feeLimit: tronWeb.toSun(1000),
      })
      .then((output) => {
        console.log("- Output:", output, "\n");
      });
    return result;
  } catch (err) {
    console.log(err);
  }
};

// (async () => {
//   let result = await withdrawTronToken(
//     "https://nile.trongrid.io/",
//     "",
//     "",
//     "test",
//     "1",
//     "",
//     ""
//   );
// })();

exports.withdrawBitcoin = async (
  toAddress,
  fromAddress,
  amount,
  privateKey
) => {

  

};
