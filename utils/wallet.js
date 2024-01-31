const bip39 = require("bip39");
const bcrypt = require("bcrypt");

exports.generateMnemonicPhrase = () => {
  return bip39.generateMnemonic();
};

exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(20);
  const securePassword = await bcrypt.hash(password, salt);

  return securePassword;
};

exports.createRandomAccount = async (mnemonic, tronWeb) => {
  const path = "m/44'/195'/0'/0/1";
  const data = tronWeb.fromMnemonic(mnemonic, path);

  return {
    address: data.address,
    privateKey: data.privateKey,
    publicKey: data.publicKey,
  };
};

exports.getTransactionHistory = async (address) => {
  const normalData = await axios.get(
    `https://nile.trongrid.io/v1/accounts/${address}/transactions`
  );
  const trc20Data = await axios.get(
    `https://nile.trongrid.io/v1/accounts/${address}/transactions/trc20?limit=100&contract_address=TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj`
  ); // Only USDT

  let normalTxData = [];

  for (let i = 0; i < normalData["data"].length; i++) {
    normalTxData.push({
        ...normalData["data"][i],
        value: normalData["data"][i]["raw_data"]["contract"][0][
            "parameter"
          ]
    })
  }
  return {
    normalTxData,
    trc20TxData: trc20Data
  }
};

exports.getTotalBalance = async (address, tronWeb) => {
    const response = await tronWeb.trx.getBalance(address);
    return (tronWeb.BigNumber(response)).toNumber();
}