const InvoiceAuthor = require('../models/invoiceAuthorModel.js');
const Invoice = require('../models/invoiceModel.js');
const Paper = require('../models/paperModel.js');

// Hàm để lấy invoice theo author_id
exports.getInvoicesByAuthorId = async (req, res) => {
  try {
    const { authorId } = req.params; // Lấy authorId từ params

    // Thực hiện truy vấn JOIN
    const invoiceData = await InvoiceAuthor.findAll({
      where: { author_id: authorId },
      include: [
        {
          model: Invoice, // Join với bảng Invoice
          attributes: ['id'], // Chọn cột id của bảng Invoice
        },
        {
          model: Paper, // Join với bảng Paper
          attributes: ['id'], // Chọn cột id của bảng Paper
        },
      ],
    });

    // Nếu không có dữ liệu
    if (invoiceData.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No invoices found for the specified author.',
      });
    }

    // Trả về kết quả thành công
    res.status(200).json({
      status: 'success',
      data: invoiceData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve invoices.',
    });
  }
};
