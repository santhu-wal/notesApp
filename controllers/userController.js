const db = require("../dbconnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require('../lib/mailer')

exports.signup = async (req, res) => {
    try {
        const { username, emailId, password } = req.body;
        const role = "user";
        let user = await db("select * from users where emailId = ?", emailId)
        if (user.length > 0) throw new Error("you are already registered. please login")
        const encryptedPassword = await bcrypt.hash(password, 10);
        await db("insert into users set ?",
            {
                username: username,
                emailId: emailId,
                password: encryptedPassword,
                role: role
            }
        )
        mailer(username, emailId)
        return res.status(201).send("Registration succesfull");
    } catch (err) {
        return res.send(err.message);
    }
};

exports.login = async (req, res) => {
    try {
        const { emailId, password } = req.body;
        let user = await db("select * from users where emailId = ?", emailId)
        if (user.length < 1) throw new Error("You are not registered")
        if (!(await bcrypt.compare(password, user[0].password))) {
            return res.status(401).send("password is incorrect");
        }
        const token = jwt.sign(
            {
                id: user[0].id,
                emailId: user[0].emailId,
                role: user[0].role
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "7d",
            }
        );
        res.status(200).json({ message: "login successful", token: token });
    } catch (err) {
        return res.send(err.message);
    }
};


exports.getinfo = async (req, res) => {
    try {
        if (req.user.role == 'admin') {
            let result = await db("SELECT U.id, U.username, U.emailId, (SELECT COUNT(*) FROM notes  WHERE notes.userId = U.id) AS notesCount FROM users U ");
            res.status(200).send(result)
        } else {
            const id = req.user.id;
            var sql = "SELECT id, username, emailId, (SELECT COUNT(*) FROM notes  WHERE notes.userId = users.id) AS notesCount FROM users  WHERE id =?";
            const result2 = await db(sql, id);
            res.status(200).send(result2);
        }
    } catch (err) {
        res.send(err.message);
    }
}

exports.getUsersByDate = async (req, res) => {
    try {
        const { from_date, to_date } = req.body;
        if (req.user.role === "admin") {
            if (from_date > to_date) return res.status(400).send('from_date should be smaller than to_date')
            let data = await db("SELECT U.id, U.username, U.emailId,U.created_at , (SELECT COUNT(*) FROM notes  WHERE notes.userId = U.id) AS notesCount FROM users U where created_at between ? AND ?", [from_date + ' 00:00:00', to_date + ' 23:59:59'])
            res.status(200).send(data)
        }
        else throw new Error("Access Denied")
    } catch (err) {
        res.send(err.message)
    }
}

exports.deleteUser = async (req, res) => {
    try {
        if (req.user.role === "user") throw new Error("Access Denied")
        const id = req.params.id;
        let result = await db(`select * from users where id=?`, id)
        if (result.length < 1) throw new Error("id not found")
        else if (result[0].role === "admin") throw new Error("You have no access to delete admin.")
        await db("delete from users where id=?", [id])
        res.status(200).send("user deleted")
    }
    catch (err) {
        return res.send(err.message);
    }
}


exports.editRole = async (req, res) => {
    try {
        if (req.user.role === "user") throw new Error("Access Denied")
        const id = req.params.id;
        let data = await db("select * from users where id=?", id)
        if (data.length < 1) throw new Error("Invalid id.")
        if (data[0].role === "user") {
            db("update users set role=? where id=?", ["admin", id])
            res.status(200).send("You made him admin")
        }
        if (data[0].role === "admin") {
            db("update users set role=? where id=?", ["user", id])
            res.status(200).send("Removed as admin")
        }
    }
    catch (err) {
        return res.send(err.message);
    }
}


exports.deleteAcc = async (req, res) => {
    try {
        const id = req.user.id;
        let result = await db("select * from users where role=?", "admin")
        if (result.length < 2) throw new Error("Please make someone as admin to delete this user")
        await db("delete from users where id=?", [id])
        res.status(200).send("user deleted")
    }
    catch (err) {
        return res.send(err.message);
    }
}







// let data = await db('select * from users where created_at between ? AND ?',[from_date+' 00:00:00',to_date+' 23:59:59'])


/*
//let data = await db('select * from users where created_at between ? AND ?',['2021-12-10 00:00:00','2021-12-11 23:59:59'])
exports.getUsersByDate=async(req,res)=>{
    try{
    const {date1,date2} = req.body;

    let from_date=req.body.date1;
    let to_date=req.body.date2;

    //let d1=new Date(date1);
    //let d2=new Date(date2);

    if(req.user.role==="admin"){
        if(from_date > to_date) return res.send('from_date should be smaller than to_date')
    let data = await db('select * from users where created_at between ? AND ?',[from_date+' 00:00:00',to_date+' 23:59:59'])
    res.status(200).send(data)
    }
    else return res.status(401).send("Access Denied")
}catch(e){
    res.status(500).send(e)
}
}


*/
/*
exports.changePassword = async (req, res) => {
    try {
        const id = req.user.id;
        const { password, newpassword } = req.body;
        let result = await db("select * from users where id = ?", id)
        if (!(await bcrypt.compare(password, result[0].password))) {
            return res.status(400).send("password is incorrect");
        }
        const encryptedPassword = await bcrypt.hash(newpassword, 10);
        await db("update users set password=? where id=?", [encryptedPassword, id]);
        res.status(200).json({ success: true, message: "password changed succesfully" });
    }
    catch (err) {
        return res.status(500).send(err);
    }
}

//to change password
router.put("/changepassword", authenticate.verifyuser, validate.passwordValidate, userController.changePassword)
*/