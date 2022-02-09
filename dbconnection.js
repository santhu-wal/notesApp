var mysql = require("mysql");
var util=require('util');

//establish connection to db
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Santhu@123",
  database: "crudapi",
});


connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

const query = util.promisify(connection.query).bind(connection);

module.exports = query;












/*
  var sql = "create table if not exists users(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, username varchar(255), emailId varchar(255) NOT NULL, password varchar(255),noOfPosts INT, role varchar(255))";
  connection.query(sql, function (err, result) {
    if (err) throw err;
  });

  var sql2="create table if not exists notes(userId int, title varchar(255), note varchar(255), FOREIGN KEY (userId)  REFERENCES users(id) ON DELETE CASCADE)";
  connection.query(sql2, function (err, result) {
    if (err) throw err;
  });

  */

//});


 