const { DataTypes, Sequelize } = require('sequelize');
// const sequelize = require('../server.js');
const Author = require('./authorModel.js');
const Paper = require('./paperModel.js');
const Invoice = require('./invoiceModel.js');

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

const InvoiceAuthor = sequelize.define(
  'InvoiceAuthor',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    invoice_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Invoice,
        key: 'id',
      },
    },
    author_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Author,
        key: 'id',
      },
    },
    papers_id: {
      type: DataTypes.STRING(255),
      references: {
        model: Paper,
        key: 'id',
      },
    },
  },
  {
    tableName: 'invoices_authors',
    timestamps: false,
  },
);

sequelize
  .sync()
  .then(() => {
    console.log('Invoice Author table created successfully!');
  })
  .catch((error) => {
    console.error('Unable to create table : ', error);
  });

// Mối quan hệ giữa Invoices và InvoicesAuthors
Invoice.hasMany(InvoiceAuthor, { foreignKey: 'invoice_id' });
InvoiceAuthor.belongsTo(Invoice, { foreignKey: 'invoice_id' });

// Mối quan hệ giữa Authors và InvoicesAuthors
Author.hasMany(InvoiceAuthor, { foreignKey: 'author_id' });
InvoiceAuthor.belongsTo(Author, { foreignKey: 'author_id' });

// Mối quan hệ giữa Papers và InvoicesAuthors
Paper.hasMany(InvoiceAuthor, { foreignKey: 'papers_id' });
InvoiceAuthor.belongsTo(Paper, { foreignKey: 'papers_id' });

module.exports = InvoiceAuthor;
