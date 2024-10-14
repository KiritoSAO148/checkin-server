const Paper = require('../models/paperModel.js');
const sequelize = require('sequelize');
const Author = require('../models/authorModel'); // Đảm bảo import mô hình Author
const AuthorPaper = require('../models/authorPaperModel'); // Đảm bảo import mô hình AuthorPaper
const InvoiceAuthor = require('../models/invoiceAuthorModel'); // Đảm bảo import mô hình InvoiceAuthor

exports.getAllPapers = async (req, res) => {
  try {
    // Lấy limit và page từ query params, đặt giá trị mặc định nếu không có
    const limit = parseInt(req.query.limit) || 10; // Số lượng authors mỗi trang, mặc định là 10
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
    const offset = (page - 1) * limit; // Tính toán offset cho query

    // Lấy tổng số lượng authors (để tính tổng số trang)
    const totalPapers = await Paper.count();

    // Lấy danh sách authors với phân trang
    const papers = await Paper.findAll({
      limit,
      offset,
    });

    // Tính tổng số trang dựa trên số lượng authors và limit
    const totalPages = Math.ceil(totalPapers / limit);

    res.status(200).json({
      status: 'success',
      results: papers.length,
      currentPage: page,
      totalPages,
      data: {
        papers,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch papers',
    });
  }
};

exports.getPaper = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm Paper và kết hợp với InvoiceAuthor để lấy invoice_id duy nhất
    const paper = await Paper.findOne({
      where: { id }, // Kiểm tra id của paper
      include: [
        {
          model: InvoiceAuthor,
          attributes: ['invoice_id'],
          where: { papers_id: id }, // Đảm bảo paper_id trong InvoiceAuthor khớp với paper id
        },
      ],
    });

    if (!paper) {
      return res.status(404).json({
        status: 'fail',
        message: `Paper with id ${id} not found or no associated invoice`,
      });
    }

    // Lấy invoice_id từ InvoiceAuthor (vì chỉ có 1 invoice per paper)
    const invoice_id = paper.InvoiceAuthors[0].invoice_id;

    // Loại bỏ thuộc tính InvoiceAuthors khỏi kết quả trả về
    const paperData = paper.toJSON(); // Chuyển đối tượng paper sang dạng JSON
    delete paperData.InvoiceAuthors; // Xóa thuộc tính InvoiceAuthors

    res.status(200).json({
      status: 'success',
      data: {
        paperData,
        invoice_id, // Trả về invoice_id duy nhất
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch paper and invoice',
      error: err.message,
    });
  }
};

// Hàm thêm một author mới
exports.createPaper = async (req, res) => {
  try {
    const {
      id,
      title,
      track_name,
      track_id,
      published_time,
      num_of_registers,
      paper_status,
    } = req.body;

    // Kiểm tra các giá trị có hợp lệ hay không
    if (!id || !title) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing required fields: id, title',
      });
    }

    // Tạo paper mới
    const newPaper = await Paper.create({
      id,
      title,
      track_name,
      track_id,
      published_time,
      num_of_registers,
      paper_status,
    });

    res.status(201).json({
      status: 'success',
      data: {
        author: newPaper,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create paper',
      error: err.message,
    });
  }
};

exports.updatePaper = async (req, res) => {
  try {
    const { id } = req.params; // Lấy paper ID từ URL
    const {
      title,
      track_name,
      track_id,
      published_time,
      num_of_registers,
      paper_status,
    } = req.body; // Lấy dữ liệu từ body

    // Kiểm tra xem author có tồn tại không
    const paper = await Paper.findByPk(id);
    if (!paper) {
      return res.status(404).json({
        status: 'fail',
        message: `Paper with id ${id} not found`,
      });
    }

    // Cập nhật thông tin của paper
    await paper.update({
      title: title || paper.title,
      track_name: track_name || paper.track_name,
      track_id: track_id || paper.track_id,
      published_time: published_time || paper.published_time,
      num_of_registers: num_of_registers || paper.num_of_registers,
      paper_status: paper_status || paper.paper_status,
    });

    res.status(200).json({
      status: 'success',
      data: {
        paper,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update paper',
    });
  }
};

exports.deletePaper = async (req, res) => {
  try {
    const paperId = req.params.id; // Lấy ID của paper từ URL

    // Tìm author theo id và xóa nó
    const paper = await Paper.findByPk(id);
    if (!paper) {
      return res.status(404).json({
        status: 'fail',
        message: `Paper with id ${id} not found`,
      });
    }

    // Xóa paper
    await paper.destroy();

    res.status(204).json({
      status: 'success',
      message: `Paper with id ${id} deleted successfully.`,
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete paper',
      error: err.message,
    });
  }
};
