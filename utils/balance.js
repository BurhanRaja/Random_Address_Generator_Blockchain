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

// Get TestNet Address Balance 
exports.getTestBalance = async (
  type,
  chain,
  address,
  contractAddress,
  tronWeb
) => {
  let balance = 0;

  switch (chain) {
    case chain === "ethereum":
      if (type === "coin") {
        const responseNormal = await axios.get(
          `${etherTestApiUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${etherScanApiKey}`
        );
        if (
          responseNormal?.data?.status === "1" &&
          responseNormal?.data?.message === "OK"
        ) {
          balance = responseNormal?.data?.result;
        }
      }
      if (type === "token") {
        const responseToken = await axios.get(
          `${etherTestApiUrl}?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}&tag=latest&apikey=${etherScanApiKey}`
        );
        if (
          responseToken?.data?.status === "1" &&
          responseToken?.data?.message === "OK"
        ) {
          balance = responseNormal?.data?.result;
        }
      }
      break;
    case chain === "polygon":
      if (type === "coin") {
        const responseNormal = await axios.get(
          `${polygonTestApiUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${polygonScanApiKey}`
        );
        if (
          responseNormal?.data?.status === "1" &&
          responseNormal?.data?.message === "OK"
        ) {
          balance = responseNormal?.data?.result;
        }
      }
      if (type === "token") {
        const responseToken = await axios.get(
          `${polygonTestApiUrl}?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}&tag=latest&apikey=${polygonScanApiKey}`
        );
        if (
          responseToken?.data?.status === "1" &&
          responseToken?.data?.message === "OK"
        ) {
          balance = responseNormal?.data?.result;
        }
      }
      break;
    case chain === "bsc":
      if (type === "coin") {
        const responseNormal = await axios.get(
          `${bscTestApiUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${bscScanApiKey}`
        );
        if (
          responseNormal?.data?.status === "1" &&
          responseNormal?.data?.message === "OK"
        ) {
          balance = responseNormal?.data?.result;
        }
      }
      if (type === "token") {
        const responseToken = await axios.get(
          `${bscTestApiUrl}?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}&tag=latest&apikey=${bscScanApiKey}`
        );
        if (
          responseToken?.data?.status === "1" &&
          responseToken?.data?.message === "OK"
        ) {
          balance = responseNormal?.data?.result;
        }
      }
      break;
    case chain === "bitcoin":
      const responseNormal = await axios.get(
        `${bitcoinMainApiUrl}/address/${address}`
      );
      if (responseNormal?.data["balanceSat"]) {
            balance = responseNormal?.data["balanceSat"]
      }
      break;
    case chain === "tron":
        if (type === "coin") {
            const response = await tronWeb.trx.getBalance(address);
            const bigNum = tronWeb.BigNumber(response)
            balance = bigNum.toNumber();
        }
        if (type === "token") {
            tronWeb.setAddress(contractAddress);
            const contract = await tronWeb.contract().at(contractAddress);
            const balance = await contract.balanceOf(address).call();      
        }
        break;
    default:
      break;
  }

  return balance;
};

// Get MainNet Address Balance 
exports.getMainBalance = async (
    type,
    chain,
    address,
    contractAddress,
    tronWeb
  ) => {
    let balance = 0;
  
    switch (chain) {
      case chain === "ethereum":
        if (type === "coin") {
          const responseNormal = await axios.get(
            `${etherMainApiUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${etherScanApiKey}`
          );
          if (
            responseNormal?.data?.status === "1" &&
            responseNormal?.data?.message === "OK"
          ) {
            balance = responseNormal?.data?.result;
          }
        }
        if (type === "token") {
          const responseToken = await axios.get(
            `${etherMainApiUrl}?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}&tag=latest&apikey=${etherScanApiKey}`
          );
          if (
            responseToken?.data?.status === "1" &&
            responseToken?.data?.message === "OK"
          ) {
            balance = responseNormal?.data?.result;
          }
        }
        break;
      case chain === "polygon":
        if (type === "coin") {
          const responseNormal = await axios.get(
            `${polygonMainApiUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${polygonScanApiKey}`
          );
          if (
            responseNormal?.data?.status === "1" &&
            responseNormal?.data?.message === "OK"
          ) {
            balance = responseNormal?.data?.result;
          }
        }
        if (type === "token") {
          const responseToken = await axios.get(
            `${polygonMainApiUrl}?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}&tag=latest&apikey=${polygonScanApiKey}`
          );
          if (
            responseToken?.data?.status === "1" &&
            responseToken?.data?.message === "OK"
          ) {
            balance = responseNormal?.data?.result;
          }
        }
        break;
      case chain === "bsc":
        if (type === "coin") {
          const responseNormal = await axios.get(
            `${bscMainApiUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${bscScanApiKey}`
          );
          if (
            responseNormal?.data?.status === "1" &&
            responseNormal?.data?.message === "OK"
          ) {
            balance = responseNormal?.data?.result;
          }
        }
        if (type === "token") {
          const responseToken = await axios.get(
            `${bscMainApiUrl}?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}&tag=latest&apikey=${bscScanApiKey}`
          );
          if (
            responseToken?.data?.status === "1" &&
            responseToken?.data?.message === "OK"
          ) {
            balance = responseNormal?.data?.result;
          }
        }
        break;
      case chain === "bitcoin":
        const responseNormal = await axios.get(
          `${bitcoinMainApiUrl}/address/${address}`
        );
        if (responseNormal?.data["balanceSat"]) {
              balance = responseNormal?.data["balanceSat"]
        }
        break;
      case chain === "tron":
          if (type === "coin") {
              const response = await tronWeb.trx.getBalance(address);
              const bigNum = tronWeb.BigNumber(response)
              balance = bigNum.toNumber();
          }
          if (type === "token") {
              tronWeb.setAddress(contractAddress);
              const contract = await tronWeb.contract().at(contractAddress);
              const balance = await contract.balanceOf(address).call();      
          }
          break;
      default:
        break;
    }
  
    return balance;
  };
  

// base58:{
//     hash:"22c17a06117b40516f9826804800003562e834c9",
//     version: 5
//     },
//     encoding:"base58",
//     validateaddress:{
//         isvalid: true,
//         address:"34rng4QwB5pHUbGDJw1JxjLwgEU8TQuEqv",
//         scriptPubKey:"a91422c17a06117b40516f9826804800003562e834c987",
//         isscript:true,
//         iswitness:false
//     },
//     electrumScripthash:"124dbe6cf2394aa0e566d9b1df021343b563c694283038940e42ac9b24a50fcc",
//     txHistory: {
//         txCount:2,
//         txids:["5cf995061aeb00d36dd45b78514bdd4e091c299a0b1c10f030e4f56c200e3b1a","8f907925d2ebe48765103e6845c06f1f2bb77c6adc1cc002865865eb5cfd5c1c"],
//         blockHeightsByTxid:{
//             "5cf995061aeb00d36dd45b78514bdd4e091c299a0b1c10f030e4f56c200e3b1a":481830,"8f907925d2ebe48765103e6845c06f1f2bb77c6adc1cc002865865eb5cfd5c1c":481824
//     },
//         "balanceSat":759000,
//         "request":{"limit":10,"offset":0,"sort":"desc"}
//     }

