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
const Account = sequelize.define(
  'Author',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    a_username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    a_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    a_role: {
      type: DataTypes.STRING(1),
      defaultValue: 'A',
    },
  },
  {
    tableName: 'accounts',
    timestamps: false, // disable createdAt and updatedAt fields
  },
);

sequelize
  .sync()
  .then(() => {
    console.log('Account table created successfully!');
  })
  .catch((error) => {
    console.error('Unable to create table : ', error);
  });

module.exports = Account;
