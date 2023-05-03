const User = require('../models/user');
const md5 = require('md5');

module.exports.profile = (req,res)=>{
    if(req.cookies.user_id){
        User.findById(req.cookies.user_id)
        .then((user)=>{
            if(user){
                return res.render('user_profile',{
                    title:'User Profile',
                    user:user,
                });
            }
            return res.redirect('/users/sign-in');
        })
        .catch((err)=>{
            console.log(err);
            return res.redirect('/users/sign-in');
        })
    }
    else{
        return res.redirect('/users/sign-in');
    }
}

module.exports.signUp = (req,res)=>{
    return res.render('user_sign_up',{
        title:'Codeial | Sign Up'
    });
}

module.exports.signIn = (req,res)=>{
    return res.render('user_sign_in',{
        title:'Codeial | Sign In'
    });
}

//get the signup data
module.exports.create = (req,res)=>{
    if(req.body.password!=req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email:req.body.email})
    .then((user)=>{
        if(!user){
            User.create({
                name:req.body.name,
                email:req.body.email,
                password:md5(req.body.password),
            })
            .then(()=>{
                return res.redirect('/users/sign-in')
            })
            .catch((err)=>{
                console.log(err);
            });
        }
        else{
            return res.redirect('back');
        }
    })
    .catch((err)=>{
        console.log('Error in finding user',err)
    })
}

//sign in and create session for user
module.exports.createSession = (req,res)=>{
    //steps to authenticate
    //find the user
    User.findOne({email:req.body.email})
    .then((user)=>{
        //handle user found
        if(user){
            //handle incorrect password
            if(user.password!=md5(req.body.password)){
                return res.redirect('back');
            }
            //handle session creation
            res.cookie('user_id',user.id);
            return res.redirect('/users/profile');
        }
        else{
            //handle user not found
            return res.redirect('back');
        }
    })
}

module.exports.signOut = (req,res)=>{
    res.cookie('user_id','').redirect('/users/sign-in');
    // return res.redirect('/users/sign-in');
}