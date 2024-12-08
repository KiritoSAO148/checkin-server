const Account = require('../models/accountModel.js');
const Author = require('../models/authorModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// exports.login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Kiểm tra xem tài khoản có tồn tại không
//     const account = await Account.findOne({ where: { username } });
//     if (!account) {
//       return res.status(404).json({
//         status: 'fail',
//         message: 'Account not found',
//       });
//     }

//     // Kiểm tra mật khẩu có chính xác không
//     const isPasswordValid = await bcrypt.compare(password, account.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         status: 'fail',
//         message: 'Incorrect password',
//       });
//     }

//     // Tạo token JWT
//     const token = jwt.sign(
//       { id: account.id, role: account.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' },
//     );

//     // Lấy thông tin author tương ứng với email (username)
//     const author = await Author.findOne({ where: { email: username } });
//     if (!author) {
//       return res.status(404).json({
//         status: 'fail',
//         message: 'Author not found',
//       });
//     }

//     // Trả về token và thông tin author
//     res.status(200).json({
//       status: 'success',
//       data: {
//         token,
//         author_id: author.id,
//         author_name: author.author_name,
//         role: account.role,
//         affiliation: author.affiliation,
//         email: author.email,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: 'error',
//       message: 'Login failed',
//       error: err.message,
//     });
//   }
// };

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Kiểm tra xem author có tồn tại không
    const account = await Account.findOne({ where: { a_username: username } });
    if (!account) {
      return res.status(404).json({
        status: 'fail',
        message: 'Account not found',
      });
    }
    // Kiểm tra mật khẩu (so sánh trực tiếp, không mã hóa)
    if (account.a_password !== password) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect password',
      });
    }

    const author = await Author.findOne({ where: { email: username } });
    if (!author) {
      return res.status(404).json({
        status: 'fail',
        message: 'Author not found',
      });
    }

    // Tạo token JWT (JWT sẽ mã hóa dữ liệu của người dùng như id và role)
    const token = jwt.sign(
      { id: author.id, role: account.a_role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    res.status(200).json({
      status: 'success',
      data: {
        token,
        author_id: author.id,
        author_name: author.author_name,
        role: account.a_role,
        affiliation: author.affiliation,
        email: author.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Login failed',
      error: err.message,
    });
  }
};
