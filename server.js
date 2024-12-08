const dotenv = require('dotenv');
const mysql = require('mysql');
const { Sequelize } = require('sequelize');

dotenv.config({ path: './config.env' });
const app = require('./app');

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    port: 3306,
    dialect: 'mysql',
  },
);

// Kiểm tra kết nối đến cơ sở dữ liệu với Sequelize
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to the database using Sequelize.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Đồng bộ các models (tùy chọn, có thể bỏ qua nếu không muốn Sequelize tự động tạo bảng)
// sequelize
//   .sync()
//   .then(() => {
//     console.log('Database synced.');
//   })
//   .catch((err) => {
//     console.error('Failed to sync database:', err);
//   });

// const conn = mysql.createConnection({
//   host: process.env.DATABASE_HOST,
//   user: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE_NAME,
// });

// conn.connect((err) => {
//   if (err) {
//     console.log(err);
//     throw err;
//   } else {
//     console.log('Connected to the database');
//   }
// });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

module.exports = sequelize;
