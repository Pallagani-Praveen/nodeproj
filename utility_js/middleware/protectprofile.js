module.exports = (req,res,next)=>{
    if(!req.user){
        req.session.messages = ['login to see the profile page'];
        res.redirect('/auth/login');
    }
    else{
        next();
    }
};