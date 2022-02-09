const db = require("../dbconnection");
const bcrypt = require("bcrypt");

let tables = async (req, res) => {
  try {
    await db(
      "create table if not exists users(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, username varchar(255), emailId varchar(255) NOT NULL, password varchar(255), role varchar(255),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
    );
    const email = "santhoshtedla@gmail.com";
    const password = await bcrypt.hash("santhosh111", 10);
    let results = await db("select * from users where emailId = ?", email)
    if (results.length < 1) {
      await db("insert into users set ?",
        {
          username: "santhu",
          emailId: email,
          password: password,
          role: "admin",
        }
      )
    }

    await db(
      "create table if not exists notes(noteId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, userId int, title varchar(255), note varchar(255),imagepath varchar(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (userId)  REFERENCES users(id) ON DELETE CASCADE)",
    );

    await db("create table if not exists comments(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,userId int, noteId int, messages varchar(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (noteId)  REFERENCES notes(noteId) ON DELETE CASCADE )");
  }
  catch (error) {
    res.status(500).send(error)
  }
}
tables();
