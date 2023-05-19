const Post = require('../../../models/post');
const Comment = require('../../../models/comment');
module.exports.index = async (req,res)=>{
    let posts = await Post.find({})
        .sort({createdAt:-1})
        .populate({path:'user',select:'-password'})
        .populate({
            path:'comments',
            populate:{
                path:'user'
            }
        });
    return res.status(200).json({
        message:"List of posts",
        posts:posts,
        
    })
}

module.exports.destroy = async (req,res)=>{
    try{
        let post = await Post.findById(req.params.id)
        if(post.user == req.user.id){
            await Post.findByIdAndDelete(req.params.id);
            await Comment.deleteMany({post:req.params.id});
            return res.status(200).json({
                message:"Post deleted"
            })
        }else{
            return res.status(401).json({
                message:"You cannot delete this post"
            })
        }
    }catch(err){
        return res.status(500).json({
            message:"Internal server error"
        });
    }
}
