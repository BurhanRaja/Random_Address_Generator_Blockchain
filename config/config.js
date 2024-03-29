require("dotenv").config();

module.exports = {
    etherScanApiKey: process.env.ETHERSCAN_API_KEY,
    polygonScanApiKey: process.env.POLYGON_API_KEY,
    bscScanApiKey: process.env.BSC_API_KEY,

    etherMainApiUrl: process.env.ETHERSCAN_MAINNET_API_URL,
    polygonMainApiUrl: process.env.POLYGON_MAINNET_API_URL,
    bscMainApiUrl: process.env.BSC_MAINNET_API_URL,
    tronMainApiUrl: process.env.TRON_MAINNET_API_URL,
    bitcoinMainApiUrl: process.env.BITCOIN_API_URL,

    etherTestApiUrl: process.env.ETHERSCAN_TESTNET_API_URL,
    polygonTestApiUrl: process.env.POLYGON_TESTNET_API_URL,
    bscTestApiUrl: process.env.BSC_TESTNET_API_URL,
    tronTestApiUrl: process.env.TRON_TESTNET_API_URL,

    ethereumTestTransactionUrl: process.env.ETHEREUM_TRANSACTION_TESTNET_RPC_URL,
    polygonTestTransactionUrl: process.env.POLYGON_TRANSACTION_TESTNET_RPC_URL,
    bscTestTransactionUrl: process.env.BSC_TRANSACTION_TESTNET_RPC_URL,

    ethereumMainTransactionUrl: process.env.ETHEREUM_TRANSACTION_MAINNET_RPC_URL,
    polygonMainTransactionUrl: process.env.POLYGON_TRANSACTION_MAINNET_RPC_URL,
    bscMainTransactionUrl: process.env.BSC_TRANSACTION_MAINNET_RPC_URL,

    ethereumTestContractAddress: process.env.ETHEREUM_TESTNET_USDT_CONTRACT_ADDRESS,
    polygonTestContractAddress: process.env.POLYGON_TESTNET_USDT_CONTRACT_ADDRESS,
    bscTestContractAddress: process.env.BSC_TESTNET_USDT_CONTRACT_ADDRESS,
    tronTestContractAddress: process.env.TRON_TESTNET_USDT_CONTRACT_ADDRESS,

    ethereumMainContractAddress: process.env.ETHEREUM_MAINNET_USDT_CONTRACT_ADDRESS,
    polygonMainContractAddress: process.env.POLYGON_MAINNET_USDT_CONTRACT_ADDRESS,
    bscMainContractAddress: process.env.BSC_MAINNET_USDT_CONTRACT_ADDRESS,
    tronMainContractAddress: process.env.TRON_MAINNET_USDT_CONTRACT_ADDRESS,

    secretKeyOne: process.env.SECRET_ENCRYPTION_KEY_1,
    secretKeyTwo: process.env.SECRET_ENCRYPTION_KEY_2,
    secretKeyThree: process.env.SECRET_ENCRYPTION_KEY_3,

    secretJwtKey: process.env.SECRET_JWT_KET,

    secretKeys: [process.env.SECRET_ENCRYPTION_KEY_1, process.env.SECRET_ENCRYPTION_KEY_2, process.env.SECRET_ENCRYPTION_KEY_3]
}