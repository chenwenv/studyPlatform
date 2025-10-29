// index.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
require('dotenv').config();

// 引入 Sequelize 和 User 模型
const sequelize = require('./config/database');
const User = require('./models/User');
// const sequelize = new Sequelize('feynman_db', 'root', '123456', {
//   host: 'localhost',
//   dialect: 'mysql'
// });

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

//添加路由
app.use('/api/users', require('./routes/users'));
app.use('/api/knowledge-points', require('./routes/knowledgePoints'));

// 同步数据库（开发阶段可用，生产环境建议用迁移）
sequelize.sync({ alter: true }) // 注意：alter 在生产环境慎用！
  .then(() => {
    console.log('MySQL connected and models synced!');
  })
  .catch(err => {
    console.error('Unable to connect to MySQL:', err);
  });

// --- API 路由 ---
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 检查邮箱或用户名是否已存在
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [{ email }, { username }] 
      } 
    });
    if (existingUser) {
      return res.status(400).json({ 
        msg: existingUser.email === email ? 'Email already exists' : 'Username already exists' 
      });
    }

    // 密码哈希
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建用户
    await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.status(201).json({ msg: 'User registered successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Feynman Platform backend is running at http://localhost:${port}`);
});
