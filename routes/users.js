// routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const util = require('util');
const jwtSign = util.promisify(jwt.sign);
const User = require('../models/User');

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 字段校验
    if (!username || !email || !password) {
      return res.status(400).json({ msg: '用户名、邮箱和密码不能为空' });
    }

    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: '该邮箱已被注册' });
    }

    // 检查用户名是否已存在（可选但推荐）
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ msg: '用户名已被使用' });
    }

    // 密码加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建用户（推荐使用 create 而非 new + save）
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // 生成 JWT
    const payload = { user: { id: user.id } };
    const token = await jwtSign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });

    res.status(201).json({ token });

  } catch (err) {
    console.error('❌ 注册失败:', err);
    console.error('❌ 错误堆栈:', err.stack);
    res.status(500).json({ msg: '服务器内部错误，请稍后再试' });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: '邮箱和密码不能为空' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: '无效的邮箱或密码' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: '无效的邮箱或密码' });
    }

    const payload = { user: { id: user.id } };
    const token = await jwtSign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });

    res.json({ token });

  } catch (err) {
    console.error('❌ 登录失败:', err);
    console.error('❌ 错误堆栈:', err.stack);
    res.status(500).json({ msg: '服务器内部错误，请稍后再试' });
  }
});

module.exports = router;
console.log('🔥 开始处理注册请求');