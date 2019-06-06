const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password:{
    type:Sequelize.STRING,
    allowNull:false
  },
  resetToken:Sequelize.STRING,
  resetTokenExp:Sequelize.DATE

});

module.exports = User;
