const express = require('express');
var app = express();
require("dotenv").config();

const userRoute=require('./routes/user')
const notesRoute=require('./routes/notes')
const commentsRoute=require('./routes/comments')

const table=require('./models/tables')

app.use('/upload',express.static('uploads'))
app.use(express.json());

app.use("/",userRoute);
app.use("/notes",notesRoute); 
app.use("/comments",commentsRoute); 
 

app.listen(3000, function () {
    console.log("Connected to port 3000");
});