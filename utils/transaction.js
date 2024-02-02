const {
  etherScanApiKey,
  polygonScanApiKey,
  bscScanApiKey,

  etherTestApiUrl,
  polygonTestApiUrl,
  bscTestApiUrl,
  tronTestApiUrl,

  bitcoinMainApiUrl,
  etherMainApiUrl,
  polygonMainApiUrl,
  bscMainApiUrl,
  tronMainApiUrl,
} = require("../config/config");
const axios = require("axios");

// Get All the Transactions from TestNet
exports.getTestTransactions = async (
  type,
  chain,
  address,
  page,
  offset,
  contractAddress
) => {
  let transactions = [];
  if (chain === "ethereum") {
    if (type === "coin") {
      const responseNormal = await axios.get(
        `${etherTestApiUrl}?module=account&action=txlist&address=${address}&page=${page}&offset=${offset}&sort=asc&apikey=${etherScanApiKey}`
      );
      if (
        responseNormal?.data?.status === "1" &&
        responseNormal?.data?.message === "OK"
      ) {
        transactions = responseNormal?.data?.result;
      }
    }
    if (type === "token") {
      const responseToken = await axios.get(
        `${etherTestApiUrl}?module=account&action=tokentx&contractaddress=${contractAddress}&address=${address}&page=${page}&offset=${offset}&sort=asc&apikey=${etherScanApiKey}`
      );
      if (
        responseToken?.data?.status === "1" &&
        responseToken?.data?.message === "OK"
      ) {
        transactions = responseToken?.data?.result;
      }
    }
  }

  if (chain === "polygon") {
    if (type === "coin") {
      const responseNormal = await axios.get(
        `${polygonTestApiUrl}?module=account&action=txlist&address=${address}&page=${page}&offset=${offset}&sort=asc&apikey=${polygonScanApiKey}`
      );
      if (
        responseNormal?.data?.status === "1" &&
        responseNormal?.data?.message === "OK"
      ) {
        transactions = responseNormal?.data?.result;
      }
    }
    if (type === "token") {
      const responseToken = await axios.get(
        `${polygonTestApiUrl}?module=account&action=tokentx&contractaddress=${contractAddress}&address=${address}&page=${page}&offset=${offset}&sort=asc&apikey=${polygonScanApiKey}`
      );
      if (
        responseToken?.data?.status === "1" &&
        responseToken?.data?.message === "OK"
      ) {
        transactions = responseToken?.data?.result;
      }
    }
  }
  if (chain === "bitcoin") {
    const responseNormal = await axios.get(
      `${bitcoinMainApiUrl}/address/${address}`
    );
    if (responseNormal?.data) {
      transactions = responseNormal?.data?.result;
    }
  }
  if (chain === "bsc") {
    if (type === "coin") {
      const responseNormal = await axios.get(
        `${bscTestApiUrl}?module=account&action=txlist&address=${address}&page=${page}&offset=${offset}&sort=asc&apikey=${bscScanApiKey}`
      );
      if (
        responseNormal?.data?.status === "1" &&
        responseNormal?.data?.message === "OK"
      ) {
        transactions = responseNormal?.data?.result;
      }
    }
    if (type === "token") {
      const responseToken = await axios.get(
        `${bscTestApiUrl}?module=account&action=tokentx&contractaddress=${contractAddress}&address=${address}&page=${page}&offset=${offset}&sort=asc&apikey=${bscScanApiKey}`
      );
      if (
        responseToken?.data?.status === "1" &&
        responseToken?.data?.message === "OK"
      ) {
        transactions = responseToken?.data?.result;
      }
    }
  }
  if (chain === "tron") {
    if (type === "coin") {
      const responseNormal = await axios.get(
        `${tronTestApiUrl}/v1/accounts/${address}/transactions`
      );
      if (responseNormal?.data?.success === true) {
        for (const transaction of responseNormal?.data["data"]) {
          transactions.push({
            ...transaction,
            value: transaction["raw_data"]["contract"][0]["parameter"],
          });
        }
      }
    }
    if (type === "token") {
      const responseToken = await axios.get(
        `${tronTestApiUrl}/v1/accounts/${address}/transactions/trc20?limit=${offset}&contract_address=${contractAddress}`
      );
      if (responseToken?.data?.success === true) {
        transactions = responseToken?.data?.data;
      }
    }
  }
  return transactions;
};

