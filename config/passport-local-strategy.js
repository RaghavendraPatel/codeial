const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
//auth using passport
passport.use(new LocalStrategy({
    usernameField:'email'
    },
    function(email,password,done){
        //find user and establish identity
        User.findOne({emai:email})
        .then((user)=>{
            if(!user || user.password!=password){
                console.log('Invalid username or password');
                return done(null,false)
            }
            return done(null,user);
        })
        .catch((err)=>{
            console.log("error in finding user");
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

module.exports = passport;