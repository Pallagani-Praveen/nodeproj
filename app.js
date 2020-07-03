var express = require('express');
var bodyparser = require('body-parser');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
var ObjectId =  require('mongodb').ObjectID;
const authRoutes = require('./routes/auth-routes');
const models = require('./models/user-model');
const mailSender  = require('./mail/mailSender');
const protectprofile  =  require('./utility_js/middleware/protectprofile');
var urlencodedParser = bodyparser.urlencoded({extended:false});
const cryption = require('./utility_js/cryption');
var app = express();

// mongoose.connect('mongodb://localhost:27017/one2many',{ useNewUrlParser: true },()=>{
//     console.log('Connected to database');
// });
mongoose.connect(process.env.MONGODB_URI,{ useUnifiedTopology: true },(err)=>{
    if(err){
        console.log(process.env.MONGODB_URI);
        console.log(err);
    }
    else{
    console.log('Connected to database');
    }
});



app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys:['thisismykey']
}));

app.set('view engine','ejs');

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth',authRoutes);




app.use('/styles',express.static('styles'));
app.use('/utility_js',express.static('utility_js'));
app.use('/fonts',express.static('fonts'));
app.use('/images',express.static('images'));
app.use('/partials',express.static('partials'));



app.get('/',(req,res)=>{
    var message = req.session.messages;
        req.session.messages = [];
    if(req.user){
    models.Envelop.find({username:req.user.username},(err,result)=>{
        
        res.render('home',{allenvelops:result,message:message,user:req.user});
    });
    }
    else{
    res.render('home',{allenvelops:null,message:message,user:null});
    }
});


app.get('/contact',protectprofile,(req,res)=>{
    res.render('contact');
});



app.post('/contact',urlencodedParser,(req,res)=>{
    var contact = new models.Contact({
        username:req.user.username,
        name:req.body.name,
        email:req.body.email,
        subject:req.body.subject,
        message:req.body.message
    });
    contact.save((err)=>{
        if(!err){
            mailSender(req.user.username,req.body.name,req.body.email,req.body.subject,req.body.message,(err,info)=>{
                if(err){
                    req.session.messages = ['request backup to database'];
                    res.redirect('/');
                }
                else{
                    req.session.messages =[]; 
                res.redirect('/');
                }
            });
            
        }
        else{
            req.session.messages = ['Form Submission Failed'];
            res.redirect('/');
        }
    });
    
});


app.get('/profile/:id',protectprofile,(req,res)=>{
    models.User.findById(req.params.id).then((user)=>{
        res.render('profile',{user:user});
    });
});

app.get('/server-error',(req,res)=>{
    res.render('server_error');
});



app.post('/submit-data',urlencodedParser,(req,res)=>{
    var salt = cryption.randSalt(16);
    const envelop = new models.Envelop({
        username:req.user.username,
        toaddress:req.body.toaddress,
        key:req.body.ukey,
        secretkey:cryption.encrypt(req.body.upwd,salt),
        salt:salt
    });
    envelop.save((err)=>{
        if(err){
            res.redirect('/server-error');
        }
        else{
            res.redirect('/');
        }
    });
});


app.post('/update-profile',(req,res)=>{
    console.log(req.query.id);
    //updating envelops along with the user
    models.User.findOne({_id:req.query.id},(err,user)=>{
        if(user.username!=req.query.username){
            models.Envelop.updateMany({username:user.username},{username:req.query.username},(err,affected,resp)=>{
                console.log('Envelops updated',affected);
            });
        }
    });

    models.User.findById(req.query.id).then((user)=>{
        models.User.update({_id:req.query.id},
            {username:req.query.username,email:req.query.email,password:cryption.encrypt(req.query.password,user.salt)},(err,affected,resp)=>{
                res.send(req.query.username);
            });
    });
    

});

app.get('/delete-envelop',(req,res)=>{
    var envelop_id = ObjectId(req.query.envelop_id);
    models.Envelop.deleteOne({_id:envelop_id},(err,affected,resp)=>{
        console.log(affected);
        res.redirect('/');
    });
   
   
});


app.get('/update-envelop',(req,res)=>{
    var envelop_id = req.query.envelop_id;
    
    models.Envelop.findById(envelop_id).then((user)=>{
        user.secretkey = cryption.decrypt(user.secretkey,user.salt);
        res.render('update_envelop',{user:user});
    });
    
});


// function for the ajax call
app.post('/update-envelop',(req,res)=>{
    var envelop_id = req.query.id;
    models.Envelop.findById(envelop_id).then((user)=>{
        models.Envelop.update({_id:envelop_id},
            {toaddress:req.query.toaddress,key:req.query.key,secretkey:cryption.encrypt(req.query.secretkey,user.salt)},(err,affected,resp)=>{
                res.send(affected);
            });
    });
    
});



app.post('/search-envelop',urlencodedParser,(req,res)=>{

    if(req.user){
        var value = req.body.searched_envelop;
        var start = new Date();
        models.Envelop.find({toaddress:{$regex:value,$options:"i"},username:req.user.username},(err,result)=>{
            var end = new Date() - start;

            if(result && result.length!=0){
                for(var i=0;i<result.length;i++){
                    result[i].secretkey = cryption.decrypt(result[i].secretkey,result[i].salt);
                }
            }
            
           
            res.render('search',{result:result,user:req.user,search:value,exc_time:end/1000});
        });
    }
    else{
        req.session.messages = ['Login to see the functions'];
        res.redirect('/');
    }
});


// function to ajax call for reading the envelops
app.get('/api-data',(req,res)=>{
    models.Envelop.findOne({"_id":ObjectId(req.query._id)},(err,result)=>{
        result.secretkey = cryption.decrypt(result.secretkey,result.salt);
        res.send(result);
    });
});

app.get('/find-password',(req,res)=>{
    var password = req.query.password;
    var salt = req.query.salt;
    var decodedPassword = cryption.decrypt(password,salt);
    res.send(decodedPassword);
});


app.listen(process.env.PORT || 3000,()=>{
    console.log('server started on port 3000');
});