const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const models = require('../models/user-model');
const cryption = require('../utility_js/cryption');

passport.serializeUser((user,done)=>{
    done(null,user.id);
});
passport.deserializeUser((id,done)=>{
    models.User.findById(id).then((user)=>{
        done(null,user);
    });
});


passport.use('local',new LocalStrategy(
    function(username, password, done) {
      // models.User.findOne({ username: username,password:password }, function (err, user) {
      //   if (err) { return done(err); }
      //   if(!user){ return done(null,false,{message:'Invalid UserName/Password'}); }
      //   return done(null, user);
      // });
      models.User.findOne({username:username},function(err,user){
        if(err) { return done(err); }
        if(!user){ return done(null,false,{message:'Invalid UserName/Password'}); }
        var salt = user.salt;
        
        var hashedPassword = cryption.encrypt(password,salt);
        console.log(salt);
        console.log(hashedPassword);
        if(user.password===hashedPassword){
          return done(null,user);
        }
        else{
          return done(null,false,{message:'Invalid Password'});
        }

      });
    }
  ));

