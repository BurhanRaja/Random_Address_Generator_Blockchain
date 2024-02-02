const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  // DB
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbPort: process.env.DB_PORT,
  dialect: "mysql"
};
