const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_js_learn', 'application', 's@myD#@mnl@sy', {
  dialect: 'mysql',
  host: '172.29.67.213'
});

module.exports = sequelize;
