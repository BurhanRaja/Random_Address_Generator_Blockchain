const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Withdraw = sequelize.define(
    "Withdraw",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      from: DataTypes.STRING,
      to: DataTypes.STRING,
      trxhash: DataTypes.STRING,
      amountDecimal: DataTypes.STRING,
      amountBigNumber: DataTypes.BIGINT,
      type: DataTypes.STRING,
      chain: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      timestamp: true,
    }
  );
  return Withdraw;
};
