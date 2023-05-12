const Post = require('../models/post');
const Comment = require('../models/comment');

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

module.exports.destroy = (req,res)=>{
    Post.findById(req.params.id)
    .then((post)=>{
        if(post.user == req.user.id){
            Post.findByIdAndDelete(req.params.id)
            .then(()=>{
                Comment.deleteMany({post:req.params.id})
                .then(()=>{
                    return res.redirect('back');
                })
            })
        }
        else{
            return res.redirect('back');
        }
    })
}
