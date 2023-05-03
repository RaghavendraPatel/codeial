const User = require('../models/user');

module.exports.profile = (req,res)=>{
    return res.render('user_profile',{
        title:'User Profile'
    });
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
module.exports.create = (req,res)=>{
    if(req.body.password!=req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email:req.body.email})
    .then((user)=>{
        if(!user){
            User.create(req.body)
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
    return res.redirect('/');
}

//signout

module.exports.destroySession = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
    });
    return res.redirect('/');
}