const Post = require('../models/post');
const User = require('../models/user');
module.exports.home =  async (req,res)=>{
    try{
        let posts = await Post.find({})
        .sort({createdAt:-1})
        .populate('user')
        .populate({
            path:'comments',
            populate:{
                path:'user'
            },
            populate:{
                path: 'likes'
            }
        })
        .populate({path:'likes'});

        let users = await User.find({});
        return res.render('home',{
            title:'Codial | Home',
            posts:posts,
            all_users:users
        });
    }
    catch(err){
        console.log('Error: ',err);
    }
}