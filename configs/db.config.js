const { Sequelize } = require("sequelize");
const { Connector } = require("@google-cloud/cloud-sql-connector");
const dotenv = require("dotenv");

dotenv.config();
// const cloudSqlSequelize = async () => {
//   const connector = new Connector();
//   const clientOpts = await connector.getOptions({
//     instanceConnectionName: process.env.DB_CONNECTION_NAME,
//     ipType: 'PRIVATE',
//   });

//   // Create a Sequelize instance using the connection options from the Cloud SQL Connector
//   const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
//     host: clientOpts.host,
//     dialect: 'postgres',
//     logging: false,
//     pool: {
//       max: 10,
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//     },
//   });

//   return sequelize;
// };

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: 5432,
    dialect: "postgres",
    logging: false,
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
