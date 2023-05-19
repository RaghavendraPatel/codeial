const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = (req,res)=>{
    User.findById(req.params.id)
    .then((user)=>{
        return res.render('user_profile',{
            title:'User Profile',
            profile_user:user
        });
    });
}

module.exports.update = async (req,res)=>{
    if(req.user.id==req.params.id){
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('******Multer error:',err);
                }
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){
                    if(user.avatar){
                        if(fs.existsSync(path.join(__dirname,'..',user.avatar))){
                            fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                        }
                    }
                    user.avatar = User.avatarPath +'/'+req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        } catch (error) {
            req.flash('error',error);
            return res.redirect('back');
        }
    }else{
        req.flash('error','Unauthorized');
        return res.status(401).send('Unauthorized');
    }
}
module.exports.signUp = (req,res)=>{
    if(req.isAuthenticated()){
        console.log('Already signed in');
        return res.redirect('/users/profile')
    }
    return res.render('user_sign_up',{
        title:'Codeial | Sign Up'
    });
}

module.exports.signIn = (req,res)=>{
    if(req.isAuthenticated()){
        console.log('Already signed in');
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title:'Codeial | Sign In'
    });
}

//get the signup data
module.exports.create = async (req,res)=>{
    try{
        if(req.body.password!=req.body.confirm_password){
            return res.redirect('back');
        }
        let user = await User.findOne({email:req.body.email});
        if(!user){
            await User.create(req.body);
            return res.redirect('/users/sign-in')
        }
        else{
            return res.redirect('back');
        }
    }
    catch(err){
        console.log('Error in finding user',err)
    }
}

//sign in and create session for user
module.exports.createSession = (req,res)=>{
    req.flash('success','Logged in Successfully');
    return res.redirect('/');
}

//signout

module.exports.destroySession = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
    });
    req.flash('success','You have been logged out');
    return res.redirect('/');
}

