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
const Author = sequelize.define(
  'Author',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    author_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    affiliation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
    },
    author_role: {
      type: DataTypes.STRING(1),
      defaultValue: 'A',
    },

    checked_in: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    type: {
      type: DataTypes.STRING,
    },
    position: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'authors',
    timestamps: false, // disable createdAt and updatedAt fields
  },
);

sequelize
  .sync()
  .then(() => {
    console.log('Author table created successfully!');
  })
  .catch((error) => {
    console.error('Unable to create table : ', error);
  });

module.exports = Author;
