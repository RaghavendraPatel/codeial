const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.toggleLike = async (req,res)=>{
    try {
        //like/toggle/?id=lfldf&type=Post
        let likable;
        let deleted = false;


        if(req.query.type == 'Post'){
            likable = await Post.findById(req.query.id).populate('likes');
        }else{
            likable = await Comment.findById(req.query.id).populate('likes');
        }

        //check if like already exists
        let existingLike = await Like.findOne({
            likable : req.query.id,
            onModel : req.query.type,
            user : req.user.id
        })
        //if a like already exists then delete it
        if(existingLike){
            likable.likes.pull(existingLike._id);
            likable.save();
            await Like.findOneAndDelete({
                likable : req.query.id,
                onModel : req.query.type,
                user : req.user._id
            });
            // existingLike.remove()
            deleted = true;
        }else{
            let newLike = await Like.create({
                user: req.user._id,
                likable: req.query.id,
                onModel: req.query.type
            })

            likable.likes.push(newLike._id);
            likable.save();
        }

        return res.status(200).json({
            message:'Request Successful',
            data:{
                deleted:deleted,
            }
        });
        // return res.redirect('back')

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : 'Internal serval error'
        });
    }
}