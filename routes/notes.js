const express = require("express");
const router = express.Router();

const validate=require('../validations/validate')
const notesController = require('../controllers/notesController')
const authenticate=require('../middleware/authenticate')
const upload = require("../middleware/multer");
 

//add new notes
router.post("/", upload.single('image') , authenticate.verifyuser,validate.noteValidate, notesController.addNotes)


//if admin, all notes will get ..... if user, only his notes will get
router.get("/",authenticate.verifyuser,notesController.getNotes)

//get notes by id
router.get("/:id",authenticate.verifyuser,notesController.getNotesById)


//to delete notes
router.delete("/:title",authenticate.verifyuser,notesController.deletenotes)

module.exports = router;