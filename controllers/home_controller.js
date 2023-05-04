const Post = require('../models/post');
const User = require('../models/user');
module.exports.home = (req,res)=>{

    Post.find({}).populate('user').exec()
    .then((posts)=>{
        return res.render('home',{
            title:'Codial | Home',
            posts
        });
    })
    .catch((err)=>{
        console.log('Error fetching posts');
    })
}