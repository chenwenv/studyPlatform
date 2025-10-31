// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 1. 从请求头中获取 Authorization
    const authHeader = req.header('Authorization');

    // 2. 检查 Authorization 是否存在
    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // 3. 检查是否以 "Bearer " 开头
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Token format invalid' });
    }

    // 4. 提取 token
    const token = authHeader.substring(7); // "Bearer ".length === 7

    // 5. 验证 token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};