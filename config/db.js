const Sequlize = require("sequelize");
const dbName = process.env.DB_NAME||"imai_user";
const dbUser = process.env.DB_USER||"imai";
const dbPassword = process.env.DB_PASSWORD||"imai2023";

const sequelize = new Sequlize(dbName,dbUser,dbPassword,{
    host:process.env.DB_HOST||"127.0.0.1",
    port:process.env.DB_PORT||3306,
    dialect:"mysql"
});
const db ={}
db.Sequlize=Sequlize;
db.sequelize=sequelize;


//model-table
// db.customer = require("./customer.model")(sequelize,Sequlize)
db.User = require("../model/User")(sequelize,Sequlize)
db.Role = require("../model/Role")(sequelize,Sequlize)
db.UserRole = require("../model/UserRole")(sequelize,Sequlize)

module.exports=db;

