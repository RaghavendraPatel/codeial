const User = require('../models/user');
module.exports.profile = (req,res)=>{
    User.findById(req.params.id)
    .then((user)=>{
        return res.render('user_profile',{
            title:'User Profile',
            profile_user:user
        });
    });
}

module.exports.update = (req,res)=>{
    if(req.user.id==req.params.id){
        User.findByIdAndUpdate(req.params.id,req.body)
        .then(()=>{
            return res.redirect('back');
        })
    }else{
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

