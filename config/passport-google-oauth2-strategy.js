const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const secret = require('./secret.json');

const User = require('../models/user');

passport.use(new googleStrategy({
        clientID:secret['google-oauth'].clientID,
        clientSecret:secret['google-oauth'].clientSecret,
        callbackURL:secret['google-oauth'].callbackURL
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