// index.js
console.log('✅ 服务器正在启动...'); // 新增这行
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const User = require('./models/User');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routes/users'));
app.use('/api/knowledge-points', require('./routes/knowledgePoints'));

// 关键：先确保数据库连接成功，再启动服务器
sequelize.authenticate()
  .then(() => {
    console.log('✅ 数据库认证成功');
    // return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ 数据库模型同步完成');
    app.listen(port, () => {
      console.log(`🚀 Feynman Platform 运行在 http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('❌ 启动失败 - 数据库错误:', err);
    process.exit(1); // 确保进程退出，避免“假运行”
  });

// 全局错误监听
process.on('unhandledRejection', (err) => {
  console.error('❌ 未处理的 Promise 拒绝:', err);
});
// 所有路由之后，添加这个
app.use((req, res) => {
  console.log('🔍 未匹配请求:', req.method, req.url);
  res.status(404).json({ msg: 'Not Found' });
});