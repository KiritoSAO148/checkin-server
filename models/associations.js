const Author = require('./authorModel.js');
const Paper = require('./paperModel.js');
const AuthorPaper = require('./authorPaperModel.js');
const Invoice = require('./invoiceModel.js');
const InvoiceAuthor = require('./invoiceAuthorModel.js');

// Mối quan hệ giữa Authors và AuthorsPapers
Author.hasMany(AuthorsPaper, { foreignKey: 'id_authors' });
AuthorPaper.belongsTo(Author, { foreignKey: 'id_authors' });

// Mối quan hệ giữa Papers và AuthorsPapers
Paper.hasMany(AuthorPaper, { foreignKey: 'id_papers' });
AuthorPaper.belongsTo(Paper, { foreignKey: 'id_papers' });

// Mối quan hệ giữa Invoices và InvoicesAuthors
Invoice.hasMany(InvoiceAuthor, { foreignKey: 'invoice_id' });
InvoiceAuthor.belongsTo(Invoice, { foreignKey: 'invoice_id' });

// Mối quan hệ giữa Authors và InvoicesAuthors
Author.hasMany(InvoiceAuthor, { foreignKey: 'author_id' });
InvoiceAuthor.belongsTo(Author, { foreignKey: 'author_id' });

// Mối quan hệ giữa Papers và InvoicesAuthors
Paper.hasMany(InvoiceAuthor, { foreignKey: 'papers_id' });
InvoiceAuthor.belongsTo(Paper, { foreignKey: 'papers_id' });

module.exports = {
  Author,
  Paper,
  AuthorsPaper,
  Invoice,
  InvoicesAuthor,
};
