const { DataTypes, Sequelize } = require('sequelize');
// const sequelize = require('../server.js');
const Author = require('./authorModel.js');
const Paper = require('./paperModel.js');

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

const AuthorPaper = sequelize.define(
  'AuthorPaper',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    id_authors: {
      type: DataTypes.INTEGER,
      references: {
        model: Author,
        key: 'id',
      },
    },
    name_authors: {
      type: DataTypes.STRING(255),
      allowNull: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
    affiliation_authors: {
      type: DataTypes.STRING(255),
      allowNull: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
    id_papers: {
      type: DataTypes.STRING(255),
      references: {
        model: Paper,
        key: 'id',
      },
    },
    is_registered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    num_of_gifts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    note:{
      type: DataTypes.STRING(255),
      allowNull: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    }
  },
  {
    tableName: 'authors_papers',
    timestamps: false,
  },
);

sequelize
  .sync()
  .then(() => {
    console.log('Author Paper table created successfully!');
  })
  .catch((error) => {
    console.error('Unable to create table : ', error);
  });

// Mối quan hệ giữa Authors và AuthorsPapers
Author.hasMany(AuthorPaper, { foreignKey: 'id_authors' });
AuthorPaper.belongsTo(Author, { foreignKey: 'id_authors' });

// Mối quan hệ giữa Papers và AuthorsPapers
Paper.hasMany(AuthorPaper, { foreignKey: 'id_papers' });
AuthorPaper.belongsTo(Paper, { foreignKey: 'id_papers' });

module.exports = AuthorPaper;
