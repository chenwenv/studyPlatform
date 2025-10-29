// 1. 引入 express
const express = require('express');

// 2. 创建应用实例
const app = express();

// 3. 设置端口
const port = 3000;

// 4. 定义一个路由：访问 / 时返回文本
app.get('/', (req, res) => {
  res.send('Hello, Feynman Learner!');
});

// 5. 启动服务器
app.listen(port, () => {
  console.log(`Feynman Platform backend is running at http://localhost:${port}`);
});