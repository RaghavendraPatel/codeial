const Comment = require('../models/comment');
const Post = require('../models/post')
module.exports.create = async (req,res)=>{
    try{
        let post = await Post.findById(req.body.post)
        if(post){
            let comment = await Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            });
            post.comments.push(comment);
            post.save();
            return res.redirect('/');
        }
    }
    catch(err){
        console.log("Error",err);
    }
}

module.exports.destroy = async (req,res)=>{
    let comment = await Comment.findById(req.params.id)
    if(comment.user == req.user.id){
        let postId = comment.post;
        await Comment.findByIdAndDelete(req.user.id);
        await Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}})
        return res.redirect('back');
    }
}