// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // 确保能访问 sequelize 实例


const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true, // 自动添加 createdAt, updatedAt
  tableName: 'users'
});

module.exports = User;