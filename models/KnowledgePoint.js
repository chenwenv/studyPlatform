// models/KnowledgePoint.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const KnowledgePoint = sequelize.define('KnowledgePoint', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('not_started', 'in_progress', 'mastered'),
    defaultValue: 'not_started'
  },
  reviewList: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  timestamps: true,
  tableName: 'knowledge_points'
});

// 建立关联
KnowledgePoint.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(KnowledgePoint, { foreignKey: 'userId' });

module.exports = KnowledgePoint;