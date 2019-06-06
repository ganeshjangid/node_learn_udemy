const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_js_udemy_myself', 'root', 'ganesh2468*', {
  dialect: 'mysql',
  host: '127.0.0.1'
});
/* const sequelize = new Sequelize('node_js_learn', 'application', 's@myD#@mnl@sy', {
  dialect: 'mysql',
  host: '172.29.67.213'
}); */

module.exports = sequelize;
