const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');

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
            comment = await comment.populate('user', 'name email');
            // commentsMailer.newComment(comment);
            let job = queue.create('emails',comment).save(function(err){
                if(err){
                    console.log("error in creating queue",err);
                    return;
                }
                console.log('job enqueued',job.id);
            });
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }


            req.flash('success', 'Comment published!');
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
        
        // send the comment id which was deleted back to the views
        if (req.xhr){
            return res.status(200).json({
                data: {
                    comment_id: req.params.id
                },
                message: "Post deleted"
            });
        }


        req.flash('success', 'Comment deleted!');
        return res.redirect('back');
    }
}