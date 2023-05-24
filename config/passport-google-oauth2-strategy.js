const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');

const User = require('../models/user');

passport.use(new googleStrategy({
        clientID:"626842065003-8aclfk7lvieodg4mbll9n3cn8urccg7n.apps.googleusercontent.com",
        clientSecret:"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",
        callbackURL:"http://127.0.0.1:8000/users/auth/google/callback"
    },
    function(accessToken,refreshToken, profile,done){
        //find a user
        console.log(profile)
        User.findOne({email:profile.emails[0].value})
        .then((user)=>{
            if(user){
                //if found set this user as req.user
                return done(null,user);
            }else{
                User.create({
                    //if not found create a new user
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                })
                .then((user)=>{
                    return done(null,user);
                })
                .catch((err)=>{
                    console.log("Error in creating user",err);
                    return;
                })
            }
        })
        .catch((err)=>{
            console.log("Error in google strategy-passpost",err);
            return;
        });
    }
));

module.exports = passport;