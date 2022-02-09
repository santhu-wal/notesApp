const db = require("../dbconnection");

exports.addNotes = async (req, res) => {
  try {
    const id = req.user.id;
    var url;
    if (req.file) {
      url = req.file.destination + "/" + req.file.filename;
    }

    const { title, note } = req.body;

    await db("insert into notes set ?",
      {
        userId: id,
        title: title,
        note: note,
        imagepath: url
      }
    )
    res.status(201).send("notes added succesfully...");
  }
  catch (error) {
    res.status(500).send(error);
  }
}


exports.deletenotes = async (req, res) => {
  try {
    const id = req.user.id;
    const title = req.params.title;
    let data = await db("select * from notes where userId=? and title=?", [id, title])
    if (data.length < 1) return res.send("Title not found")
    db("delete from notes where title= ?", title)
    let results = await db("select * from notes where userId=?", id)
    let n = results.length;
    db("update users set noOfPosts=? where id=?", [n, id])
    res.status(201).send("deleted succesfully...");
  }
  catch (error) {
    res.status(500).send(error);
  }

}


exports.getNotes = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      var page = parseInt(req.query.page);
      var limit = parseInt(req.query.limit);
      if (!page) page = 1
      if (!limit) limit = 10
      var skip = (page - 1) * limit;
      var count = skip + ',' + limit;
      // const result = await db('SELECT title,note FROM notes ORDER BY noteId LIMIT '+count);
      const result = await db("SELECT N.noteId, N.title, N.note, N.created_at, (select username from users where users.id=N.userId) AS created_by, (SELECT COUNT(*) FROM comments  WHERE comments.noteId = N.noteId) AS noOfComments FROM notes N ORDER BY noteId LIMIT " + count);
      res.status(200).send(result)
    }
    else {
      const id = req.user.id;
      const result2 = await db("SELECT N.noteId, N.title, N.note , N.created_at, (SELECT COUNT(*) FROM comments  WHERE comments.noteId = N.noteId) AS noOfComments FROM notes N where userId=?", id);
      res.status(200).send(result2)
    }
  }
  catch (error) {
    res.status(500).send(error);
  }
}


exports.getNotesById = async (req, res) => {
  try {
    const note_id = req.params.id;
    let result = await db("select N.title,N.note ,N.created_at, U.username AS created_by from notes N INNER JOIN users as U on U.id=N.userId where N.noteId=?", note_id);
    if (result.length < 1) throw new Error("Note id is invalid")
    let comments = await db("select C.messages, U.username As created_by from comments C INNER JOIN users as U on U.id=C.userId where noteId=?", note_id);
    result[0].comments = comments;
    res.send(result)
  } catch (err) {
    res.send(err.message)
  }
}











/*
exports.getNotes = async (req, res) => {
  try {
    if(req.user.role==="admin"){
      var page = parseInt(req.query.page);
      var limit = parseInt(req.query.limit);
      var skip = (page-1) * limit;
      var count = skip +','+limit;
      const result = await db('SELECT * FROM notes ORDER BY noteId LIMIT '+count);
      res.status(200).send(result)
     }
    else{
      const id=req.user.id;
      let result2 = await db("select * from notes where userId=?",id)
      res.status(200).send(result2)
    }
  }
  catch (error) {
    res.status(500).send(error);
  }
}




exports.getNotesById = async (req, res) => {
  try {
    const note_id = req.params.id;
    let result = await db("select N.title,N.note ,N.created_at, (select username from users where users.id=N.userId) AS created_by from notes N where noteId=?", note_id);
    if(result.length<1) throw new Error("Note id is invalid")
    let temp = await db("select C.messages,(select username from users where users.id=C.userId) as username from comments C where noteId=?", note_id);
    let temp1 = [];
    temp.forEach((x, i) => {
      temp1[i] = x.username + ": " + x.messages;
    });
    result[0].comments = temp;
    res.send(result)
  } catch (err) {
    res.status(500).send(err)
  }
}

*/

