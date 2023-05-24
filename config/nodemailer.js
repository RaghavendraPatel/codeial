const nodemailer = require('nodemailer');
const secret = require('./secret.json');
const ejs = require('ejs');
const path = require('path'); 

let transporter = nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:secret['mail-auth'].user,
        pass:secret['mail-auth'].password
    }
});

let renderTemplate = (data,relativePath)=>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        (err,template)=>{
            if(err){
                console.log("Errorin rendering  template");
                return;
            }
            mailHTML = template;
        }
    )
    return mailHTML;
}

module.exports = {
    transporter:transporter,
    renderTemplate:renderTemplate
}