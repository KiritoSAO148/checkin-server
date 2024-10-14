const { DataTypes, Sequelize } = require('sequelize');
// const { sequelize } = require('../server.js'); // Import the sequelize instance

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
  },
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database: ', error);
  });

// Define the author model
const Invoice = sequelize.define(
  'Invoice',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
  },
  {
    tableName: 'invoices',
    timestamps: false, // disable createdAt and updatedAt fields
  },
);

sequelize
  .sync()
  .then(() => {
    console.log('Invoice table created successfully!');
  })
  .catch((error) => {
    console.error('Unable to create table : ', error);
  });

module.exports = Invoice;
