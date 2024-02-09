const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Deposit = sequelize.define(
    "Deposit",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      addressId: DataTypes.UUID,
      walletId: DataTypes.UUID,
      type: DataTypes.STRING,
      chain: DataTypes.STRING,
      amountDecimal: DataTypes.INTEGER,
      amountBigNumber: DataTypes.BIGINT,
    },
    {
      timestamps: true,
    }
  );
  return Deposit;
};
