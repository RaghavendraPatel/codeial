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
            user : req.user._id
        })
        //if a like already exists then delete it
        if(existingLike){
            likable.likes.pull(existingLike._id);
            likable.save();

            existingLike.remove()
            deleted = true;
        }else{
            let newLike = await Like.create({
                user: req.user._id,
                likable: req.query.id,
                onModel: req.query.type
            })

            likable.likes.push(like._id);
            likable.save();
        }

        return res.json({
            message:'Request Successful',
            data:{
                deleted:deleted,
            }
        }).stats(200);

    } catch (error) {
        console.log(error);
        return res.json({
            message : 'Internal serval error'
        }).stats(500);
    }
}