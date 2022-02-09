const express = require("express");
const router = express.Router();

const commentController = require('../controllers/commentController')
const authenticate=require('../middleware/authenticate')
const validate=require('../validations/validate')


router.post('/:id',authenticate.verifyuser, validate.commentValidate,commentController.addComment)

router.delete('/:id',authenticate.verifyuser,commentController.deleteComment)

module.exports = router;