const axios = require("axios");
const { bitcoin } = require("bitcoinjs-lib");
var secp = require("tiny-secp256k1");
const { ECPairFactory } = require("ecpair");

// const createBTCTx = async (toAddress, value, url, fromAddress) => {
//   try {
//     const valueSatoshi = value * 100000000;
//     let data = JSON.stringify({
//       inputs: [
//         {
//           addresses: [`${fromAddress}`],
//         },
//       ],
//       outputs: [
//         {
//           addresses: [`${toAddress}`],
//           value: valueSatoshi,
//         },
//       ],
//     });

//     let config = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: "https://api.blockcypher.com/v1/bcy/test/txs/new",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       data,
//     };

//     const response = await axios.request(config);

//     if (response.status !== 201) {
//       return {
//         code: 0,
//         message: response.data.error,
//       };
//     }

//     return response.data;
//   } catch (err) {
//     return err;
//   }
// };

// const generateSignatures = (privateKey, env, toSign, ecc) => {
//   try {
//     const ECPair = ECPairFactory(ecc);

//     let keys = ECPair.fromPrivateKey(
//       Buffer.from(privateKey, "hex"),
//       bitcoin.networks.testnet
//     );

//     const signatures = [];
//     const pubkeys = [];

//     for (let i = 0; i < toSign.length; i++) {
//       signatures.push(
//         bitcoin.script.signature
//           .encode(keys.sign(Buffer.from(toSign[i], "hex")), 0x01)
//           .toString("hex")
//           .slice(0, -2)
//       );
//       pubkeys.push(keys.publicKey.toString("hex"));
//     }

//     return {
//       signatures,
//       pubkeys,
//     };
//   } catch (err) {
//     return err;
//   }
// };

// const sendBTCTx = async (tx, toSign, signatures, pubkeys, url, env) => {
//   try {
//     const sendTx = {
//       tx,
//       signatures,
//       pubkeys,
//       tosign: toSign,
//     };

//     const response = await axios.request({
//       url: "https://api.blockcypher.com/v1/bcy/test/txs/send?token=394253417eb64dab8ee3c070c8d722aa",
//       method: "post",
//       data: sendTx,
//     });

//     if (response.status !== 201) {
//       return response?.data.error;
//     }

//     return response?.data;
//   } catch (err) {
//     return err;
//   }
// };

const newBitcoinTx = async (toAddress, fromAddress, amount, privateKey) => {
  const eCPair = ECPairFactory(secp);
  const keys = eCPair.fromPrivateKey(privateKey);

  const valueSatoshi = amount * 100000000;

  const newTx = {
    inputs: [
      {
        addresses: [`${fromAddress}`],
      },
    ],
    outputs: [
      {
        addresses: [`${toAddress}`],
        value: valueSatoshi,
      },
    ],
  };

  const response = axios.post(
    "https://api.blockcypher.com/v1/bcy/test/txs/new?token=394253417eb64dab8ee3c070c8d722aa",
    {
      data: JSON.stringify(newTx),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (response?.status === 201) {
    const tmpTx = response.data;
    tmpTx.pubkeys = [];
    tmpTx.signatures = tmpTx.tosign.map(function (toSign, n) {
      tmpTx.pubkeys.push(keys.publicKey.toString("hex"));
      return bitcoin.script.signature
        .encode(keys.sign(Buffer.from(toSign, "hex")), 0x01)
        .toString("hex")
        .slice(0, -2);
    });

    const res = await axios.post('https://api.blockcypher.com/v1/bcy/test/txs/send?token=394253417eb64dab8ee3c070c8d722aa', JSON.stringify(tmpTx))
    if (res.status === 201) {
        return res.data;
    }
  }
};
