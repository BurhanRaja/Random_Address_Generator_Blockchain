const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const Address = sequelize.define("Address", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        address: DataTypes.STRING,
        publicKey: DataTypes.STRING,
        privateKey: DataTypes.TEXT,
        index: DataTypes.INTEGER,
        type: DataTypes.STRING,
        chain: DataTypes.STRING,
        walletId: DataTypes.UUID,
        encryption: DataTypes.INTEGER
    }, {
        timestamps: true
    })
    return Address
}