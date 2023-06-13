const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.create = async (req,res)=>{
    try{
        let post = await Post.create({
            content:req.body.content,
            user:req.user._id
        });
        if(req.xhr){
            
            post = await post.populate('user','name');
            
            return res.status(200).json({
                data:{
                    post:post
                },
                message:"Post created"
            })
        }
        req.flash('success','Post created successfully');
        return res.redirect('back');
    }catch(error){
        req.flash('error','Error creating Post');
        console.log(error)
        return res.redirect('back');
    }
}

module.exports.destroy = async (req,res)=>{
    try{
        let post = await Post.findById(req.params.id);

        
        if(post.user == req.user.id){

            await Like.deleteMany({likable:post,onModel:'Post'});
            await Like.deleteMany({_id:{$in: post.comments}});

            await Post.findByIdAndDelete(req.params.id);

            await Comment.deleteMany({post:req.params.id});
            
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id : req.params.id,
                    },
                    message:"Post deleted"
                })
            }
        }
        req.flash('success','Post deleted successfully');
        return res.redirect('back');
    }
    catch(err){
        req.flash('error','Error deleting Post');
        return res.redirect('back');
    }
}
