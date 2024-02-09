const {
  dbName,
  dialect,
  dbUsername,
  dbPassword,
  dbHost,
  dbPort,
} = require("./db.config");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  dbName, dbUsername, dbPassword, 
  {
    host: dbHost,
    dialect,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log(`Database connected`);
  })
  .catch((err) => {
    console.log(err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.wallet = require("../models/Wallet")(sequelize);
db.address = require("../models/Address")(sequelize);
db.deposit = require("../models/Deposit")(sequelize);
db.withdraw = require("../models/Withdraw")(sequelize);

module.exports = db;