const Author = require('../models/authorModel.js');

exports.getAllAuthors = async (req, res) => {
  try {
    // Lấy limit và page từ query params, đặt giá trị mặc định nếu không có
    const limit = parseInt(req.query.limit) || 10; // Số lượng authors mỗi trang, mặc định là 10
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
    const offset = (page - 1) * limit; // Tính toán offset cho query

    // Lấy tổng số lượng authors (để tính tổng số trang)
    const totalAuthors = await Author.count();

    // Lấy danh sách authors với phân trang
    const authors = await Author.findAll({
      limit,
      offset,
    });

    // Tính tổng số trang dựa trên số lượng authors và limit
    const totalPages = Math.ceil(totalAuthors / limit);

    res.status(200).json({
      status: 'success',
      results: authors.length,
      currentPage: page,
      totalPages,
      data: {
        authors,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch authors',
    });
  }
};

exports.getAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm author theo id
    const author = await Author.findByPk(id);
    if (!author) {
      return res.status(404).json({
        status: 'fail',
        message: `Author with id ${id} not found`,
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        author,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch author',
      error: err.message,
    });
  }
};

// Hàm thêm một author mới
exports.createAuthor = async (req, res) => {
  try {
    const { author_name, affiliation, email, author_role, type, position } =
      req.body;

    // Kiểm tra các giá trị có hợp lệ hay không
    if (!author_name || !affiliation || !type || !position) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing required fields: author_name, affiliation',
      });
    }

    // Tạo author mới
    const newAuthor = await Author.create({
      author_name,
      affiliation,
      email,
      author_role,
      type,
      position,
    });

    res.status(201).json({
      status: 'success',
      data: {
        author: newAuthor,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create author',
      error: err.message,
    });
  }
};

exports.updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { author_name, affiliation, email, author_role, checked_in } =
      req.body;

    // Kiểm tra xem author có tồn tại không
    const author = await Author.findByPk(id);
    if (!author) {
      return res.status(404).json({
        status: 'fail',
        message: `Author with id ${id} not found`,
      });
    }

    // Cập nhật thông tin author
    await author.update({
      author_name: author_name || author.author_name,
      affiliation: affiliation || author.affiliation,
      email: email || author.email,
      author_role: author_role || author.author_role,
      checked_in: checked_in || author.checked_in,
    });

    res.status(200).json({
      status: 'success',
      data: {
        author,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update author',
      error: err.message,
    });
  }
};

exports.deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm author theo id và xóa nó
    const author = await Author.findByPk(id);
    if (!author) {
      return res.status(404).json({
        status: 'fail',
        message: `Author with id ${id} not found`,
      });
    }

    // Xóa author
    await author.destroy();

    res.status(204).json({
      status: 'success',
      message: `Author with id ${id} deleted successfully.`,
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete author',
      error: err.message,
    });
  }
};
