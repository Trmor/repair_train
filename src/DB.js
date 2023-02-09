const {sql, DataTypes} = require('sequelize');
const sequelize = new Sequelize("usersdb2", "root", "123456", {
    dialect: "postgres",
    host: "localhost"
  });

const User = sql.define("User", 
{
userName:{
    type: DataTypes.STRING,
    autoIncrement: true,
    primaryKey: true,
}
}
);