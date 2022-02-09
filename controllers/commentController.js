const db = require("../dbconnection");

exports.addComment = async (req, res) => {
  try {
    const id = req.user.id;
    const note_id = req.params.id;
    const comment = req.body.comment;
    let result = await db('select * from notes where noteId=?', note_id);
    if (result.length < 1) throw new Error('notesId Invalid')
    if (result[0].userId == id || req.user.role === "admin") {
      await db("insert into comments set ?",
        {
          userId: id,
          noteId: note_id,
          messages: comment
        }
      )
      res.status(201).send('comment added!!!')

    }
    else throw new Error('You are not allowed to add comments to this note')
  } catch (err) {
    res.send(err.message)
  }
}


exports.deleteComment = async (req, res) => {
  try {
    const id = req.user.id;
    const comment_id = req.params.id;
    let result = await db('select * from comments where id=?', comment_id);
    if (result.length < 1) throw new Error('Invalid comment Id')

    if (result[0].userId == id) {
      await db('delete from comments where id=?', comment_id)
      res.status(200).send('comment deleted')
    }
    else throw new Error('You are not allowed to delete this comment')
  } catch (err) {
    res.send(err.message)

  }
}
