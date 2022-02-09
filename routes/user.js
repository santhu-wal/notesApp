const express = require("express");
const router = express.Router();

const validate=require('../validations/validate')
const userController = require('../controllers/userController')
const authenticate=require('../middleware/authenticate')


//login route for customer
router.post("/login", validate.loginValidate, userController.login);

//adding customer register request
router.post("/register", validate.userValidate, userController.signup);


//if admin, all users info will get ....if user, only his/her details will get
router.get('/',authenticate.verifyuser,userController.getinfo)


// only admin can delete a user
router.delete('/:id',authenticate.verifyuser,userController.deleteUser)

//to delete account
router.delete('/',authenticate.verifyuser,userController.deleteAcc)

//to change role
router.put('/:id',authenticate.verifyuser,userController.editRole);


//to get users list who are registered between 2 dates
router.get("/bydate", authenticate.verifyuser, validate.dateValidate,userController.getUsersByDate)

module.exports = router;