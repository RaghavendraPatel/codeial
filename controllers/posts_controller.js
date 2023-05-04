const Post = require('../models/post');

module.exports.create = (req,res)=>{
    console.log(res.locals.user.id)
    Post.create({
        content:req.body.content,
        user:req.user._id
    })
    .then((post)=>{
        console.log(post);
        return res.redirect('back');
    })
    .catch((err)=>{
        console.log('Error creating Post',err);
    });
}