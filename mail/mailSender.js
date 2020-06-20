const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'academicoffice137@gmail.com',
        pass:'Praveen jp2'
    }
});

module.exports = (username,name,email,subject,message,done) => {
    const mailOptions = {
        from:'academicoffice137@gmail.com',
        to:'praveenpallagani999@gmail.com',
        subject:subject,
        html:'<h1>'+message+'</h1>'
    };

    transporter.sendMail(mailOptions,(err,info)=>{
        if(err){
            return done(err);
        }
        return done(err,info);
    });
};

