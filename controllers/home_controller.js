module.exports.home = (req,res)=>{
    console.log(req.cookies);
    res.cookie('user_id',26);
    return res.render('home',{
        title:'Home',
    });
}