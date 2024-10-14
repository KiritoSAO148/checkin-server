const { DataTypes, Sequelize } = require('sequelize');
// const sequelize = require('../server.js'); // Import the sequelize instance

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

// Define the paper model
const Paper = sequelize.define(
  'Paper',
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    track_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    track_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    published_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    num_of_registers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    paper_status: {
      type: DataTypes.ENUM('0', '1'),
      allowNull: false,
    },
  },
  {
    tableName: 'papers',
    timestamps: false,
  },
);

sequelize
  .sync()
  .then(() => {
    console.log('Paper table created successfully!');
  })
  .catch((error) => {
    console.error('Unable to create table : ', error);
  });

module.exports = Paper;
