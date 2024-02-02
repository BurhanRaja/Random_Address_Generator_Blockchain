const bip39 = require("bip39");
const bcrypt = require("bcrypt");

exports.generateMnemonicPhrase = () => {
  return bip39.generateMnemonic();
};

exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const securePassword = await bcrypt.hash(password, salt);

  return securePassword;
};
