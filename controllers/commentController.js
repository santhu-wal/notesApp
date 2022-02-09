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




















/*
// let result = await db("select N.title,N.note,(select messages from comments where comments.noteId=3) as y from notes N where noteId=3")

exports.getComments= async (req,res)=>{
  try{
  if(req.user.role==="admin"){
    const note_id=req.params.noteId;
  let temp = await db("select messages from comments where comments.noteId=?",note_id);
  let result = await db("select N.title,N.note from notes N where noteId=?",note_id);
  let temp1 = [];
  temp.forEach((x, i) => {
    temp1[i]=x.messages;
  });
  result[0].comments=temp1;
  res.send(result)
}
else return res.send('Access Denied')
}catch(e){
  res.send(e)
}
}
*/

/*
exports.addComment = async (req, res) => {
  const id = req.user.id;
  const { noteId, comment } = req.body;
  let result = await db("SELECT U.role, (SELECT userId FROM notes  WHERE notes.noteId = ?) AS x FROM users U where id=?", [noteId, id]);
  if (result[0].role === "admin" || result[0].x == id) {
    await db("insert into comments set ?",
      {
        userId: id,
        noteId: noteId,
        messages: comment
      }
    )
    res.send('added')
  }
  else return res.send("You are not allowed to comment to this note.")

} 
*/

