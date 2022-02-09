const nodeMailer = require('nodemailer')

module.exports = (username,email) => {
    const transporter = nodeMailer.createTransport({
        service : 'gmail',
        auth : {
            user : 'santhoshtedla@gmail.com',
            pass : process.env.password
        }
    });
     
    var mailOptions = {
        from : 'santhoshtedla@gmail.com',
        to : email,
        subject : "Registration update",
        text : `Hi ${username}. You are succesfully registered`


    }
    
    transporter.sendMail(mailOptions , (err) => {
        if(err){
            console.log(err)
        }else{
            console.log('Email send To : ' + mailOptions.to)
        }
    })
}