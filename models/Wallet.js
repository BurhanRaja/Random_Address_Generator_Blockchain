const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Wallet = sequelize.define(
    "Wallet",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      seedphrase: DataTypes.TEXT,
      crmname: DataTypes.STRING,
      password: DataTypes.STRING,
      ethereumIdx: DataTypes.INTEGER,
      tronIdx: DataTypes.INTEGER,
      bitcoinIdx: DataTypes.INTEGER,
      bscIdx: DataTypes.INTEGER,
      encryption: DataTypes.INTEGER,
    },
    {
      timestamps: true,
    }
  );

  return Wallet;
};
