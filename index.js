const { ec } = require("elliptic");
// const bitcoin = require("bitcoinjs-lib");
const { ethers } = require("ethers");

// const provider = ethers.getDefaultProvider("sepolia", {
//   alchemy:
//     "https://eth-sepolia.g.alchemy.com/v2/3Jc9y27ItSrtghfNAYacuMy3TbtokDm2",
// });

// // Function to generate a Bitcoin address from a public key
// function generateBitcoinAddress(publicKey) {
//   // Create a new Bitcoin address using the public key
//   const { address } = bitcoin.payments.p2pkh({
//     pubkey: Buffer.from(publicKey, "hex"),
//   });

//   return address;
// }

// function createEthereumAddress(publicKey) {
//   const address = ethers.computeAddress(publicKey);
//   return address;
// }

// async function getAddressBalance() {
//   let balance = await provider.getBalance(
//     "0xBafA68696F7f8c4D05D50FAE9A5132F65Ce414Ee"
//   );
//   return ethers.formatEther(balance);
// }

const curve = new ec("secp256k1");

// const keyPair = curve.genKeyPair();
// const publicKey = keyPair.getPublic("hex");
// const privateKey = keyPair.getPrivate("hex");

// console.log({ publicKey, privateKey });
// console.log(generateBitcoinAddress(publicKey));
// console.log(createEthereumAddress("0x" + publicKey));

// getAddressBalance().then((data) => console.log(data));

function generateSeed() {
  const wallet = ethers.Wallet.createRandom();
  const mnemonic = wallet.mnemonic.phrase;
  return mnemonic;
}

function derivePrivateKey(seed) {
  // Use the sha256 hash of the seed as a more secure method (this is just an example)
  const hash = curve(seed);
  return hash;
}

// Function to derive a public key from the private key
function derivePublicKey(privateKey) {
  // Derive the public key from the private key
  const key = ec.keyFromPrivate(privateKey);
  const publicKey = key.getPublic("hex");
  return publicKey;
}

const seed = generateSeed();
console.log('Seed:', seed);

const privateKey = derivePrivateKey(seed);
console.log('Private Key:', privateKey);

const publicKey = derivePublicKey(privateKey);
console.log('Public Key:', publicKey);