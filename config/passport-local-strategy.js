const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
//auth using passport
passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true
    },
    function(req,email,password,done){
        //find user and establish identity
        User.findOne({email:email})
        .then((user)=>{
            if(!user || user.password!=password){
                req.flash('error','Invalid username or password');
                return done(null,false)
            }
            return done(null,user);
        })
        .catch((err)=>{
            req.flash('error','error in finding user');
            return done(err);
        });
    }
));

//serializing the user to decide whick key is to be kept in the cookie
passport.serializeUser((user,done)=>{
    done(null,user.id)
});
//deserializing the user form kin in cookie
passport.deserializeUser((id,done)=>{
    User.findById(id)
    .catch((err)=>{
        console.log("error in finding user");
        done(err);
    })
    .then((user)=>{
        done(null,user);
    })
});

//check if user is authenticated
passport.checkAuthentication = (req,res,next)=>{
    //if the user is signed in the pass on the request to next function
    if(req.isAuthenticated()){
        return next();
    }
    //if user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = (req,res,next)=>{
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from session cookie
        //sending it to locals for the views
        res.locals.user = req.user;
    }
    next();
}
module.exports = passport;