// Get All Transactions from Mainnet
exports.getMainTransactions = async (
  type,
  chain,
  address,
  contractAddress,
  page,
  offset
) => {
  let transactions = [];

  if (chain === "ethereum") {
    if (type === "coin") {
      const responseNormal = await axios.get(
        `${etherMainApiUrl}?module=account&action=txlist&address=${address}&page=${page}&offset=${offset}&sort=asc&apikey=${etherScanApiKey}`
      );
      if (
        responseNormal?.data?.status === "1" &&
        responseNormal?.data?.message === "OK"
      ) {
        transactions = responseNormal?.data?.result;
      }
    }
    if (type === "token") {
      const responseToken = await axios.get(
        `${etherMainApiUrl}?module=account&action=tokentx&contractaddress=${contractAddress}&address=${address}&page=${page}&offset=${offset}&sort=asc&apikey=${etherScanApiKey}`
      );
      if (
        responseToken?.data?.status === "1" &&
        responseToken?.data?.message === "OK"
      ) {
        transactions = responseToken?.data?.result;
      }
    }
  }
  if (chain === "polygon") {
    if (type === "coin") {
      const responseNormal = await axios.get(
        `${polygonMainApiUrl}?module=account&action=txlist&address=${address}&page=${page}&offset=${offset}&sort=asc&apikey=${polygonScanApiKey}`
      );
      if (
        responseNormal?.data?.status === "1" &&
        responseNormal?.data?.message === "OK"
      ) {
        transactions = responseNormal?.data?.result;
      }
    }
    if (type === "token") {
      const responseToken = await axios.get(
        `${polygonMainApiUrl}?module=account&action=tokentx&contractaddress=${contractAddress}&address=${address}&page=${page}&offset=${offset}&sort=asc&apikey=${polygonScanApiKey}`
      );
      if (
        responseToken?.data?.status === "1" &&
        responseToken?.data?.message === "OK"
      ) {
        transactions = responseToken?.data?.result;
      }
    }
  }

  if (chain === "bitcoin") {
    const responseNormal = await axios.get(
      `${bitcoinMainApiUrl}/address/${address}`
    );
    if (responseNormal?.data["txHistory"]) {
      for (const tx of responseNormal?.data["txHistory"]["txids"]) {
        const response = await axios.get(`${bitcoinMainApiUrl}//tx/${address}`);
        transactions.push(response);
      }
    }
  }
  if (chain === "bsc") {
    if (type === "coin") {
      const responseNormal = await axios.get(
        `${bscMainApiUrl}?module=account&action=txlist&address=${address}&page=${page}&offset=${offset}&sort=asc&apikey=${bscScanApiKey}`
      );
      if (
        responseNormal?.data?.status === "1" &&
        responseNormal?.data?.message === "OK"
      ) {
        transactions = responseNormal?.data?.result;
      }
    }
    if (type === "token") {
      const responseToken = await axios.get(
        `${bscMainApiUrl}?module=account&action=tokentx&contractaddress=${contractAddress}&address=${address}&page=${page}&offset=${offset}&sort=asc&apikey=${bscScanApiKey}`
      );
      if (
        responseToken?.data?.status === "1" &&
        responseToken?.data?.message === "OK"
      ) {
        transactions = responseToken?.data?.result;
      }
    }
  }
  if (chain === "tron") {
    if (type === "coin") {
      const responseNormal = await axios.get(
        `${tronMainApiUrl}/v1/accounts/${address}/transactions`
      );
      if (responseNormal?.data?.success === true) {
        for (const transaction of responseNormal?.data["data"]) {
          transactions.push({
            ...transaction,
            value: transaction["raw_data"]["contract"][0]["parameter"],
          });
        }
      }
    }
    if (type === "token") {
      const responseToken = await axios.get(
        `${tronMainApiUrl}/v1/accounts/${address}/transactions/trc20?limit=${offset}&contract_address=${contractAddress}`
      );
      if (responseToken?.data?.success === true) {
        transactions = responseToken?.data?.data;
      }
    }
  }

  return transactions;
};
