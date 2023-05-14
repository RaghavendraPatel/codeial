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
        req.flash('success','Post created successfully');
        return res.redirect('back');
    })
    .catch((err)=>{
        req.flash('error','Error creating Post');
        return res.redirect('back');
    });
}

module.exports.destroy = async (req,res)=>{
    try{
        let post = await Post.findById(req.params.id)
        if(post.user == req.user.id){
            await Post.findByIdAndDelete(req.params.id)
            await Comment.deleteMany({post:req.params.id})
        }
        req.flash('success','Post deleted successfully');
        return res.redirect('back');
    }
    catch(err){
        req.flash('error','Error deleting Post');
        return res.redirect('back');
    }
}
