// routes/knowledgePoints.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const KnowledgePoint = require('../models/KnowledgePoint');

// 创建知识点
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const kp = await KnowledgePoint.create({
      title,
      content,
      userId: req.user.id // 注意：是 userId，不是 user
    });
    res.json(kp);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 获取所有知识点
router.get('/', auth, async (req, res) => {
  try {
    const kps = await KnowledgePoint.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(kps);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 获取单个知识点
router.get('/:id', auth, async (req, res) => {
  try {
    const kp = await KnowledgePoint.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!kp) return res.status(404).json({ msg: 'Knowledge point not found' });
    res.json(kp);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 更新知识点
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, status, reviewList } = req.body;
    const [updated] = await KnowledgePoint.update(
      { title, content, status, reviewList },
      {
        where: { id: req.params.id, userId: req.user.id }
      }
    );
    if (!updated) return res.status(404).json({ msg: 'Not found or not authorized' });

    const updatedKp = await KnowledgePoint.findByPk(req.params.id);
    res.json(updatedKp);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 删除知识点
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await KnowledgePoint.destroy({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!deleted) return res.status(404).json({ msg: 'Not found or not authorized' });
    res.json({ msg: 'Knowledge point removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;