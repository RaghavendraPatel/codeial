const nodemailer = require('../config/nodemailer');

exports.newComment = (comment)=>{
    console.log('inside new comment mailer',comment);
    let htmlString = nodemailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');
    nodemailer.transporter.sendMail({
        from:'raghavpatel2808.cn.test@gmail.com',
        to: comment.user.email,
        subject:'new comment published',
        html:htmlString
    },(err,info)=>{
        if(err){
            console.log('Error in sending mail',err);
            return;
        }
        // console.log('Message sent',info);
        return;
    })
}