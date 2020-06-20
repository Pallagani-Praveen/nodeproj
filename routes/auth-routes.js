const router = require('express').Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended:false});
const models = require('../models/user-model');
const cryption = require('../utility_js/cryption');

router.get('/signup',(req,res)=>{
    res.render('signup');
});

router.post('/signup',urlencodedParser,(req,res)=>{
    var randSalt = cryption.randSalt(16);
    var encrypted = cryption.encrypt(req.body.password1,randSalt);
    user = new models.User({
        username:req.body.username,
        password:encrypted,
        salt:randSalt,
        email:req.body.email
    });
    user.save((err)=>{
        if(err){
           
            res.redirect('/auth/signup');
        }
        else{
            res.redirect('/auth/login');
        }
    });
    
});

router.post('/login', urlencodedParser, function (req, res, next) {
    passport.authenticate('local', function (err, user,info) {
         if (err) { return next(err); }
         
         if (!user) {
            req.session.messages = [info.message];
              return res.redirect('/auth/login');
         }
         req.logIn(user, function (err) {
              if (err) { return next(err); }
              return res.redirect('/');
         });
    })(req, res, next);
});



router.get('/login',(req,res)=>{
    messages = req.session.messages;
    req.session.messages = []
    res.render('login',{message:messages});
});


router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
});



module.exports = router;